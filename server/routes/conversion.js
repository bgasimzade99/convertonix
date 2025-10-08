import express from 'express'
import sharp from 'sharp'
import { PDFDocument } from 'pdf-lib'
import fs from 'fs/promises'

const router = express.Router()

// Advanced image conversion endpoint
router.post('/image', async (req, res) => {
  try {
    const upload = req.app.get('upload')
    
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'File upload failed', message: err.message })
      }

      const { targetFormat, quality = 90, width, height, enhance = false } = req.body
      const inputPath = req.file.path

      try {
        let image = sharp(inputPath)

        // Get metadata
        const metadata = await image.metadata()

        // Apply enhancements if requested
        if (enhance === 'true' || enhance === true) {
          image = image
            .sharpen()
            .modulate({ brightness: 1.05, saturation: 1.1 })
        }

        // Resize if dimensions provided
        if (width || height) {
          image = image.resize(
            width ? parseInt(width) : null,
            height ? parseInt(height) : null,
            { fit: 'inside', withoutEnlargement: false }
          )
        }

        // Convert to target format
        const outputBuffer = await image
          .toFormat(targetFormat, { quality: parseInt(quality) })
          .toBuffer()

        // Clean up input file
        await fs.unlink(inputPath)

        // Send converted image
        res.set('Content-Type', `image/${targetFormat}`)
        res.set('Content-Disposition', `attachment; filename="converted.${targetFormat}"`)
        res.send(outputBuffer)

      } catch (error) {
        await fs.unlink(inputPath).catch(() => {})
        throw error
      }
    })
  } catch (error) {
    console.error('Image conversion error:', error)
    res.status(500).json({ error: 'Conversion failed', message: error.message })
  }
})

// PDF compression endpoint
router.post('/pdf/compress', async (req, res) => {
  try {
    const upload = req.app.get('upload')
    
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'File upload failed', message: err.message })
      }

      const inputPath = req.file.path

      try {
        // Read PDF
        const pdfBytes = await fs.readFile(inputPath)
        const pdfDoc = await PDFDocument.load(pdfBytes)

        // Compress by removing metadata and optimizing
        pdfDoc.setTitle('')
        pdfDoc.setAuthor('')
        pdfDoc.setSubject('')
        pdfDoc.setKeywords([])
        pdfDoc.setProducer('')
        pdfDoc.setCreator('')

        // Save compressed PDF
        const compressedBytes = await pdfDoc.save({
          useObjectStreams: false,
          addDefaultPage: false
        })

        // Clean up input file
        await fs.unlink(inputPath)

        // Send compressed PDF
        res.set('Content-Type', 'application/pdf')
        res.set('Content-Disposition', 'attachment; filename="compressed.pdf"')
        res.send(Buffer.from(compressedBytes))

      } catch (error) {
        await fs.unlink(inputPath).catch(() => {})
        throw error
      }
    })
  } catch (error) {
    console.error('PDF compression error:', error)
    res.status(500).json({ error: 'Compression failed', message: error.message })
  }
})

export default router

