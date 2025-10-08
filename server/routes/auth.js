import express from 'express'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()

// In-memory user storage (in production, use a database)
const users = new Map()
const sessions = new Map()

// Register/Login endpoint (simplified for demo)
router.post('/login', (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    // Check if user exists
    let user = users.get(email)
    
    if (!user) {
      // Create new user
      user = {
        id: uuidv4(),
        email,
        isPremium: false,
        usageCount: 0,
        createdAt: new Date(),
        lastLogin: new Date()
      }
      users.set(email, user)
    } else {
      user.lastLogin = new Date()
    }

    // Create session
    const sessionId = uuidv4()
    sessions.set(sessionId, {
      userId: user.id,
      email: user.email,
      createdAt: new Date()
    })

    res.json({
      sessionId,
      user: {
        id: user.id,
        email: user.email,
        isPremium: user.isPremium,
        usageCount: user.usageCount
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed', message: error.message })
  }
})

// Get user info
router.get('/user/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params
    const session = sessions.get(sessionId)

    if (!session) {
      return res.status(401).json({ error: 'Invalid session' })
    }

    const user = users.get(session.email)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      id: user.id,
      email: user.email,
      isPremium: user.isPremium,
      usageCount: user.usageCount
    })

  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Failed to get user info', message: error.message })
  }
})

// Track usage
router.post('/usage', (req, res) => {
  try {
    const { sessionId } = req.body
    const session = sessions.get(sessionId)

    if (!session) {
      return res.status(401).json({ error: 'Invalid session' })
    }

    const user = users.get(session.email)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Increment usage count
    user.usageCount += 1

    res.json({
      usageCount: user.usageCount,
      isPremium: user.isPremium
    })

  } catch (error) {
    console.error('Usage tracking error:', error)
    res.status(500).json({ error: 'Failed to track usage', message: error.message })
  }
})

// Logout
router.post('/logout', (req, res) => {
  try {
    const { sessionId } = req.body
    sessions.delete(sessionId)
    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({ error: 'Logout failed', message: error.message })
  }
})

export default router

