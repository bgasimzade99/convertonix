import React from 'react'
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Database, 
  Server, 
  Globe, 
  CheckCircle,
  AlertCircle,
  FileText,
  Users,
  Clock
} from 'lucide-react'
import Particles from '../components/Particles'
import BackToTop from '../components/BackToTop'

function Privacy() {
  const privacyPrinciples = [
    {
      icon: <Lock size={48} />,
      title: "🔒 Local Processing",
      description: "All file conversions happen directly in your browser. Your files never leave your device.",
      details: [
        "No file uploads to our servers",
        "Processing happens in your browser",
        "Files stay on your device at all times",
        "Zero data transmission to external servers"
      ]
    },
    {
      icon: <EyeOff size={48} />,
      title: "👁️ No Data Collection",
      description: "We don't collect, store, or analyze your personal data or file contents.",
      details: [
        "No personal information collection",
        "No file content analysis",
        "No usage tracking or analytics",
        "No third-party data sharing"
      ]
    },
    {
      icon: <Database size={48} />,
      title: "🗄️ Zero Storage",
      description: "We don't store any files, metadata, or conversion history on our servers.",
      details: [
        "No file storage on our servers",
        "No conversion history stored remotely",
        "No metadata collection",
        "Complete data sovereignty"
      ]
    },
    {
      icon: <Globe size={48} />,
      title: "🌍 GDPR Compliant",
      description: "We follow strict privacy regulations and data protection standards.",
      details: [
        "GDPR compliance",
        "CCPA compliance",
        "Privacy by design principles",
        "Regular privacy audits"
      ]
    }
  ]

  const dataTypes = [
    {
      type: "File Contents",
      collected: false,
      reason: "All processing happens locally in your browser"
    },
    {
      type: "Personal Information",
      collected: false,
      reason: "We don't require or collect personal data"
    },
    {
      type: "Usage Analytics",
      collected: false,
      reason: "No tracking or analytics on file conversions"
    },
    {
      type: "IP Addresses",
      collected: false,
      reason: "We don't log or store IP addresses"
    },
    {
      type: "Browser Information",
      collected: false,
      reason: "No browser fingerprinting or tracking"
    }
  ]

  const securityMeasures = [
    {
      icon: <Shield size={32} />,
      title: "End-to-End Encryption",
      description: "All communications use HTTPS encryption"
    },
    {
      icon: <Server size={32} />,
      title: "Secure Infrastructure",
      description: "Hosted on secure, certified cloud infrastructure"
    },
    {
      icon: <CheckCircle size={32} />,
      title: "Regular Security Audits",
      description: "Regular security assessments and updates"
    },
    {
      icon: <Users size={32} />,
      title: "Privacy Team",
      description: "Dedicated privacy and security team"
    }
  ]

  return (
    <div className="privacy-page">
      <Particles />
      
      {/* Hero Section */}
      <section className="privacy-hero">
        <div className="container">
          <h1>
            <span className="gradient-text">Privacy Policy</span>
            <br />
            Your Data, Your Control
          </h1>
          <p className="hero-subtitle">
            At Convertonix, privacy isn't just a feature—it's our foundation. 
            We've built our platform with privacy-first principles to ensure your data never leaves your device.
          </p>
        </div>
      </section>

      {/* Privacy Principles */}
      <section className="privacy-principles">
        <div className="container">
          <h2 className="section-title">Our Privacy Principles</h2>
          <div className="principles-grid">
            {privacyPrinciples.map((principle, index) => (
              <div key={index} className="principle-card">
                <div className="principle-icon">{principle.icon}</div>
                <h3>{principle.title}</h3>
                <p className="principle-description">{principle.description}</p>
                <ul className="principle-details">
                  {principle.details.map((detail, idx) => (
                    <li key={idx}>
                      <CheckCircle size={16} />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Collection */}
      <section className="data-collection">
        <div className="container">
          <h2 className="section-title">What We Don't Collect</h2>
          <p className="section-subtitle">
            Unlike other file conversion services, we don't collect any of your data.
          </p>
          <div className="data-table">
            {dataTypes.map((item, index) => (
              <div key={index} className="data-row">
                <div className="data-type">
                  <FileText size={20} />
                  <span>{item.type}</span>
                </div>
                <div className="data-status">
                  <span className={`status ${item.collected ? 'collected' : 'not-collected'}`}>
                    {item.collected ? 'Collected' : 'Not Collected'}
                  </span>
                </div>
                <div className="data-reason">{item.reason}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Measures */}
      <section className="security-measures">
        <div className="container">
          <h2 className="section-title">Security Measures</h2>
          <div className="security-grid">
            {securityMeasures.map((measure, index) => (
              <div key={index} className="security-card">
                <div className="security-icon">{measure.icon}</div>
                <h3>{measure.title}</h3>
                <p>{measure.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="technical-details">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="technical-content">
            <div className="technical-text">
              <h3>Local Processing Technology</h3>
              <p>
                Convertonix uses advanced browser-based processing technology that allows 
                file conversions to happen entirely on your device. This means:
              </p>
              <ul className="technical-list">
                <li><strong>Client-Side Processing:</strong> All conversion algorithms run in your browser</li>
                <li><strong>No Server Uploads:</strong> Files never leave your device</li>
                <li><strong>Memory-Only Processing:</strong> Files are processed in RAM, not stored</li>
                <li><strong>Automatic Cleanup:</strong> All temporary data is cleared after conversion</li>
              </ul>
            </div>
            <div className="technical-visual">
              <div className="process-flow">
                <div className="flow-step">
                  <div className="step-icon">📁</div>
                  <div className="step-text">Your File</div>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-step">
                  <div className="step-icon">💻</div>
                  <div className="step-text">Your Browser</div>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-step">
                  <div className="step-icon">✨</div>
                  <div className="step-text">Converted File</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="privacy-contact">
        <div className="container">
          <h2 className="section-title">Questions About Privacy?</h2>
          <p className="section-subtitle">
            If you have any questions about our privacy practices or how we protect your data, 
            please don't hesitate to contact us.
          </p>
          <div className="contact-info">
            <div className="contact-item">
              <Clock size={24} />
              <div>
                <h4>Response Time</h4>
                <p>We respond to privacy inquiries within 24 hours</p>
              </div>
            </div>
            <div className="contact-item">
              <AlertCircle size={24} />
              <div>
                <h4>Report Issues</h4>
                <p>Found a privacy concern? Report it immediately</p>
              </div>
            </div>
          </div>
          <div className="contact-cta">
            <button className="btn-primary" onClick={() => window.open('mailto:bgdevofficial@gmail.com?subject=Privacy Inquiry', '_blank')}>
              Contact Privacy Team
            </button>
          </div>
        </div>
      </section>
      
      <BackToTop />
    </div>
  )
}

export default Privacy
