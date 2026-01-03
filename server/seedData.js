import Job from './models/Job.js'
import User from './models/User.js'

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({})
    await Job.deleteMany({})

    // Create test users
    const jobSeeker = await User.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'password123',
      role: 'job_seeker',
      bio: 'Full stack developer with 5 years experience',
      phone: '+1234567890',
    })

    const employer = await User.create({
      name: 'Tech Company',
      email: 'employer@example.com',
      password: 'password123',
      role: 'employer',
      company: 'TechCorp Inc',
      phone: '+0987654321',
    })

    const employer2 = await User.create({
      name: 'Design Studio',
      email: 'design@example.com',
      password: 'password123',
      role: 'employer',
      company: 'Creative Design Studio',
      phone: '+1122334455',
    })

    // Create test jobs
    const jobs = [
      {
        title: 'Senior React Developer',
        description: 'We are looking for an experienced React developer to join our team. You will work on building scalable web applications.',
        company: employer._id,
        companyName: employer.company,
        location: 'San Francisco, CA',
        salary: { min: 150, max: 180 },
        jobType: 'Full-time',
        category: 'Technology',
        experienceLevel: 'Senior',
        skills: ['React', 'JavaScript', 'Node.js', 'PostgreSQL'],
        qualifications: 'BS in Computer Science or equivalent experience',
      },
      {
        title: 'Full Stack Developer',
        description: 'Join our startup and build the future with us. Full stack role with modern tech stack.',
        company: employer._id,
        companyName: employer.company,
        location: 'Remote',
        salary: { min: 100, max: 140 },
        jobType: 'Full-time',
        category: 'Technology',
        experienceLevel: 'Mid-level',
        skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
        qualifications: '3+ years of development experience',
      },
      {
        title: 'UX/UI Designer',
        description: 'Create beautiful and intuitive user interfaces for our products.',
        company: employer2._id,
        companyName: employer2.company,
        location: 'New York, NY',
        salary: { min: 120, max: 150 },
        jobType: 'Full-time',
        category: 'Design',
        experienceLevel: 'Mid-level',
        skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
        qualifications: '3+ years UX/UI design experience',
      },
      {
        title: 'Frontend Engineer',
        description: 'Build responsive web applications with the latest technologies.',
        company: employer._id,
        companyName: employer.company,
        location: 'Austin, TX',
        salary: { min: 110, max: 150 },
        jobType: 'Full-time',
        category: 'Technology',
        experienceLevel: 'Mid-level',
        skills: ['React', 'Vue.js', 'CSS', 'HTML'],
        qualifications: '2+ years frontend development',
      },
      {
        title: 'Data Scientist',
        description: 'Analyze complex datasets and build machine learning models.',
        company: employer._id,
        companyName: employer.company,
        location: 'Boston, MA',
        salary: { min: 130, max: 170 },
        jobType: 'Full-time',
        category: 'Data',
        experienceLevel: 'Senior',
        skills: ['Python', 'TensorFlow', 'SQL', 'Statistics'],
        qualifications: 'MS/PhD in relevant field or equivalent experience',
      },
      {
        title: 'Product Manager',
        description: 'Lead product strategy for our enterprise solutions.',
        company: employer._id,
        companyName: employer.company,
        location: 'Seattle, WA',
        salary: { min: 140, max: 180 },
        jobType: 'Full-time',
        category: 'Product',
        experienceLevel: 'Senior',
        skills: ['Product Strategy', 'Analytics', 'Leadership'],
        qualifications: '5+ years product management experience',
      },
      {
        title: 'Graphic Designer',
        description: 'Create engaging visual content for our marketing campaigns.',
        company: employer2._id,
        companyName: employer2.company,
        location: 'Los Angeles, CA',
        salary: { min: 80, max: 110 },
        jobType: 'Full-time',
        category: 'Design',
        experienceLevel: 'Junior',
        skills: ['Adobe Creative Suite', 'Illustrator', 'Photoshop'],
        qualifications: 'Portfolio demonstrating design skills',
      },
      {
        title: 'DevOps Engineer',
        description: 'Manage cloud infrastructure and deployment pipelines.',
        company: employer._id,
        companyName: employer.company,
        location: 'Remote',
        salary: { min: 135, max: 165 },
        jobType: 'Full-time',
        category: 'Technology',
        experienceLevel: 'Mid-level',
        skills: ['Kubernetes', 'Docker', 'AWS', 'CI/CD'],
        qualifications: '3+ years DevOps experience',
      },
      {
        title: 'Marketing Manager',
        description: 'Lead marketing initiatives and drive business growth.',
        company: employer2._id,
        companyName: employer2.company,
        location: 'Chicago, IL',
        salary: { min: 90, max: 130 },
        jobType: 'Full-time',
        category: 'Marketing',
        experienceLevel: 'Mid-level',
        skills: ['Digital Marketing', 'Analytics', 'Content Strategy'],
        qualifications: '3+ years marketing management',
      },
      {
        title: 'HR Specialist',
        description: 'Support HR operations and employee development.',
        company: employer._id,
        companyName: employer.company,
        location: 'Denver, CO',
        salary: { min: 70, max: 100 },
        jobType: 'Full-time',
        category: 'HR',
        experienceLevel: 'Junior',
        skills: ['Recruitment', 'Employee Relations', 'HR Systems'],
        qualifications: 'HR certification or experience preferred',
      },
    ]

    await Job.insertMany(jobs)

    console.log('✅ Database seeded successfully!')
    return true
  } catch (error) {
    console.error('❌ Error seeding database:', error.message)
    return false
  }
}

export default seedData
