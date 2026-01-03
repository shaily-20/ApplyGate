import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import db from '../db.js';

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

// Middleware to check role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    next();
  };
};

// GET all jobs with filters
router.get('/', (req, res) => {
  try {
    const { search, category, jobType, experienceLevel, location, page = 1, limit = 10 } = req.query;

    let query = 'SELECT j.*, GROUP_CONCAT(js.skill) as skills FROM jobs j LEFT JOIN job_skills js ON j.id = js.jobId WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (j.title LIKE ? OR j.description LIKE ? OR j.companyName LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (category) {
      query += ' AND j.category = ?';
      params.push(category);
    }

    if (jobType) {
      query += ' AND j.jobType = ?';
      params.push(jobType);
    }

    if (experienceLevel) {
      query += ' AND j.experienceLevel = ?';
      params.push(experienceLevel);
    }

    if (location) {
      query += ' AND j.location LIKE ?';
      params.push(`%${location}%`);
    }

    query += ' GROUP BY j.id ORDER BY j.createdAt DESC';

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    query += ` LIMIT ? OFFSET ?`;
    params.push(limitNum, offset);

    const jobs = db.prepare(query).all(...params);

    // Get total count
    let countQuery = 'SELECT COUNT(DISTINCT j.id) as total FROM jobs j WHERE 1=1';
    const countParams = [];

    if (search) {
      countQuery += ' AND (j.title LIKE ? OR j.description LIKE ? OR j.companyName LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    if (category) {
      countQuery += ' AND j.category = ?';
      countParams.push(category);
    }

    if (jobType) {
      countQuery += ' AND j.jobType = ?';
      countParams.push(jobType);
    }

    if (experienceLevel) {
      countQuery += ' AND j.experienceLevel = ?';
      countParams.push(experienceLevel);
    }

    if (location) {
      countQuery += ' AND j.location LIKE ?';
      countParams.push(`%${location}%`);
    }

    const { total } = db.prepare(countQuery).get(...countParams);

    const formattedJobs = jobs.map(job => ({
      id: job.id,
      title: job.title,
      description: job.description,
      companyName: job.companyName,
      location: job.location,
      salary: { min: job.salaryMin, max: job.salaryMax, currency: job.salaryCurrency },
      jobType: job.jobType,
      category: job.category,
      experienceLevel: job.experienceLevel,
      skills: job.skills ? job.skills.split(',') : [],
      qualifications: job.qualifications,
      views: job.views,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt
    }));

    res.status(200).json({
      success: true,
      data: formattedJobs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET single job by ID
router.get('/:id', (req, res) => {
  try {
    const jobId = req.params.id;

    // Increment views
    db.prepare('UPDATE jobs SET views = views + 1 WHERE id = ?').run(jobId);

    const job = db.prepare(`
      SELECT j.*, GROUP_CONCAT(js.skill) as skills
      FROM jobs j
      LEFT JOIN job_skills js ON j.id = js.jobId
      WHERE j.id = ?
      GROUP BY j.id
    `).get(jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const formattedJob = {
      id: job.id,
      title: job.title,
      description: job.description,
      companyName: job.companyName,
      location: job.location,
      salary: { min: job.salaryMin, max: job.salaryMax, currency: job.salaryCurrency },
      jobType: job.jobType,
      category: job.category,
      experienceLevel: job.experienceLevel,
      skills: job.skills ? job.skills.split(',') : [],
      qualifications: job.qualifications,
      views: job.views + 1,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt
    };

    res.status(200).json({ success: true, data: formattedJob });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST create new job (Employer only)
router.post(
  '/',
  authenticateToken,
  authorize('employer'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('jobType').notEmpty().withMessage('Job type is required'),
    body('experienceLevel').notEmpty().withMessage('Experience level is required'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { title, description, location, category, jobType, experienceLevel, salaryMin, salaryMax, qualifications, skills } = req.body;

      const stmt = db.prepare(`
        INSERT INTO jobs (title, description, companyName, location, salaryMin, salaryMax, jobType, category, experienceLevel, userId, qualifications)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const user = db.prepare('SELECT company FROM users WHERE id = ?').get(req.user.id);
      const companyName = user?.company || 'Company';

      const result = stmt.run(
        title,
        description,
        companyName,
        location,
        salaryMin || 0,
        salaryMax || 0,
        jobType,
        category,
        experienceLevel,
        req.user.id,
        qualifications || null
      );

      // Add skills
      if (skills && Array.isArray(skills)) {
        const insertSkill = db.prepare('INSERT INTO job_skills (jobId, skill) VALUES (?, ?)');
        skills.forEach(skill => {
          insertSkill.run(result.lastInsertRowid, skill);
        });
      }

      res.status(201).json({
        success: true,
        message: 'Job created successfully',
        data: { id: result.lastInsertRowid }
      });
    } catch (error) {
      console.error('Create job error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// POST apply for job (Job Seeker only)
router.post('/:id/apply', authenticateToken, authorize('job_seeker'), (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    // Check if job exists
    const job = db.prepare('SELECT id FROM jobs WHERE id = ?').get(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check if already applied
    const existing = db.prepare('SELECT id FROM applications WHERE jobId = ? AND userId = ?').get(jobId, userId);
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job' });
    }

    // Insert application
    const stmt = db.prepare('INSERT INTO applications (jobId, userId, status) VALUES (?, ?, ?)');
    stmt.run(jobId, userId, 'applied');

    res.status(200).json({
      success: true,
      message: 'Application submitted successfully'
    });
  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
