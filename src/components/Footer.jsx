import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Instagram, Linkedin, Globe } from 'lucide-react'

function Footer() {
  const navigate = useNavigate()

  const handleLinkClick = (e, path) => {
    e.preventDefault()
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-section">
            <h3>About Convertonix</h3>
            <div className="footer-logo">
              <Link to="/" onClick={(e) => handleLinkClick(e, '/')}>
                <Sparkles size={32} className="footer-logo-icon" />
                <span className="footer-logo-text">Convertonix</span>
              </Link>
            </div>
            <p>
              AI-powered file conversion platform. Convert 100+ formats instantly. 
              All processing happens in your browser - your files never leave your device.
            </p>
            <div className="footer-social">
              <a 
                href="https://www.tiktok.com/@bgdev.official?is_from_webapp=1&sender_device=pc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                aria-label="TikTok"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a 
                href="http://instagram.com/bgdevofficial" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/company/108664615/admin/dashboard/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://bgdevofficial.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                aria-label="BGDev Website"
              >
                <Globe size={20} />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <div className="footer-links-grid">
              <Link to="/features" onClick={(e) => handleLinkClick(e, '/features')}>Features</Link>
              <Link to="/pricing" onClick={(e) => handleLinkClick(e, '/pricing')}>Pricing</Link>
              <Link to="/about" onClick={(e) => handleLinkClick(e, '/about')}>About</Link>
              <Link to="/blog" onClick={(e) => handleLinkClick(e, '/blog')}>Blog</Link>
              <Link to="/support" onClick={(e) => handleLinkClick(e, '/support')}>Support</Link>
              <Link to="/terms" onClick={(e) => handleLinkClick(e, '/terms')}>Terms</Link>
              <Link to="/privacy" onClick={(e) => handleLinkClick(e, '/privacy')}>Privacy</Link>
              <Link to="/refund" onClick={(e) => handleLinkClick(e, '/refund')}>Refund</Link>
            </div>
          </div>

          <div className="footer-section">
            <h3>Supported Formats</h3>
            <div className="footer-formats">
              <div className="format-group">
                <strong>Documents:</strong> PDF, DOCX, XLSX, PPTX, TXT
              </div>
              <div className="format-group">
                <strong>Images:</strong> JPG, PNG, GIF, WEBP, HEIC, SVG
              </div>
              <div className="format-group">
                <strong>Media:</strong> MP4, MP3, WAV, AAC, MOV, WebM
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-privacy">
            🛡️ <strong>Privacy-First:</strong> All conversions happen in your browser. No files uploaded to servers.
          </p>
          <p className="footer-copy">
            © 2025 Convertonix.com • Made by <a href="https://bgdevofficial.com" target="_blank" rel="noopener noreferrer">BGDev</a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

