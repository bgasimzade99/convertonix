// Register Service Worker for PWA support

export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Periodically check for updates (every 5 minutes - less frequent to avoid errors)
      setInterval(() => {
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.ready.then(registration => {
            registration.update().catch(error => {
              // Silently fail if update check fails (common in dev mode)
              if (import.meta.env.PROD) {
                console.warn('Service worker update check failed:', error)
              }
            })
          })
        }
      }, 300000) // 5 minutes instead of 60 seconds

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
            try {
              if (event.data && event.data.type === 'NEW_VERSION') {
                window.location.reload()
              }
            } catch (error) {
              console.error('Error handling service worker message:', error)
            }
          })
          
          // Handle service worker controller changes
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload()
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

