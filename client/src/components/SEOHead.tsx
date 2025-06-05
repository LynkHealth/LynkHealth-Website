import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
}

export function SEOHead({ title, description, keywords, canonicalUrl }: SEOHeadProps) {
  useEffect(() => {
    // Set document title
    document.title = title;
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }
    
    // Set keywords if provided
    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'keywords';
        meta.content = keywords;
        document.head.appendChild(meta);
      }
    }
    
    // Set canonical URL if provided
    if (canonicalUrl) {
      const canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        canonicalLink.setAttribute('href', canonicalUrl);
      } else {
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = canonicalUrl;
        document.head.appendChild(link);
      }
    }
    
    // Open Graph tags
    const setOGTag = (property: string, content: string) => {
      const existingTag = document.querySelector(`meta[property="${property}"]`);
      if (existingTag) {
        existingTag.setAttribute('content', content);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', property);
        meta.content = content;
        document.head.appendChild(meta);
      }
    };
    
    setOGTag('og:title', title);
    setOGTag('og:description', description);
    setOGTag('og:type', 'website');
    
    // Twitter Card tags
    const setTwitterTag = (name: string, content: string) => {
      const existingTag = document.querySelector(`meta[name="${name}"]`);
      if (existingTag) {
        existingTag.setAttribute('content', content);
      } else {
        const meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    };
    
    setTwitterTag('twitter:card', 'summary_large_image');
    setTwitterTag('twitter:title', title);
    setTwitterTag('twitter:description', description);
  }, [title, description, keywords, canonicalUrl]);
  
  return null;
}
