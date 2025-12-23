import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

// Import routes
import conversionRoutes from './routes/conversion.js'
import aiRoutes from './routes/ai.js'
import authRoutes from './routes/auth.js'
import paymentRoutes from './routes/payment.js'
import contactRoutes from './routes/contact.js'

// Import AI proxy
import { createAIProxy } from './ai-proxy.js'

// Import file conversion service
import { createFileConversionService } from './services/fileConversionService.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet())
app.use(cors())
app.use(compression())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
app.use('/api/', limiter)

// Create necessary directories if they don't exist
const uploadsDir = path.join(__dirname, 'uploads')
const tempDir = path.join(__dirname, 'temp')

[uploadsDir, tempDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log(`Created directory: ${dir}`)
  }
})

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
})

// Make upload middleware available globally
app.set('upload', upload)

// Initialize AI Proxy
createAIProxy(app)

// Routes
app.use('/api/convert', conversionRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api', contactRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// Error handling middleware - Professional implementation
app.use((err, req, res, next) => {
  console.error('Server Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  })
  
  // Handle multer errors (file upload errors)
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds the maximum allowed limit (100MB)'
      })
    }
    return res.status(400).json({
      success: false,
      error: `File upload error: ${err.message}`
    })
  }
  
  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: `Validation error: ${err.message}`
    })
  }
  
  // Generic error response
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err
    })
  })
})

// Cleanup old files periodically (every hour)
setInterval(() => {
  const now = Date.now()
  const maxAge = 60 * 60 * 1000 // 1 hour
  
  fs.readdir(uploadsDir, (err, files) => {
    if (err) return console.error('Error reading uploads directory:', err)
    
    files.forEach(file => {
      const filePath = path.join(uploadsDir, file)
      fs.stat(filePath, (err, stats) => {
        if (err) return console.error('Error getting file stats:', err)
        
        if (now - stats.mtimeMs > maxAge) {
          fs.unlink(filePath, err => {
            if (err) console.error('Error deleting file:', err)
            else console.log('Deleted old file:', file)
          })
        }
      })
    })
  })
}, 60 * 60 * 1000)

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📁 Uploads directory: ${uploadsDir}`)
})

