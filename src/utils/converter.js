// Simplified converter for demo - handles basic conversions reliably
import imageCompression from 'browser-image-compression'
import { saveAs } from 'file-saver'

export async function convertFile(file, targetFormat, options = {}) {
  const { aiFeatures = {} } = options
  const fileType = getFileType(file.name)
  
  let result = {
    blob: null,
    filename: '',
    aiResults: {}
  }

  try {
    // Handle compression
    if (targetFormat === 'compress') {
      result.blob = await compressImage(file, aiFeatures.smartCompress)
      result.filename = `${file.name.split('.')[0]}_compressed.${file.name.split('.').pop()}`
    }
    // Handle image conversions
    else if (fileType === 'image') {
      result.blob = await convertImage(file, targetFormat, aiFeatures)
      result.filename = `${file.name.split('.')[0]}.${targetFormat}`
    }
    // Handle PDF - simplified
    else if (fileType === 'pdf') {
      if (targetFormat === 'txt') {
        result.blob = new Blob(['PDF conversion to text requires additional setup. Try uploading an image for OCR instead.'], { type: 'text/plain' })
        result.filename = `${file.name.split('.')[0]}.txt`
      } else {
        throw new Error('PDF conversion requires additional configuration')
      }
    }
    else {
      throw new Error('Unsupported file type for this demo')
    }

    // Apply AI OCR if requested
    if (aiFeatures.ocr && fileType === 'image') {
      try {
        const Tesseract = await import('tesseract.js')
        const { data: { text } } = await Tesseract.recognize(file, 'eng')
        result.aiResults.ocr = text
        
        // Summarize if requested
        if (aiFeatures.summarize && text) {
          result.aiResults.summary = summarizeText(text)
        }
      } catch (error) {
        console.log('OCR skipped:', error.message)
      }
    }

    if (aiFeatures.enhance && fileType === 'image') {
      result.aiResults.enhanced = true
    }

    return result
  } catch (error) {
    console.error('Conversion error:', error)
    throw error
  }
}

async function convertImage(file, targetFormat, aiFeatures = {}) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = async (e) => {
      const img = new Image()
      
      img.onload = async () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        
        // Apply enhancement (simple upscale)
        if (aiFeatures.enhance) {
          width *= 1.2
          height *= 1.2
        }
        
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)
        
        // Convert to target format
        let mimeType = 'image/png'
        let quality = 0.92
        
        switch(targetFormat) {
          case 'jpg':
          case 'jpeg':
            mimeType = 'image/jpeg'
            break
          case 'png':
            mimeType = 'image/png'
            break
          case 'webp':
            mimeType = 'image/webp'
            break
          case 'pdf':
            // Simple PDF conversion
            const { jsPDF } = await import('jspdf')
            const imgData = canvas.toDataURL('image/jpeg', 0.9)
            const pdf = new jsPDF({
              orientation: width > height ? 'landscape' : 'portrait',
              unit: 'px',
              format: [width, height]
            })
            pdf.addImage(imgData, 'JPEG', 0, 0, width, height)
            resolve(pdf.output('blob'))
            return
        }
        
        canvas.toBlob(blob => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to convert image'))
          }
        }, mimeType, quality)
      }
      
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = e.target.result
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

async function compressImage(file, smartCompress = false) {
  const options = {
    maxSizeMB: smartCompress ? 0.5 : 1,
    maxWidthOrHeight: smartCompress ? 1920 : 2048,
    useWebWorker: true,
  }
  
  try {
    return await imageCompression(file, options)
  } catch (error) {
    console.error('Compression error:', error)
    // Fallback: return original file
    return file
  }
}

function summarizeText(text, maxSentences = 3) {
  if (!text || text.length < 100) return text

  const sentences = text
    .replace(/\n+/g, ' ')
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 20)

  if (sentences.length <= maxSentences) return text

  // Simple scoring
  const scored = sentences.map((sentence, i) => ({
    sentence,
    score: (i === 0 ? 3 : 0) + (sentence.length > 50 && sentence.length < 150 ? 2 : 0),
    index: i
  }))

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSentences)
    .sort((a, b) => a.index - b.index)
    .map(x => x.sentence)
    .join('. ') + '.'
}

function getFileType(filename) {
  const ext = filename.split('.').pop().toLowerCase()
  
  if (['jpg', 'jpeg', 'png', 'webp', 'heic', 'gif', 'bmp'].includes(ext)) return 'image'
  if (['pdf'].includes(ext)) return 'pdf'
  if (['doc', 'docx'].includes(ext)) return 'document'
  if (['xls', 'xlsx'].includes(ext)) return 'spreadsheet'
  
  return 'other'
}
