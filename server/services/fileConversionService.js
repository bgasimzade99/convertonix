import sharp from 'sharp'
import pdf2pic from 'pdf2pic'
import mammoth from 'mammoth'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const execAsync = promisify(exec)

export function createFileConversionService() {
  
  // Image conversion using Sharp
  const convertImage = async (inputBuffer, outputFormat, options = {}) => {
    try {
      let sharpInstance = sharp(inputBuffer)
      
      // Apply quality settings
      if (outputFormat === 'jpeg' || outputFormat === 'jpg') {
        sharpInstance = sharpInstance.jpeg({ quality: options.quality || 90 })
      } else if (outputFormat === 'png') {
        sharpInstance = sharpInstance.png({ compressionLevel: options.compressionLevel || 6 })
      } else if (outputFormat === 'webp') {
        sharpInstance = sharpInstance.webp({ quality: options.quality || 90 })
      }
      
      // Apply resize if specified
      if (options.width || options.height) {
        sharpInstance = sharpInstance.resize(options.width, options.height, {
          fit: options.fit || 'inside',
          withoutEnlargement: true
        })
      }
      
      const outputBuffer = await sharpInstance.toBuffer()
      return outputBuffer
    } catch (error) {
      throw new Error(`Image conversion failed: ${error.message}`)
    }
  }
  
  // PDF to images conversion
  const convertPdfToImages = async (inputBuffer, outputFormat = 'jpg') => {
    try {
      const tempDir = path.join(__dirname, '../temp')
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true })
      }
      
      const inputPath = path.join(tempDir, `input_${Date.now()}.pdf`)
      const outputPath = path.join(tempDir, `output_${Date.now()}`)
      
      // Write input buffer to file
      fs.writeFileSync(inputPath, inputBuffer)
      
      // Convert PDF to images using pdf2pic
      const convert = pdf2pic.fromPath(inputPath, {
        density: 100,
        saveFilename: "page",
        savePath: outputPath,
        format: outputFormat,
        width: 2000,
        height: 2000
      })
      
      const result = await convert(1, { responseType: "buffer" })
      
      // Clean up temp files
      fs.unlinkSync(inputPath)
      fs.rmSync(outputPath, { recursive: true, force: true })
      
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
      
      const inputPath = path.join(tempDir, `input_${Date.now()}.mp4`)
      const outputPath = path.join(tempDir, `output_${Date.now()}.${outputFormat}`)
      
      // Write input buffer to file
      fs.writeFileSync(inputPath, inputBuffer)
      
      // Build FFmpeg command
      let command = `ffmpeg -i "${inputPath}" -y`
      
      if (outputFormat === 'mp4') {
        command += ' -c:v libx264 -c:a aac'
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
      fs.unlinkSync(inputPath)
      fs.unlinkSync(outputPath)
      
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
      
      const inputPath = path.join(tempDir, `input_${Date.now()}.mp3`)
      const outputPath = path.join(tempDir, `output_${Date.now()}.${outputFormat}`)
      
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
      fs.unlinkSync(inputPath)
      fs.unlinkSync(outputPath)
      
      return outputBuffer
    } catch (error) {
      throw new Error(`Audio conversion failed: ${error.message}`)
    }
  }
  
  // Main conversion function
  const convertFile = async (inputBuffer, inputFormat, outputFormat, options = {}) => {
    try {
      let outputBuffer
      
      // Determine file type and call appropriate converter
      if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg'].includes(inputFormat.toLowerCase())) {
        if (['jpg', 'jpeg', 'png', 'webp'].includes(outputFormat.toLowerCase())) {
          outputBuffer = await convertImage(inputBuffer, outputFormat, options)
        } else if (outputFormat.toLowerCase() === 'pdf') {
          // Convert image to PDF (simplified)
          outputBuffer = await convertImage(inputBuffer, 'png', options)
          // Note: For production, you'd want to use a proper PDF library
        }
      } else if (inputFormat.toLowerCase() === 'pdf') {
        if (['jpg', 'jpeg', 'png'].includes(outputFormat.toLowerCase())) {
          outputBuffer = await convertPdfToImages(inputBuffer, outputFormat)
        }
      } else if (['doc', 'docx'].includes(inputFormat.toLowerCase())) {
        if (['txt', 'html'].includes(outputFormat.toLowerCase())) {
          outputBuffer = await convertDocument(inputBuffer, outputFormat)
        }
      } else if (['mp4', 'avi', 'mov', 'webm', 'mkv'].includes(inputFormat.toLowerCase())) {
        if (['mp4', 'webm', 'gif'].includes(outputFormat.toLowerCase())) {
          outputBuffer = await convertVideo(inputBuffer, outputFormat, options)
        }
      } else if (['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(inputFormat.toLowerCase())) {
        if (['mp3', 'wav', 'ogg'].includes(outputFormat.toLowerCase())) {
          outputBuffer = await convertAudio(inputBuffer, outputFormat, options)
        }
      } else {
        throw new Error(`Unsupported conversion: ${inputFormat} to ${outputFormat}`)
      }
      
      return outputBuffer
    } catch (error) {
      throw new Error(`File conversion failed: ${error.message}`)
    }
  }
  
  return {
    convertFile,
    convertImage,
    convertPdfToImages,
    convertDocument,
    convertVideo,
    convertAudio
  }
}
