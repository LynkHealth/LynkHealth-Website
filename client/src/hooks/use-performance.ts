import { useEffect } from 'react';

// Performance optimization hook
export function usePerformance() {
  useEffect(() => {
    // Preload critical resources
    const preloadLinks = [
      '/images/AdobeStock_616281927_1751485954823.jpeg', // Hero image
    ];

    preloadLinks.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = href;
      document.head.appendChild(link);
    });

    // Optimize third-party scripts
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => {
        // Load non-critical third-party scripts during idle time
        const scripts = document.querySelectorAll('script[data-defer]');
        scripts.forEach((script) => {
          if (script instanceof HTMLScriptElement) {
            script.src = script.dataset.src || '';
          }
        });
      });
    }

    // Add service worker for caching if available
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Service worker registration failed, continue without it
      });
    }
  }, []);
}

// Font loading optimization
export function useFontOptimization() {
  useEffect(() => {
    // Preload critical fonts
    const fontLinks = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    ];

    fontLinks.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      link.onload = function() {
        (this as HTMLLinkElement).rel = 'stylesheet';
      };
      document.head.appendChild(link);
    });
  }, []);
}