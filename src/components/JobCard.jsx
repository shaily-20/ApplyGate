import './JobCard.css'

function JobCard({ job }) {
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

  const formatDate = (date) => {
    const d = new Date(date)
    const now = new Date()
    const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24))
    if (diff === 0) return 'Today'
    if (diff === 1) return '1 day ago'
    if (diff < 7) return `${diff} days ago`
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`
    return `${Math.floor(diff / 30)} months ago`
  }

  return (
    <div className="job-card">
      <div className="job-card-header">
        <span className="job-emoji">{getCategoryEmoji(job.category)}</span>
        <span className="job-level-badge">{job.experienceLevel}</span>
      </div>
      
      <h3 className="job-title">{job.title}</h3>
      <p className="job-company">{job.companyName}</p>
      
      <div className="job-meta">
        <span className="job-location">📍 {job.location}</span>
        <span className="job-salary">💰 {formatSalary(job.salary)}</span>
      </div>
      
      <div className="job-category">
        <span className="category-tag">{job.category}</span>
        <span className="job-type-tag">{job.jobType}</span>
      </div>
      
      <p className="job-posted">{formatDate(job.createdAt)}</p>
    </div>
  )
}

export default JobCard

