import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { jobService } from '../services/authService';
import './PostJob.css';

export default function PostJob() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: 'Technology',
    jobType: 'Full-time',
    experienceLevel: 'Entry Level',
    salaryMin: '',
    salaryMax: '',
    qualifications: '',
    skills: ''
  });

  if (user?.role !== 'employer') {
    return (
      <div className="post-job-error">
        <h2>Access Denied</h2>
        <p>Only employers can post jobs. Please sign up as an employer.</p>
        <button onClick={() => navigate('/signup')}>Sign Up as Employer</button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        setError('Job title is required');
        setLoading(false);
        return;
      }
      if (!formData.description.trim()) {
        setError('Job description is required');
        setLoading(false);
        return;
      }
      if (!formData.location.trim()) {
        setError('Location is required');
        setLoading(false);
        return;
      }

      // Parse skills from comma-separated string
      const skillsArray = formData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);

      const jobPayload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        companyName: user.company || 'Company',
        location: formData.location.trim(),
        salaryMin: parseInt(formData.salaryMin) || 0,
        salaryMax: parseInt(formData.salaryMax) || 0,
        salaryCurrency: 'USD',
        jobType: formData.jobType,
        category: formData.category,
        experienceLevel: formData.experienceLevel,
        qualifications: formData.qualifications.trim(),
        skills: skillsArray
      };

      const response = await jobService.createJob(jobPayload);
      
      if (response) {
        setSuccess('Job posted successfully! Redirecting...');
        setTimeout(() => {
          navigate('/jobs');
        }, 2000);
      }
    } catch (err) {
      console.error('Error posting job:', err);
      setError(err.response?.data?.message || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-job-container">
      <div className="post-job-header">
        <h1>Post a New Job</h1>
        <p>Fill in the job details to attract qualified candidates</p>
      </div>

      <div className="post-job-form-wrapper">
        <form onSubmit={handleSubmit} className="post-job-form">
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="title">Job Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Senior React Developer"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., San Francisco, CA"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Technology">Technology</option>
                <option value="Design">Design</option>
                <option value="Data">Data</option>
                <option value="Product">Product</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="jobType">Job Type</label>
              <select
                id="jobType"
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Temporary">Temporary</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="experienceLevel">Experience Level</label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
              >
                <option value="Entry Level">Entry Level</option>
                <option value="Mid-level">Mid-level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
                <option value="Executive">Executive</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="salaryMin">Salary Min ($)</label>
              <input
                type="number"
                id="salaryMin"
                name="salaryMin"
                value={formData.salaryMin}
                onChange={handleChange}
                placeholder="e.g., 80000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="salaryMax">Salary Max ($)</label>
              <input
                type="number"
                id="salaryMax"
                name="salaryMax"
                value={formData.salaryMax}
                onChange={handleChange}
                placeholder="e.g., 120000"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="skills">Required Skills (comma-separated)</label>
              <textarea
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g., React, JavaScript, Node.js, PostgreSQL"
                rows="3"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="description">Job Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the job, responsibilities, and requirements..."
                rows="8"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="qualifications">Qualifications</label>
              <textarea
                id="qualifications"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                placeholder="List the required qualifications..."
                rows="4"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/jobs')}
              className="btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Posting Job...' : 'Post Job'}
            </button>
          </div>
        </form>

        <div className="post-job-tips">
          <h3>Tips for a Great Job Posting</h3>
          <ul>
            <li>✓ Use a clear, descriptive job title</li>
            <li>✓ Specify salary range when possible</li>
            <li>✓ List all required skills and technologies</li>
            <li>✓ Include clear job description and responsibilities</li>
            <li>✓ Mention company benefits and perks</li>
            <li>✓ Be specific about experience level required</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
