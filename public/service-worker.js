const CACHE_NAME = 'convertonix-v2'
const urlsToCache = [
  '/',
  '/logo.svg',
  '/favicon.svg'
]

// Install event - skip waiting to activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache).catch(err => {
          console.log('Cache addAll error:', err)
        })
      })
  )
})

// Fetch event - Network First strategy for HTML, Cache First for assets
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Network first for HTML files
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response before caching
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone)
          })
          return response
        })
        .catch(() => {
          // Fallback to cache if offline
          return caches.match(request)
        })
    )
    return
  }

  // Network first for API calls
  if (url.pathname.startsWith('/api')) {
    event.respondWith(fetch(request))
    return
  }

  // Cache first for static assets (js, css, images)
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version but also fetch update in background
          fetch(request).then((response) => {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, response)
            })
          }).catch(() => {})
          return cachedResponse
        }
        
        // Not in cache, fetch from network
        return fetch(request).then((response) => {
          // Cache the new response
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone)
          })
          return response
        })
      })
  )
})

// Activate event - claim clients immediately and clean old caches
self.addEventListener('activate', (event) => {
  self.clients.claim()
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

