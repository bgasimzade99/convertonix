import { useState, useEffect, useCallback } from 'react'
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
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Features from './pages/Features'
import Pricing from './pages/Pricing'
import About from './pages/About'

function AppContent() {
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [convertedFile, setConvertedFile] = useState(null)
  const [isConverting, setIsConverting] = useState(false)
  const [usageCount, setUsageCount] = useState(0)
  const [showPricing, setShowPricing] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showAIChat, setShowAIChat] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [conversionHistory, setConversionHistory] = useState([])
  const [batchMode, setBatchMode] = useState(false)

  const { user, isPremium, canConvert, trackConversion } = useAuth()
  
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
      // Ctrl/Cmd + H - History
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault()
        setShowHistory(!showHistory)
      }
      // Ctrl/Cmd + D - Dark mode
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault()
        setDarkMode(!darkMode)
      }
      // Ctrl/Cmd + G - AI Generate
      if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault()
        setShowAIChat(!showAIChat)
      }
      // Escape - Close modals
      if (e.key === 'Escape') {
        setShowPricing(false)
        setShowHistory(false)
        setShowAdvanced(false)
        setShowAIChat(false)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [darkMode, showHistory])

  const handleFileUpload = useCallback((files) => {
    if (batchMode) {
      setUploadedFiles(files)
    } else {
      setUploadedFiles([files[0]])
    }
    setConvertedFile(null)
  }, [batchMode])

  const handleConvert = async (targetFormat, options = {}) => {
    if (!isPremium && usageCount >= 2) {
      setShowPricing(true)
      return
    }

    setIsConverting(true)
    setSelectedFormat(targetFormat)

    try {
      const { convertFile } = await import('./utils/converter')
      
      const results = []
      for (const file of uploadedFiles) {
        const result = await convertFile(file, targetFormat, {
          ...options,
          aiFeatures
        })
        results.push({
          ...result,
          originalName: file.name
        })
      }

      const finalResult = results.length === 1 ? results[0] : {
        blob: results[0].blob,
        filename: results[0].filename,
        aiResults: results[0].aiResults,
        batch: results
      }

      setConvertedFile(finalResult)

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

      // Update usage
      if (!isPremium) {
        const newCount = usageCount + 1
        setUsageCount(newCount)
        const today = new Date().toDateString()
        localStorage.setItem('converterUsage', JSON.stringify({ date: today, count: newCount }))
      }
    } catch (error) {
      console.error('Conversion error:', error)
      alert('Conversion failed: ' + error.message)
    } finally {
      setIsConverting(false)
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
        setShowAIChat(true)
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
          count={usageCount} 
          isPremium={isPremium}
          onUpgradeClick={() => setShowPricing(true)}
          user={user}
        />

        <QuickActions 
          onAction={handleQuickAction}
          onToggleBatch={() => setBatchMode(!batchMode)}
          batchMode={batchMode}
          onShowAdvanced={() => setShowAdvanced(true)}
          onShowAIChat={() => setShowAIChat(true)}
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
            if (plan === 'premium') {
              setIsPremium(true)
              localStorage.setItem('isPremium', 'true')
            }
            setShowPricing(false)
          }}
        />
      )}

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

      {showAdvanced && (
        <AdvancedSettings
          onClose={() => setShowAdvanced(false)}
          settings={{}}
          onSave={() => setShowAdvanced(false)}
        />
      )}

      {showAIChat && (
        <AIChat
          onClose={() => setShowAIChat(false)}
          onGenerateFile={handleGenerateFile}
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
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#privacy">Privacy</a>
            <a href="#support">Support</a>
            <a href="#api">API</a>
            <a href="#blog">Blog</a>
          </div>
          <p className="footer-copy">© 2025 Convertonix.com • Made by BGDev ⚡</p>
        </div>
      </footer>
      
      {/* Keyboard shortcuts helper - Desktop only */}
      {window.innerWidth >= 768 && (
        <div className="shortcuts-hint">
          <kbd>G</kbd> AI • <kbd>U</kbd> Upload • <kbd>H</kbd> History • <kbd>D</kbd> Dark
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
      />
    </div>
  )
}

function HomePage() {
  return <AppContent />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
