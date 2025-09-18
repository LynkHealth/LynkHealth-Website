// Performance utilities for load time optimization
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
  preloadCriticalResources();
  addResourceHints();
  loadNonCriticalJS();
  
  // Add font optimization in a non-blocking way
  setTimeout(() => {
    optimizeFonts();
  }, 0);
}