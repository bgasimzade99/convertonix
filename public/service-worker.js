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

// Fetch event - Stale While Revalidate for everything
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Never cache API calls, always fetch fresh
  if (url.pathname.startsWith('/api')) {
    event.respondWith(fetch(request))
    return
  }

  // For all other requests (HTML, JS, CSS, images), use stale-while-revalidate
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Always try to fetch fresh version
        const fetchPromise = fetch(request)
          .then((response) => {
            // If we got a successful response, cache it
            if (response.ok) {
              const responseClone = response.clone()
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone)
              })
            }
            return response
          })
          .catch(() => {
            // If fetch failed and we have a cache, return it
            if (cachedResponse) {
              return cachedResponse
            }
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

