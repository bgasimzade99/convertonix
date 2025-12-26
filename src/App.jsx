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
import Toast from './components/Toast'
import NewYearUpgradePrompt from './components/NewYearUpgradePrompt'
import SnowEffect from './components/SnowEffect'
import HowItWorks from './components/HowItWorks'
import Footer from './components/Footer'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import apiService from './utils/apiService'
import { NEW_YEAR_CAMPAIGN, isCampaignActive } from './config/campaign'

// Lazy load pages for better performance
const Features = lazy(() => import('./pages/Features'))
const Pricing = lazy(() => import('./pages/Pricing'))
const About = lazy(() => import('./pages/About'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Terms = lazy(() => import('./pages/Terms'))
const Refund = lazy(() => import('./pages/Refund'))
const Support = lazy(() => import('./pages/Support'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))

function AppContent({ generatedFile, setGeneratedFile }) {
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [convertedFile, setConvertedFile] = useState(null)
  const [isConverting, setIsConverting] = useState(false)
  const [usageCount, setUsageCount] = useState(0)
  const [showPricing, setShowPricing] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [conversionHistory, setConversionHistory] = useState([])
  const [batchMode, setBatchMode] = useState(false)
  const [toast, setToast] = useState(null)
  const [showNewYearPrompt, setShowNewYearPrompt] = useState(false)
  const [promptReason, setPromptReason] = useState(null)
  const [showHowItWorks, setShowHowItWorks] = useState(false)
  const [showCampaign, setShowCampaign] = useState(false)

  const { user, isPremium, canConvert, trackConversion, getRemainingConversions } = useAuth()

  // Handle generated file from AI Chat
  useEffect(() => {
    if (generatedFile) {
      setUploadedFiles([generatedFile])
      setConvertedFile(null)
      setGeneratedFile(null)
    }
  }, [generatedFile, setGeneratedFile])

  useEffect(() => {
    setShowCampaign(isCampaignActive(NEW_YEAR_CAMPAIGN))
  }, [])
  
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
    
    // Scroll to conversion section after a short delay to ensure DOM is updated
    setTimeout(() => {
      const conversionSection = document.getElementById('conversion-section')
      if (conversionSection) {
        const headerOffset = 80
        const elementPosition = conversionSection.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }, 150)
  }, [batchMode])

  const handleConvert = async (targetFormat, options = {}) => {
    console.log('🚀 CONVERSION BAŞLADI')
    console.log('Target Format:', targetFormat)
    console.log('AI Features:', aiFeatures)
    console.log('Options:', options)
    console.log('Uploaded Files:', uploadedFiles)
    
    // Define fallback function if not available from context
    const getRemainingConversionsLocal = () => {
      if (typeof getRemainingConversions === 'function') {
        return getRemainingConversions()
      }
      // Fallback: check localStorage or return default
      const stored = localStorage.getItem('remainingConversions')
      return stored ? parseInt(stored, 10) : 5
    }
    
    // Check conversion limit for non-premium users
    if (!isPremium) {
      const remaining = getRemainingConversionsLocal()
      console.log('Remaining conversions:', remaining)
      if (remaining !== undefined && remaining !== null && remaining <= 0) {
        console.log('❌ Conversion limit reached')
        // Show New Year campaign prompt if active, otherwise show pricing modal
        if (isCampaignActive(NEW_YEAR_CAMPAIGN)) {
          setPromptReason('limit')
          setShowNewYearPrompt(true)
        } else {
          setShowPricing(true)
        }
        return
      }
    }

    if (!targetFormat) {
      console.log('❌ No format selected')
      setToast({ message: 'Please select a format to convert to', type: 'warning' })
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
      setToast({ message: `Conversion failed: ${error.message}`, type: 'error' })
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
    setGeneratedFile(null) // Clear the generated file state
  }, [])

  return (
    <div className="home-page">
      <Particles />
      {showCampaign && <SnowEffect />}
      
      <main className="container">
        <div className="hero">
          <div className="hero-badge">
            <span className="badge-text">✨ Free • Secure • AI-Powered</span>
          </div>
          
          <h1>
            <span className="gradient-text">Convert any file</span>
            <br />
            <span className="hero-subheading">instantly</span>
          </h1>

          <div className="hero-ice-strip">
            <div className="ice-glow"></div>
            <span className="ice-text">❄ Frost-fast conversions • Glacier-grade uptime</span>
          </div>
          
          <p className="hero-description">
            Free. Fast. Private. AI-powered conversion for 100+ formats.
            <br />
            <span className="hero-trust">No signup required • Files auto-deleted • 100% browser-based</span>
          </p>
          
          <div className="hero-cta">
            <button 
              className="btn-hero-primary"
              onClick={() => document.querySelector('.dropzone')?.click()}
            >
              Convert Now
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button 
              className="btn-hero-secondary"
              onClick={(e) => {
                e.preventDefault()
                console.log('How it works button clicked')
                setShowHowItWorks(true)
              }}
            >
              How it works
            </button>
          </div>
          
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-value">100K+</div>
              <div className="stat-label">Files Converted</div>
            </div>
            <div className="stat">
              <div className="stat-value">100+</div>
              <div className="stat-label">Formats</div>
            </div>
            <div className="stat">
              <div className="stat-value">4.9</div>
              <div className="stat-label">Rating</div>
            </div>
            <div className="stat">
              <div className="stat-value">0s</div>
              <div className="stat-label">Upload Time</div>
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
            
            {/* Rich Content Sections for AdSense */}
            <section className="homepage-content-sections">
              <div className="content-section">
                <h2 className="section-title">Why Choose Convertonix?</h2>
                <div className="features-grid-home">
                  <div className="feature-card-home">
                    <div className="feature-icon-home">🛡️</div>
                    <h3>Privacy-First Design</h3>
                    <p>
                      All file conversions happen directly in your browser. Your files never leave your device, 
                      ensuring complete privacy and security. No uploads, no storage, no tracking - just pure conversion.
                    </p>
                  </div>
                  <div className="feature-card-home">
                    <div className="feature-icon-home">🧠</div>
                    <h3>AI-Powered Technology</h3>
                    <p>
                      Our advanced AI algorithms ensure accurate conversions with preserved formatting, images, 
                      and diagrams. Experience intelligent document processing like never before.
                    </p>
                  </div>
                  <div className="feature-card-home">
                    <div className="feature-icon-home">⚡</div>
                    <h3>Lightning Fast</h3>
                    <p>
                      Convert files instantly with optimized processing algorithms. No waiting, no queues - 
                      just drag, drop, and download your converted files in seconds.
                    </p>
                  </div>
                  <div className="feature-card-home">
                    <div className="feature-icon-home">📦</div>
                    <h3>Batch Processing</h3>
                    <p>
                      Convert multiple files at once with our batch processing feature. Save time and effort 
                      by processing entire folders in a single operation.
                    </p>
                  </div>
                  <div className="feature-card-home">
                    <div className="feature-icon-home">🌍</div>
                    <h3>100+ Formats Supported</h3>
                    <p>
                      From PDF to Word, images to videos, documents to archives - we support over 100 file formats. 
                      Whatever you need to convert, Convertonix has you covered.
                    </p>
                  </div>
                  <div className="feature-card-home">
                    <div className="feature-icon-home">🆓</div>
                    <h3>100% Free</h3>
                    <p>
                      No hidden costs, no premium walls. All core features are completely free. 
                      Convert unlimited files without registration or credit card requirements.
                    </p>
                  </div>
                </div>
              </div>

              <div className="content-section">
                <h2 className="section-title">How Convertonix Works</h2>
                <div className="how-it-works-steps">
                  <div className="step-item">
                    <div className="step-number">1</div>
                    <h3>Upload Your File</h3>
                    <p>
                      Simply drag and drop your file onto the upload area, or click to browse. 
                      Supports files up to 100MB with no registration required.
                    </p>
                  </div>
                  <div className="step-item">
                    <div className="step-number">2</div>
                    <h3>Select Output Format</h3>
                    <p>
                      Choose from 100+ supported formats including PDF, Word, Excel, PowerPoint, 
                      images, videos, and audio files.
                    </p>
                  </div>
                  <div className="step-item">
                    <div className="step-number">3</div>
                    <h3>AI Processing</h3>
                    <p>
                      Our AI-powered engine processes your file locally in your browser. 
                      Advanced algorithms preserve formatting, images, tables, and diagrams.
                    </p>
                  </div>
                  <div className="step-item">
                    <div className="step-number">4</div>
                    <h3>Download Result</h3>
                    <p>
                      Get your converted file instantly. All processing happens in real-time, 
                      and your original file remains untouched on your device.
                    </p>
                  </div>
                </div>
              </div>

              <div className="content-section">
                <h2 className="section-title">Popular Conversion Types</h2>
                <div className="conversion-types">
                  <div className="conversion-type-item">
                    <h3>PDF Conversions</h3>
                    <p>
                      Convert PDF to Word (DOCX), Excel (XLSX), PowerPoint (PPTX), images (JPG, PNG), 
                      or extract text to plain text files. Preserve formatting, images, and layouts perfectly.
                    </p>
                    <ul>
                      <li>PDF to Word - Maintains formatting and structure</li>
                      <li>PDF to Images - Extract pages as high-quality images</li>
                      <li>PDF to Excel - Convert tables and data accurately</li>
                      <li>PDF to PowerPoint - Transform presentations seamlessly</li>
                    </ul>
                  </div>
                  <div className="conversion-type-item">
                    <h3>Document Conversions</h3>
                    <p>
                      Convert between Word (DOCX, DOC), Excel (XLSX, XLS), PowerPoint (PPTX, PPT), 
                      and other document formats while preserving all content, formatting, and metadata.
                    </p>
                    <ul>
                      <li>Word to PDF - Create professional PDFs instantly</li>
                      <li>Excel to CSV - Export spreadsheet data easily</li>
                      <li>PowerPoint to PDF - Convert presentations to PDF</li>
                      <li>Document to HTML - Publish documents online</li>
                    </ul>
                  </div>
                  <div className="conversion-type-item">
                    <h3>Image Conversions</h3>
                    <p>
                      Convert between JPG, PNG, GIF, WEBP, HEIC, SVG, BMP, TIFF and more. 
                      Adjust quality, resize dimensions, and optimize file sizes as needed.
                    </p>
                    <ul>
                      <li>JPG to PNG - Convert with transparency support</li>
                      <li>HEIC to JPG - Convert iPhone photos easily</li>
                      <li>Image to PDF - Combine images into PDF documents</li>
                      <li>Format optimization - Reduce file sizes without quality loss</li>
                    </ul>
                  </div>
                  <div className="conversion-type-item">
                    <h3>Media Conversions</h3>
                    <p>
                      Convert video and audio files between formats. Extract audio from videos, 
                      compress files, and optimize quality for your needs.
                    </p>
                    <ul>
                      <li>Video format conversion - MP4, AVI, MOV, WebM, MKV</li>
                      <li>Audio format conversion - MP3, WAV, AAC, FLAC, OGG</li>
                      <li>Audio extraction from videos</li>
                      <li>Quality optimization and compression</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="content-section">
                <h2 className="section-title">About Convertonix</h2>
                <div className="about-content">
                  <p>
                    Convertonix is a cutting-edge file conversion platform developed by BGDev, a digital craft studio 
                    focused on creating modern, minimal, and powerful web solutions. Built with privacy-first principles, 
                    Convertonix processes all files locally in your browser, ensuring your data never leaves your device.
                  </p>
                  <p>
                    Our mission is to make file conversion simple, fast, and accessible to everyone. Whether you're a 
                    student converting documents, a designer optimizing images, or a professional managing files, 
                    Convertonix provides the tools you need without compromising on privacy or quality.
                  </p>
                  <p>
                    With support for over 100 file formats, AI-powered processing, and batch conversion capabilities, 
                    Convertonix is the go-to solution for millions of users worldwide. All conversions are performed 
                    using advanced algorithms that preserve formatting, maintain quality, and deliver results instantly.
                  </p>
                </div>
              </div>
            </section>
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
            <div className="batch-converter-section" id="conversion-section">
              <BatchConverter
                files={uploadedFiles}
                onConvert={handleConvert}
                isConverting={isConverting}
                aiFeatures={aiFeatures}
                setAiFeatures={setAiFeatures}
                onCancel={handleReset}
              />
            </div>
          ) : (
            <div className="conversion-options-section" id="conversion-section">
              <ConversionOptions
                file={uploadedFiles[0]}
                onConvert={handleConvert}
                isConverting={isConverting}
                aiFeatures={aiFeatures}
                setAiFeatures={setAiFeatures}
                onCancel={handleReset}
              />
            </div>
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

      <Footer />
      
      {/* Keyboard shortcuts helper - Desktop only */}
      {window.innerWidth >= 768 && (
        <div className="shortcuts-hint">
          <kbd>U</kbd> Upload
        </div>
      )}

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* How It Works Modal */}
      {showHowItWorks && (
        <HowItWorks onClose={() => setShowHowItWorks(false)} />
      )}
    </div>
  )
}

function HomePage({ generatedFile, setGeneratedFile }) {
  return <AppContent generatedFile={generatedFile} setGeneratedFile={setGeneratedFile} />
}

function AppWrapper() {
  const [darkMode, setDarkMode] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showPricing, setShowPricing] = useState(false)
  const [showAIChat, setShowAIChat] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [conversionHistory, setConversionHistory] = useState([])
  const [generatedFile, setGeneratedFile] = useState(null)

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
            <Route path="/" element={<HomePage generatedFile={generatedFile} setGeneratedFile={setGeneratedFile} />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/refund" element={<Refund />} />
            <Route path="/support" element={<Support />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
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
              // File generated from AI - pass to AppContent
              console.log('Generated file:', file)
              setGeneratedFile(file)
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
