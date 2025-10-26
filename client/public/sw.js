// Service Worker for caching optimization with build-time cache versioning
// Cache version is fetched from version.json which is generated at build time
let CACHE_VERSION = 'loading';
let CACHE_NAME = 'lynk-health-loading';

// Fetch the build version
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    fetch('/version.json')
      .then(response => response.json())
      .then(data => {
        CACHE_VERSION = data.buildTimestamp;
        CACHE_NAME = `lynk-health-v${CACHE_VERSION}`;
        console.log('[Service Worker] Cache version:', CACHE_VERSION);
        
        // Cache critical static assets
        const STATIC_CACHE = [
          '/manifest.json',
          '/version.json',
          // Critical hero images
          '/images/AdobeStock_616281927_1751485954823.jpeg',
          '/images/AdobeStock_419808796_1751485954770.jpeg',
          // Frequently used images
          '/images/elderly-patient-care.jpeg',
          '/images/elderly-monitoring.jpeg',
          '/images/elderly-behavioral-health.jpeg',
          '/images/AdobeStock_133178564_1751485954798.jpeg',
          '/images/AdobeStock_400007631_1751485954795.jpeg',
          '/images/AdobeStock_279901729_1751485954797.jpeg',
          '/images/AdobeStock_226055713_1751485954796.jpeg',
          '/images/AdobeStock_429992249_1751485954795.jpeg',
          '/images/LOGO-Lynk_Health_1749182161866.png',
          '/images/image_1756413884888.png'
        ];
        
        return caches.open(CACHE_NAME).then((cache) => {
          return cache.addAll(STATIC_CACHE);
        }).catch((err) => {
          console.warn('[Service Worker] Cache failed:', err);
        });
      })
      .catch(err => {
        console.warn('[Service Worker] Failed to fetch version:', err);
        // Use timestamp as fallback
        CACHE_VERSION = Date.now();
        CACHE_NAME = `lynk-health-v${CACHE_VERSION}`;
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating version:', CACHE_VERSION);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName.startsWith('lynk-health-')) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - use network-first for HTML/JS/CSS, cache-first for images
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  // Skip chrome extensions and non-http(s) requests
  if (!url.protocol.startsWith('http')) return;
  
  // Determine caching strategy based on resource type
  const isImage = /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(url.pathname);
  const isHTML = url.pathname === '/' || /\.html$/i.test(url.pathname);
  const isAPI = url.pathname.startsWith('/api');
  const isVersion = url.pathname === '/version.json';
  
  if (isAPI || isVersion) {
    // Never cache API requests or version file
    event.respondWith(fetch(event.request));
    return;
  }
  
  if (isImage) {
    // Cache-first for images (they change rarely)
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request).then((response) => {
            // Cache the fetched image for future use
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return response;
          });
        })
        .catch(() => fetch(event.request))
    );
  } else {
    // Network-first for HTML, JS, CSS (ensures fresh content)
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response as it can only be consumed once
          const responseToCache = response.clone();
          
          // Don't cache HTML responses, but cache JS/CSS
          if (response && response.status === 200 && !isHTML) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          
          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(event.request);
        })
    );
  }
});

// Listen for messages from the client to skip waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[Service Worker] Received SKIP_WAITING message');
    self.skipWaiting();
  }
});