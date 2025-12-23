import express from 'express'
import multer from 'multer'
import { createFileConversionService } from '../services/fileConversionService.js'

const router = express.Router()
const fileConversionService = createFileConversionService()

// Configure multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({ 
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types for conversion
    cb(null, true)
  }
})

// Main conversion endpoint
router.post('/convert', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      })
    }

    const { 
      inputFormat, 
      outputFormat, 
      quality = 90,
      width,
      height,
      enhance = false,
      compress = false
    } = req.body

    if (!inputFormat || !outputFormat) {
      return res.status(400).json({ 
        success: false, 
        error: 'Input and output formats are required' 
      })
    }

    // Prepare conversion options
    const options = {
      quality: parseInt(quality),
      width: width ? parseInt(width) : undefined,
      height: height ? parseInt(height) : undefined,
      enhance: enhance === 'true' || enhance === true,
      compress: compress === 'true' || compress === true
    }

    // Perform conversion
    const outputBuffer = await fileConversionService.convertFile(
      req.file.buffer,
      inputFormat,
      outputFormat,
      options
    )

    // Generate output filename
    const originalName = req.file.originalname.split('.')[0]
    const outputFilename = `${originalName}_converted.${outputFormat}`

    // Set proper content type based on output format
    const contentTypeMap = {
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'webp': 'image/webp',
      'gif': 'image/gif',
      'svg': 'image/svg+xml',
      'txt': 'text/plain',
      'html': 'text/html',
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'ogg': 'audio/ogg'
    }
    
    const contentType = contentTypeMap[outputFormat.toLowerCase()] || `application/${outputFormat}`
    
    // Send response
    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Disposition', `attachment; filename="${outputFilename}"`)
    res.setHeader('Content-Length', outputBuffer.length)
    
    res.status(200).json({
      success: true,
      filename: outputFilename,
      size: outputBuffer.length,
      format: outputFormat,
      data: outputBuffer.toString('base64') // Send as base64 for frontend
    })

  } catch (error) {
    console.error('Conversion error:', {
      message: error.message,
      stack: error.stack,
      inputFormat: req.body.inputFormat,
      outputFormat: req.body.outputFormat,
      fileName: req.file?.originalname
    })
    
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Conversion failed',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
})

// Batch conversion endpoint
router.post('/batch-convert', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No files uploaded' 
      })
    }

    const { 
      outputFormat, 
      quality = 90,
      width,
      height,
      enhance = false,
      compress = false
    } = req.body

    if (!outputFormat) {
      return res.status(400).json({ 
        success: false, 
        error: 'Output format is required' 
      })
    }

    const results = []
    const errors = []

    // Process each file
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i]
      
      try {
        // Determine input format from file extension
        const inputFormat = file.originalname.split('.').pop().toLowerCase()
        
        const options = {
          quality: parseInt(quality),
          width: width ? parseInt(width) : undefined,
          height: height ? parseInt(height) : undefined,
          enhance: enhance === 'true' || enhance === true,
          compress: compress === 'true' || compress === true
        }

        const outputBuffer = await fileConversionService.convertFile(
          file.buffer,
          inputFormat,
          outputFormat,
          options
        )

        const originalName = file.originalname.split('.')[0]
        const outputFilename = `${originalName}_converted.${outputFormat}`

        results.push({
          originalName: file.originalname,
          filename: outputFilename,
          size: outputBuffer.length,
          format: outputFormat,
          data: outputBuffer.toString('base64')
        })

      } catch (error) {
        errors.push({
          filename: file.originalname,
          error: error.message
        })
      }
    }

    res.status(200).json({
      success: true,
      results,
      errors,
      totalProcessed: results.length,
      totalErrors: errors.length
    })

  } catch (error) {
    console.error('Batch conversion error:', error)
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Batch conversion failed' 
    })
  }
})

// Get supported formats endpoint
router.get('/formats', (req, res) => {
    const supportedFormats = {
    image: {
      input: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg', 'tiff', 'tif', 'ico', 'heic', 'heif', 'avif'],
      output: ['jpg', 'jpeg', 'png', 'webp', 'pdf']
    },
    document: {
      input: ['pdf', 'doc', 'docx'],
      output: ['pdf', 'txt', 'html', 'jpg', 'png']
    },
    video: {
      input: ['mp4', 'avi', 'mov', 'webm', 'mkv'],
      output: ['mp4', 'webm', 'gif']
    },
    audio: {
      input: ['mp3', 'wav', 'ogg', 'm4a', 'flac'],
      output: ['mp3', 'wav', 'ogg']
    }
  }

  res.status(200).json({
    success: true,
    formats: supportedFormats
  })
})

export default router