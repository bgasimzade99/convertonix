import { Brain, Sparkles, Zap, Shield } from 'lucide-react'

function AIFeatures() {
  return (
    <div className="ai-features-section">
      <h2 className="section-title">
        <Sparkles size={28} />
        AI-Powered Features
      </h2>
      
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">
            <Brain size={40} />
          </div>
          <h3>Smart OCR</h3>
          <p>Extract text from images and PDFs with industry-leading accuracy using AI</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Sparkles size={40} />
          </div>
          <h3>AI Enhancement</h3>
          <p>Automatically improve image quality with AI upscaling and optimization</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Zap size={40} />
          </div>
          <h3>Smart Compression</h3>
          <p>AI determines optimal compression settings for best quality-to-size ratio</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Shield size={40} />
          </div>
          <h3>Privacy First</h3>
          <p>All conversions happen in your browser. Your files never leave your device</p>
        </div>
      </div>
    </div>
  )
}

export default AIFeatures

