import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'job-portal.db');

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Initialize tables
export const initDB = () => {
  try {
    // Users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'job_seeker',
        company TEXT,
        bio TEXT,
        phone TEXT,
        isVerified BOOLEAN DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Jobs table
    db.exec(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        companyName TEXT NOT NULL,
        location TEXT NOT NULL,
        salaryMin INTEGER,
        salaryMax INTEGER,
        salaryCurrency TEXT DEFAULT 'USD',
        jobType TEXT NOT NULL,
        category TEXT NOT NULL,
        experienceLevel TEXT NOT NULL,
        qualifications TEXT,
        userId INTEGER NOT NULL,
        views INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

    // Skills table (many-to-many)
    db.exec(`
      CREATE TABLE IF NOT EXISTS job_skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        jobId INTEGER NOT NULL,
        skill TEXT NOT NULL,
        FOREIGN KEY (jobId) REFERENCES jobs(id) ON DELETE CASCADE
      )
    `);

    // Applications table
    db.exec(`
      CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        jobId INTEGER NOT NULL,
        userId INTEGER NOT NULL,
        status TEXT DEFAULT 'applied',
        appliedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (jobId) REFERENCES jobs(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(jobId, userId)
      )
    `);

    console.log('✅ SQLite Database initialized');
    seedData();
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
};

// Seed sample data
export const seedData = () => {
  try {
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    
    if (userCount > 0) return;

    // Insert test users
    const insertUser = db.prepare(`
      INSERT INTO users (name, email, password, role, company, bio, phone)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const user1 = insertUser.run(
      'John Doe',
      'user@example.com',
      '$2a$10$YIjlrJflteKUsdVPVHBLle.fXMkF8/5XyFkPCQHpEJxScbpH3LIBa', // bcrypt hashed 'password123'
      'job_seeker',
      null,
      'Full stack developer with 5 years experience',
      '+1234567890'
    );

    const user2 = insertUser.run(
      'Tech Company',
      'employer@example.com',
      '$2a$10$YIjlrJflteKUsdVPVHBLle.fXMkF8/5XyFkPCQHpEJxScbpH3LIBa', // bcrypt hashed 'password123'
      'employer',
      'TechCorp Inc',
      null,
      '+0987654321'
    );

    // Insert sample jobs
    const insertJob = db.prepare(`
      INSERT INTO jobs (title, description, companyName, location, salaryMin, salaryMax, jobType, category, experienceLevel, userId, qualifications)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const jobs = [
      {
        title: 'Senior React Developer',
        description: 'We are looking for an experienced React developer to join our team. You will work on building scalable web applications.',
        companyName: 'TechCorp Inc',
        location: 'San Francisco, CA',
        salaryMin: 150,
        salaryMax: 180,
        jobType: 'Full-time',
        category: 'Technology',
        experienceLevel: 'Senior',
        userId: user2.lastInsertRowid,
        qualifications: 'BS in Computer Science or equivalent experience'
      },
      {
        title: 'Full Stack Developer',
        description: 'Join our startup and build the future with us. Full stack role with modern tech stack.',
        companyName: 'TechCorp Inc',
        location: 'Remote',
        salaryMin: 100,
        salaryMax: 140,
        jobType: 'Full-time',
        category: 'Technology',
        experienceLevel: 'Mid-level',
        userId: user2.lastInsertRowid,
        qualifications: '3+ years experience'
      },
      {
        title: 'UX/UI Designer',
        description: 'Looking for a creative UX/UI designer for web and mobile projects.',
        companyName: 'Creative Studio',
        location: 'New York, NY',
        salaryMin: 80,
        salaryMax: 120,
        jobType: 'Full-time',
        category: 'Design',
        experienceLevel: 'Mid-level',
        userId: user2.lastInsertRowid,
        qualifications: 'Portfolio required'
      },
      {
        title: 'Data Analyst',
        description: 'Analyze business data and provide insights to drive strategy.',
        companyName: 'Analytics Corp',
        location: 'Boston, MA',
        salaryMin: 90,
        salaryMax: 130,
        jobType: 'Full-time',
        category: 'Data',
        experienceLevel: 'Junior',
        userId: user2.lastInsertRowid,
        qualifications: 'SQL and Excel skills required'
      },
      {
        title: 'Marketing Manager',
        description: 'Lead marketing initiatives and manage campaigns.',
        companyName: 'Marketing Plus',
        location: 'Los Angeles, CA',
        salaryMin: 70,
        salaryMax: 110,
        jobType: 'Full-time',
        category: 'Marketing',
        experienceLevel: 'Senior',
        userId: user2.lastInsertRowid,
        qualifications: '5+ years marketing experience'
      }
    ];

    jobs.forEach(job => {
      const result = insertJob.run(
        job.title,
        job.description,
        job.companyName,
        job.location,
        job.salaryMin,
        job.salaryMax,
        job.jobType,
        job.category,
        job.experienceLevel,
        job.userId,
        job.qualifications
      );

      // Add skills
      const insertSkill = db.prepare(`
        INSERT INTO job_skills (jobId, skill)
        VALUES (?, ?)
      `);

      const skillsMap = {
        'Senior React Developer': ['React', 'JavaScript', 'Node.js', 'PostgreSQL'],
        'Full Stack Developer': ['React', 'Node.js', 'MongoDB', 'Docker'],
        'UX/UI Designer': ['Figma', 'Sketch', 'Adobe XD'],
        'Data Analyst': ['SQL', 'Python', 'Tableau', 'Excel'],
        'Marketing Manager': ['Social Media', 'Analytics', 'Strategy', 'Content']
      };

      (skillsMap[job.title] || []).forEach(skill => {
        insertSkill.run(result.lastInsertRowid, skill);
      });
    });

    console.log('📝 Sample data seeded successfully');
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
  }
};

export default db;
