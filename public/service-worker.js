const CACHE_NAME = 'convertonix-v3'
const STATIC_ASSETS = [
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
        return cache.addAll(STATIC_ASSETS).catch(err => {
          console.log('Cache addAll error:', err)
        })
      })
  )
})

// Helper function to check if request can be cached
function canCacheRequest(request) {
  const url = new URL(request.url)
  
  // Only cache GET requests
  if (request.method !== 'GET') {
    return false
  }
  
  // Don't cache non-HTTP(S) schemes (chrome-extension://, data:, blob:, etc.)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return false
  }
  
  // Don't cache API calls
  if (url.pathname.startsWith('/api')) {
    return false
  }
  
  return true
}

// Fetch event - Stale While Revalidate for everything
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Never cache API calls, always fetch fresh
  if (url.pathname.startsWith('/api')) {
    event.respondWith(fetch(request))
    return
  }

  // Check if this request can be cached
  if (!canCacheRequest(request)) {
    // Just fetch without caching for unsupported requests
    event.respondWith(fetch(request).catch(() => {
      // Return a simple error response if fetch fails
      return new Response('Network error', { status: 408 })
    }))
    return
  }

  // For cacheable requests (HTML, JS, CSS, images), use stale-while-revalidate
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Always try to fetch fresh version
        const fetchPromise = fetch(request)
          .then((response) => {
            // If we got a successful response and request is cacheable, cache it
            if (response.ok && canCacheRequest(request)) {
              const responseClone = response.clone()
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone).catch((error) => {
                  // Silently fail if cache.put fails (e.g., for unsupported request types)
                  console.warn('Cache put failed (non-critical):', error.message)
                })
              })
            }
            return response
          })
          .catch(() => {
            // If fetch failed and we have a cache, return it
            if (cachedResponse) {
              return cachedResponse
            }
            // Return error response if no cache available
            return new Response('Network error', { status: 408 })
          })

        // Return cached version immediately if available, otherwise wait for fetch
        return cachedResponse || fetchPromise
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

