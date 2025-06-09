// Auto-generated cache version - DO NOT EDIT MANUALLY
const CACHE_VERSION = 'v1749447932803';
const CACHE_NAME = `liftoff-cache-${CACHE_VERSION}`;

// Core files to cache
const URLS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon_512.png',
  '/rocket_big.png',
];

// Install event - cache core files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing with version:', CACHE_VERSION);
  // Skip waiting to activate immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching core files...');
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch((error) => {
        console.error('Failed to cache core files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating with version:', CACHE_VERSION);
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('liftoff-cache-') && name !== CACHE_NAME)
          .map((name) => {
            console.log('Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    }).then(async () => {
      console.log('Service Worker activated and claiming clients');
      const allClients = await self.clients.matchAll({ type: 'window' });
      for (const client of allClients) {
        client.postMessage({ type: 'RELOAD_APP' });
      }
    })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip caching for API routes and external requests
  if (event.request.url.includes('/api/') || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // For HTML pages, always try network first to get fresh content
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                // Cache the fresh response
                caches.open(CACHE_NAME)
                  .then((cache) => cache.put(event.request, networkResponse.clone()));
                return networkResponse;
              }
              return cachedResponse || networkResponse;
            })
            .catch(() => {
              // If network fails, serve from cache
              return cachedResponse || new Response('Offline', { status: 503 });
            });
        }

        // For other resources, serve from cache first, update in background
        if (cachedResponse) {
          // Background fetch to update cache
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME)
                  .then((cache) => cache.put(event.request, networkResponse.clone()));
              }
            })
            .catch(() => {
              // Silent fail for background updates
            });
          
          return cachedResponse;
        }

        // If not in cache, fetch from network
        return fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              // Cache the response
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(event.request, networkResponse.clone()));
            }
            return networkResponse;
          });
      })
  );
});

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CHECK_UPDATE') {
    self.registration.update();
  }
});