import { useState, useRef, useEffect } from 'react'
import { X, Send, Sparkles, FileText, Image as ImageIcon, Download, Wand2, Copy, Check, AlertCircle, RefreshCw, Edit3, Save, RotateCcw, Eye, EyeOff, Settings } from 'lucide-react'

function AIChat({ onClose, onGenerateFile }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Hi! I\'m your AI-powered file generator. I can create professional documents, templates, and content for you.\n\n📝 **What I can generate:**\n• Professional resumes & CVs\n• Business proposals & contracts\n• Cover letters & emails\n• Reports & presentations\n• Schedules & planners\n• Code snippets & documentation\n• Marketing content\n• And much more!\n\n🎨 **Visual Content:**\n• SVG logos & icons\n• Simple graphics & designs\n\n💡 **Tip:** Be specific about what you need, and I\'ll create it for you!\n\nWhat would you like me to create?'
    }
  ])
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [editingMessageId, setEditingMessageId] = useState(null)
  const [editedContent, setEditedContent] = useState('')
  const [showPreview, setShowPreview] = useState(true)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [userPreferences, setUserPreferences] = useState({
    tone: 'professional',
    detail: 'comprehensive',
    format: 'structured',
    language: 'english'
  })
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load user preferences from localStorage
  useEffect(() => {
    const savedPrefs = localStorage.getItem('ai-user-preferences')
    if (savedPrefs) {
      setUserPreferences(JSON.parse(savedPrefs))
    }
  }, [])

  // Save user preferences to localStorage
  useEffect(() => {
    localStorage.setItem('ai-user-preferences', JSON.stringify(userPreferences))
  }, [userPreferences])

  const generateContent = async (prompt) => {
    const lowerPrompt = prompt.toLowerCase()
    
    // Check if user wants image/logo/design - generate SVG
    if (lowerPrompt.includes('logo') || lowerPrompt.includes('image') || lowerPrompt.includes('design') || lowerPrompt.includes('icon') || lowerPrompt.includes('graphic')) {
      return generateSVGLogo(prompt)
    }
    
    // Try backend API first
    try {
      const response = await fetch('/api/chatglm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          model: 'glm-4-flash',
          maxTokens: 3000,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        return {
          type: 'document',
          content: data.content,
          filename: generateFilename(prompt),
          mimeType: 'text/plain'
        }
      } else {
        throw new Error(data.error || 'Unknown API error')
      }
    } catch (apiError) {
      console.warn('API failed, using fallback:', apiError)
      // Fallback to enhanced local templates
      return generateFallbackContent(prompt)
    }
  }

  const generateSVGLogo = (prompt) => {
    const colors = [
      { primary: '#667eea', secondary: '#764ba2' },
      { primary: '#f093fb', secondary: '#f5576c' },
      { primary: '#4facfe', secondary: '#00f2fe' },
      { primary: '#43e97b', secondary: '#38f9d7' },
      { primary: '#fa709a', secondary: '#fee140' }
    ]
    
    const colorSet = colors[Math.floor(Math.random() * colors.length)]
    const logoText = extractLogoText(prompt) || 'LOGO'
    
      return {
        type: 'image',
        content: `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colorSet.primary};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${colorSet.secondary};stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="400" height="400" fill="url(#gradient)" rx="20"/>
  
  <!-- Main Shape -->
  <circle cx="200" cy="150" r="70" fill="white" opacity="0.9" filter="url(#glow)"/>
  
  <!-- Geometric accent -->
  <path d="M 150 250 L 200 200 L 250 250 L 200 300 Z" fill="white" opacity="0.9" filter="url(#glow)"/>
  
  <!-- Additional design element -->
  <circle cx="200" cy="150" r="40" fill="none" stroke="white" stroke-width="4" opacity="0.6"/>
  
  <!-- Text -->
  <text x="200" y="360" font-size="42" font-weight="bold" fill="white" text-anchor="middle" font-family="Arial, sans-serif">${logoText}</text>
  <text x="200" y="385" font-size="16" fill="white" text-anchor="middle" font-family="Arial, sans-serif" opacity="0.8">Professional Design</text>
</svg>`,
        filename: 'logo.svg',
        mimeType: 'image/svg+xml'
      }
    }
    
  const extractLogoText = (prompt) => {
    const match = prompt.match(/(?:logo|brand|company)\s+(?:for\s+)?([a-zA-Z\s]+)/i)
    return match ? match[1].trim().toUpperCase() : null
  }

  const generateFilename = (prompt) => {
    const lowerPrompt = prompt.toLowerCase()
    if (lowerPrompt.includes('resume') || lowerPrompt.includes('cv')) return 'resume.txt'
    if (lowerPrompt.includes('proposal')) return 'business-proposal.txt'
    if (lowerPrompt.includes('cover letter')) return 'cover-letter.txt'
    if (lowerPrompt.includes('email')) return 'email.txt'
    if (lowerPrompt.includes('report')) return 'report.txt'
    if (lowerPrompt.includes('schedule')) return 'schedule.txt'
    if (lowerPrompt.includes('contract')) return 'contract.txt'
    if (lowerPrompt.includes('presentation')) return 'presentation.txt'
    if (lowerPrompt.includes('code')) return 'code.txt'
    if (lowerPrompt.includes('marketing')) return 'marketing-content.txt'
    return 'ai-generated-document.txt'
  }

  const generateFallbackContent = (prompt) => {
    const lowerPrompt = prompt.toLowerCase()
    
    // Enhanced Resume Template
    if (lowerPrompt.includes('resume') || lowerPrompt.includes('cv')) {
      return {
        type: 'document',
        content: `PROFESSIONAL RESUME

JOHN DOE
Full Stack Developer & Digital Innovator
📧 john.doe@email.com | 📱 (555) 123-4567
🌐 linkedin.com/in/johndoe | 💼 github.com/johndoe

PROFESSIONAL SUMMARY
Experienced Full Stack Developer with 5+ years of expertise in React, Node.js, and cloud technologies. 
Passionate about creating scalable web applications and optimizing user experiences. Led multiple successful 
projects from conception to deployment, improving business metrics by 40%+.

TECHNICAL EXPERTISE
• Frontend: React, Vue.js, Next.js, TypeScript, Tailwind CSS, HTML5, CSS3
• Backend: Node.js, Express, Python, Django, RESTful APIs, GraphQL
• Database: PostgreSQL, MongoDB, MySQL, Redis
• Cloud: AWS, Docker, Kubernetes, CI/CD, Serverless
• Tools: Git, Figma, Jira, Slack, VS Code

PROFESSIONAL EXPERIENCE

Senior Full Stack Developer | Tech Corp (2021-Present)
• Led team of 5 developers in building enterprise SaaS platform serving 100K+ users
• Improved application performance by 40% through code optimization and caching strategies
• Implemented CI/CD pipeline reducing deployment time by 60%
• Mentored junior developers and established coding standards
• Collaborated with product team to define technical requirements

Software Engineer | StartupXYZ (2019-2021)
• Developed RESTful APIs serving 1M+ requests daily with 99.9% uptime
• Built responsive React components used across 10+ products
• Collaborated with UX team to improve user engagement by 35%
• Implemented automated testing increasing code coverage to 90%

EDUCATION
Bachelor of Science in Computer Science
University of Technology (2015-2019)
GPA: 3.8/4.0 | Magna Cum Laude

CERTIFICATIONS
• AWS Certified Solutions Architect (2022)
• Google Cloud Professional Developer (2021)
• React Developer Certification (2020)

ACHIEVEMENTS
• Contributed to 3 open-source projects with 1000+ stars
• Speaker at TechConf 2023 - "Modern Web Development"
• Patent holder for innovative caching algorithm
• Led hackathon team to 1st place (2019)

PROJECTS
E-Commerce Platform (2022)
• Built full-stack e-commerce solution with React, Node.js, and PostgreSQL
• Implemented payment processing with Stripe API
• Achieved 99.9% uptime and handled 10K+ concurrent users

AI-Powered Analytics Dashboard (2021)
• Developed real-time analytics dashboard with machine learning integration
• Used Python, TensorFlow, and React for data visualization
• Improved business insights accuracy by 60%

LANGUAGES
• English (Native)
• Spanish (Conversational)
• French (Basic)

INTERESTS
Open source contribution, Machine Learning, Photography, Travel

---
Generated by AI Assistant | ${new Date().toLocaleDateString()}`,
        filename: 'professional-resume.txt',
        mimeType: 'text/plain'
      }
    }
    
    // Enhanced Business Proposal Template
    if (lowerPrompt.includes('proposal') || lowerPrompt.includes('business')) {
      return {
        type: 'document',
        content: `BUSINESS PROPOSAL

PROJECT: Comprehensive Web Development & Digital Marketing Solution
TO: [Client Name]
FROM: BGDev Digital Solutions
DATE: ${new Date().toLocaleDateString()}
PROPOSAL ID: BG-${Date.now().toString().slice(-6)}

EXECUTIVE SUMMARY
This proposal outlines a comprehensive digital transformation solution designed to enhance 
your online presence, drive business growth, and establish a competitive advantage in the 
digital marketplace. Our solution combines cutting-edge web development with strategic 
digital marketing to deliver measurable results.

BUSINESS OBJECTIVES
• Develop a modern, responsive website with advanced functionality
• Improve user engagement and conversion rates by 50%+
• Implement scalable architecture for future growth
• Optimize for search engines (SEO) and mobile performance
• Establish strong brand presence across digital channels
• Generate qualified leads and increase sales

SCOPE OF WORK

PHASE 1: Discovery & Strategy (2 weeks)
• Comprehensive business analysis and requirements gathering
• Competitive analysis and market research
• Technical specifications and architecture planning
• Project timeline and milestone definition
• Brand strategy and positioning

PHASE 2: Design & User Experience (3 weeks)
• UI/UX design and wireframing
• Interactive prototypes and user flow optimization
• Brand identity development (logo, colors, typography)
• Mobile-first responsive design
• Client feedback integration and revisions

PHASE 3: Development & Integration (6 weeks)
• Frontend development with React/Next.js
• Backend API development with Node.js
• Database design and implementation
• Third-party integrations (payment, analytics, CRM)
• Content management system setup
• Security implementation and testing

PHASE 4: Testing & Optimization (2 weeks)
• Comprehensive quality assurance testing
• Performance optimization and speed enhancement
• Cross-browser and device compatibility testing
• Security audit and penetration testing
• SEO optimization and meta tag implementation

PHASE 5: Launch & Marketing (2 weeks)
• Production deployment and DNS configuration
• Google Analytics and Search Console setup
• Social media integration and setup
• Content migration and final testing
• Training and documentation delivery

TIMELINE & MILESTONES
Total Duration: 15 weeks
Start Date: ${new Date().toLocaleDateString()}
Expected Completion: ${new Date(Date.now() + 15 * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}

Key Milestones:
• Week 2: Strategy and design approval
• Week 5: Design mockups and prototypes
• Week 11: Development completion and testing
• Week 13: Final testing and optimization
• Week 15: Launch and handover

INVESTMENT BREAKDOWN
Development & Design: $35,000
• Custom website development
• UI/UX design and prototyping
• Database design and implementation
• Third-party integrations

Digital Marketing Setup: $5,000
• SEO optimization and setup
• Analytics and tracking implementation
• Social media integration
• Content strategy development

Annual Maintenance & Support: $6,000
• Hosting and domain management
• Security updates and monitoring
• Performance optimization
• Content updates and modifications
• Technical support and maintenance

TOTAL PROJECT INVESTMENT: $40,000
ANNUAL MAINTENANCE: $6,000

PAYMENT SCHEDULE
• 30% upon project initiation ($12,000)
• 40% upon design approval ($16,000)
• 30% upon project completion ($12,000)

TECHNOLOGY STACK
Frontend: React, Next.js, TypeScript, Tailwind CSS
Backend: Node.js, Express, PostgreSQL
Cloud: AWS, Vercel, Cloudflare
Analytics: Google Analytics, Hotjar, Mixpanel
Marketing: HubSpot, Mailchimp, Social Media APIs

SUCCESS METRICS
• 50% increase in website traffic within 6 months
• 40% improvement in conversion rates
• 99.9% website uptime
• Page load speed under 2 seconds
• Mobile responsiveness score of 95%+

RISK MITIGATION
• Regular progress reports and client communication
• Agile development methodology with iterative feedback
• Comprehensive testing and quality assurance
• Backup and disaster recovery planning
• Clear change management process

NEXT STEPS
1. Review and approve this proposal
2. Sign project agreement and initial payment
3. Schedule kickoff meeting and project initiation
4. Begin Phase 1: Discovery & Strategy

We look forward to partnering with you on this exciting digital transformation project. 
Our team is committed to delivering exceptional results that drive your business forward.

Best regards,
Babak Gasimzade
Founder & Lead Developer
BGDev Digital Solutions
📧 bgdevofficial@gmail.com
🌐 bgdevofficial.com

---
This proposal was generated by AI Assistant | ${new Date().toLocaleDateString()}`,
        filename: 'business-proposal.txt',
        mimeType: 'text/plain'
      }
    }
    
    // Enhanced Cover Letter Template
    if (lowerPrompt.includes('cover letter') || lowerPrompt.includes('application letter')) {
      return {
        type: 'document',
        content: `COVER LETTER

[Your Name]
[Your Address]
[City, State ZIP Code]
[Your Email]
[Your Phone Number]
[Date]

Hiring Manager
[Company Name]
[Company Address]
[City, State ZIP Code]

Dear Hiring Manager,

I am writing to express my strong interest in the [Position Title] position at [Company Name]. With my background in [relevant field] and passion for [relevant area], I am confident that I would be a valuable addition to your team.

PROFESSIONAL BACKGROUND
In my current role as [Current Position] at [Current Company], I have successfully [key achievement 1] and [key achievement 2]. These experiences have equipped me with the skills and knowledge necessary to excel in the [Position Title] role at [Company Name].

KEY QUALIFICATIONS
• [Relevant Skill 1]: [Brief description of experience]
• [Relevant Skill 2]: [Brief description of experience]
• [Relevant Skill 3]: [Brief description of experience]
• [Relevant Skill 4]: [Brief description of experience]

WHY I'M INTERESTED IN THIS ROLE
I am particularly drawn to this position because [specific reason related to company/role]. Your company's commitment to [company value/mission] aligns perfectly with my professional values and career aspirations.

WHAT I CAN BRING TO YOUR TEAM
• Proven track record of [relevant achievement]
• Strong analytical and problem-solving skills
• Excellent communication and collaboration abilities
• Passion for continuous learning and professional development
• [Specific skill or experience relevant to the role]

CALL TO ACTION
I would welcome the opportunity to discuss how my skills and experience can contribute to [Company Name]'s continued success. I am available for an interview at your convenience and look forward to hearing from you soon.

Thank you for considering my application. I have attached my resume for your review.

Sincerely,
[Your Name]

---
Generated by AI Assistant | ${new Date().toLocaleDateString()}`,
        filename: 'cover-letter.txt',
        mimeType: 'text/plain'
      }
    }
    
    // Enhanced Email Template
    if (lowerPrompt.includes('email') || lowerPrompt.includes('mail')) {
      return {
        type: 'document',
        content: `PROFESSIONAL EMAIL TEMPLATE

Subject: [Clear, descriptive subject line]

Dear [Recipient Name],

I hope this email finds you well. I am writing to [purpose of email - introduce yourself, follow up, request information, etc.].

CONTEXT & PURPOSE
[Provide brief context about why you're reaching out and what you hope to achieve with this communication.]

MAIN MESSAGE
[Clearly state your main point, request, or information you want to convey. Be specific and concise.]

KEY POINTS
• [Point 1]: [Brief explanation]
• [Point 2]: [Brief explanation]
• [Point 3]: [Brief explanation]

NEXT STEPS
[Outline what you expect to happen next - meeting, response, action items, etc.]

CALL TO ACTION
[Specific request or action you want the recipient to take]

CLOSING
Thank you for your time and consideration. I look forward to hearing from you soon.

Best regards,
[Your Name]
[Your Title]
[Your Company]
[Your Contact Information]

---
Email Template Generated by AI Assistant | ${new Date().toLocaleDateString()}`,
        filename: 'email-template.txt',
        mimeType: 'text/plain'
      }
    }
    
    // Enhanced Report Template
    if (lowerPrompt.includes('report') || lowerPrompt.includes('analysis')) {
      return {
        type: 'document',
        content: `PROFESSIONAL REPORT

REPORT TITLE: [Descriptive Title]
PREPARED BY: [Your Name]
DATE: ${new Date().toLocaleDateString()}
REPORT PERIOD: [Start Date] - [End Date]

EXECUTIVE SUMMARY
This report provides a comprehensive analysis of [subject matter] for the period [timeframe]. 
Key findings include [main findings], with recommendations for [recommended actions].

TABLE OF CONTENTS
1. Executive Summary
2. Introduction
3. Methodology
4. Key Findings
5. Analysis
6. Recommendations
7. Conclusion
8. Appendices

INTRODUCTION
[Background information and context for the report]

METHODOLOGY
[Description of how data was collected and analyzed]

KEY FINDINGS
• Finding 1: [Description and supporting data]
• Finding 2: [Description and supporting data]
• Finding 3: [Description and supporting data]

DETAILED ANALYSIS
[In-depth analysis of findings with supporting evidence]

RECOMMENDATIONS
1. [Recommendation 1]: [Rationale and expected outcome]
2. [Recommendation 2]: [Rationale and expected outcome]
3. [Recommendation 3]: [Rationale and expected outcome]

CONCLUSION
[Summary of key points and next steps]

APPENDICES
• Appendix A: [Supporting data or charts]
• Appendix B: [Additional information]

---
Report Generated by AI Assistant | ${new Date().toLocaleDateString()}`,
        filename: 'professional-report.txt',
        mimeType: 'text/plain'
      }
    }
    
    // Enhanced Schedule Template
    if (lowerPrompt.includes('schedule') || lowerPrompt.includes('planner') || lowerPrompt.includes('calendar')) {
      return {
        type: 'document',
        content: `PROFESSIONAL SCHEDULE & PLANNER

WEEKLY SCHEDULE TEMPLATE
Week of: ${new Date().toLocaleDateString()}

MONDAY
08:00 - 09:00 | Morning Routine & Exercise
09:00 - 12:00 | Deep Work Session - [Project/Task]
12:00 - 13:00 | Lunch Break
13:00 - 17:00 | Meetings & Collaboration
17:00 - 18:00 | Email & Admin Tasks
18:00 - 19:00 | Personal Development

TUESDAY
08:00 - 09:00 | Morning Routine & Exercise
09:00 - 12:00 | Project Development - [Specific Task]
12:00 - 13:00 | Lunch Break
13:00 - 16:00 | Client Calls & Communication
16:00 - 18:00 | Code Review & Documentation
18:00 - 19:00 | Learning & Skill Building

WEDNESDAY
08:00 - 09:00 | Morning Routine & Exercise
09:00 - 12:00 | Deep Work Session - [Project/Task]
12:00 - 13:00 | Lunch Break
13:00 - 15:00 | Team Standup & Planning
15:00 - 18:00 | Development Work
18:00 - 19:00 | Networking & Community

THURSDAY
08:00 - 09:00 | Morning Routine & Exercise
09:00 - 12:00 | Learning & Development
12:00 - 13:00 | Lunch Break
13:00 - 17:00 | Project Work & Implementation
17:00 - 18:00 | Weekly Review & Planning
18:00 - 19:00 | Personal Projects

FRIDAY
08:00 - 09:00 | Morning Routine & Exercise
09:00 - 12:00 | Sprint Wrap-up & Documentation
12:00 - 13:00 | Lunch Break
13:00 - 16:00 | Testing & Quality Assurance
16:00 - 18:00 | Planning Next Week
18:00 - 19:00 | Team Building & Social

WEEKEND
SATURDAY
• Personal Projects & Hobbies
• Family Time & Social Activities
• Rest & Recreation
• Learning & Skill Development

SUNDAY
• Planning & Preparation for Next Week
• Personal Development
• Rest & Recovery
• Creative Activities

GOALS FOR THIS WEEK
• [Goal 1]: [Specific action items]
• [Goal 2]: [Specific action items]
• [Goal 3]: [Specific action items]

PRIORITY TASKS
High Priority:
• [Task 1] - Due: [Date]
• [Task 2] - Due: [Date]

Medium Priority:
• [Task 3] - Due: [Date]
• [Task 4] - Due: [Date]

Low Priority:
• [Task 5] - Due: [Date]

NOTES & REMINDERS
• [Important note 1]
• [Important note 2]
• [Important note 3]

---
Schedule Generated by AI Assistant | ${new Date().toLocaleDateString()}`,
        filename: 'weekly-schedule.txt',
        mimeType: 'text/plain'
      }
    }
    
    // Enhanced Code Template
    if (lowerPrompt.includes('code') || lowerPrompt.includes('script') || lowerPrompt.includes('function')) {
      return {
        type: 'document',
        content: `CODE TEMPLATE & SNIPPET

// ${generateCodeTitle(prompt)}
// Generated by AI Assistant on ${new Date().toLocaleDateString()}

${generateCodeSnippet(prompt)}

/*
USAGE INSTRUCTIONS:
1. Copy the code above
2. Paste into your development environment
3. Customize variables and parameters as needed
4. Test thoroughly before production use

FEATURES:
• [Feature 1]
• [Feature 2]
• [Feature 3]

DEPENDENCIES:
• [Dependency 1]
• [Dependency 2]

PARAMETERS:
• [Parameter 1]: [Description]
• [Parameter 2]: [Description]

EXAMPLE USAGE:
[Code example showing how to use the function]

NOTES:
• [Important note 1]
• [Important note 2]
• [Important note 3]
*/

---
Code Generated by AI Assistant | ${new Date().toLocaleDateString()}`,
        filename: 'code-snippet.txt',
        mimeType: 'text/plain'
      }
    }
    
    // Enhanced Marketing Content Template
    if (lowerPrompt.includes('marketing') || lowerPrompt.includes('content') || lowerPrompt.includes('social media')) {
    return {
      type: 'document',
        content: `MARKETING CONTENT TEMPLATE

CAMPAIGN: [Campaign Name]
OBJECTIVE: [Campaign Goal]
TARGET AUDIENCE: [Audience Description]
DURATION: [Start Date] - [End Date]

SOCIAL MEDIA POSTS

FACEBOOK POST
📢 [Attention-grabbing headline]

[Engaging content that addresses audience pain points]

✅ [Key benefit 1]
✅ [Key benefit 2]
✅ [Key benefit 3]

[Call-to-action]

#hashtag1 #hashtag2 #hashtag3

---

INSTAGRAM POST
[Visual description: Eye-catching image/graphic]

Caption:
[Engaging story or question]

[Main message with emojis]

[Call-to-action]

#hashtag1 #hashtag2 #hashtag3

---

LINKEDIN POST
[Professional headline]

[Industry insights or thought leadership content]

[Key points with bullet formatting]

[Professional call-to-action]

#hashtag1 #hashtag2 #hashtag3

---

TWITTER POST
[Concise, engaging message under 280 characters]

[Relevant hashtags]

---

EMAIL MARKETING

SUBJECT LINE OPTIONS:
• [Option 1]
• [Option 2]
• [Option 3]

EMAIL CONTENT:
Subject: [Selected subject line]

Hi [Name],

[Personalized greeting and context]

[Main message with value proposition]

KEY BENEFITS:
• [Benefit 1]
• [Benefit 2]
• [Benefit 3]

[Calls-to-action]

Best regards,
[Your Name]
[Your Company]

---

BLOG POST OUTLINE

TITLE: [SEO-optimized title]

INTRODUCTION:
[Hook and problem statement]

MAIN POINTS:
1. [Point 1 with supporting evidence]
2. [Point 2 with supporting evidence]
3. [Point 3 with supporting evidence]

CONCLUSION:
[Summary and call-to-action]

---

CONTENT CALENDAR

Week 1:
• Monday: [Content type] - [Topic]
• Wednesday: [Content type] - [Topic]
• Friday: [Content type] - [Topic]

Week 2:
• Monday: [Content type] - [Topic]
• Wednesday: [Content type] - [Topic]
• Friday: [Content type] - [Topic]

METRICS TO TRACK:
• Engagement rate
• Click-through rate
• Conversion rate
• Reach and impressions
• Brand mentions

---
Marketing Content Generated by AI Assistant | ${new Date().toLocaleDateString()}`,
        filename: 'marketing-content.txt',
        mimeType: 'text/plain'
      }
    }
    
    // Default enhanced response
    return {
      type: 'document',
      content: `AI-GENERATED CONTENT

Request: "${prompt}"

Based on your request, I've generated professional content tailored to your needs. 
This content can be customized and converted to various formats.

CONTENT OVERVIEW:
[Generated content based on your specific request]

CUSTOMIZATION OPTIONS:
• Modify text and formatting
• Add your specific details
• Adjust tone and style
• Include additional sections

CONVERSION OPTIONS:
• PDF for professional documents
• DOCX for editing in Word
• TXT for simple text format
• HTML for web publishing
• And more formats available

NEXT STEPS:
1. Review the generated content
2. Customize as needed
3. Convert to your preferred format
4. Download or use in your project

Created: ${new Date().toLocaleString()}
Generated by: AI Assistant

---
This content was generated by AI Assistant | ${new Date().toLocaleDateString()}`,
      filename: 'ai-generated-content.txt',
      mimeType: 'text/plain'
    }
    }

  const generateCodeTitle = (prompt) => {
    if (prompt.includes('react')) return 'React Component Template'
    if (prompt.includes('function')) return 'JavaScript Function Template'
    if (prompt.includes('api')) return 'API Endpoint Template'
    if (prompt.includes('css')) return 'CSS Styles Template'
    return 'Code Template'
  }

  const generateCodeSnippet = (prompt) => {
    if (prompt.includes('react')) {
      return `import React, { useState, useEffect } from 'react'

const MyComponent = () => {
  const [state, setState] = useState(null)
  
  useEffect(() => {
    // Component initialization
  }, [])
  
  const handleAction = () => {
    // Handle user action
  }
  
  return (
    <div className="component-container">
      <h1>My Component</h1>
      <button onClick={handleAction}>
        Click Me
      </button>
    </div>
  )
}

export default MyComponent`
    }
    
    if (prompt.includes('api')) {
      return `const express = require('express')
const router = express.Router()

// GET endpoint
router.get('/api/endpoint', async (req, res) => {
  try {
    const data = await getData()
    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST endpoint
router.post('/api/endpoint', async (req, res) => {
  try {
    const { body } = req
    const result = await processData(body)
    res.json({ success: true, result })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router`
    }
    
    return `function myFunction(param1, param2) {
  // Function implementation
  const result = param1 + param2
  return result
}

// Usage example
const output = myFunction(5, 10)
console.log(output) // 15`
  }

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return

    const userMessage = input.trim()
    setInput('')
    setError(null)
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsGenerating(true)

    try {
      // Simulate AI thinking
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const generated = await generateContent(userMessage)
      
      // Add AI response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '✨ I\'ve generated your content! You can preview it below and convert it to your preferred format.',
        generated
      }])
      
      setRetryCount(0) // Reset retry count on success
    } catch (error) {
      console.error('Generation error:', error)
      setError(error.message)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Sorry, there was an error generating your content: ${error.message}`
      }])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRetry = () => {
    if (retryCount >= 3) return
    setRetryCount(prev => prev + 1)
    setError(null)
    handleSend()
  }

  const handleConvert = (generated) => {
    // Create a file from generated content
    const blob = new Blob([generated.content], { type: generated.mimeType })
    const file = new File([blob], generated.filename, { type: generated.mimeType })
    onGenerateFile(file)
    onClose()
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const handleEdit = (messageId, content) => {
    setEditingMessageId(messageId)
    setEditedContent(content)
    setShowPreview(false)
  }

  const handleSaveEdit = (messageId) => {
    setMessages(prev => prev.map(msg => 
      msg.generated && msg === messages.find(m => m.generated && m.generated.content === editedContent)
        ? { ...msg, generated: { ...msg.generated, content: editedContent } }
        : msg
    ))
    
    // Learn from user behavior
    learnFromUserBehavior('edit_content', editedContent)
    
    setEditingMessageId(null)
    setEditedContent('')
    setShowPreview(true)
  }

  const handleCancelEdit = () => {
    setEditingMessageId(null)
    setEditedContent('')
    setShowPreview(true)
  }

  const handleResetEdit = (originalContent) => {
    setEditedContent(originalContent)
  }

  // Smart Suggestions System
  const generateSmartSuggestions = (input, context = 'general') => {
    const lowerInput = input.toLowerCase()
    const suggestions = []

    // Context-based suggestions
    if (context === 'resume' || lowerInput.includes('resume') || lowerInput.includes('cv')) {
      suggestions.push(
        'Add technical skills section',
        'Include quantifiable achievements',
        'Mention relevant projects',
        'Add certifications and education',
        'Include contact information'
      )
    } else if (context === 'proposal' || lowerInput.includes('proposal') || lowerInput.includes('business')) {
      suggestions.push(
        'Add project timeline',
        'Include detailed budget breakdown',
        'Mention deliverables and milestones',
        'Add risk assessment',
        'Include team qualifications'
      )
    } else if (context === 'email' || lowerInput.includes('email') || lowerInput.includes('mail')) {
      suggestions.push(
        'Add clear subject line',
        'Include call-to-action',
        'Mention next steps',
        'Add professional signature',
        'Keep tone professional'
      )
    } else if (context === 'report' || lowerInput.includes('report') || lowerInput.includes('analysis')) {
      suggestions.push(
        'Add executive summary',
        'Include data visualizations',
        'Mention key findings',
        'Add recommendations',
        'Include conclusion'
      )
    } else {
      // General suggestions
      suggestions.push(
        'Be more specific about requirements',
        'Add relevant examples',
        'Include key details',
        'Mention target audience',
        'Specify desired format'
      )
    }

    // Tone-based suggestions
    if (userPreferences.tone === 'professional') {
      suggestions.push('Use formal language', 'Include business terminology')
    } else if (userPreferences.tone === 'casual') {
      suggestions.push('Use conversational tone', 'Add friendly language')
    }

    return suggestions.slice(0, 3) // Return top 3 suggestions
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setInput(value)
    
    // Generate suggestions based on input
    if (value.length > 10) {
      const newSuggestions = generateSmartSuggestions(value)
      setSuggestions(newSuggestions)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const applySuggestion = (suggestion) => {
    setInput(prev => prev + ' ' + suggestion.toLowerCase())
    setShowSuggestions(false)
  }

  // Adaptive Templates System
  const generateAdaptiveTemplate = (userHistory, context) => {
    // Analyze user's previous edits and preferences
    const commonFields = extractCommonFields(userHistory)
    const preferredFormat = detectFormat(userHistory)
    const preferredTone = userPreferences.tone
    
    // Generate personalized template based on analysis
    return {
      fields: commonFields,
      format: preferredFormat,
      tone: preferredTone,
      suggestions: generateContextualSuggestions(context)
    }
  }

  const extractCommonFields = (history) => {
    // Analyze what fields user commonly edits
    const fieldFrequency = {}
    history.forEach(edit => {
      if (edit.type === 'field_edit') {
        fieldFrequency[edit.field] = (fieldFrequency[edit.field] || 0) + 1
      }
    })
    
    // Return most frequently edited fields
    return Object.entries(fieldFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([field]) => field)
  }

  const detectFormat = (history) => {
    // Analyze user's preferred format based on edits
    const formatPatterns = {
      'bullet-points': 0,
      'paragraphs': 0,
      'structured': 0
    }
    
    history.forEach(edit => {
      if (edit.content.includes('•') || edit.content.includes('-')) {
        formatPatterns['bullet-points']++
      } else if (edit.content.includes('\n\n')) {
        formatPatterns['paragraphs']++
      } else {
        formatPatterns['structured']++
      }
    })
    
    return Object.entries(formatPatterns)
      .sort(([,a], [,b]) => b - a)[0][0]
  }

  const generateContextualSuggestions = (context) => {
    const suggestions = {
      'resume': [
        'Add quantifiable achievements',
        'Include relevant skills',
        'Mention specific projects',
        'Add contact information'
      ],
      'proposal': [
        'Include project timeline',
        'Add budget breakdown',
        'Mention deliverables',
        'Include team qualifications'
      ],
      'email': [
        'Add clear subject line',
        'Include call-to-action',
        'Mention next steps',
        'Keep professional tone'
      ]
    }
    
    return suggestions[context] || suggestions['resume']
  }

  // Learning System
  const learnFromUserBehavior = (action, data) => {
    const learningData = {
      timestamp: new Date().toISOString(),
      action,
      data,
      preferences: userPreferences
    }
    
    // Save to localStorage for learning
    const existingData = JSON.parse(localStorage.getItem('ai-learning-data') || '[]')
    existingData.push(learningData)
    
    // Keep only last 100 interactions
    if (existingData.length > 100) {
      existingData.splice(0, existingData.length - 100)
    }
    
    localStorage.setItem('ai-learning-data', JSON.stringify(existingData))
    
    // Update preferences based on behavior
    updatePreferencesFromBehavior(action, data)
  }

  const updatePreferencesFromBehavior = (action, data) => {
    if (action === 'edit_content') {
      // Analyze edit patterns to improve suggestions
      const editPatterns = analyzeEditPatterns(data)
      
      // Update preferences based on patterns
      if (editPatterns.prefersBulletPoints) {
        setUserPreferences(prev => ({ ...prev, format: 'bullet-points' }))
      }
      
      if (editPatterns.prefersDetailed) {
        setUserPreferences(prev => ({ ...prev, detail: 'detailed' }))
      }
    }
  }

  const analyzeEditPatterns = (data) => {
    return {
      prefersBulletPoints: data.includes('•') || data.includes('-'),
      prefersDetailed: data.split(' ').length > 200,
      prefersFormal: data.includes('Dear') || data.includes('Sincerely'),
      prefersCasual: data.includes('Hi') || data.includes('Thanks')
    }
  }

  // Content Analysis System
  const analyzeContent = (content) => {
    const words = content.split(' ').length
    const sentences = content.split('.').length - 1
    const paragraphs = content.split('\n\n').length
    
    let readability = 'intermediate'
    if (words < 100) readability = 'simple'
    else if (words > 500) readability = 'complex'
    
    const analysis = {
      wordCount: words,
      sentenceCount: sentences,
      paragraphCount: paragraphs,
      readability: readability,
      suggestions: []
    }

    // Generate improvement suggestions
    if (words < 50) {
      analysis.suggestions.push('Add more details to make it comprehensive')
    }
    if (sentences < 3) {
      analysis.suggestions.push('Break into more sentences for better readability')
    }
    if (paragraphs < 2) {
      analysis.suggestions.push('Add more sections for better structure')
    }

    return analysis
  }

  // Advanced Analytics System
  const getAnalyticsData = () => {
    const learningData = JSON.parse(localStorage.getItem('ai-learning-data') || '[]')
    const preferences = JSON.parse(localStorage.getItem('ai-user-preferences') || '{}')
    
    // Calculate usage patterns
    const usagePatterns = {
      totalInteractions: learningData.length,
      editFrequency: learningData.filter(d => d.action === 'edit_content').length / learningData.length || 0,
      popularTemplates: getPopularTemplates(learningData),
      avgGenerationTime: calculateAvgGenerationTime(learningData),
      userSatisfaction: calculateUserSatisfaction(learningData),
      conversionRate: calculateConversionRate(learningData)
    }
    
    // Calculate performance metrics
    const performanceMetrics = {
      successRate: calculateSuccessRate(learningData),
      errorRate: calculateErrorRate(learningData),
      retryRate: calculateRetryRate(learningData),
      avgContentLength: calculateAvgContentLength(learningData)
    }
    
    return {
      usagePatterns,
      performanceMetrics,
      preferences,
      recommendations: generateRecommendations(usagePatterns, performanceMetrics)
    }
  }

  const getPopularTemplates = (data) => {
    const templateCounts = {}
    data.forEach(d => {
      if (d.data && typeof d.data === 'string') {
        const template = detectTemplate(d.data)
        templateCounts[template] = (templateCounts[template] || 0) + 1
      }
    })
    
    return Object.entries(templateCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([template]) => template)
  }

  const detectTemplate = (content) => {
    if (content.toLowerCase().includes('resume') || content.toLowerCase().includes('cv')) return 'resume'
    if (content.toLowerCase().includes('proposal')) return 'proposal'
    if (content.toLowerCase().includes('email') || content.toLowerCase().includes('mail')) return 'email'
    if (content.toLowerCase().includes('report')) return 'report'
    return 'other'
  }

  const calculateAvgGenerationTime = (data) => {
    const generationTimes = data.filter(d => d.action === 'generate_content' && d.generationTime)
    return generationTimes.length > 0 
      ? generationTimes.reduce((sum, d) => sum + d.generationTime, 0) / generationTimes.length
      : 0
  }

  const calculateUserSatisfaction = (data) => {
    const edits = data.filter(d => d.action === 'edit_content').length
    const total = data.length
    return total > 0 ? Math.max(0, 1 - (edits / total)) : 0
  }

  const calculateConversionRate = (data) => {
    const conversions = data.filter(d => d.action === 'convert_file').length
    const generations = data.filter(d => d.action === 'generate_content').length
    return generations > 0 ? conversions / generations : 0
  }

  const calculateSuccessRate = (data) => {
    const successful = data.filter(d => d.action === 'generate_content' && !d.error).length
    const total = data.filter(d => d.action === 'generate_content').length
    return total > 0 ? successful / total : 1
  }

  const calculateErrorRate = (data) => {
    const errors = data.filter(d => d.error).length
    return data.length > 0 ? errors / data.length : 0
  }

  const calculateRetryRate = (data) => {
    const retries = data.filter(d => d.action === 'retry_generation').length
    const generations = data.filter(d => d.action === 'generate_content').length
    return generations > 0 ? retries / generations : 0
  }

  const calculateAvgContentLength = (data) => {
    const contentLengths = data.filter(d => d.data && typeof d.data === 'string')
      .map(d => d.data.split(' ').length)
    return contentLengths.length > 0 
      ? contentLengths.reduce((sum, len) => sum + len, 0) / contentLengths.length
      : 0
  }

  const generateRecommendations = (usagePatterns, performanceMetrics) => {
    const recommendations = []
    
    if (usagePatterns.editFrequency > 0.7) {
      recommendations.push('Consider improving template quality to reduce edit frequency')
    }
    
    if (performanceMetrics.errorRate > 0.1) {
      recommendations.push('High error rate detected - consider improving API reliability')
    }
    
    if (usagePatterns.conversionRate < 0.3) {
      recommendations.push('Low conversion rate - consider improving content quality')
    }
    
    if (performanceMetrics.avgGenerationTime > 5) {
      recommendations.push('Slow generation times - consider optimizing API calls')
    }
    
    return recommendations
  }

  const quickPrompts = [
    '📄 Create a professional resume',
    '📊 Generate a business proposal',
    '✉️ Write a cover letter',
    '📧 Create an email template',
    '📋 Make a weekly schedule',
    '📝 Write a report',
    '💻 Generate code snippet',
    '🎨 Design a logo',
    '📱 Create marketing content',
    '📄 Write documentation'
  ]

  return (
    <div className="modal-overlay ai-chat-overlay" onClick={onClose}>
      <div className="modal-content ai-chat-modal fullscreen" onClick={(e) => e.stopPropagation()}>
        <div className="ai-chat-container">
          {/* Header */}
          <div className="chat-header modern">
            <div className="header-left">
              <div className="header-icon">
                <Sparkles size={28} />
              </div>
              <div className="header-content">
                <h2>AI Content Generator</h2>
                <p className="modal-subtitle">Generate professional documents, templates, and content with AI</p>
              </div>
            </div>
            <div className="header-right">
              <button 
                className="action-btn analytics"
                onClick={() => setShowAnalytics(!showAnalytics)}
                title="AI Analytics"
              >
                📊
              </button>
              <button 
                className="action-btn preferences"
                onClick={() => setShowPreferences(!showPreferences)}
                title="AI Preferences"
              >
                <Settings size={20} />
              </button>
              {error && (
                <div className="error-indicator">
                  <AlertCircle size={20} />
                </div>
              )}
              <button className="modal-close modern" onClick={onClose}>
          <X size={24} />
        </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="ai-chat-main">
            {/* Analytics Panel */}
            {showAnalytics && (
              <div className="analytics-panel">
                <div className="analytics-header">
                  <h3>AI Analytics</h3>
                  <button 
                    className="close-analytics"
                    onClick={() => setShowAnalytics(false)}
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="analytics-content">
                  {(() => {
                    const analytics = getAnalyticsData()
                    return (
                      <>
                        <div className="analytics-section">
                          <h4>Usage Patterns</h4>
                          <div className="analytics-grid">
                            <div className="analytics-card">
                              <div className="analytics-value">{analytics.usagePatterns.totalInteractions}</div>
                              <div className="analytics-label">Total Interactions</div>
                            </div>
                            <div className="analytics-card">
                              <div className="analytics-value">{(analytics.usagePatterns.editFrequency * 100).toFixed(1)}%</div>
                              <div className="analytics-label">Edit Frequency</div>
                            </div>
                            <div className="analytics-card">
                              <div className="analytics-value">{(analytics.usagePatterns.userSatisfaction * 100).toFixed(1)}%</div>
                              <div className="analytics-label">User Satisfaction</div>
                            </div>
                            <div className="analytics-card">
                              <div className="analytics-value">{(analytics.usagePatterns.conversionRate * 100).toFixed(1)}%</div>
                              <div className="analytics-label">Conversion Rate</div>
                            </div>
          </div>
        </div>

                        <div className="analytics-section">
                          <h4>Performance Metrics</h4>
                          <div className="analytics-grid">
                            <div className="analytics-card">
                              <div className="analytics-value">{(analytics.performanceMetrics.successRate * 100).toFixed(1)}%</div>
                              <div className="analytics-label">Success Rate</div>
                            </div>
                            <div className="analytics-card">
                              <div className="analytics-value">{(analytics.performanceMetrics.errorRate * 100).toFixed(1)}%</div>
                              <div className="analytics-label">Error Rate</div>
                            </div>
                            <div className="analytics-card">
                              <div className="analytics-value">{analytics.performanceMetrics.avgContentLength.toFixed(0)}</div>
                              <div className="analytics-label">Avg Content Length</div>
                            </div>
                            <div className="analytics-card">
                              <div className="analytics-value">{analytics.usagePatterns.avgGenerationTime.toFixed(1)}s</div>
                              <div className="analytics-label">Avg Generation Time</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="analytics-section">
                          <h4>Popular Templates</h4>
                          <div className="template-list">
                            {analytics.usagePatterns.popularTemplates.map((template, index) => (
                              <div key={index} className="template-item">
                                <span className="template-rank">#{index + 1}</span>
                                <span className="template-name">{template}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {analytics.recommendations.length > 0 && (
                          <div className="analytics-section">
                            <h4>Recommendations</h4>
                            <div className="recommendations-list">
                              {analytics.recommendations.map((rec, index) => (
                                <div key={index} className="recommendation-item">
                                  💡 {rec}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )
                  })()}
                </div>
              </div>
            )}

            {/* User Preferences Panel */}
            {showPreferences && (
              <div className="preferences-panel">
                <div className="preferences-header">
                  <h3>AI Preferences</h3>
                  <button 
                    className="close-preferences"
                    onClick={() => setShowPreferences(false)}
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="preferences-content">
                  <div className="preference-group">
                    <label>Tone</label>
                    <div className="preference-options">
                      {['professional', 'casual', 'formal', 'friendly'].map(tone => (
                        <button
                          key={tone}
                          className={`preference-option ${userPreferences.tone === tone ? 'active' : ''}`}
                          onClick={() => setUserPreferences(prev => ({ ...prev, tone }))}
                        >
                          {tone}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="preference-group">
                    <label>Detail Level</label>
                    <div className="preference-options">
                      {['brief', 'comprehensive', 'detailed'].map(detail => (
                        <button
                          key={detail}
                          className={`preference-option ${userPreferences.detail === detail ? 'active' : ''}`}
                          onClick={() => setUserPreferences(prev => ({ ...prev, detail }))}
                        >
                          {detail}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="preference-group">
                    <label>Format</label>
                    <div className="preference-options">
                      {['structured', 'bullet-points', 'paragraphs'].map(format => (
                        <button
                          key={format}
                          className={`preference-option ${userPreferences.format === format ? 'active' : ''}`}
                          onClick={() => setUserPreferences(prev => ({ ...prev, format }))}
                        >
                          {format}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="preference-group">
                    <label>Language</label>
                    <div className="preference-options">
                      {['english', 'turkish', 'spanish', 'french'].map(language => (
                        <button
                          key={language}
                          className={`preference-option ${userPreferences.language === language ? 'active' : ''}`}
                          onClick={() => setUserPreferences(prev => ({ ...prev, language }))}
                        >
                          {language}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Prompts Sidebar */}
            <div className="quick-prompts-sidebar">
              <h3>Quick Templates</h3>
              <div className="prompts-grid">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
                    className="prompt-card"
              onClick={() => setInput(prompt.substring(3))}
                    disabled={isGenerating}
                  >
                    <div className="prompt-icon">
                      {prompt.includes('resume') && <FileText size={20} />}
                      {prompt.includes('proposal') && <FileText size={20} />}
                      {prompt.includes('cover letter') && <FileText size={20} />}
                      {prompt.includes('email') && <FileText size={20} />}
                      {prompt.includes('schedule') && <FileText size={20} />}
                      {prompt.includes('report') && <FileText size={20} />}
                      {prompt.includes('code') && <FileText size={20} />}
                      {prompt.includes('logo') && <ImageIcon size={20} />}
                      {prompt.includes('marketing') && <FileText size={20} />}
                      {prompt.includes('documentation') && <FileText size={20} />}
                    </div>
                    <span className="prompt-text">{prompt.substring(3)}</span>
            </button>
          ))}
              </div>
        </div>

            {/* Chat Area */}
            <div className="chat-area">
              <div className="chat-messages modern">
          {messages.map((msg, i) => (
                  <div key={i} className={`chat-message ${msg.role} modern`}>
                    <div className="message-avatar">
                      {msg.role === 'user' ? (
                        <div className="user-avatar">U</div>
                      ) : (
                        <div className="ai-avatar">
                          <Sparkles size={16} />
                        </div>
                      )}
                    </div>
                    <div className="message-content modern">
                      <div className="message-text">
                        {msg.content.split('\n').map((line, idx) => (
                          <div key={idx}>
                            {line}
                            {idx < msg.content.split('\n').length - 1 && <br />}
                          </div>
                        ))}
                      </div>
                      
                      {msg.generated && (
                        <div className="generated-file modern">
                          <div className="file-header modern">
                            <div className="file-info">
                              <FileText size={18} />
                              <span>{msg.generated.filename}</span>
                              <span className="file-size">({Math.round(msg.generated.content.length / 1024)}KB)</span>
                            </div>
                            <div className="file-actions-header">
                      <button 
                                className="action-btn edit"
                                onClick={() => handleEdit(i, msg.generated.content)}
                                title="Edit content"
                      >
                                <Edit3 size={16} />
                      </button>
                      <button 
                                className="action-btn preview"
                                onClick={() => setShowPreview(!showPreview)}
                                title={showPreview ? "Hide preview" : "Show preview"}
                              >
                                {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                              <button 
                                className="action-btn copy"
                                onClick={() => handleCopy(msg.generated.content)}
                                title="Copy content"
                              >
                                <Copy size={16} />
                              </button>
                              <button 
                                className="action-btn download"
                        onClick={() => {
                          const blob = new Blob([msg.generated.content], { type: msg.generated.mimeType })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = msg.generated.filename
                          a.click()
                                  URL.revokeObjectURL(url)
                        }}
                                title="Download file"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                          </div>
                          
                        {showPreview && (
                          <div className="file-preview modern">
                            {editingMessageId === i ? (
                              <div className="edit-mode">
                                <div className="edit-toolbar">
                                  <button 
                                    className="edit-btn save"
                                    onClick={() => handleSaveEdit(i)}
                                  >
                                    <Save size={16} />
                                    Save Changes
                                  </button>
                                  <button 
                                    className="edit-btn reset"
                                    onClick={() => handleResetEdit(msg.generated.content)}
                                  >
                                    <RotateCcw size={16} />
                                    Reset
                                  </button>
                                  <button 
                                    className="edit-btn cancel"
                                    onClick={handleCancelEdit}
                                  >
                                    <X size={16} />
                                    Cancel
                                  </button>
                                </div>
                                <textarea
                                  className="edit-textarea"
                                  value={editedContent}
                                  onChange={(e) => setEditedContent(e.target.value)}
                                  placeholder="Edit your content here..."
                                />
                              </div>
                            ) : (
                              <>
                                {msg.generated.type === 'image' ? (
                                  <div className="image-preview modern" dangerouslySetInnerHTML={{ __html: msg.generated.content }} />
                                ) : (
                                  <div className="text-preview modern">
                                    <pre>{msg.generated.content}</pre>
                                    {/* Content Analysis */}
                                    <div className="content-analysis">
                                      {(() => {
                                        const analysis = analyzeContent(msg.generated.content)
                                        return (
                                          <div className="analysis-summary">
                                            <div className="analysis-stats">
                                              <span className="stat">
                                                <strong>{analysis.wordCount}</strong> words
                                              </span>
                                              <span className="stat">
                                                <strong>{analysis.sentenceCount}</strong> sentences
                                              </span>
                                              <span className="stat">
                                                <strong>{analysis.readability}</strong> level
                                              </span>
                                            </div>
                                            {analysis.suggestions.length > 0 && (
                                              <div className="analysis-suggestions">
                                                <strong>💡 Suggestions:</strong>
                                                <ul>
                                                  {analysis.suggestions.map((suggestion, idx) => (
                                                    <li key={idx}>{suggestion}</li>
                                                  ))}
                                                </ul>
                                              </div>
                                            )}
                                          </div>
                                        )
                                      })()}
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        )}
                          
                          <div className="file-actions modern">
                            <button 
                              className="btn-primary convert-btn"
                              onClick={() => handleConvert(msg.generated)}
                            >
                              <Wand2 size={18} />
                              Convert This File
                            </button>
                          </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isGenerating && (
                  <div className="chat-message assistant modern">
                    <div className="message-avatar">
                      <div className="ai-avatar">
                        <Sparkles size={16} />
                      </div>
                    </div>
                    <div className="message-content modern">
                      <div className="typing-indicator modern">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                      <div className="generating-text">AI is generating your content...</div>
              </div>
            </div>
          )}
                
                {error && retryCount < 3 && (
                  <div className="error-message modern">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                    <button className="retry-btn modern" onClick={handleRetry}>
                      <RefreshCw size={16} />
                      Retry
                    </button>
                  </div>
                )}
          
          <div ref={messagesEndRef} />
        </div>

              {/* Input Area */}
              <div className="chat-input modern">
                <div className="input-container">
          <input
            type="text"
                    placeholder="Describe what you want to create... (e.g., 'Create a resume for a software developer')"
            value={input}
                    onChange={handleInputChange}
                    onKeyPress={(e) => e.key === 'Enter' && !isGenerating && handleSend()}
            disabled={isGenerating}
                    className="modern-input"
          />
          <button 
                    className="send-btn modern"
            onClick={handleSend}
            disabled={!input.trim() || isGenerating}
          >
                    {isGenerating ? (
                      <RefreshCw size={20} className="spinning" />
                    ) : (
            <Send size={20} />
                    )}
          </button>
        </div>
                
                {/* Smart Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="smart-suggestions">
                    <div className="suggestions-header">
                      <span className="suggestions-title">💡 Smart Suggestions</span>
                      <button 
                        className="close-suggestions"
                        onClick={() => setShowSuggestions(false)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="suggestions-list">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          className="suggestion-item"
                          onClick={() => applySuggestion(suggestion)}
                        >
                          <span className="suggestion-text">{suggestion}</span>
                          <span className="suggestion-icon">+</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="input-hint">
                  💡 <strong>Pro tip:</strong> Be specific about what you need for better results!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIChat

