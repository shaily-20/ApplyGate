import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './HomePage.css'

function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  const handleBrowseJobs = () => {
    navigate('/#jobs')
  }

  const handleStartHiring = () => {
    if (!isAuthenticated) {
      navigate('/signup')
    } else {
      navigate('/post-job')
    }
  }

  return (
    <div className="home-page-main">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content-main">
          <div className="hero-text">
            <h1 className="hero-title">Welcome to ApplyGate</h1>
            <p className="hero-description">
              Your Ultimate Platform for Job Search & Recruitment
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={handleBrowseJobs}>
                🔍 Browse Jobs
              </button>
              <button className="btn-secondary" onClick={handleStartHiring}>
                📝 Post a Job
              </button>
            </div>
          </div>
          <div className="hero-illustration">
            <div className="illustration-box">
              <span className="huge-emoji">💼</span>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Info Section */}
      <section className="platform-section">
        <div className="container-wide">
          <h2 className="section-heading">About ApplyGate</h2>
          <p className="section-subtitle">
            A modern, secure, and user-friendly platform designed to connect job seekers with employers
          </p>

          <div className="platform-features">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>Experience blazing-fast job search with real-time filtering and instant results</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Safe</h3>
              <p>Your data is protected with advanced encryption and secure authentication</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Fully Responsive</h3>
              <p>Access ApplyGate from any device - desktop, tablet, or mobile phone</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Global Opportunities</h3>
              <p>Explore job opportunities from companies around the world</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>Smart Matching</h3>
              <p>Find jobs that match your skills and preferences with advanced filtering</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⏱️</div>
              <h3>Real-Time Updates</h3>
              <p>Get instant notifications about new job postings and application status</p>
            </div>
          </div>
        </div>
      </section>

      {/* RTC Features Section */}
      <section className="rtc-features-section">
        <div className="container-wide">
          <h2 className="section-heading">Advanced RTC Features</h2>
          <p className="section-subtitle">
            Real-Time Communication & Collaboration Tools
          </p>

          <div className="rtc-tabs">
            <button
              className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </button>
            <button
              className={`tab-button ${activeTab === 'messaging' ? 'active' : ''}`}
              onClick={() => setActiveTab('messaging')}
            >
              💬 Messaging
            </button>
            <button
              className={`tab-button ${activeTab === 'video' ? 'active' : ''}`}
              onClick={() => setActiveTab('video')}
            >
              📹 Video Interviews
            </button>
            <button
              className={`tab-button ${activeTab === 'screen' ? 'active' : ''}`}
              onClick={() => setActiveTab('screen')}
            >
              🖥️ Screen Sharing
            </button>
          </div>

          <div className="rtc-content">
            {activeTab === 'overview' && (
              <div className="rtc-card">
                <h3>Real-Time Communication Platform</h3>
                <p>
                  ApplyGate integrates cutting-edge WebRTC technology to enable seamless communication
                  between employers and job seekers. Our platform supports:
                </p>
                <ul className="rtc-list">
                  <li>✅ Instant messaging with text, media, and file sharing</li>
                  <li>✅ One-on-one and group video interviews</li>
                  <li>✅ Screen sharing for technical assessments</li>
                  <li>✅ Real-time notifications and presence indicators</li>
                  <li>✅ Call recording and transcription (optional)</li>
                  <li>✅ Chat history and conversation management</li>
                </ul>
              </div>
            )}

            {activeTab === 'messaging' && (
              <div className="rtc-card">
                <h3>💬 Instant Messaging</h3>
                <p>
                  Connect instantly with employers and job seekers through our integrated messaging system:
                </p>
                <ul className="rtc-list">
                  <li>✅ Real-time message delivery with read receipts</li>
                  <li>✅ Share files, images, and documents</li>
                  <li>✅ Create group conversations for team communication</li>
                  <li>✅ Search and filter message history</li>
                  <li>✅ Emoji and rich text support</li>
                  <li>✅ Message encryption for privacy</li>
                </ul>
              </div>
            )}

            {activeTab === 'video' && (
              <div className="rtc-card">
                <h3>📹 Video Interview Platform</h3>
                <p>
                  Conduct professional video interviews with built-in scheduling and recording:
                </p>
                <ul className="rtc-list">
                  <li>✅ HD video and crystal-clear audio quality</li>
                  <li>✅ Automatic scheduling and calendar integration</li>
                  <li>✅ One-click join - no downloads required</li>
                  <li>✅ Virtual backgrounds for professional appearance</li>
                  <li>✅ Automatic recording and transcript generation</li>
                  <li>✅ Interview feedback and notes section</li>
                </ul>
              </div>
            )}

            {activeTab === 'screen' && (
              <div className="rtc-card">
                <h3>🖥️ Screen Sharing & Collaboration</h3>
                <p>
                  Perfect for technical interviews, portfolio reviews, and collaborative problem-solving:
                </p>
                <ul className="rtc-list">
                  <li>✅ Share entire screen or specific windows</li>
                  <li>✅ Remote cursor indication for easy guidance</li>
                  <li>✅ Whiteboard for sketching and brainstorming</li>
                  <li>✅ Code editor integration for live coding interviews</li>
                  <li>✅ Low-latency sharing for smooth experience</li>
                  <li>✅ Recording includes shared content</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="container-wide">
          <h2 className="section-heading">Platform Statistics</h2>
          
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Active Jobs</div>
              <div className="stat-description">Fresh opportunities posted daily</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Companies</div>
              <div className="stat-description">Leading employers worldwide</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100K+</div>
              <div className="stat-label">Job Seekers</div>
              <div className="stat-description">Active community members</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">Success Rate</div>
              <div className="stat-description">Successful job placements</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container-wide">
          <h2 className="section-heading">How ApplyGate Works</h2>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Create Account</h3>
              <p>Sign up as a Job Seeker or Employer and complete your profile</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Browse or Post</h3>
              <p>Job Seekers browse jobs, Employers post job openings</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Connect & Chat</h3>
              <p>Start instant messaging with potential candidates or employers</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Video Interview</h3>
              <p>Conduct professional video interviews using our RTC platform</p>
            </div>
            <div className="step-card">
              <div className="step-number">5</div>
              <h3>Offer & Accept</h3>
              <p>Seal the deal with job offers and acceptance</p>
            </div>
            <div className="step-card">
              <div className="step-number">6</div>
              <h3>Start Working</h3>
              <p>Begin your new journey with your new employer</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Find Your Perfect Job?</h2>
          <p>Start your journey today with ApplyGate - where opportunities meet ambition</p>
          <div className="cta-buttons">
            <button className="btn-large-primary" onClick={handleBrowseJobs}>
              Start Browsing Jobs
            </button>
            <button className="btn-large-secondary" onClick={handleStartHiring}>
              Become an Employer
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
