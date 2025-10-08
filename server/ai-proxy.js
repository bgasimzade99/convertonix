import fetch from 'node-fetch'

export const createAIProxy = (app) => {
  // AI ChatGLM Proxy Endpoint
  app.post('/api/chatglm', async (req, res) => {
    try {
      const { prompt, model = 'glm-4-flash', maxTokens = 2000, temperature = 0.7 } = req.body

      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' })
      }

      const CHATGLM_API_KEY = process.env.CHATGLM_API_KEY || 'c82c3e1eaa1141b69328b5829f478d3d.nxhyBNFeo2bHVbiI'
      const CHATGLM_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'

      const response = await fetch(CHATGLM_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CHATGLM_API_KEY}`
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI assistant that generates professional documents, templates, and text content based on user requests. Always provide complete, well-formatted, and professional content. Do not generate images or visual designs - only text content.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature,
          max_tokens: maxTokens
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('ChatGLM API Error:', response.status, errorText)
        return res.status(response.status).json({ 
          error: `ChatGLM API error: ${response.status}`,
          details: errorText
        })
      }

      const data = await response.json()
      const generatedText = data.choices[0].message.content

      res.json({
        success: true,
        content: generatedText,
        usage: data.usage
      })

    } catch (error) {
      console.error('Server Error:', error)
      res.status(500).json({ 
        error: 'Internal server error',
        details: error.message
      })
    }
  })

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() })
  })
}
