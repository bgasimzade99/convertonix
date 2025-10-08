// Register Service Worker for PWA support

export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
          console.log('✅ ServiceWorker registered:', registration)
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New update available
                if (confirm('New version available! Reload to update?')) {
                  window.location.reload()
                }
              }
            })
          })
        })
        .catch(error => {
          console.error('ServiceWorker registration failed:', error)
        })
    })
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister()
      })
      .catch(error => {
        console.error(error.message)
      })
  }
}

