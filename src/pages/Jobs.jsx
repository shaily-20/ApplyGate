import { useState } from 'react'
import Hero from '../components/Hero'
import JobListings from '../components/JobListings'
import './Jobs.css'

function Jobs() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  return (
    <div className="jobs-page">
      <Hero onSearch={setSearchQuery} />

      <JobListings 
        searchQuery={searchQuery} 
        category={selectedCategory} 
        onCategoryChange={setSelectedCategory}
      />
    </div>
  )
}

export default Jobs
