// Performance utilities for load time optimization

// Dynamic version based on build timestamp
// In development, use a static version to avoid infinite reloads
// In production, use build timestamp to ensure cache is cleared on deployment
const APP_VERSION = import.meta.env.MODE === 'production' 
  ? (import.meta.env.VITE_BUILD_TIMESTAMP || '1.0.0')
  : 'dev-1.0.0';
const VERSION_KEY = 'lynk-health-app-version';

// Register and update service worker
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('[SW] Service Worker registered:', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('[SW] New service worker found, updating...');
            
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[SW] New content available, reloading...');
                  // New service worker available, refresh the page
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              });
            }
          });
          
          // Check for updates every 60 seconds
          setInterval(() => {
            registration.update();
          }, 60000);
        })
        .catch((error) => {
          console.warn('[SW] Service Worker registration failed:', error);
        });
    });
    
    // Reload page when new service worker takes control
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[SW] Controller changed, reloading page...');
      window.location.reload();
    });
  }
}

// Cache busting and version management
export function clearCacheOnVersionChange() {
  const storedVersion = localStorage.getItem(VERSION_KEY);
  
  if (storedVersion !== APP_VERSION) {
    console.log(`[Cache] Version change detected (${storedVersion} → ${APP_VERSION}). Clearing cache...`);
    
    // Clear browser caches
    if ('caches' in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach(cacheName => {
          console.log('[Cache] Deleting cache:', cacheName);
          caches.delete(cacheName);
        });
      }).catch(err => {
        console.warn('[Cache] Failed to clear service worker caches:', err);
      });
    }
    
    // Clear localStorage (except for version)
    const keysToKeep = [VERSION_KEY];
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Update stored version
    localStorage.setItem(VERSION_KEY, APP_VERSION);
    
    // Force reload if this is not the first visit and version changed
    if (storedVersion && storedVersion !== APP_VERSION) {
      console.log('[Cache] Reloading page to apply updates...');
      // Small delay to ensure cache is cleared
      setTimeout(() => {
        window.location.reload();
      }, 100);
      return true; // Indicate reload will happen
    }
  }
  
  return false; // No reload needed
}

export function preloadCriticalResources() {
  const criticalImages = [
    '/images/elderly-patient-care.jpeg',
    '/images/AdobeStock_419808796_1751485954770.jpeg'
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

export function optimizeFonts() {
  // Use font-display: swap for better performance
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  `;
  document.head.appendChild(style);
}

// Implement resource hints
export function addResourceHints() {
  const hints = [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'true' },
    { rel: 'dns-prefetch', href: 'https://lynk.health' }
  ];

  hints.forEach(hint => {
    const link = document.createElement('link');
    link.rel = hint.rel;
    link.href = hint.href;
    if (hint.crossorigin) link.crossOrigin = hint.crossorigin;
    document.head.appendChild(link);
  });
}

// Lazy load non-critical JavaScript
export function loadNonCriticalJS() {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      // Load analytics or other non-critical scripts here
      console.log('[Performance] Loading non-critical resources during idle time');
    });
  }
}

// Initialize all performance optimizations
export function initializePerformanceOptimizations() {
  // Clear cache if version changed (must be first)
  const willReload = clearCacheOnVersionChange();
  
  // Only continue if we're not about to reload
  if (!willReload) {
    // Register service worker for caching
    registerServiceWorker();
    
    preloadCriticalResources();
    addResourceHints();
    loadNonCriticalJS();
    
    // Add font optimization in a non-blocking way
    setTimeout(() => {
      optimizeFonts();
    }, 0);
  }
}