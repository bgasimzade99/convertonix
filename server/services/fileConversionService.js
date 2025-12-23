import sharp from 'sharp'
import pdf2pic from 'pdf2pic'
import mammoth from 'mammoth'
import { PDFDocument, rgb } from 'pdf-lib'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const execAsync = promisify(exec)

export function createFileConversionService() {
  
  // Image conversion using Sharp - Professional implementation
  const convertImage = async (inputBuffer, outputFormat, options = {}) => {
    try {
      let sharpInstance = sharp(inputBuffer)
      
      // Get image metadata for better handling
      const metadata = await sharpInstance.metadata()
      
      // Apply quality settings
      if (outputFormat === 'jpeg' || outputFormat === 'jpg') {
        sharpInstance = sharpInstance.jpeg({ 
          quality: options.quality || 90,
          progressive: true,
          mozjpeg: true
        })
      } else if (outputFormat === 'png') {
        sharpInstance = sharpInstance.png({ 
          compressionLevel: options.compressionLevel || 6,
          adaptiveFiltering: true,
          palette: options.compress || false
        })
      } else if (outputFormat === 'webp') {
        sharpInstance = sharpInstance.webp({ 
          quality: options.quality || 90,
          effort: 6
        })
      }
      
      // Apply resize if specified
      if (options.width || options.height) {
        sharpInstance = sharpInstance.resize(options.width, options.height, {
          fit: options.fit || 'inside',
          withoutEnlargement: true,
          kernel: sharp.kernel.lanczos3
        })
      }
      
      // Apply enhancement if requested
      if (options.enhance) {
        sharpInstance = sharpInstance.sharpen()
          .normalize()
          .gamma(1.2)
      }
      
      const outputBuffer = await sharpInstance.toBuffer()
      return outputBuffer
    } catch (error) {
      throw new Error(`Image conversion failed: ${error.message}`)
    }
  }
  
  // Image to PDF conversion - Professional implementation with pdf-lib
  // Supports: PNG, JPG, JPEG, SVG, GIF, BMP, WebP, TIFF, HEIC, diagrams, graphs
  const convertImageToPdf = async (inputBuffer, inputFormat, options = {}) => {
    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create()
      
      // Handle SVG separately (convert to PNG first)
      let imageBuffer = inputBuffer
      let width, height
      
      if (inputFormat.toLowerCase() === 'svg') {
        // Convert SVG to PNG first using Sharp
        const pngBuffer = await sharp(inputBuffer)
          .png({ density: 300 }) // High DPI for quality
          .toBuffer()
        
        imageBuffer = pngBuffer
        
        // Get dimensions
        const metadata = await sharp(pngBuffer).metadata()
        width = metadata.width
        height = metadata.height
      } else {
        // For other formats, get metadata directly
        const metadata = await sharp(inputBuffer).metadata()
        width = metadata.width || 800
        height = metadata.height || 600
        
        // Convert image to PNG/JPEG for PDF embedding (PDF-lib works best with PNG/JPEG)
        // Keep original format if already PNG/JPEG
        if (!['png', 'jpeg', 'jpg'].includes(inputFormat.toLowerCase())) {
          // Convert GIF, BMP, WebP, TIFF, HEIC to PNG
          imageBuffer = await sharp(inputBuffer)
            .png({ compressionLevel: 9 })
            .toBuffer()
        }
      }
      
      // Apply resize if specified (maintain aspect ratio)
      if (options.width || options.height) {
        const aspectRatio = width / height
        let finalWidth = width
        let finalHeight = height
        
        if (options.width && options.height) {
          finalWidth = options.width
          finalHeight = options.height
        } else if (options.width) {
          finalWidth = options.width
          finalHeight = options.width / aspectRatio
        } else if (options.height) {
          finalHeight = options.height
          finalWidth = options.height * aspectRatio
        }
        
        imageBuffer = await sharp(imageBuffer)
          .resize(Math.round(finalWidth), Math.round(finalHeight), {
            fit: 'fill',
            kernel: sharp.kernel.lanczos3
          })
          .png()
          .toBuffer()
        
        const resizedMetadata = await sharp(imageBuffer).metadata()
        width = resizedMetadata.width
        height = resizedMetadata.height
      }
      
      // Embed the image in PDF
      let pdfImage
      const isPng = imageBuffer[0] === 0x89 && imageBuffer[1] === 0x50
      const isJpeg = imageBuffer[0] === 0xFF && imageBuffer[1] === 0xD8
      
      if (isPng) {
        // PNG format
        pdfImage = await pdfDoc.embedPng(imageBuffer)
      } else if (isJpeg) {
        // JPEG format
        pdfImage = await pdfDoc.embedJpg(imageBuffer)
      } else {
        // Fallback: convert to PNG
        const pngBuffer = await sharp(imageBuffer).png().toBuffer()
        pdfImage = await pdfDoc.embedPng(pngBuffer)
      }
      
      // Get PDF page dimensions (use A4 as default if not specified)
      const pdfWidth = options.pdfWidth || 595.28  // A4 width in points
      const pdfHeight = options.pdfHeight || 841.89 // A4 height in points
      
      // Calculate scaling to fit page while maintaining aspect ratio
      const imageAspectRatio = width / height
      const pageAspectRatio = pdfWidth / pdfHeight
      
      let scaledWidth, scaledHeight, x, y
      
      if (imageAspectRatio > pageAspectRatio) {
        // Image is wider - fit to width
        scaledWidth = pdfWidth * 0.95 // 95% of page width with margins
        scaledHeight = scaledWidth / imageAspectRatio
        x = (pdfWidth - scaledWidth) / 2
        y = (pdfHeight - scaledHeight) / 2
      } else {
        // Image is taller - fit to height
        scaledHeight = pdfHeight * 0.95 // 95% of page height with margins
        scaledWidth = scaledHeight * imageAspectRatio
        x = (pdfWidth - scaledWidth) / 2
        y = (pdfHeight - scaledHeight) / 2
      }
      
      // Create a new page
      const page = pdfDoc.addPage([pdfWidth, pdfHeight])
      
      // Draw the image on the page
      page.drawImage(pdfImage, {
        x: x,
        y: y,
        width: scaledWidth,
        height: scaledHeight,
      })
      
      // Generate PDF bytes
      const pdfBytes = await pdfDoc.save()
      return Buffer.from(pdfBytes)
      
    } catch (error) {
      console.error('Image to PDF conversion error:', error)
      throw new Error(`Image to PDF conversion failed: ${error.message}`)
    }
  }
  
  // Multiple images to single PDF - For batch conversion
  const convertImagesToPdf = async (imageBuffers, inputFormats, options = {}) => {
    try {
      const pdfDoc = await PDFDocument.create()
      const pdfWidth = options.pdfWidth || 595.28
      const pdfHeight = options.pdfHeight || 841.89
      
      for (let i = 0; i < imageBuffers.length; i++) {
        const imageBuffer = imageBuffers[i]
        const inputFormat = inputFormats[i] || 'png'
        
        // Convert SVG to PNG if needed
        let processedBuffer = imageBuffer
        if (inputFormat.toLowerCase() === 'svg') {
          processedBuffer = await sharp(imageBuffer)
            .png({ density: 300 })
            .toBuffer()
        }
        
        // Get image dimensions
        const metadata = await sharp(processedBuffer).metadata()
        let width = metadata.width || 800
        let height = metadata.height || 600
        
        // Embed image
        let pdfImage
        const isPng = processedBuffer[0] === 0x89 && processedBuffer[1] === 0x50
        const isJpeg = processedBuffer[0] === 0xFF && processedBuffer[1] === 0xD8
        
        if (isPng) {
          pdfImage = await pdfDoc.embedPng(processedBuffer)
        } else if (isJpeg) {
          pdfImage = await pdfDoc.embedJpg(processedBuffer)
        } else {
          const pngBuffer = await sharp(processedBuffer).png().toBuffer()
          pdfImage = await pdfDoc.embedPng(pngBuffer)
        }
        
        // Calculate scaling
        const imageAspectRatio = width / height
        const pageAspectRatio = pdfWidth / pdfHeight
        
        let scaledWidth, scaledHeight, x, y
        
        if (imageAspectRatio > pageAspectRatio) {
          scaledWidth = pdfWidth * 0.95
          scaledHeight = scaledWidth / imageAspectRatio
        } else {
          scaledHeight = pdfHeight * 0.95
          scaledWidth = scaledHeight * imageAspectRatio
        }
        
        x = (pdfWidth - scaledWidth) / 2
        y = (pdfHeight - scaledHeight) / 2
        
        // Add page and draw image
        const page = pdfDoc.addPage([pdfWidth, pdfHeight])
        page.drawImage(pdfImage, {
          x: x,
          y: y,
          width: scaledWidth,
          height: scaledHeight,
        })
      }
      
      const pdfBytes = await pdfDoc.save()
      return Buffer.from(pdfBytes)
      
    } catch (error) {
      console.error('Images to PDF conversion error:', error)
      throw new Error(`Images to PDF conversion failed: ${error.message}`)
    }
  }
  
  // PDF to images conversion
  const convertPdfToImages = async (inputBuffer, outputFormat = 'jpg') => {
    try {
      const tempDir = path.join(__dirname, '../temp')
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true })
      }
      
      const inputPath = path.join(tempDir, `input_${Date.now()}_${Math.random().toString(36).substring(7)}.pdf`)
      const outputPath = path.join(tempDir, `output_${Date.now()}_${Math.random().toString(36).substring(7)}`)
      
      // Write input buffer to file
      fs.writeFileSync(inputPath, inputBuffer)
      
      // Convert PDF to images using pdf2pic
      const convert = pdf2pic.fromPath(inputPath, {
        density: 200, // Higher density for better quality
        saveFilename: "page",
        savePath: outputPath,
        format: outputFormat,
        width: 2000,
        height: 2000
      })
      
      const result = await convert(1, { responseType: "buffer" })
      
      // Clean up temp files
      try {
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath)
        if (fs.existsSync(outputPath)) fs.rmSync(outputPath, { recursive: true, force: true })
      } catch (cleanupError) {
        console.warn('Cleanup error (non-critical):', cleanupError.message)
      }
      
      return result.buffer
    } catch (error) {
      throw new Error(`PDF to image conversion failed: ${error.message}`)
    }
  }
  
  // Document conversion (Word to other formats)
  const convertDocument = async (inputBuffer, outputFormat) => {
    try {
      if (outputFormat === 'txt') {
        const result = await mammoth.extractRawText({ buffer: inputBuffer })
        return Buffer.from(result.value, 'utf8')
      } else if (outputFormat === 'html') {
        const result = await mammoth.convertToHtml({ buffer: inputBuffer })
        return Buffer.from(result.value, 'utf8')
      }
      throw new Error(`Unsupported document format: ${outputFormat}`)
    } catch (error) {
      throw new Error(`Document conversion failed: ${error.message}`)
    }
  }
  
  // Video conversion using FFmpeg
  const convertVideo = async (inputBuffer, outputFormat, options = {}) => {
    try {
      const tempDir = path.join(__dirname, '../temp')
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true })
      }
      
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(7)
      const inputPath = path.join(tempDir, `input_${timestamp}_${random}.mp4`)
      const outputPath = path.join(tempDir, `output_${timestamp}_${random}.${outputFormat}`)
      
      // Write input buffer to file
      fs.writeFileSync(inputPath, inputBuffer)
      
      // Build FFmpeg command
      let command = `ffmpeg -i "${inputPath}" -y`
      
      if (outputFormat === 'mp4') {
        command += ' -c:v libx264 -c:a aac -preset medium'
      } else if (outputFormat === 'webm') {
        command += ' -c:v libvpx-vp9 -c:a libopus'
      } else if (outputFormat === 'gif') {
        command += ' -vf "fps=10,scale=640:-1:flags=lanczos" -c:v gif'
      }
      
      if (options.quality) {
        command += ` -crf ${options.quality}`
      }
      
      command += ` "${outputPath}"`
      
      await execAsync(command)
      
      const outputBuffer = fs.readFileSync(outputPath)
      
      // Clean up temp files
      try {
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath)
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath)
      } catch (cleanupError) {
        console.warn('Cleanup error (non-critical):', cleanupError.message)
      }
      
      return outputBuffer
    } catch (error) {
      throw new Error(`Video conversion failed: ${error.message}`)
    }
  }
  
  // Audio conversion using FFmpeg
  const convertAudio = async (inputBuffer, outputFormat, options = {}) => {
    try {
      const tempDir = path.join(__dirname, '../temp')
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true })
      }
      
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(7)
      const inputPath = path.join(tempDir, `input_${timestamp}_${random}.mp3`)
      const outputPath = path.join(tempDir, `output_${timestamp}_${random}.${outputFormat}`)
      
      // Write input buffer to file
      fs.writeFileSync(inputPath, inputBuffer)
      
      // Build FFmpeg command
      let command = `ffmpeg -i "${inputPath}" -y`
      
      if (outputFormat === 'mp3') {
        command += ' -codec:a libmp3lame'
      } else if (outputFormat === 'wav') {
        command += ' -codec:a pcm_s16le'
      } else if (outputFormat === 'ogg') {
        command += ' -codec:a libvorbis'
      }
      
      if (options.bitrate) {
        command += ` -b:a ${options.bitrate}k`
      }
      
      command += ` "${outputPath}"`
      
      await execAsync(command)
      
      const outputBuffer = fs.readFileSync(outputPath)
      
      // Clean up temp files
      try {
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath)
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath)
      } catch (cleanupError) {
        console.warn('Cleanup error (non-critical):', cleanupError.message)
      }
      
      return outputBuffer
    } catch (error) {
      throw new Error(`Audio conversion failed: ${error.message}`)
    }
  }
  
  // Main conversion function - Professional implementation
  const convertFile = async (inputBuffer, inputFormat, outputFormat, options = {}) => {
    try {
      // Validate input
      if (!inputBuffer || inputBuffer.length === 0) {
        throw new Error('Input buffer is empty')
      }
      
      // Normalize formats
      const normalizedInputFormat = inputFormat.toLowerCase().replace(/^\./, '')
      const normalizedOutputFormat = outputFormat.toLowerCase().replace(/^\./, '')
      
      let outputBuffer
      
      // Comprehensive image format support (including diagrams, graphs, SVG, etc.)
      const imageFormats = [
        'jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg', 
        'tiff', 'tif', 'ico', 'heic', 'heif', 'avif', 'raw'
      ]
      
      if (imageFormats.includes(normalizedInputFormat)) {
        if (['jpg', 'jpeg', 'png', 'webp'].includes(normalizedOutputFormat)) {
          outputBuffer = await convertImage(inputBuffer, normalizedOutputFormat, options)
        } else if (normalizedOutputFormat === 'pdf') {
          // Professional image to PDF conversion with pdf-lib
          outputBuffer = await convertImageToPdf(inputBuffer, normalizedInputFormat, options)
        } else {
          throw new Error(`Unsupported output format for images: ${normalizedOutputFormat}`)
        }
      } else if (normalizedInputFormat === 'pdf') {
        if (['jpg', 'jpeg', 'png'].includes(normalizedOutputFormat)) {
          outputBuffer = await convertPdfToImages(inputBuffer, normalizedOutputFormat)
        } else {
          throw new Error(`Unsupported output format for PDF: ${normalizedOutputFormat}`)
        }
      } else if (['doc', 'docx'].includes(normalizedInputFormat)) {
        if (['txt', 'html'].includes(normalizedOutputFormat)) {
          outputBuffer = await convertDocument(inputBuffer, normalizedOutputFormat)
        } else {
          throw new Error(`Unsupported output format for documents: ${normalizedOutputFormat}`)
        }
      } else if (['mp4', 'avi', 'mov', 'webm', 'mkv', 'flv', 'wmv'].includes(normalizedInputFormat)) {
        if (['mp4', 'webm', 'gif'].includes(normalizedOutputFormat)) {
          outputBuffer = await convertVideo(inputBuffer, normalizedOutputFormat, options)
        } else {
          throw new Error(`Unsupported output format for video: ${normalizedOutputFormat}`)
        }
      } else if (['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac', 'wma'].includes(normalizedInputFormat)) {
        if (['mp3', 'wav', 'ogg'].includes(normalizedOutputFormat)) {
          outputBuffer = await convertAudio(inputBuffer, normalizedOutputFormat, options)
        } else {
          throw new Error(`Unsupported output format for audio: ${normalizedOutputFormat}`)
        }
      } else {
        throw new Error(`Unsupported conversion: ${normalizedInputFormat} to ${normalizedOutputFormat}`)
      }
      
      if (!outputBuffer || outputBuffer.length === 0) {
        throw new Error('Conversion produced empty output')
      }
      
      return outputBuffer
    } catch (error) {
      console.error('File conversion error:', {
        inputFormat,
        outputFormat,
        error: error.message,
        stack: error.stack
      })
      throw new Error(`File conversion failed: ${error.message}`)
    }
  }
  
  return {
    convertFile,
    convertImage,
    convertImageToPdf,
    convertImagesToPdf,
    convertPdfToImages,
    convertDocument,
    convertVideo,
    convertAudio
  }
}
