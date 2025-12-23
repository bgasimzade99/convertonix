import React, { useState } from 'react'
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Clock, 
  CheckCircle, 
  Search,
  BookOpen,
  Users,
  Zap,
  Shield,
  ArrowRight,
  Send,
  FileText,
  AlertCircle,
  Sparkles,
  Loader,
  X
} from 'lucide-react'
import Particles from '../components/Particles'
import BackToTop from '../components/BackToTop'

function Support() {
  const [toast, setToast] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I convert a file?",
          answer: "Simply drag and drop your file onto the upload area, select your desired output format, and click convert. All processing happens in your browser - no uploads required."
        },
        {
          question: "What file formats are supported?",
          answer: "We support 100+ file formats including PDF, DOCX, XLSX, PPTX, JPG, PNG, MP4, MP3, and many more. Check our Features page for the complete list."
        },
        {
          question: "Is there a file size limit?",
          answer: "File size limits depend on your browser's memory capacity. Generally, files up to 100MB work well, but larger files may require more processing time."
        },
        {
          question: "Do I need to create an account?",
          answer: "No account is required for basic conversions. However, creating an account gives you access to premium features, unlimited conversions, and conversion history."
        }
      ]
    },
    {
      category: "Technical Issues",
      questions: [
        {
          question: "Why is my conversion taking so long?",
          answer: "Conversion speed depends on file size, complexity, and your device's processing power. Large files or complex documents may take longer to process. Pro users get priority queue access."
        },
        {
          question: "My conversion failed. What should I do?",
          answer: "Try refreshing the page and converting again. If the issue persists, check that your file isn't corrupted, try a different browser, or contact our support team for assistance."
        },
        {
          question: "Can I convert files offline?",
          answer: "Yes! Once the page is loaded, you can convert files without an internet connection since all processing happens locally in your browser."
        },
        {
          question: "Is my data secure?",
          answer: "Absolutely. Convertonix processes files entirely in your browser - files never leave your device. We don't store, view, or have access to your files."
        }
      ]
    },
    {
      category: "Account & Billing",
      questions: [
        {
          question: "How do I upgrade to Pro?",
          answer: "Click the 'Upgrade' button in the header or visit our Pricing page. You can start with a free plan and upgrade anytime. No credit card required for the free plan."
        },
        {
          question: "Can I cancel my subscription?",
          answer: "Yes, you can cancel your subscription at any time through your account settings or by contacting us. You'll continue to have access until the end of your billing period."
        },
        {
          question: "How are payments processed?",
          answer: "All payments are securely processed by Paddle, our merchant of record. We don't store or process payment card information directly."
        },
        {
          question: "Do you offer refunds?",
          answer: "Refunds are handled by Paddle in accordance with their refund policy. Please visit our Refund Policy page or contact us for assistance with refund requests."
        }
      ]
    }
  ]

  const supportChannels = [
    {
      icon: <Mail size={32} />,
      title: "Email Support",
      description: "Get personalized help from our support team",
      contact: "bgdevofficial@gmail.com",
      availability: "24/7",
      responseTime: "Within 24 hours",
      color: "var(--indigo)"
    },
    {
      icon: <MessageCircle size={32} />,
      title: "Documentation",
      description: "Comprehensive guides and tutorials",
      contact: "Help Center",
      availability: "Always available",
      responseTime: "Self-service",
      color: "var(--purple)"
    },
    {
      icon: <BookOpen size={32} />,
      title: "Knowledge Base",
      description: "Search through our FAQ and articles",
      contact: "Browse articles",
      availability: "24/7",
      responseTime: "Instant",
      color: "var(--pink)"
    }
  ]

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        showToast('success', data.message || 'Message sent successfully! We\'ll get back to you within 24 hours.')
        setContactForm({ name: '', email: '', subject: '', message: '' })
      } else {
        showToast('error', data.error || 'Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Contact form error:', error)
      showToast('error', 'Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className="support-page">
      <Particles />
      
      {/* Hero Section */}
      <section className="support-hero">
        <div className="container">
          <h1>
            <span className="gradient-text">Support Center</span>
          </h1>
          <p className="hero-subtitle">
            We're here to help. Find answers to common questions, explore our documentation, 
            or get in touch with our support team.
          </p>
          
          {/* Search Bar */}
          <div className="support-search">
            <div className="search-container">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="support-channels premium-section">
        <div className="container">
          <h2 className="section-title">Get Support</h2>
          <p className="section-subtitle">
            Choose the support channel that works best for you
          </p>
          <div className="channels-grid">
            {supportChannels.map((channel, index) => (
              <div key={index} className="channel-card premium-card">
                <div className="channel-icon" style={{ color: channel.color }}>
                  {channel.icon}
                </div>
                <h3>{channel.title}</h3>
                <p className="channel-description">{channel.description}</p>
                <div className="channel-details">
                  <div className="detail-item">
                    <Clock size={16} />
                    <span><strong>Response Time:</strong> {channel.responseTime}</span>
                  </div>
                  <div className="detail-item">
                    <CheckCircle size={16} />
                    <span><strong>Availability:</strong> {channel.availability}</span>
                  </div>
                </div>
                {channel.title === 'Email Support' ? (
                  <a href={`mailto:${channel.contact}`} className="btn-outline premium-btn">
                    Send Email
                    <ArrowRight size={16} />
                  </a>
                ) : (
                  <button className="btn-outline premium-btn">
                    Explore
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section premium-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Quick answers to the most common questions about Convertonix
          </p>
          
          <div className="faq-categories">
            {filteredFaqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="faq-category premium-card">
                <h3 className="category-title">
                  <FileText size={24} />
                  {category.category}
                </h3>
                <div className="faq-list">
                  {category.questions.map((faq, faqIndex) => (
                    <div key={faqIndex} className="faq-item">
                      <div className="faq-question-wrapper">
                        <HelpCircle size={20} className="faq-icon" />
                        <h4 className="faq-question">{faq.question}</h4>
                      </div>
                      <p className="faq-answer">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Tips */}
      <section className="quick-tips premium-section">
        <div className="container">
          <h2 className="section-title">Quick Tips</h2>
          <div className="tips-grid">
            <div className="tip-card premium-card">
              <div className="tip-icon">
                <Zap size={32} />
              </div>
              <h3>Faster Conversions</h3>
              <p>Close unnecessary browser tabs to free up memory for faster processing. Pro users get priority queue access.</p>
            </div>
            <div className="tip-card premium-card">
              <div className="tip-icon">
                <Shield size={32} />
              </div>
              <h3>Privacy First</h3>
              <p>All conversions happen locally in your browser - your files never leave your device. No uploads, no storage.</p>
            </div>
            <div className="tip-card premium-card">
              <div className="tip-icon">
                <Users size={32} />
              </div>
              <h3>Upgrade to Pro</h3>
              <p>Unlock unlimited conversions, faster AI processing, priority queue, and all 100+ formats with Pro.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="contact-form-section premium-section">
        <div className="container">
          <div className="contact-form-wrapper premium-card enhanced-form-card">
            <div className="contact-form-header">
              <div className="form-header-icon">
                <MessageCircle size={48} />
              </div>
              <h2>Still Need Help?</h2>
              <p>Can't find what you're looking for? Send us a message and we'll get back to you within 24 hours.</p>
            </div>
            
            <form onSubmit={handleContactSubmit} className="contact-form premium-form">
              <div className="form-row">
                <div className="form-group enhanced-form-group">
                  <label htmlFor="name">
                    <span className="label-icon">👤</span>
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    placeholder="Your full name"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group enhanced-form-group">
                  <label htmlFor="email">
                    <span className="label-icon">✉️</span>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    placeholder="your.email@example.com"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="form-group enhanced-form-group">
                <label htmlFor="subject">
                  <span className="label-icon">📌</span>
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                  placeholder="What can we help you with?"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-group enhanced-form-group">
                <label htmlFor="message">
                  <span className="label-icon">💬</span>
                  Message
                </label>
                <textarea
                  id="message"
                  rows="6"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  placeholder="Tell us more about your question or issue. The more details you provide, the better we can help you."
                  required
                  disabled={isSubmitting}
                ></textarea>
                <div className="char-count">
                  {contactForm.message.length} / 5000 characters
                </div>
              </div>
              
              <button 
                type="submit" 
                className="btn-primary premium-btn enhanced-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader size={20} className="spinning" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Toast Notification */}
      {toast && (
        <div className={`contact-toast contact-toast-${toast.type}`}>
          <div className="toast-content">
            {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className="toast-close-btn">
            <X size={18} />
          </button>
        </div>
      )}
      
      <BackToTop />
    </div>
  )
}

export default Support
