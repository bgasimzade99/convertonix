import sgMail from '@sendgrid/mail'
import dotenv from 'dotenv'

dotenv.config()

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

export async function sendVerificationEmail(email, verificationToken) {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`

  const msg = {
    to: email,
    from: process.env.FROM_EMAIL || 'noreply@convertonix.com',
    subject: 'Verify Your Email - Convertonix',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💎 Welcome to Convertonix!</h1>
            </div>
            <div class="content">
              <p>Hi there! 👋</p>
              <p>Thanks for signing up for Convertonix - the professional AI-powered file converter.</p>
              <p>Please verify your email address by clicking the button below:</p>
              <center>
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </center>
              <p>Or copy and paste this link: <br><small>${verificationUrl}</small></p>
              <p>This link will expire in 24 hours.</p>
              <p>If you didn't create an account, you can safely ignore this email.</p>
            </div>
            <div class="footer">
                  <p>© 2025 Convertonix.com - Made by BGDev ⚡</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  try {
    if (process.env.SENDGRID_API_KEY) {
      await sgMail.send(msg)
    } else {
      console.log('📧 Email would be sent to:', email)
      console.log('Verification URL:', verificationUrl)
    }
  } catch (error) {
    console.error('Email sending error:', error)
    throw error
  }
}

export async function sendPasswordResetEmail(email, resetToken) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`

  const msg = {
    to: email,
    from: process.env.FROM_EMAIL || 'noreply@convertai.pro',
    subject: 'Reset Your Password - ConvertAI',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset</h1>
            </div>
            <div class="content">
              <p>You requested to reset your password.</p>
              <p>Click the button below to reset it:</p>
              <center>
                <a href="${resetUrl}" class="button">Reset Password</a>
              </center>
              <p>This link expires in 1 hour.</p>
              <p>If you didn't request this, ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  try {
    if (process.env.SENDGRID_API_KEY) {
      await sgMail.send(msg)
    } else {
      console.log('📧 Password reset email would be sent to:', email)
      console.log('Reset URL:', resetUrl)
    }
  } catch (error) {
    console.error('Email sending error:', error)
    throw error
  }
}

export async function sendPremiumWelcomeEmail(email) {
  const msg = {
    to: email,
    from: process.env.FROM_EMAIL || 'noreply@convertai.pro',
    subject: '🎉 Welcome to ConvertAI Premium!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .feature { padding: 10px; margin: 10px 0; background: white; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>👑 Welcome to Premium!</h1>
            </div>
            <div class="content">
              <p>Congratulations! You're now a ConvertAI Premium member! 🎉</p>
              <p><strong>Here's what you get:</strong></p>
              <div class="feature">✅ Unlimited file conversions</div>
              <div class="feature">🤖 Advanced AI features</div>
              <div class="feature">⚡ Priority processing</div>
              <div class="feature">📦 Batch conversions</div>
              <div class="feature">☁️ Cloud storage integration</div>
              <div class="feature">🎯 No watermarks</div>
              <p>Start converting now and enjoy all premium features!</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  try {
    if (process.env.SENDGRID_API_KEY) {
      await sgMail.send(msg)
    }
  } catch (error) {
    console.error('Email sending error:', error)
  }
}

