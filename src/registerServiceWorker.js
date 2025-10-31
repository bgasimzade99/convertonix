// Register Service Worker for PWA support

export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Periodically check for updates (every 60 seconds)
      setInterval(() => {
        navigator.serviceWorker.ready.then(registration => {
          registration.update()
        })
      }, 60000)

      navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
          console.log('✅ ServiceWorker registered:', registration)
          
          // Check for updates on registration
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Force reload when new update is available
                window.location.reload()
              }
            })
          })

          // Listen for messages from service worker
          navigator.serviceWorker.addEventListener('message', event => {
            if (event.data && event.data.type === 'NEW_VERSION') {
              window.location.reload()
            }
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

