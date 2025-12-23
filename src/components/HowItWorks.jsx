import React from 'react'
import { X, Upload, FileText, Sparkles, Download, Shield, Zap, CheckCircle2 } from 'lucide-react'

function HowItWorks({ onClose }) {
  const steps = [
    {
      icon: <Upload size={32} />,
      title: "Upload Your File",
      description: "Drag and drop your file or click to browse. We support 100+ formats including PDF, Word, Images, Videos, and more.",
      color: "var(--indigo)"
    },
    {
      icon: <FileText size={32} />,
      title: "Choose Format",
      description: "Select your desired output format. Our AI automatically detects the best conversion settings for optimal quality.",
      color: "var(--purple)"
    },
    {
      icon: <Sparkles size={32} />,
      title: "AI Processing",
      description: "Our advanced AI processes your file instantly. Enhance images, extract text with OCR, or compress files intelligently.",
      color: "var(--gold)"
    },
    {
      icon: <Download size={32} />,
      title: "Download Instantly",
      description: "Get your converted file in seconds. Files are processed in your browser - nothing is uploaded to our servers.",
      color: "var(--green)"
    }
  ]

  const features = [
    {
      icon: <Shield size={24} />,
      text: "100% Private - Files never leave your browser"
    },
    {
      icon: <Zap size={24} />,
      text: "Lightning Fast - Convert in seconds, not minutes"
    },
    {
      icon: <CheckCircle2 size={24} />,
      text: "No Signup Required - Start converting immediately"
    }
  ]

  return (
    <div className="modal-overlay how-it-works-overlay" onClick={onClose}>
      <div className="modal-content how-it-works-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={24} />
        </button>

        <div className="how-it-works-header">
          <h2>How Convertonix Works</h2>
          <p className="how-it-works-subtitle">
            Convert any file in 4 simple steps. Fast, secure, and completely free to start.
          </p>
        </div>

        <div className="how-it-works-steps">
          {steps.map((step, index) => (
            <div key={index} className="how-it-works-step">
              <div className="step-number">{index + 1}</div>
              <div className="step-icon" style={{ color: step.color }}>
                {step.icon}
              </div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="step-connector">
                  <div className="connector-line"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="how-it-works-features">
          <h3>Why Choose Convertonix?</h3>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-item">
                <div className="feature-icon">{feature.icon}</div>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="how-it-works-cta">
          <button className="btn-primary" onClick={onClose}>
            Start Converting Now
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default HowItWorks

