import bcrypt from 'bcryptjs';
import express from 'express';
import { body, validationResult } from 'express-validator';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Sign up
router.post(
  '/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['job_seeker', 'employer']).withMessage('Invalid role'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { name, email, password, role, company } = req.body;

      // Check if user exists
      const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
      if (existingUser) {
        return res.status(409).json({ success: false, message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      const stmt = db.prepare(`
        INSERT INTO users (name, email, password, role, company)
        VALUES (?, ?, ?, ?, ?)
      `);

      const result = stmt.run(name, email, hashedPassword, role, company || null);

      // Create token
      const token = jwt.sign(
        { id: result.lastInsertRowid, email, role },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        token,
        user: { id: result.lastInsertRowid, name, email, role }
      });

      // Also append to simple JSON file for "allow signup" record keeping
      try {
        const filePath = path.join(__dirname, '..', 'allowSignup.json');
        const record = {
          id: result.lastInsertRowid,
          name,
          email,
          role,
          company: company || null,
          createdAt: new Date().toISOString(),
          passwordHash: hashedPassword
        };

        let data = [];
        if (fs.existsSync(filePath)) {
          const raw = fs.readFileSync(filePath, 'utf8') || '[]';
          try {
            data = JSON.parse(raw);
          } catch (e) {
            data = [];
          }
        }

        data.push(record);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      } catch (e) {
        console.error('Failed to write allowSignup.json:', e.message);
      }
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      // Find user
      let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

      // If not found in SQLite, try simple file store (allowSignup.json)
      if (!user) {
        try {
          const filePath = path.join(__dirname, '..', 'allowSignup.json');
          if (fs.existsSync(filePath)) {
            const raw = fs.readFileSync(filePath, 'utf8') || '[]';
            const fileUsers = JSON.parse(raw);
            const found = fileUsers.find(u => u.email === email);
            if (found) {
              // Map file record to user-like object
              user = {
                id: found.id,
                name: found.name,
                email: found.email,
                password: found.passwordHash,
                role: found.role,
              };
            }
          }
        } catch (e) {
          console.error('Error reading allowSignup.json during login:', e.message);
        }
      }

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      // Create token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// Get current user
router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, role, company, bio, phone FROM users WHERE id = ?').get(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        bio: user.bio,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Google sign-in (id_token)
router.post('/google', async (req, res) => {
  try {
    const { id_token } = req.body;
    if (!id_token) return res.status(400).json({ success: false, message: 'id_token is required' });

    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';

    // Verify token with Google's tokeninfo endpoint
    const verifyResp = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`);
    if (!verifyResp.ok) {
      const text = await verifyResp.text();
      console.error('Google token verification failed:', text);
      return res.status(401).json({ success: false, message: 'Invalid Google token' });
    }

    const payload = await verifyResp.json();

    // Optionally check audience
    if (GOOGLE_CLIENT_ID && payload.aud !== GOOGLE_CLIENT_ID) {
      console.error('Google token audience mismatch', payload.aud, GOOGLE_CLIENT_ID);
      return res.status(401).json({ success: false, message: 'Invalid Google client' });
    }

    const email = payload.email;
    const name = payload.name || payload.email.split('@')[0];
    const email_verified = payload.email_verified === 'true' || payload.email_verified === true;

    // See if user exists in DB
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      // create user with a random password (hashed)
      const randomPassword = Math.random().toString(36).slice(-12);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      const insert = db.prepare(`
        INSERT INTO users (name, email, password, role, company, isVerified)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      const result = insert.run(name, email, hashedPassword, 'job_seeker', null, email_verified ? 1 : 0);
      user = { id: result.lastInsertRowid, name, email, role: 'job_seeker' };

      // append to allowSignup.json
      try {
        const filePath = path.join(__dirname, '..', 'allowSignup.json');
        let data = [];
        if (fs.existsSync(filePath)) {
          const raw = fs.readFileSync(filePath, 'utf8') || '[]';
          try { data = JSON.parse(raw); } catch (e) { data = []; }
        }
        data.push({ id: user.id, name, email, role: 'job_seeker', createdAt: new Date().toISOString() });
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      } catch (e) {
        console.error('Failed to write allowSignup.json (google):', e.message);
      }
    }

    // create jwt
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '30d' });

    res.status(200).json({ success: true, message: 'Login successful', token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Google sign-in error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
