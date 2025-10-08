import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { register as registerServiceWorker } from './registerServiceWorker'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Register PWA Service Worker
if (import.meta.env.PROD) {
  registerServiceWorker()
}

// PWA Install Prompt
let deferredPrompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredPrompt = e
  
  // Show install button/banner
  const installBanner = document.createElement('div')
  installBanner.innerHTML = `
    <div style="position: fixed; bottom: 20px; right: 20px; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 1rem 2rem; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 9999; display: flex; gap: 1rem; align-items: center; border: 2px solid rgba(255,255,255,0.2); backdrop-filter: blur(20px);">
      <span>⚡ Install Convertonix for offline access!</span>
      <button id="install-btn" style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 12px rgba(251,191,36,0.4);">Install</button>
      <button id="close-btn" style="background: transparent; color: white; border: 2px solid white; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 700; cursor: pointer;">Later</button>
    </div>
  `
  document.body.appendChild(installBanner)
  
  document.getElementById('install-btn').addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response: ${outcome}`)
      deferredPrompt = null
      installBanner.remove()
    }
  })
  
  document.getElementById('close-btn').addEventListener('click', () => {
    installBanner.remove()
  })
})

