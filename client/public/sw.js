// Service Worker for caching optimization
const CACHE_NAME = 'lynk-health-v1';
const STATIC_CACHE = [
  '/',
  '/manifest.json',
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

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_CACHE);
      })
      .catch(() => {
        // Cache failed, continue without caching
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
      .catch(() => {
        // Network failed, return cached version or continue
        return fetch(event.request);
      })
  );
});