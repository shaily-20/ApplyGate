// Mock in-memory database for testing without MongoDB
const mockDB = {
  users: [],
  jobs: [],
  nextUserId: 1,
  nextJobId: 1
};

export const initMockDB = () => {
  // Initialize with sample data
  const user1 = {
    _id: String(mockDB.nextUserId++),
    name: 'John Doe',
    email: 'user@example.com',
    password: 'hashed_password123',
    role: 'job_seeker',
    bio: 'Full stack developer with 5 years experience',
    phone: '+1234567890',
    createdAt: new Date()
  };

  const user2 = {
    _id: String(mockDB.nextUserId++),
    name: 'Tech Company',
    email: 'employer@example.com',
    password: 'hashed_password123',
    role: 'employer',
    company: 'TechCorp Inc',
    phone: '+0987654321',
    createdAt: new Date()
  };

  mockDB.users.push(user1, user2);

  // Sample jobs
  const jobs = [
    {
      _id: String(mockDB.nextJobId++),
      title: 'Senior React Developer',
      description: 'We are looking for an experienced React developer to join our team.',
      companyName: 'TechCorp Inc',
      location: 'San Francisco, CA',
      salary: { min: 150, max: 180, currency: 'USD' },
      jobType: 'Full-time',
      category: 'Technology',
      experienceLevel: 'Senior',
      skills: ['React', 'JavaScript', 'Node.js'],
      applications: [],
      views: 0,
      createdAt: new Date()
    },
    {
      _id: String(mockDB.nextJobId++),
      title: 'UX/UI Designer',
      description: 'Looking for a creative UX/UI designer for web and mobile projects.',
      companyName: 'TechCorp Inc',
      location: 'Remote',
      salary: { min: 100, max: 140, currency: 'USD' },
      jobType: 'Full-time',
      category: 'Design',
      experienceLevel: 'Mid-level',
      skills: ['Figma', 'Sketch', 'Adobe XD'],
      applications: [],
      views: 0,
      createdAt: new Date()
    }
  ];

  mockDB.jobs.push(...jobs);

  console.log('✅ Mock Database initialized with sample data');
  return mockDB;
};

export default mockDB;
