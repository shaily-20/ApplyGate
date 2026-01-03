import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>ApplyGate</h4>
          <p>Your gateway to amazing job opportunities</p>
        </div>
        
        <div className="footer-section">
          <h5>Quick Links</h5>
          <ul>
            <li><a href="#jobs">Browse Jobs</a></li>
            <li><a href="#companies">Companies</a></li>
            <li><a href="#about">About Us</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h5>For Companies</h5>
          <ul>
            <li><a href="#post">Post a Job</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#recruiting">Recruiting</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h5>Contact</h5>
          <ul>
            <li><a href="mailto:support@applygate.com">support@applygate.com</a></li>
            <li><a href="tel:+1234567890">+1 (234) 567-890</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2026 ApplyGate. All rights reserved.</p>
        <div className="footer-social">
          <a href="#facebook">Facebook</a>
          <a href="#twitter">Twitter</a>
          <a href="#linkedin">LinkedIn</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
