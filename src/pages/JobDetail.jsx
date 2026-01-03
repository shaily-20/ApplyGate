import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { jobService } from '../services/authService'
import './JobDetail.css'

function JobDetail() {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    fetchJobDetails()
  }, [id])

  const fetchJobDetails = async () => {
    try {
      setLoading(true)
      const response = await jobService.getJobById(id)
      setJob(response.data)
    } catch (err) {
      setError('Failed to load job details')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (user?.role !== 'job_seeker') {
      alert('Only job seekers can apply for jobs')
      return
    }

    setApplying(true)
    try {
      await jobService.applyForJob(id)
      setApplied(true)
      alert('Application submitted successfully!')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply')
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="job-detail-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading job details...</p>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="job-detail-container">
        <div className="error-message">{error || 'Job not found'}</div>
        <button onClick={() => navigate('/')} className="back-btn">Back to Jobs</button>
      </div>
    )
  }

  const getCategoryEmoji = (category) => {
    const emojiMap = {
      'Technology': '🚀',
      'Design': '🎨',
      'Data': '📊',
      'Product': '📈',
      'Sales': '💼',
      'Marketing': '📢',
      'HR': '👥',
      'Finance': '💰'
    }
    return emojiMap[category] || '💼'
  }

  const formatSalary = (salary) => {
    if (typeof salary === 'object' && salary.min && salary.max) {
      return `$${salary.min}K - $${salary.max}K`
    }
    return salary || 'Competitive'
  }

  return (
    <div className="job-detail-container">
      <button onClick={() => navigate('/')} className="back-btn">← Back to Jobs</button>
      
      <div className="job-detail-card">
        <div className="job-detail-header">
          <div className="header-content">
            <span className="detail-emoji">{getCategoryEmoji(job.category)}</span>
            <div className="header-text">
              <h1>{job.title}</h1>
              <p className="company-name">{job.companyName}</p>
            </div>
          </div>
          <div className="header-badges">
            <span className="badge">{job.experienceLevel}</span>
            <span className="badge">{job.jobType}</span>
            <span className="badge">{job.category}</span>
          </div>
        </div>

        <div className="job-detail-info">
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">📍</div>
              <div className="info-content">
                <h3>Location</h3>
                <p>{job.location}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">💰</div>
              <div className="info-content">
                <h3>Salary</h3>
                <p>{formatSalary(job.salary)}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">📊</div>
              <div className="info-content">
                <h3>Experience Level</h3>
                <p>{job.experienceLevel}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">👁️</div>
              <div className="info-content">
                <h3>Views</h3>
                <p>{job.views || 0} people viewed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="job-detail-description">
          <h2>About the Job</h2>
          <p>{job.description}</p>
        </div>

        {job.qualifications && (
          <div className="job-detail-section">
            <h2>Qualifications</h2>
            <p>{job.qualifications}</p>
          </div>
        )}

        {job.skills && job.skills.length > 0 && (
          <div className="job-detail-section">
            <h2>Required Skills</h2>
            <div className="skills-list">
              {job.skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        )}

        <div className="job-detail-footer">
          <div className="job-stats">
            <span>Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
            <span>Applications: {job.applications?.length || 0}</span>
          </div>
          
          <button 
            onClick={handleApply}
            disabled={applied || applying || !isAuthenticated || user?.role !== 'job_seeker'}
            className={`apply-button ${applied ? 'applied' : ''}`}
          >
            {applied ? '✓ Applied' : applying ? 'Applying...' : 'Apply Now'}
          </button>
        </div>

        {isAuthenticated && user?.role === 'employer' && (
          <div className="employer-note">
            <p>You are viewing this as an employer</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobDetail
