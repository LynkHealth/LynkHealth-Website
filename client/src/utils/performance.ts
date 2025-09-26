// Performance utilities for load time optimization

// Cache busting and version management
export function clearCacheOnVersionChange() {
  const APP_VERSION = '1.0.0'; // Update this when making major releases
  const VERSION_KEY = 'lynk-health-app-version';
  const storedVersion = localStorage.getItem(VERSION_KEY);
  
  if (storedVersion !== APP_VERSION) {
    console.log(`Version change detected (${storedVersion} → ${APP_VERSION}). Clearing cache...`);
    
    // Clear browser caches
    if ('caches' in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      }).catch(err => {
        console.warn('Failed to clear service worker caches:', err);
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
      console.log('Reloading page to apply updates...');
      window.location.reload();
      return; // Exit early as page will reload
    }
  }
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
    { rel: 'dns-prefetch', href: 'https://lynk.health' }  ];

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
      console.log('Loading non-critical resources during idle time');
    });
  }
}

// Initialize all performance optimizations
export function initializePerformanceOptimizations() {
  // Clear cache if version changed (must be first)
  clearCacheOnVersionChange();
  
  preloadCriticalResources();
  addResourceHints();
  loadNonCriticalJS();
  
  // Add font optimization in a non-blocking way
  setTimeout(() => {
    optimizeFonts();
  }, 0);
}