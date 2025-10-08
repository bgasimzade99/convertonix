import React, { useState } from 'react'
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search,
  BookOpen,
  Users,
  Zap,
  Shield,
  ArrowRight,
  Send
} from 'lucide-react'
import Particles from '../components/Particles'
import BackToTop from '../components/BackToTop'

function Support() {
  const [searchQuery, setSearchQuery] = useState('')
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I convert a file?",
          answer: "Simply drag and drop your file onto the upload area, select your desired output format, and click convert. All processing happens in your browser."
        },
        {
          question: "What file formats are supported?",
          answer: "We support 50+ file formats including PDF, DOCX, XLSX, PPTX, JPG, PNG, MP4, MP3, and many more. Check our Features page for the complete list."
        },
        {
          question: "Is there a file size limit?",
          answer: "File size limits depend on your browser's memory capacity. Generally, files up to 100MB work well, but larger files may require more processing time."
        }
      ]
    },
    {
      category: "Technical Issues",
      questions: [
        {
          question: "Why is my conversion taking so long?",
          answer: "Conversion speed depends on file size, complexity, and your device's processing power. Large files or complex documents may take longer to process."
        },
        {
          question: "My conversion failed. What should I do?",
          answer: "Try refreshing the page and converting again. If the issue persists, check that your file isn't corrupted and try a different browser."
        },
        {
          question: "Can I convert files offline?",
          answer: "Yes! Once the page is loaded, you can convert files without an internet connection since all processing happens locally."
        }
      ]
    },
    {
      category: "Account & Billing",
      questions: [
        {
          question: "Do I need to create an account?",
          answer: "No account is required for basic conversions. However, creating an account gives you access to premium features and conversion history."
        },
        {
          question: "How do I upgrade to Premium?",
          answer: "Click the 'Upgrade' button in the header or visit our Pricing page. You can start with a free trial."
        },
        {
          question: "Can I cancel my subscription?",
          answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
        }
      ]
    }
  ]

  const supportChannels = [
    {
      icon: <Mail size={32} />,
      title: "Email Support",
      description: "Get help via email within 24 hours",
      contact: "bgdevofficial@gmail.com",
      availability: "24/7",
      responseTime: "Within 24 hours"
    },
    {
      icon: <MessageCircle size={32} />,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      contact: "Available on website",
      availability: "Mon-Fri 9AM-6PM",
      responseTime: "Immediate"
    },
    {
      icon: <BookOpen size={32} />,
      title: "Documentation",
      description: "Comprehensive guides and tutorials",
      contact: "Help Center",
      availability: "24/7",
      responseTime: "Self-service"
    }
  ]

  const handleContactSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(contactForm.subject)
    const body = encodeURIComponent(
      `Name: ${contactForm.name}\nEmail: ${contactForm.email}\n\nMessage:\n${contactForm.message}`
    )
    window.open(`mailto:bgdevofficial@gmail.com?subject=${subject}&body=${body}`, '_blank')
    setContactForm({ name: '', email: '', subject: '', message: '' })
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
            <br />
            We're Here to Help
          </h1>
          <p className="hero-subtitle">
            Get help with Convertonix. Find answers to common questions, 
            contact our support team, or explore our documentation.
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
      <section className="support-channels">
        <div className="container">
          <h2 className="section-title">Get Support</h2>
          <div className="channels-grid">
            {supportChannels.map((channel, index) => (
              <div key={index} className="channel-card">
                <div className="channel-icon">{channel.icon}</div>
                <h3>{channel.title}</h3>
                <p className="channel-description">{channel.description}</p>
                <div className="channel-details">
                  <div className="detail-item">
                    <strong>Contact:</strong> {channel.contact}
                  </div>
                  <div className="detail-item">
                    <strong>Availability:</strong> {channel.availability}
                  </div>
                  <div className="detail-item">
                    <strong>Response Time:</strong> {channel.responseTime}
                  </div>
                </div>
                <button className="btn-outline">
                  {channel.title === 'Email Support' ? 'Send Email' : 
                   channel.title === 'Live Chat' ? 'Start Chat' : 
                   'View Docs'}
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          {filteredFaqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="faq-category">
              <h3 className="category-title">{category.category}</h3>
              <div className="faq-list">
                {category.questions.map((faq, faqIndex) => (
                  <div key={faqIndex} className="faq-item">
                    <h4 className="faq-question">{faq.question}</h4>
                    <p className="faq-answer">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="contact-form-section">
        <div className="container">
          <h2 className="section-title">Contact Us</h2>
          <p className="section-subtitle">
            Can't find what you're looking for? Send us a message and we'll get back to you.
          </p>
          
          <form onSubmit={handleContactSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                value={contactForm.subject}
                onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                rows="6"
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                required
              ></textarea>
            </div>
            
            <button type="submit" className="btn-primary">
              <Send size={20} />
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Quick Tips */}
      <section className="quick-tips">
        <div className="container">
          <h2 className="section-title">Quick Tips</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <Zap size={32} />
              <h3>Faster Conversions</h3>
              <p>Close unnecessary browser tabs to free up memory for faster processing.</p>
            </div>
            <div className="tip-card">
              <Shield size={32} />
              <h3>Privacy First</h3>
              <p>All conversions happen locally in your browser - your files never leave your device.</p>
            </div>
            <div className="tip-card">
              <Users size={32} />
              <h3>Team Features</h3>
              <p>Upgrade to Premium for team collaboration and advanced features.</p>
            </div>
          </div>
        </div>
      </section>
      
      <BackToTop />
    </div>
  )
}

export default Support
