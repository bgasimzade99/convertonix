import express from 'express'
import { HfInference } from '@huggingface/inference'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

// Initialize Hugging Face client (optional - for advanced AI features)
const hf = process.env.HUGGINGFACE_API_KEY 
  ? new HfInference(process.env.HUGGINGFACE_API_KEY)
  : null

// AI Text Summarization endpoint
router.post('/summarize', async (req, res) => {
  try {
    const { text, maxLength = 150 } = req.body

    if (!text) {
      return res.status(400).json({ error: 'Text is required' })
    }

    // If HuggingFace API is available, use it
    if (hf) {
      try {
        const summary = await hf.summarization({
          model: 'facebook/bart-large-cnn',
          inputs: text.slice(0, 1024),
          parameters: {
            max_length: maxLength,
            min_length: 40
          }
        })

        return res.json({ 
          summary: summary.summary_text,
          method: 'ai'
        })
      } catch (error) {
        console.log('HuggingFace API error, falling back to extractive summarization')
      }
    }

    // Fallback: Simple extractive summarization
    const summary = extractiveSummarize(text, 3)
    res.json({ 
      summary,
      method: 'extractive'
    })

  } catch (error) {
    console.error('Summarization error:', error)
    res.status(500).json({ error: 'Summarization failed', message: error.message })
  }
})

// AI Text Extraction (OCR alternative)
router.post('/extract-text', async (req, res) => {
  try {
    const { imageUrl } = req.body

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' })
    }

    // This would integrate with an OCR service
    // For now, return a placeholder
    res.json({ 
      text: 'OCR processing should be done client-side with Tesseract.js for privacy',
      note: 'Use client-side OCR to maintain privacy-first approach'
    })

  } catch (error) {
    console.error('Text extraction error:', error)
    res.status(500).json({ error: 'Text extraction failed', message: error.message })
  }
})

// AI Image Analysis
router.post('/analyze-image', async (req, res) => {
  try {
    const { imageUrl } = req.body

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' })
    }

    // If HuggingFace API is available, use image classification
    if (hf) {
      try {
        const result = await hf.imageClassification({
          data: await fetch(imageUrl).then(r => r.blob()),
          model: 'microsoft/resnet-50'
        })

        return res.json({ 
          analysis: result,
          method: 'ai'
        })
      } catch (error) {
        console.log('HuggingFace image analysis error:', error)
      }
    }

    res.json({ 
      message: 'AI image analysis requires HuggingFace API key',
      note: 'Set HUGGINGFACE_API_KEY in .env file'
    })

  } catch (error) {
    console.error('Image analysis error:', error)
    res.status(500).json({ error: 'Image analysis failed', message: error.message })
  }
})

// Helper function for extractive summarization
function extractiveSummarize(text, maxSentences = 3) {
  const sentences = text
    .replace(/\n+/g, ' ')
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 20)

  if (sentences.length <= maxSentences) {
    return text
  }

  const scoredSentences = sentences.map((sentence, index) => {
    let score = 0
    
    if (index === 0) score += 3
    if (index === sentences.length - 1) score += 2
    
    const words = sentence.split(/\s+/)
    if (words.length >= 10 && words.length <= 30) score += 2
    
    const keywords = ['important', 'significant', 'key', 'main', 'essential']
    keywords.forEach(keyword => {
      if (sentence.toLowerCase().includes(keyword)) score += 2
    })
    
    return { sentence, score, originalIndex: index }
  })

  const topSentences = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSentences)
    .sort((a, b) => a.originalIndex - b.originalIndex)
    .map(item => item.sentence)

  return topSentences.join('. ') + '.'
}

export default router

