import express from 'express'
import { body, validationResult } from 'express-validator'
import sgMail from '@sendgrid/mail'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

// Configure SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

// Contact form endpoint
router.post('/contact', 
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('subject')
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('Subject must be between 3 and 200 characters'),
    body('message')
      .trim()
      .isLength({ min: 10, max: 5000 })
      .withMessage('Message must be between 10 and 5000 characters')
  ],
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        })
      }

      const { name, email, subject, message } = req.body

      // Prepare email
      const emailContent = {
        to: 'bgdevofficial@gmail.com',
        from: process.env.FROM_EMAIL || 'noreply@convertonix.com',
        replyTo: email,
        subject: `[Convertonix Support] ${subject}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #f5f5f5;
                }
                .container {
                  background: white;
                  border-radius: 12px;
                  padding: 30px;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }
                .header {
                  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                  color: white;
                  padding: 25px 30px;
                  border-radius: 12px 12px 0 0;
                  margin: -30px -30px 30px -30px;
                }
                .header h1 {
                  margin: 0;
                  font-size: 24px;
                  font-weight: 700;
                }
                .content {
                  margin: 20px 0;
                }
                .info-row {
                  margin: 15px 0;
                  padding: 12px;
                  background: #f8f9fa;
                  border-radius: 8px;
                  border-left: 3px solid #6366f1;
                }
                .info-label {
                  font-weight: 700;
                  color: #6366f1;
                  font-size: 12px;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  margin-bottom: 5px;
                }
                .info-value {
                  font-size: 15px;
                  color: #1a1a1a;
                }
                .message-box {
                  margin: 20px 0;
                  padding: 20px;
                  background: #f8f9fa;
                  border-radius: 8px;
                  border: 1px solid #e0e0e0;
                }
                .message-box .label {
                  font-weight: 700;
                  color: #6366f1;
                  margin-bottom: 10px;
                  display: block;
                }
                .message-box .content {
                  color: #1a1a1a;
                  white-space: pre-wrap;
                  line-height: 1.8;
                }
                .footer {
                  margin-top: 30px;
                  padding-top: 20px;
                  border-top: 1px solid #e0e0e0;
                  text-align: center;
                  color: #666;
                  font-size: 12px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>📧 New Contact Form Submission</h1>
                </div>
                <div class="content">
                  <div class="info-row">
                    <div class="info-label">From</div>
                    <div class="info-value">${name} (${email})</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">Subject</div>
                    <div class="info-value">${subject}</div>
                  </div>
                  <div class="message-box">
                    <span class="label">Message:</span>
                    <div class="content">${message.replace(/\n/g, '<br>')}</div>
                  </div>
                </div>
                <div class="footer">
                  <p>This message was sent from the Convertonix support form.</p>
                  <p>© 2025 Convertonix.com • Made by BGDev ⚡</p>
                </div>
              </div>
            </body>
          </html>
        `,
        text: `
New Contact Form Submission from Convertonix

From: ${name} (${email})
Subject: ${subject}

Message:
${message}

---
This message was sent from the Convertonix support form.
© 2025 Convertonix.com • Made by BGDev ⚡
        `
      }

      // Send email
      if (process.env.SENDGRID_API_KEY) {
        await sgMail.send(emailContent)
        console.log(`✅ Contact form email sent from ${email} to bgdevofficial@gmail.com`)
      } else {
        console.log('📧 Contact form email would be sent:')
        console.log('To: bgdevofficial@gmail.com')
        console.log('From:', email)
        console.log('Subject:', subject)
        console.log('Message:', message)
      }

      res.json({
        success: true,
        message: 'Your message has been sent successfully. We will get back to you within 24 hours.'
      })

    } catch (error) {
      console.error('Contact form error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to send message. Please try again later.'
      })
    }
  }
)

export default router

