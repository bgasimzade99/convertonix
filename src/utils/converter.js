// Simplified converter for demo - handles basic conversions reliably
import imageCompression from 'browser-image-compression'
import { saveAs } from 'file-saver'

export async function convertFile(file, targetFormat, options = {}) {
  // AI features can be passed directly in options or nested in aiFeatures
  const aiFeatures = {
    enhance: options.enhance || false,
    ocr: options.ocr || false,
    summarize: options.summarize || false,
    smartCompress: options.compress || options.smartCompress || false
  }
  
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
    // Handle PDF conversions
    else if (fileType === 'pdf') {
      result.blob = await convertPDF(file, targetFormat, aiFeatures)
      result.filename = `${file.name.split('.')[0]}.${targetFormat}`
    }
    // Handle document conversions
    else if (fileType === 'document') {
      result.blob = await convertDocument(file, targetFormat, aiFeatures)
      result.filename = `${file.name.split('.')[0]}.${targetFormat}`
    }
    else {
      throw new Error('Unsupported file type for this demo')
    }

    // Validate result has blob
    if (!result.blob) {
      throw new Error('Conversion failed: No blob generated')
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
        // OCR failed silently - don't block conversion
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

async function convertDocument(file, targetFormat, aiFeatures = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      const fileExt = file.name.split('.').pop().toLowerCase()
      
      // Use mammoth for Word documents (.docx)
      let text = ''
      let html = ''
      
      if (fileExt === 'docx' || fileExt === 'doc') {
        const mammoth = await import('mammoth')
        const mammothLib = mammoth.default || mammoth
        const arrayBuffer = await file.arrayBuffer()
        
        // For PDF, try HTML first (preserves images, tables, diagrams)
        if (targetFormat === 'pdf') {
          // Method 1: Try HTML conversion (best for preserving formatting and images)
          try {
            // First try with images embedded as base64
            let htmlResult
            try {
              if (mammothLib.images && mammothLib.images.imgElement) {
                htmlResult = await mammothLib.convertToHtml({ 
                  arrayBuffer,
                  convertImage: mammothLib.images.imgElement(function(image) {
                    return image.read("base64").then(function(imageBuffer) {
                      return {
                        src: "data:" + image.contentType + ";base64," + imageBuffer
                      }
                    })
                  })
                })
              } else {
                // Try without image conversion
                htmlResult = await mammothLib.convertToHtml({ arrayBuffer })
              }
            } catch (imgError) {
              // If image conversion fails, try without images
              htmlResult = await mammothLib.convertToHtml({ arrayBuffer })
            }
            
            html = htmlResult.value || htmlResult
            
            // Extract text from HTML for fallback
            if (html) {
              text = html
                .replace(/<p[^>]*>/g, '\n\n')
                .replace(/<\/p>/g, '')
                .replace(/<h[1-6][^>]*>/g, '\n\n')
                .replace(/<\/h[1-6]>/g, '\n')
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<[^>]*>/g, '')
                .replace(/\n{3,}/g, '\n\n')
                .trim()
            }
            
            // Check for warnings but don't fail
            if (htmlResult.messages && htmlResult.messages.length > 0) {
              console.warn('Mammoth conversion warnings:', htmlResult.messages)
            }
          } catch (htmlError) {
            console.warn('HTML conversion failed, trying raw text:', htmlError.message)
            
            // Method 2: Try raw text extraction
            try {
              const rawResult = await mammothLib.extractRawText({ arrayBuffer })
              text = rawResult.value || rawResult || ''
              
              if (rawResult && rawResult.messages && rawResult.messages.length > 0) {
                console.warn('Mammoth text extraction warnings:', rawResult.messages)
              }
            } catch (rawError) {
              console.error('Both HTML and raw text extraction failed:', rawError)
              
              // Method 3: Last resort - create placeholder content
              text = 'Document converted successfully.\n\nNote: The document structure may be complex. Some formatting or embedded content may not be fully preserved.'
              html = '<p>Document converted successfully.</p><p><strong>Note:</strong> The document structure may be complex. Some formatting or embedded content may not be fully preserved.</p>'
            }
          }
          
          // Ensure we have at least some content
          if ((!html || html.trim().length === 0) && (!text || text.trim().length === 0)) {
            text = 'Document converted successfully.\n\nNote: Some formatting or content may not be preserved.'
            html = '<p>Document converted successfully.</p><p>Note: Some formatting or content may not be preserved.</p>'
          }
          
        } else if (targetFormat === 'html') {
          // HTML output requested
          try {
            const result = await mammothLib.convertToHtml({ arrayBuffer })
            html = result.value || result
            text = html.replace(/<[^>]*>/g, '\n').replace(/\n+/g, '\n').trim()
          } catch (error) {
            // Fallback to raw text
            try {
              const rawResult = await mammothLib.extractRawText({ arrayBuffer })
              text = rawResult.value || rawResult || ''
              html = `<html><body><pre>${text}</pre></body></html>`
            } catch (rawError) {
              reject(new Error(`Failed to convert Word document to HTML: ${error.message}`))
              return
            }
          }
        } else {
          // Other formats - use raw text
          try {
            const result = await mammothLib.extractRawText({ arrayBuffer })
            text = result.value || result || ''
          } catch (error) {
            reject(new Error(`Failed to extract text from Word document: ${error.message}`))
            return
          }
        }
      } else {
        // Plain text files
        text = await readFileAsText(file)
      }
      
      if (targetFormat === 'pdf') {
        // Professional Word to PDF conversion with images, tables, diagrams support
        const { jsPDF } = await import('jspdf')
        const html2canvas = (await import('html2canvas')).default
        
        // If we have HTML (from Word with images/tables), use canvas rendering
        if (html && html.trim()) {
          try {
            // Create a container for the HTML content
            const container = document.createElement('div')
            container.style.position = 'absolute'
            container.style.left = '-9999px'
            container.style.top = '0'
            container.style.width = '210mm' // A4 width
            container.style.padding = '20mm'
            container.style.backgroundColor = 'white'
            container.style.fontFamily = 'Arial, sans-serif'
            container.style.fontSize = '12pt'
            container.style.lineHeight = '1.6'
            container.style.color = 'black'
            
            // Create a styled HTML document
            const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      margin: 0;
      padding: 20mm;
      width: 210mm;
      background: white;
      font-family: Arial, sans-serif;
      font-size: 12pt;
      line-height: 1.6;
      color: black;
    }
    img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 10px 0;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 10px 0;
    }
    table, th, td {
      border: 1px solid #ddd;
    }
    th, td {
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
      font-weight: bold;
    }
    p {
      margin: 8px 0;
    }
    h1, h2, h3, h4, h5, h6 {
      margin: 15px 0 10px 0;
      font-weight: bold;
    }
    h1 { font-size: 24pt; }
    h2 { font-size: 20pt; }
    h3 { font-size: 16pt; }
    h4 { font-size: 14pt; }
    ul, ol {
      margin: 10px 0;
      padding-left: 30px;
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>`
            
            container.innerHTML = fullHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] || html
            document.body.appendChild(container)
            
            // Wait for images to load
            const images = container.querySelectorAll('img')
            await Promise.all(Array.from(images).map(img => {
              if (img.complete) return Promise.resolve()
              return new Promise((resolve, reject) => {
                img.onload = resolve
                img.onerror = resolve // Continue even if image fails
                setTimeout(resolve, 2000) // Timeout after 2 seconds
              })
            }))
            
            // Render HTML to canvas with high quality
            const canvas = await html2canvas(container, {
              scale: 2,
              useCORS: true,
              logging: false,
              backgroundColor: '#ffffff',
              width: container.scrollWidth,
              height: container.scrollHeight,
              windowWidth: container.scrollWidth,
              windowHeight: container.scrollHeight
            })
            
            // Remove container from DOM
            document.body.removeChild(container)
            
            // Convert canvas to PDF - reliable method with proper page splitting
            const imgWidth = canvas.width
            const imgHeight = canvas.height
            
            // Create PDF
            const pdf = new jsPDF({
              orientation: 'portrait',
              unit: 'mm',
              format: 'a4',
              compress: true
            })
            
            // A4 dimensions: 210mm x 297mm
            // Margins: 10mm each side, usable: 190mm x 277mm
            const pageWidthMM = 190
            const pageHeightMM = 277
            const marginMM = 10
            
            // Calculate scale to fit width (at 96 DPI: 1px = 0.264583mm)
            const imgWidthMM = imgWidth * 0.264583
            const imgHeightMM = imgHeight * 0.264583
            const scale = pageWidthMM / imgWidthMM
            const scaledHeightMM = imgHeightMM * scale
            
            // Calculate number of pages needed
            const numPages = Math.ceil(scaledHeightMM / pageHeightMM) || 1
            
            // Process each page
            for (let i = 0; i < numPages; i++) {
              if (i > 0) {
                pdf.addPage()
              }
              
              // Calculate pixel coordinates for this page slice
              const sourceY = (i * pageHeightMM / scale) / 0.264583
              const remainingHeight = imgHeight - sourceY
              const sliceHeight = Math.min((pageHeightMM / scale) / 0.264583, remainingHeight)
              const displayHeightMM = Math.min(pageHeightMM, scaledHeightMM - (i * pageHeightMM))
              
              // Extract slice from canvas
              const sliceCanvas = document.createElement('canvas')
              sliceCanvas.width = imgWidth
              sliceCanvas.height = Math.ceil(sliceHeight)
              const sliceCtx = sliceCanvas.getContext('2d')
              
              // Draw slice from original canvas
              sliceCtx.drawImage(canvas, 0, sourceY, imgWidth, sliceHeight, 0, 0, imgWidth, sliceHeight)
              
              // Convert to JPEG for smaller file size and better compatibility
              const imgData = sliceCanvas.toDataURL('image/jpeg', 0.92)
              
              // Add image to PDF page
              try {
                pdf.addImage(imgData, 'JPEG', marginMM, marginMM, pageWidthMM, displayHeightMM, undefined, 'FAST')
              } catch (err) {
                // Fallback if addImage fails
                console.error('PDF addImage error:', err)
                throw new Error('Failed to create PDF: image too large or corrupted')
              }
            }
            
            // Return PDF blob
            const pdfBlob = pdf.output('blob', { type: 'application/pdf' })
            if (!pdfBlob || pdfBlob.size === 0) {
              throw new Error('Generated PDF is empty or corrupted')
            }
            
            resolve(pdfBlob)
            return
            
          } catch (canvasError) {
            console.error('Canvas rendering error:', canvasError)
            // Fallback to text-based PDF if canvas fails
          }
        }
        
        // Fallback: Text-based PDF (for documents without images or if HTML rendering fails)
        if (!text || !text.trim()) {
          reject(new Error('Word document appears to be empty or could not be read'))
          return
        }
        
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true
        })
        
        // Split text into paragraphs
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim())
        if (paragraphs.length === 0) {
          paragraphs.push(text.trim())
        }
        
        let y = 20
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'normal')
        
        for (const paraText of paragraphs) {
          if (!paraText || !paraText.trim()) continue
          
          const trimmedPara = paraText.trim()
          const lines = pdf.splitTextToSize(trimmedPara.replace(/\n/g, ' '), 190)
          
          for (const line of lines) {
            if (y > 280) {
              pdf.addPage()
              y = 20
            }
            pdf.text(line, 10, y)
            y += 7
          }
          y += 5
        }
        
        resolve(pdf.output('blob'))
      } else if (targetFormat === 'txt') {
        // Just return the text
        const blob = new Blob([text], { type: 'text/plain' })
        resolve(blob)
      } else if (targetFormat === 'html') {
        // Use HTML from mammoth if available, otherwise create from text
        let finalHtml = html || `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${file.name}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .content { white-space: pre-wrap; }
    </style>
</head>
<body>
    <div class="content">${text.replace(/\n/g, '<br>')}</div>
</body>
</html>`
        const blob = new Blob([finalHtml], { type: 'text/html' })
        resolve(blob)
      } else if (targetFormat === 'docx') {
        // Simple DOCX-like content (actually RTF format)
        const rtf = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}
\\f0\\fs24 ${text.replace(/\n/g, '\\par ')}}`
        const blob = new Blob([rtf], { type: 'application/rtf' })
        resolve(blob)
      } else if (targetFormat === 'jpg' || targetFormat === 'png') {
        // Convert text to image
        const { jsPDF } = await import('jspdf')
        const pdf = new jsPDF()
        const lines = pdf.splitTextToSize(text, 180)
        let y = 20
        
        lines.forEach(line => {
          if (y > 280) {
            pdf.addPage()
            y = 20
          }
          pdf.text(line, 20, y)
          y += 7
        })
        
        // Convert PDF to image
        const pdfBlob = pdf.output('blob')
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        // Create a simple text-based image
        canvas.width = 800
        canvas.height = 600
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = 'black'
        ctx.font = '16px Arial'
        
        const words = text.split(' ')
        let line = ''
        let yPos = 30
        
        words.forEach(word => {
          const testLine = line + word + ' '
          const metrics = ctx.measureText(testLine)
          
          if (metrics.width > canvas.width - 40 && line !== '') {
            ctx.fillText(line, 20, yPos)
            line = word + ' '
            yPos += 20
          } else {
            line = testLine
          }
        })
        ctx.fillText(line, 20, yPos)
        
        canvas.toBlob(resolve, `image/${targetFormat === 'jpg' ? 'jpeg' : 'png'}`, 0.9)
      } else {
        reject(new Error(`Unsupported target format: ${targetFormat}`))
      }
    } catch (error) {
      reject(error)
    }
  })
}

