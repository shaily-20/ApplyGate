import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jobService } from '../services/authService'
import './Hero.css'

function Hero({ onSearch }) {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState('')
  const [stats, setStats] = useState({ jobs: 0, companies: 0, seekers: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch all jobs to get statistics
      const response = await jobService.getJobs({ limit: 1000 })
      const jobCount = response.pagination?.total || 0
      
      // Calculate company count from jobs
      const uniqueCompanies = new Set(response.data.map(job => job.companyName)).size
      
      setStats({
        jobs: jobCount,
        companies: uniqueCompanies,
        seekers: Math.floor(jobCount * 2) // Estimated seekers
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Use default values if error
      setStats({ jobs: 50000, companies: 10000, seekers: 100000 })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      onSearch(searchInput)
      // Scroll to job listings
      setTimeout(() => {
        document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">Find Your Dream Job Today</h1>
        <p className="hero-subtitle">Discover thousands of job opportunities from top companies worldwide</p>
        
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Search by job title, keywords, company..."
              className="search-input"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              autoFocus
            />
            <button type="submit" className="search-btn">
              <span>🔍 Search Jobs</span>
            </button>
          </div>
        </form>

        <div className="quick-stats">
          <div className="stat">
            <span className="stat-number">{stats.jobs.toLocaleString()}+</span>
            <span className="stat-label">Jobs Available</span>
          </div>
          <div className="stat">
            <span className="stat-number">{stats.companies}+</span>
            <span className="stat-label">Companies Hiring</span>
          </div>
          <div className="stat">
            <span className="stat-number">{stats.seekers.toLocaleString()}+</span>
            <span className="stat-label">Active Job Seekers</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
