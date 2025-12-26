import React from 'react'
import { 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive, 
  Brain, 
  Zap, 
  Shield, 
  Clock, 
  Users,
  Sparkles,
  Download,
  Upload,
  Settings,
  BarChart3
} from 'lucide-react'
import Particles from '../components/Particles'
import BackToTop from '../components/BackToTop'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'

function Features() {
  const navigate = useNavigate()

  const handleStartConverting = () => {
    navigate('/')
  }

  const handleTryAIGenerator = () => {
    navigate('/')
    // AI Generator modal will be opened from the main page
    setTimeout(() => {
      // Trigger AI chat modal after navigation
      const event = new CustomEvent('openAIChat')
      window.dispatchEvent(event)
    }, 100)
  }
  const conversionFeatures = [
    {
      icon: <FileText size={48} />,
      title: "📄 Document Conversion",
      description: "Convert PDFs, Word docs, Excel sheets, PowerPoint presentations, and more",
      features: [
        "PDF to Word, Excel, PowerPoint",
        "Word to PDF, TXT, HTML",
        "Excel to CSV, PDF, JSON",
        "PowerPoint to PDF, Images",
        "OCR text extraction from PDFs"
      ]
    },
    {
      icon: <Image size={48} />,
      title: "🖼️ Image Processing",
      description: "Advanced image conversion with AI enhancement and optimization",
      features: [
        "HEIC, WebP, PNG, JPG, GIF, SVG",
        "Batch image conversion",
        "AI image enhancement",
        "Smart compression",
        "Format optimization"
      ]
    },
    {
      icon: <Video size={48} />,
      title: "🎬 Video Conversion",
      description: "Convert videos between formats with quality optimization",
      features: [
        "MP4, MOV, AVI, WebM, MKV",
        "Resolution scaling",
        "Compression optimization",
        "Audio extraction",
        "Thumbnail generation"
      ]
    },
    {
      icon: <Music size={48} />,
      title: "🎵 Audio Processing",
      description: "High-quality audio conversion and enhancement",
      features: [
        "MP3, WAV, AAC, FLAC, OGG",
        "Bitrate optimization",
        "Audio enhancement",
        "Format conversion",
        "Metadata preservation"
      ]
    }
  ]

  const aiFeatures = [
    {
      icon: <Brain size={48} />,
      title: "🧠 AI File Generator",
      description: "Generate documents, images, and content using advanced AI",
      features: [
        "AI document creation",
        "Logo and design generation",
        "Content summarization",
        "Smart templates",
        "Custom AI prompts"
      ]
    },
    {
      icon: <Sparkles size={48} />,
      title: "✨ Smart OCR",
      description: "Extract text from images and PDFs with 99% accuracy",
      features: [
        "Multi-language support",
        "Handwriting recognition",
        "Table extraction",
        "Layout preservation",
        "Batch OCR processing"
      ]
    },
    {
      icon: <Zap size={48} />,
      title: "⚡ Smart Enhancement",
      description: "AI-powered image and document enhancement",
      features: [
        "Image upscaling",
        "Noise reduction",
        "Quality improvement",
        "Auto-correction",
        "Style transfer"
      ]
    },
    {
      icon: <BarChart3 size={48} />,
      title: "📊 Smart Compression",
      description: "Intelligent compression without quality loss",
      features: [
        "Lossless compression",
        "Size optimization",
        "Quality preservation",
        "Format-specific tuning",
        "Batch compression"
      ]
    }
  ]

  const platformFeatures = [
    {
      icon: <Shield size={48} />,
      title: "🛡️ Privacy-First",
      description: "Your files never leave your device. All processing happens locally.",
      features: [
        "100% local processing",
        "No file uploads",
        "GDPR compliant",
        "Zero data collection",
        "Offline capable"
      ]
    },
    {
      icon: <Clock size={48} />,
      title: "⚡ Lightning Fast",
      description: "Optimized algorithms for the fastest conversion speeds",
      features: [
        "GPU acceleration",
        "Parallel processing",
        "Smart caching",
        "Instant preview",
        "Background processing"
      ]
    },
    {
      icon: <Users size={48} />,
      title: "👥 Team Collaboration",
      description: "Share and collaborate on conversions with your team",
      features: [
        "Shared workspaces",
        "Team permissions",
        "Collaboration tools",
        "Version control",
        "Activity tracking"
      ]
    },
    {
      icon: <Settings size={48} />,
      title: "🔧 Advanced Settings",
      description: "Fine-tune every aspect of your conversions",
      features: [
        "Custom quality settings",
        "Format-specific options",
        "Batch processing",
        "Scheduled conversions",
        "API integration"
      ]
    }
  ]

  return (
    <div className="features-page">
      <Particles />
      
      {/* Hero Section */}
      <section className="features-hero">
        <div className="container">
          <h1>
            <span className="gradient-text">Powerful Features</span>
            <br />
            for Every Conversion Need
          </h1>
          <p className="hero-subtitle">
            From simple file conversions to AI-powered document generation, 
            Convertonix provides everything you need to work with any file format.
          </p>
        </div>
      </section>

      {/* Conversion Features */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">
            <FileText size={40} />
            File Conversion Capabilities
          </h2>
          <div className="features-grid">
            {conversionFeatures.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <ul className="feature-list">
                  {feature.features.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="features-section ai-section">
        <div className="container">
          <h2 className="section-title">
            <Brain size={40} />
            AI-Powered Features
          </h2>
          <div className="features-grid">
            {aiFeatures.map((feature, index) => (
              <div key={index} className="feature-card ai-card">
                <div className="feature-icon ai-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <ul className="feature-list">
                  {feature.features.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">
            <Shield size={40} />
            Platform Excellence
          </h2>
          <div className="features-grid">
            {platformFeatures.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <ul className="feature-list">
                  {feature.features.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <h2 className="section-title">Why Users Choose Convertonix</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">50+</div>
              <div className="stat-label">File Formats</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">1M+</div>
              <div className="stat-label">Files Converted</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">4.9⭐</div>
              <div className="stat-label">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Experience the Future of File Conversion?</h2>
          <p>Join thousands of users who trust Convertonix for their file conversion needs.</p>
          <div className="cta-buttons">
            <button className="btn-primary" onClick={handleStartConverting}>
              <Download size={20} />
              Start Converting Now
            </button>
            <button className="btn-outline" onClick={handleTryAIGenerator}>
              <Upload size={20} />
              Try AI Generator
            </button>
          </div>
        </div>
      </section>
      
      <Footer />
      <BackToTop />
    </div>
  )
}

export default Features