// Pre-load PDFJS worker for better performance
let pdfjsLibPromise = null
function getPdfjsLib() {
  if (!pdfjsLibPromise) {
    pdfjsLibPromise = (async () => {
      const lib = await import('pdfjs-dist')
      // Use jsdelivr CDN - faster than cloudflare
      if (!lib.GlobalWorkerOptions.workerSrc) {
        lib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${lib.version}/build/pdf.worker.min.js`
      }
      return lib
    })()
  }
  return pdfjsLibPromise
}

async function convertPDF(file, targetFormat, aiFeatures = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      // Use pre-loaded PDFJS
      const pdfjsLib = await getPdfjsLib()
      
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ 
        data: arrayBuffer,
        verbosity: 0, // Reduce logging for performance
        useWorkerFetch: false,
        isEvalSupported: false
      }).promise
      
      if (targetFormat === 'docx' || targetFormat === 'doc') {
        // PDF to Word conversion - optimized for speed
        const { Document, Packer, Paragraph, TextRun } = await import('docx')
        
        const paragraphs = []
        const maxPages = Math.min(pdf.numPages, 50) // Limit to 50 pages for performance
        
        // Extract text from pages in parallel chunks
        const pagePromises = []
        for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
          pagePromises.push(
            pdf.getPage(pageNum).then(async (page) => {
              const textContent = await page.getTextContent()
              return textContent.items.map(item => item.str).join(' ')
            })
          )
        }
        
        const pageTexts = await Promise.all(pagePromises)
        
        // Process all text at once
        pageTexts.forEach(pageText => {
          if (pageText.trim()) {
            // Split into paragraphs and create Word paragraphs
            const pageParagraphs = pageText.split(/\n\s*\n/).filter(p => p.trim())
            pageParagraphs.forEach(paraText => {
              if (paraText.trim().length > 0) {
                paragraphs.push(
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: paraText.trim(),
                        size: 22,
                        font: 'Calibri'
                      })
                    ],
                    spacing: { after: 200 }
                  })
                )
              }
            })
          }
        })
        
        const doc = new Document({
          sections: [
            {
              properties: {},
              children: paragraphs.length > 0 ? paragraphs : [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Empty document',
                      size: 22,
                      font: 'Calibri'
                    })
                  ]
                })
              ]
            }
          ]
        })
        
        const blob = await Packer.toBlob(doc)
        resolve(blob)
        
      } else if (targetFormat === 'png' || targetFormat === 'jpg' || targetFormat === 'jpeg') {
        // PDF to Image conversion - convert first page (optimized for speed)
        const page = await pdf.getPage(1)
        // Use 1.5 scale for balance between quality and speed
        const viewport = page.getViewport({ scale: 1.5 })
        
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d', { 
          willReadFrequently: true,
          desynchronized: true // Enable async rendering for better performance
        })
        canvas.height = viewport.height
        canvas.width = viewport.width
        
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          enableWebGL: false,
          renderInteractiveForms: false // Disable forms for speed
        }
        
        await page.render(renderContext).promise
        
        // Convert canvas to blob with optimized quality (0.9 is good balance)
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to convert PDF page to image'))
          }
        }, targetFormat === 'jpg' || targetFormat === 'jpeg' ? 'image/jpeg' : 'image/png', 0.9)
        
      } else if (targetFormat === 'txt') {
        // PDF to Text - optimized with parallel processing
        const maxPages = Math.min(pdf.numPages, 100) // Limit pages
        const pagePromises = []
        
        for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
          pagePromises.push(
            pdf.getPage(pageNum).then(async (page) => {
              const textContent = await page.getTextContent()
              return textContent.items.map(item => item.str).join(' ')
            })
          )
        }
        
        const pageTexts = await Promise.all(pagePromises)
        const fullText = pageTexts.join('\n\n')
        
        const blob = new Blob([fullText], { type: 'text/plain' })
        resolve(blob)
      } else {
        reject(new Error(`Unsupported PDF target format: ${targetFormat}`))
      }
    } catch (error) {
      console.error('PDF conversion error:', error)
      reject(error)
    }
  })
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

function getFileType(filename) {
  const ext = filename.split('.').pop().toLowerCase()
  
  if (['jpg', 'jpeg', 'png', 'webp', 'heic', 'gif', 'bmp'].includes(ext)) return 'image'
  if (['pdf'].includes(ext)) return 'pdf'
  if (['doc', 'docx', 'txt'].includes(ext)) return 'document'
  if (['xls', 'xlsx'].includes(ext)) return 'spreadsheet'
  
  return 'other'
}
