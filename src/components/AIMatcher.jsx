import { useState } from 'react'

export default function AIMatcher({ jobs = [] }) {
  const [input, setInput] = useState('')
  const [results, setResults] = useState([])

  const handleMatch = () => {
    const query = input.toLowerCase().split(/\s+|,|;/).filter(Boolean)
    if (!query.length) return setResults([])

    // Simple keyword scoring across title, description, skills
    const scored = jobs.map(job => {
      const text = [job.title, job.description, (job.skills || []).join(' ')].join(' ').toLowerCase()
      let score = 0
      query.forEach(q => {
        if (text.includes(q)) score += 1
      })
      return { job, score }
    }).filter(s => s.score > 0).sort((a,b) => b.score - a.score)

    setResults(scored)
  }

  return (
    <div className="ai-matcher">
      <h3>AI Job Matcher (demo)</h3>
      <p>Enter skills or keywords (comma or space separated). This lightweight matcher ranks jobs by keyword overlap.</p>
      <div className="ai-input-row">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="e.g., react node remote" />
        <button onClick={handleMatch}>Find Matches</button>
      </div>

      {results.length === 0 ? (
        <p className="ai-hint">No matches yet. Enter some keywords and click "Find Matches".</p>
      ) : (
        <div className="ai-results">
          {results.map(({ job, score }) => (
            <div key={job.id} className="ai-result-card">
              <h4>{job.title} <span className="score">{score}</span></h4>
              <p className="company">{job.companyName} • {job.location}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
