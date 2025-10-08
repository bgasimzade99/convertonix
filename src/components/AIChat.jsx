import { useState, useRef, useEffect } from 'react'
import { X, Send, Sparkles, FileText, Image as ImageIcon, Download, Wand2 } from 'lucide-react'

function AIChat({ onClose, onGenerateFile }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Hi! I\'m powered by ChatGLM AI. I can help you generate text content:\n\n📝 **Text Content (AI-Powered):**\n• "Create a business proposal document"\n• "Generate a professional resume"\n• "Write a cover letter for job application"\n• "Create a weekly schedule template"\n\n🎨 **Visual Content (SVG):**\n• "Make a simple logo design"\n• "Create an icon"\n\n⚠️ **Note:** I can only generate text content with AI. For images/logos, I\'ll create SVG files.\n\nWhat would you like to create?'
    }
  ])
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateContent = async (prompt) => {
    const lowerPrompt = prompt.toLowerCase()
    
    // Check if user wants image/logo/design - ChatGLM can't do images, use SVG fallback
    if (lowerPrompt.includes('logo') || lowerPrompt.includes('image') || lowerPrompt.includes('design') || lowerPrompt.includes('icon')) {
      // Generate SVG logo (ChatGLM can't generate images)
      return {
        type: 'image',
        content: `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
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
  
  <!-- Main Shape - Abstract modern design -->
  <circle cx="200" cy="150" r="70" fill="white" opacity="0.9" filter="url(#glow)"/>
  
  <!-- Geometric accent -->
  <path d="M 150 250 L 200 200 L 250 250 L 200 300 Z" fill="white" opacity="0.9" filter="url(#glow)"/>
  
  <!-- Additional design element -->
  <circle cx="200" cy="150" r="40" fill="none" stroke="white" stroke-width="4" opacity="0.6"/>
  
  <!-- Text -->
  <text x="200" y="360" font-size="42" font-weight="bold" fill="white" text-anchor="middle" font-family="Arial, sans-serif">Your Brand</text>
  <text x="200" y="385" font-size="16" fill="white" text-anchor="middle" font-family="Arial, sans-serif" opacity="0.8">Professional Design</text>
</svg>`,
        filename: 'logo.svg',
        mimeType: 'image/svg+xml'
      }
    }
    
    // ChatGLM API Integration for TEXT content only
    const CHATGLM_API_KEY = 'c82c3e1eaa1141b69328b5829f478d3d.nxhyBNFeo2bHVbiI'
    const CHATGLM_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
    
    try {
      // Call ChatGLM API for text generation
      const response = await fetch(CHATGLM_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CHATGLM_API_KEY}`
        },
        body: JSON.stringify({
          model: 'glm-4-flash',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI assistant that generates professional documents, templates, and text content based on user requests. Always provide complete, well-formatted, and professional content. Do not generate images or visual designs - only text content.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      })

      if (!response.ok) {
        throw new Error(`ChatGLM API error: ${response.status}`)
      }

      const data = await response.json()
      const generatedText = data.choices[0].message.content

      // Return generated text content
      return {
        type: 'document',
        content: generatedText,
        filename: 'ai-generated-document.txt',
        mimeType: 'text/plain'
      }
    } catch (error) {
      console.error('ChatGLM API Error:', error)
      // Fallback to local templates if API fails
    
    if (lowerPrompt.includes('resume') || lowerPrompt.includes('cv')) {
      return {
        type: 'document',
        content: `PROFESSIONAL RESUME

JOHN DOE
Full Stack Developer
Email: john.doe@email.com | Phone: (555) 123-4567
LinkedIn: linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Experienced Full Stack Developer with 5+ years of expertise in React, Node.js, and cloud technologies. 
Passionate about creating scalable web applications and optimizing user experiences.

EXPERIENCE
Senior Developer - Tech Corp (2021-Present)
• Led team of 5 developers in building enterprise SaaS platform
• Improved application performance by 40%
• Implemented CI/CD pipeline reducing deployment time by 60%

Software Engineer - StartupXYZ (2019-2021)
• Developed RESTful APIs serving 1M+ requests daily
• Built responsive React components used across 10+ products
• Collaborated with UX team to improve user engagement by 35%

EDUCATION
Bachelor of Science in Computer Science
University of Technology (2015-2019)

SKILLS
• Languages: JavaScript, TypeScript, Python, SQL
• Frontend: React, Vue.js, Next.js, Tailwind CSS
• Backend: Node.js, Express, PostgreSQL, MongoDB
• Cloud: AWS, Docker, Kubernetes, CI/CD

ACHIEVEMENTS
• AWS Certified Solutions Architect
• Contributed to 3 open-source projects with 1000+ stars
• Speaker at TechConf 2023`,
        filename: 'resume.txt',
        mimeType: 'text/plain'
      }
    }
    
    if (lowerPrompt.includes('proposal') || lowerPrompt.includes('business')) {
      return {
        type: 'document',
        content: `BUSINESS PROPOSAL

PROJECT: Web Development Services
TO: [Client Name]
FROM: [Your Company]
DATE: ${new Date().toLocaleDateString()}

EXECUTIVE SUMMARY
This proposal outlines a comprehensive web development solution designed to enhance 
your digital presence and drive business growth.

OBJECTIVES
• Develop a modern, responsive website
• Improve user engagement and conversion rates
• Implement scalable architecture for future growth
• Optimize for search engines (SEO)

SCOPE OF WORK
1. Discovery & Planning (2 weeks)
   - Requirements gathering
   - Technical specifications
   - Project timeline

2. Design Phase (3 weeks)
   - UI/UX design
   - Wireframes and prototypes
   - Client feedback and revisions

3. Development (6 weeks)
   - Frontend development
   - Backend API development
   - Database setup
   - Third-party integrations

4. Testing & Launch (2 weeks)
   - Quality assurance
   - Performance optimization
   - Deployment
   - Training and documentation

TIMELINE
Total Duration: 13 weeks
Start Date: ${new Date().toLocaleDateString()}

INVESTMENT
Development: $25,000
Maintenance (annual): $3,000

NEXT STEPS
We look forward to partnering with you on this exciting project.
Please review this proposal and let us know if you have any questions.

Best regards,
[Your Name]
[Your Company]`,
        filename: 'business-proposal.txt',
        mimeType: 'text/plain'
      }
    }
    
    if (lowerPrompt.includes('schedule') || lowerPrompt.includes('planner')) {
      return {
        type: 'document',
        content: `WEEKLY SCHEDULE

Monday
08:00 - 09:00 | Morning Routine & Exercise
09:00 - 12:00 | Deep Work Session
12:00 - 13:00 | Lunch Break
13:00 - 17:00 | Meetings & Collaboration
17:00 - 18:00 | Email & Admin Tasks

Tuesday
08:00 - 09:00 | Morning Routine & Exercise
09:00 - 12:00 | Project Development
12:00 - 13:00 | Lunch Break
13:00 - 16:00 | Client Calls
16:00 - 18:00 | Code Review & Documentation

Wednesday
08:00 - 09:00 | Morning Routine & Exercise
09:00 - 12:00 | Deep Work Session
12:00 - 13:00 | Lunch Break
13:00 - 15:00 | Team Standup & Planning
15:00 - 18:00 | Development Work

Thursday
08:00 - 09:00 | Morning Routine & Exercise
09:00 - 12:00 | Learning & Development
12:00 - 13:00 | Lunch Break
13:00 - 17:00 | Project Work
17:00 - 18:00 | Weekly Review

Friday
08:00 - 09:00 | Morning Routine & Exercise
09:00 - 12:00 | Sprint Wrap-up
12:00 - 13:00 | Lunch Break
13:00 - 16:00 | Documentation & Testing
16:00 - 18:00 | Planning Next Week

Weekend
Flexible time for personal projects, rest, and recreation`,
        filename: 'weekly-schedule.txt',
        mimeType: 'text/plain'
      }
    }
    
    if (lowerPrompt.includes('logo') || lowerPrompt.includes('image') || lowerPrompt.includes('design')) {
      // Generate SVG logo
      return {
        type: 'image',
        content: `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#gradient)"/>
  <circle cx="200" cy="150" r="60" fill="white" opacity="0.9"/>
  <path d="M 150 250 L 200 200 L 250 250 L 200 300 Z" fill="white" opacity="0.9"/>
  <text x="200" y="360" font-size="36" font-weight="bold" fill="white" text-anchor="middle">Your Brand</text>
</svg>`,
        filename: 'logo.svg',
        mimeType: 'image/svg+xml'
      }
    }
    
    // Default response (fallback if API fails)
    return {
      type: 'document',
      content: `Generated Content

Based on your request: "${prompt}"

ChatGLM API encountered an error. This is a fallback response.
Please try again with a more specific request.

You can now convert this to any format:
• PDF for professional documents
• DOCX for editing
• TXT for simple text
• And more!

Created: ${new Date().toLocaleString()}`,
      filename: 'generated-content.txt',
      mimeType: 'text/plain'
    }
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return

    const userMessage = input.trim()
    setInput('')
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsGenerating(true)

    try {
      // Simulate AI thinking
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const generated = await generateContent(userMessage)
      
      // Add AI response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '✨ I\'ve generated your file! You can preview it below or convert it to your preferred format.',
        generated
      }])
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Sorry, there was an error generating your file. Please try again.'
      }])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleConvert = (generated) => {
    // Create a file from generated content
    const blob = new Blob([generated.content], { type: generated.mimeType })
    const file = new File([blob], generated.filename, { type: generated.mimeType })
    onGenerateFile(file)
    onClose()
  }

  const quickPrompts = [
    '📄 Create a resume',
    '📊 Generate a report',
    '✉️ Write a cover letter',
    '🎨 Design a logo',
  ]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content ai-chat-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="chat-header">
          <Sparkles size={32} />
          <div>
            <h2>AI File Generator</h2>
            <p className="modal-subtitle">Generate files with AI, then convert them instantly</p>
          </div>
        </div>

        <div className="quick-prompts">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              className="quick-prompt-btn"
              onClick={() => setInput(prompt.substring(3))}
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.role}`}>
              <div className="message-content">
                {msg.content}
                
                {msg.generated && (
                  <div className="generated-file">
                    <div className="file-preview">
                      {msg.generated.type === 'image' ? (
                        <div className="image-preview" dangerouslySetInnerHTML={{ __html: msg.generated.content }} />
                      ) : (
                        <pre className="text-preview">{msg.generated.content.substring(0, 300)}...</pre>
                      )}
                    </div>
                    <div className="file-actions">
                      <button 
                        className="btn-primary btn-sm"
                        onClick={() => handleConvert(msg.generated)}
                      >
                        <Wand2 size={16} />
                        Convert This File
                      </button>
                      <button 
                        className="btn-outline btn-sm"
                        onClick={() => {
                          const blob = new Blob([msg.generated.content], { type: msg.generated.mimeType })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = msg.generated.filename
                          a.click()
                        }}
                      >
                        <Download size={16} />
                        Download
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isGenerating && (
            <div className="chat-message assistant">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Describe what you want to create..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={isGenerating}
          />
          <button 
            className="send-btn"
            onClick={handleSend}
            disabled={!input.trim() || isGenerating}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AIChat

