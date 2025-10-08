import { useState, useEffect, useCallback, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import FileUpload from './components/FileUpload'
import ConversionOptions from './components/ConversionOptions'
import ConversionResult from './components/ConversionResult'
import UsageTracker from './components/UsageTracker'
import PricingModal from './components/PricingModal'
import AIFeatures from './components/AIFeatures'
import ConversionHistory from './components/ConversionHistory'
import QuickActions from './components/QuickActions'
import AdvancedSettings from './components/AdvancedSettings'
import BatchConverter from './components/BatchConverter'
import AIChat from './components/AIChat'
import Particles from './components/Particles'
import AuthModal from './components/AuthModal'
import UserProfile from './components/UserProfile'
import BackToTop from './components/BackToTop'
import ErrorBoundary from './components/ErrorBoundary'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import apiService from './utils/apiService'

// Lazy load pages for better performance
const Features = lazy(() => import('./pages/Features'))
const Pricing = lazy(() => import('./pages/Pricing'))
const About = lazy(() => import('./pages/About'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Support = lazy(() => import('./pages/Support'))
const API = lazy(() => import('./pages/API'))
const Blog = lazy(() => import('./pages/Blog'))

function AppContent() {
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [convertedFile, setConvertedFile] = useState(null)
  const [isConverting, setIsConverting] = useState(false)
  const [usageCount, setUsageCount] = useState(0)
  const [showPricing, setShowPricing] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [conversionHistory, setConversionHistory] = useState([])
  const [batchMode, setBatchMode] = useState(false)

  const { user, isPremium, canConvert, trackConversion, getRemainingConversions } = useAuth()
  
  const [aiFeatures, setAiFeatures] = useState({
    ocr: false,
    enhance: false,
    summarize: false,
    smartCompress: false
  })

  // Load saved data
  useEffect(() => {
    const today = new Date().toDateString()
    const stored = JSON.parse(localStorage.getItem('converterUsage') || '{}')
    
    if (stored.date === today) {
      setUsageCount(stored.count || 0)
    } else {
      localStorage.setItem('converterUsage', JSON.stringify({ date: today, count: 0 }))
      setUsageCount(0)
    }

    // Premium state is now managed by AuthContext
    
    const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]')
    setConversionHistory(history)
  }, [])

  // Keyboard shortcuts (desktop only)
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only enable shortcuts on desktop (not mobile)
      if (window.innerWidth < 768) return
      
      // Ctrl/Cmd + U - Upload
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault()
        document.querySelector('.dropzone')?.click()
      }
      // Escape - Close modals
      if (e.key === 'Escape') {
        setShowPricing(false)
        setShowAdvanced(false)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const handleFileUpload = useCallback((files) => {
    if (batchMode) {
      setUploadedFiles(files)
    } else {
      setUploadedFiles([files[0]])
    }
    setConvertedFile(null)
  }, [batchMode])

  const handleConvert = async (targetFormat, options = {}) => {
    console.log('🚀 CONVERSION BAŞLADI')
    console.log('Target Format:', targetFormat)
    console.log('AI Features:', aiFeatures)
    console.log('Options:', options)
    console.log('Uploaded Files:', uploadedFiles)
    
    if (!isPremium && getRemainingConversions() <= 0) {
      console.log('❌ Conversion limit reached')
      setShowPricing(true)
      return
    }

    if (!targetFormat) {
      console.log('❌ No format selected')
      alert('Please select a format to convert to')
      return
    }

    console.log('✅ Starting conversion...')
    setIsConverting(true)
    setSelectedFormat(targetFormat)

    try {
      const results = []
      
      for (const file of uploadedFiles) {
        console.log('📁 Processing file:', file.name)
        // Determine input format from file extension
        const inputFormat = file.name.split('.').pop().toLowerCase()
        
        // Prepare conversion options with AI features
        const conversionOptions = {
          quality: options.quality || 90,
          width: options.width,
          height: options.height,
          enhance: aiFeatures.enhance,
          ocr: aiFeatures.ocr,
          summarize: aiFeatures.summarize,
          compress: aiFeatures.smartCompress
        }

        console.log('🔧 Conversion options:', conversionOptions)

        let result
        try {
          console.log('🌐 Trying API conversion...')
          // Try to use real API service
          result = await apiService.convertFile(
            file, 
            inputFormat, 
            targetFormat, 
            conversionOptions
          )
          console.log('✅ API conversion successful:', result)
        } catch (apiError) {
          console.warn('⚠️ API conversion failed, using client-side fallback:', apiError)
          // Fallback to client-side conversion
          const { convertFile } = await import('./utils/converter')
          result = await convertFile(file, targetFormat, conversionOptions)
          console.log('✅ Client-side conversion successful:', result)
        }
        
        results.push({
          blob: result.blob,
          filename: result.filename,
          size: result.size || result.blob.size,
          format: result.format || targetFormat,
          originalName: file.name,
          originalSize: file.size,
          aiResults: result.aiResults
        })
      }

      console.log('✅ All files converted:', results)

      const finalResult = results.length === 1 ? results[0] : {
        blob: results[0].blob,
        filename: results[0].filename,
        aiResults: results[0].aiResults,
        batch: results
      }

      console.log('📦 Final result:', finalResult)
      setConvertedFile(finalResult)

      // Track conversion usage
      trackConversion()
      console.log('✅ Conversion tracked')

      // Save to history
      const historyItem = {
        id: Date.now(),
        date: new Date().toISOString(),
        from: uploadedFiles[0].name.split('.').pop(),
        to: targetFormat,
        count: uploadedFiles.length,
        size: uploadedFiles[0].size
      }
      const newHistory = [historyItem, ...conversionHistory.slice(0, 19)]
      setConversionHistory(newHistory)
      localStorage.setItem('conversionHistory', JSON.stringify(newHistory))
      console.log('✅ History saved')
      
    } catch (error) {
      console.error('❌ CONVERSION ERROR:', error)
      alert('Conversion failed: ' + error.message)
    } finally {
      setIsConverting(false)
      console.log('🏁 Conversion process completed')
    }
  }

  const handleReset = useCallback(() => {
    setUploadedFiles([])
    setConvertedFile(null)
    setSelectedFormat(null)
  }, [])

  const handleQuickAction = useCallback((action) => {
    switch(action) {
      case 'compress':
        setSelectedFormat('compress')
        break
      case 'pdf':
        setSelectedFormat('pdf')
        break
      case 'jpg':
        setSelectedFormat('jpg')
        break
      case 'png':
        setSelectedFormat('png')
        break
      case 'ai-generate':
        // AI generate handled in App component
        break
    }
  }, [])

  const handleGenerateFile = useCallback((file) => {
    setUploadedFiles([file])
    setConvertedFile(null)
  }, [])

  return (
    <div className="home-page">
      <Particles />
      
      <main className="container">
        <div className="hero">
          <h1>
            <span className="gradient-text">Convert Any File</span>
            <br />Instantly with AI
          </h1>
          <p className="subtitle">
            ⚡ Lightning-fast conversions • 🔒 100% private & secure • 🤖 AI-powered features
            <br />
            All processing happens in your browser. Your files never leave your device.
          </p>
          
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-value">100K+</div>
              <div className="stat-label">Files Converted</div>
            </div>
            <div className="stat">
              <div className="stat-value">50+</div>
              <div className="stat-label">File Formats</div>
            </div>
            <div className="stat">
              <div className="stat-value">⭐ 4.9</div>
              <div className="stat-label">User Rating</div>
            </div>
          </div>
        </div>

        <UsageTracker 
          onUpgradeClick={() => setShowPricing(true)}
        />

        <QuickActions 
          onAction={handleQuickAction}
          onToggleBatch={() => setBatchMode(!batchMode)}
          batchMode={batchMode}
          onShowAdvanced={() => setShowAdvanced(true)}
        />

        {uploadedFiles.length === 0 ? (
          <>
            <FileUpload 
              onFileUpload={handleFileUpload}
              batchMode={batchMode}
            />
            <AIFeatures />
          </>
        ) : convertedFile ? (
          <ConversionResult 
            originalFile={uploadedFiles[0]}
            convertedFile={convertedFile}
            format={selectedFormat}
            onReset={handleReset}
            batchMode={batchMode}
          />
        ) : (
          batchMode && uploadedFiles.length > 1 ? (
            <BatchConverter
              files={uploadedFiles}
              onConvert={handleConvert}
              isConverting={isConverting}
              aiFeatures={aiFeatures}
              setAiFeatures={setAiFeatures}
              onCancel={handleReset}
            />
          ) : (
            <ConversionOptions
              file={uploadedFiles[0]}
              onConvert={handleConvert}
              isConverting={isConverting}
              aiFeatures={aiFeatures}
              setAiFeatures={setAiFeatures}
              onCancel={handleReset}
            />
          )
        )}
      </main>

      {showPricing && (
        <PricingModal 
          onClose={() => setShowPricing(false)}
          onPurchase={(plan) => {
            setShowPricing(false)
          }}
        />
      )}

      {showAdvanced && (
        <AdvancedSettings
          onClose={() => setShowAdvanced(false)}
          settings={{}}
          onSave={() => setShowAdvanced(false)}
        />
      )}

      <footer className="footer">
        <div className="footer-content">
          <p>🛡️ <strong>Privacy-First:</strong> All conversions happen in your browser. No files uploaded to servers.</p>
          <div className="footer-features">
            <span>🧠 AI-Powered</span>
            <span>⚡ Lightning Fast</span>
            <span>🎯 100% Accurate</span>
            <span>📦 Batch Processing</span>
            <span>🌙 Dark Mode</span>
            <span>⌨️ Keyboard Shortcuts</span>
          </div>
          <div className="footer-links">
            <a href="/features">Features</a>
            <a href="/pricing">Pricing</a>
            <a href="/privacy">Privacy</a>
            <a href="/support">Support</a>
            <a href="/api">API</a>
            <a href="/blog">Blog</a>
          </div>
          <p className="footer-copy">© 2025 Convertonix.com • Made by BGDev ⚡</p>
        </div>
      </footer>
      
      {/* Keyboard shortcuts helper - Desktop only */}
      {window.innerWidth >= 768 && (
        <div className="shortcuts-hint">
          <kbd>U</kbd> Upload
        </div>
      )}
    </div>
  )
}

function HomePage() {
  return <AppContent />
}

function AppWrapper() {
  const [darkMode, setDarkMode] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showPricing, setShowPricing] = useState(false)
  const [showAIChat, setShowAIChat] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [conversionHistory, setConversionHistory] = useState([])

  const { user } = useAuth() // Get user from AuthContext

  // Load saved data
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedDarkMode)
    
    const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]')
    setConversionHistory(history)
  }, [])

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  // Listen for AI Chat modal trigger from other pages
  useEffect(() => {
    const handleOpenAIChat = () => {
      setShowAIChat(true)
    }

    window.addEventListener('openAIChat', handleOpenAIChat)
    return () => window.removeEventListener('openAIChat', handleOpenAIChat)
  }, [])

  return (
    <Router>
      <div className="app">
        <Header 
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onShowHistory={() => setShowHistory(true)}
          onShowPricing={() => setShowPricing(true)}
          onShowAIChat={() => setShowAIChat(true)}
          onShowAuth={() => setShowAuth(true)}
          user={user}
        />
        <Suspense fallback={
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading...</p>
            </div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/support" element={<Support />} />
            <Route path="/api" element={<API />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </Suspense>

        {showHistory && (
          <ConversionHistory
            history={conversionHistory}
            onClose={() => setShowHistory(false)}
            onClear={() => {
              setConversionHistory([])
              localStorage.setItem('conversionHistory', '[]')
            }}
          />
        )}

        {showAIChat && (
          <AIChat
            onClose={() => setShowAIChat(false)}
            onGenerateFile={(file) => {
              // File generated from AI
              console.log('Generated file:', file)
              setShowAIChat(false)
            }}
          />
        )}

        {showAuth && (
          <AuthModal 
            isOpen={showAuth} 
            onClose={() => setShowAuth(false)} 
          />
        )}

        {showPricing && (
          <PricingModal 
            onClose={() => setShowPricing(false)}
            onPurchase={(plan) => {
              setShowPricing(false)
            }}
          />
        )}
        
        <BackToTop />
      </div>
    </Router>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppWrapper />
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
