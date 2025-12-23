import React from 'react'
import { 
  Users, 
  Target, 
  Award, 
  Globe, 
  Heart, 
  Lightbulb,
  Shield,
  Zap,
  Star,
  ArrowRight,
  Mail,
  Twitter,
  Linkedin,
  Github
} from 'lucide-react'
import Particles from '../components/Particles'
import BackToTop from '../components/BackToTop'
import { useNavigate } from 'react-router-dom'

function About() {
  const navigate = useNavigate()

  const handleStartConverting = () => {
    navigate('/')
  }
  const team = [
    {
      name: "Babak Gasimzade",
      role: "Founder & Lead Developer",
      avatar: "/babakme.jpg",
      bio: "Computer Science student at Riga Technical University. Passionate about building responsive web apps, mobile apps, and AI-powered tools. Creator of Convertonix and multiple innovative projects.",
      location: "Europe",
      website: "bgdevofficial.com",
      social: {
        linkedin: "https://www.linkedin.com/in/babakgasimzade/",
        github: "https://github.com/bgasimzade99",
        website: "https://bgdevofficial.com"
      },
      skills: ["React", "React Native", "TypeScript", "Node.js", "Firebase", "TailwindCSS"],
      projects: ["BGResume", "BGAutoSales", "BGWeather", "Convertonix", "Asnates JSK", "BGFocus"]
    }
  ]

  const values = [
    {
      icon: <Shield size={48} />,
      title: "Privacy First",
      description: "We believe your data belongs to you. All processing happens locally in your browser, ensuring complete privacy and security."
    },
    {
      icon: <Zap size={48} />,
      title: "Performance",
      description: "We optimize every aspect of our platform for speed and efficiency, delivering lightning-fast conversions."
    },
    {
      icon: <Heart size={48} />,
      title: "User-Centric",
      description: "Every feature we build is designed with our users in mind. We listen, learn, and iterate based on real feedback."
    },
    {
      icon: <Lightbulb size={48} />,
      title: "Innovation",
      description: "We leverage cutting-edge AI technology to solve problems that traditional tools can't handle."
    }
  ]

  const milestones = [
    {
      year: "2024",
      title: "The Beginning",
      description: "Convertonix was born from a simple idea: make file conversion fast, secure, and accessible to everyone."
    },
    {
      year: "2024 Q2",
      title: "AI Integration",
      description: "We integrated advanced AI capabilities, revolutionizing how users interact with their files."
    },
    {
      year: "2024 Q3",
      title: "Privacy-First Approach",
      description: "Pioneered local processing technology, ensuring user files never leave their devices."
    },
    {
      year: "2025",
      title: "Global Launch",
      description: "Launched Convertonix globally, serving users in over 50 countries with 99.9% uptime."
    }
  ]

  const stats = [
    { number: "1M+", label: "Files Converted" },
    { number: "50+", label: "Countries Served" },
    { number: "99.9%", label: "Uptime" },
    { number: "4.9⭐", label: "User Rating" }
  ]

  return (
    <div className="about-page">
      <Particles />
      
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1>
            <span className="gradient-text">About Convertonix</span>
            <br />
            Revolutionizing File Conversion
          </h1>
          <p className="hero-subtitle">
            We're on a mission to make file conversion simple, fast, and secure. 
            Built with privacy-first principles and powered by cutting-edge AI technology.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <h2>Our Mission</h2>
              <p>
                At Convertonix, we believe that file conversion should be effortless, secure, and accessible to everyone. 
                Our mission is to eliminate the friction between different file formats, enabling seamless digital workflows 
                while maintaining the highest standards of privacy and security.
              </p>
              <p>
                We're not just building a file converter – we're creating the future of document processing, 
                where AI meets user-friendly design to solve real-world problems.
              </p>
              <div className="mission-stats">
                {stats.map((stat, index) => (
                  <div key={index} className="mission-stat">
                    <div className="stat-number">{stat.number}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mission-visual">
              <div className="visual-card">
                <Target size={64} />
                <h3>Our Vision</h3>
                <p>To become the world's most trusted platform for file conversion and document processing.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title">Our Core Values</h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BGDev Story Section */}
      <section className="bgdev-story-section">
        <div className="container">
          <div className="bgdev-story-content">
            <div className="bgdev-story-text">
              <h2>Meet BGDev</h2>
              <div className="bgdev-quote">
                <p className="quote-text">
                  "We're not another dev agency — we're a digital craft studio."
                </p>
                <p className="quote-author">— BGDev Team</p>
              </div>
              <p>
                At BGDev, every line of code, every pixel, and every animation has a reason.
                We build things that look stunning, feel smooth, and work flawlessly.
              </p>
              <p>
                Born from late-night coding sessions and a bold vision, BGDev is a startup built by creators — 
                for creators, founders, and dreamers who want to stand out in the digital crowd.
              </p>
              <div className="bgdev-philosophy">
                <h3>Our Philosophy</h3>
                <div className="philosophy-grid">
                  <div className="philosophy-item">
                    <h4>Modern</h4>
                    <p>Cutting-edge technologies and contemporary design principles</p>
                  </div>
                  <div className="philosophy-item">
                    <h4>Minimal</h4>
                    <p>Clean, purposeful design that focuses on what matters</p>
                  </div>
                  <div className="philosophy-item">
                    <h4>Powerful</h4>
                    <p>Robust solutions that deliver exceptional performance</p>
                  </div>
                </div>
              </div>
              <p>
                We mix React, Tailwind, and design thinking to create experiences that actually feel alive. 
                From sleek landing pages to full-stack products, we make technology look beautiful — 
                and business feel human.
              </p>
              <div className="bgdev-vision">
                <h3>Our Vision</h3>
                <p>
                  Not just websites. Not just apps.<br />
                  We create digital energy — the kind that people remember.
                </p>
                <p>
                  We're here to shape the next generation of online experiences — 
                  one smart, clean project at a time.
                </p>
              </div>
            </div>
            <div className="story-timeline">
              <h3>Our Journey</h3>
              {milestones.map((milestone, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-year">{milestone.year}</div>
                  <div className="timeline-content">
                    <h4>{milestone.title}</h4>
                    <p>{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2 className="section-title">Meet BGDev</h2>
          <p className="section-subtitle">
            The digital craft studio behind Convertonix, building innovative solutions 
            that look stunning, feel smooth, and work flawlessly.
          </p>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card enhanced">
                <div className="team-header">
                  <div className="team-avatar">
                    <img src={member.avatar} alt={member.name} />
                    <div className="status-indicator"></div>
                  </div>
                  <div className="team-info">
                    <h3 className="team-name">{member.name}</h3>
                    <p className="team-role">{member.role}</p>
                    <div className="team-location">
                      <Globe size={16} />
                      <span>{member.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="team-content">
                  <p className="team-bio">{member.bio}</p>
                  
                  <div className="team-skills">
                    <h4>Tech Stack</h4>
                    <div className="skills-grid">
                      {member.skills.map((skill, idx) => (
                        <span key={idx} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="team-projects">
                    <h4>Featured Projects</h4>
                    <div className="projects-list">
                      {member.projects.map((project, idx) => (
                        <span key={idx} className="project-tag">{project}</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="team-footer">
                  <div className="team-social">
                    <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                      <Linkedin size={20} />
                    </a>
                    <a href={member.social.github} target="_blank" rel="noopener noreferrer" title="GitHub">
                      <Github size={20} />
                    </a>
                    <a href={member.social.website} target="_blank" rel="noopener noreferrer" title="Website">
                      <Globe size={20} />
                    </a>
                  </div>
                  <div className="team-website">
                    <a href={member.social.website} target="_blank" rel="noopener noreferrer">
                      {member.website}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="technology-section">
        <div className="container">
          <h2 className="section-title">Powered by Innovation</h2>
          <div className="tech-content">
            <div className="tech-text">
              <h3>Cutting-Edge Technology</h3>
              <p>
                Convertonix is built on a foundation of modern web technologies and AI innovation. 
                We use advanced algorithms, machine learning models, and browser-based processing 
                to deliver results that were previously impossible.
              </p>
              <ul className="tech-features">
                <li>Advanced AI models for document analysis and enhancement</li>
                <li>Browser-based processing for complete privacy</li>
                <li>Real-time optimization algorithms</li>
                <li>Scalable architecture supporting millions of users</li>
              </ul>
            </div>
            <div className="tech-visual">
              <div className="tech-stack">
                <div className="tech-item">
                  <Globe size={32} />
                  <span>Web Technologies</span>
                </div>
                <div className="tech-item">
                  <Zap size={32} />
                  <span>AI & ML</span>
                </div>
                <div className="tech-item">
                  <Shield size={32} />
                  <span>Security</span>
                </div>
                <div className="tech-item">
                  <Award size={32} />
                  <span>Quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <h2 className="section-title">Get in Touch</h2>
          <p className="section-subtitle">
            Have questions, suggestions, or want to work with us? We'd love to hear from you.
          </p>
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <Mail size={24} />
                <div>
                  <h4>Email Us</h4>
                  <p>bgdevofficial@gmail.com</p>
                </div>
              </div>
              <div className="contact-item">
                <Twitter size={24} />
                <div>
                  <h4>Follow Us</h4>
                  <p>@bgdevofficial</p>
                </div>
              </div>
              <div className="contact-item">
                <Globe size={24} />
                <div>
                  <h4>Visit Us</h4>
                  <p>www.bgdevofficial.com</p>
                </div>
              </div>
            </div>
            <div className="contact-cta">
              <h3>Ready to Get Started?</h3>
              <p>Join thousands of users who trust Convertonix for their file conversion needs.</p>
              <button className="btn-primary" onClick={handleStartConverting}>
                Start Converting Now
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <BackToTop />
    </div>
  )
}

export default About
