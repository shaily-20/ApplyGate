import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jobService } from '../services/authService'
import JobCard from './JobCard'
import './JobListings.css'

function JobListings({ searchQuery, category, onCategoryChange }) {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState('recent')

  const categories = ['All', 'Technology', 'Design', 'Data', 'Product', 'Sales', 'Marketing', 'Finance']

  useEffect(() => {
    fetchJobs()
  }, [searchQuery, category, page])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const filters = {
        search: searchQuery,
        category: category !== 'All' ? category : '',
        page,
        limit: 10
      }
      const response = await jobService.getJobs(filters)
      setJobs(response.data)
      setTotalPages(response.pagination.pages)
    } catch (err) {
      setError('Failed to load jobs')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleJobClick = (jobId) => {
    navigate(`/job/${jobId}`)
  }

  if (loading) {
    return (
      <section className="job-listings">
        <div className="container">
          <div className="loading">
            <p>Loading jobs...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="job-listings">
        <div className="container">
          <div className="error-message">{error}</div>
        </div>
      </section>
    )
  }

  return (
    <section className="job-listings" id="jobs">
      <div className="container">
        <h2 className="section-title">Latest Job Openings</h2>
        
        <div className="listings-layout">
          <aside className="sidebar">
            <div className="filter-section">
              <h3 className="filter-title">Category</h3>
              <div className="category-filter">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`category-btn ${category === cat ? 'active' : ''}`}
                    onClick={() => {
                      onCategoryChange(cat)
                      setPage(1)
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h3 className="filter-title">Sort By</h3>
              <select 
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Most Recent</option>
                <option value="salary">Highest Salary</option>
                <option value="relevant">Most Relevant</option>
              </select>
            </div>
          </aside>

          <main className="jobs-main">
            <div className="jobs-count">
              Showing {jobs.length} jobs
            </div>
            
            <div className="jobs-grid">
              {jobs.length > 0 ? (
                jobs.map(job => (
                  <div 
                    key={job.id} 
                    onClick={() => handleJobClick(job.id)}
                    className="job-card-wrapper"
                  >
                    <JobCard job={job} />
                  </div>
                ))
              ) : (
                <div className="no-jobs">
                  <p>No jobs found matching your criteria.</p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="pagination-btn"
                >
                  Previous
                </button>
                <span className="pagination-info">Page {page} of {totalPages}</span>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  )
}

export default JobListings
