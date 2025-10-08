import OpenAI from 'openai'
import { HfInference } from '@huggingface/inference'
import dotenv from 'dotenv'

dotenv.config()

// Initialize OpenAI (preferred for production)
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

// Initialize Hugging Face (free alternative)
const hf = process.env.HUGGINGFACE_API_KEY
  ? new HfInference(process.env.HUGGINGFACE_API_KEY)
  : null

export async function generateDocument(prompt, type = 'document') {
  try {
    if (openai) {
      // Use OpenAI GPT-4 for best quality
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional document generator. Create high-quality, well-formatted documents based on user requests."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })

      return {
        content: completion.choices[0].message.content,
        provider: 'openai'
      }
    } else if (hf) {
      // Use Hugging Face as fallback
      const result = await hf.textGeneration({
        model: 'mistralai/Mistral-7B-Instruct-v0.1',
        inputs: prompt,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7
        }
      })

      return {
        content: result.generated_text,
        provider: 'huggingface'
      }
    } else {
      throw new Error('No AI service configured. Please add OPENAI_API_KEY or HUGGINGFACE_API_KEY to .env')
    }
  } catch (error) {
    console.error('AI Generation error:', error)
    throw error
  }
}

export async function generateImage(prompt) {
  try {
    if (openai) {
      // Use DALL-E for image generation
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024"
      })

      return {
        url: response.data[0].url,
        provider: 'openai'
      }
    } else {
      throw new Error('OpenAI API key required for image generation')
    }
  } catch (error) {
    console.error('Image generation error:', error)
    throw error
  }
}

export async function summarizeText(text, maxLength = 150) {
  try {
    if (openai) {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional summarizer. Create concise, accurate summaries."
          },
          {
            role: "user",
            content: `Summarize the following text in ${maxLength} words or less:\n\n${text}`
          }
        ],
        temperature: 0.5,
        max_tokens: maxLength * 2
      })

      return completion.choices[0].message.content
    } else if (hf) {
      const result = await hf.summarization({
        model: 'facebook/bart-large-cnn',
        inputs: text,
        parameters: {
          max_length: maxLength,
          min_length: 40
        }
      })

      return result.summary_text
    } else {
      // Simple fallback
      return text.slice(0, maxLength * 5) + '...'
    }
  } catch (error) {
    console.error('Summarization error:', error)
    return text.slice(0, maxLength * 5) + '...'
  }
}

