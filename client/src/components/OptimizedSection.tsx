import { ReactNode, useRef, useState, useEffect } from 'react';

interface OptimizedSectionProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
}

// Intersection Observer based component for better performance
export default function OptimizedSection({ 
  children, 
  className = '', 
  threshold = 0.1,
  rootMargin = '50px'
}: OptimizedSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <section ref={sectionRef} className={className}>
      {isVisible ? children : (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse bg-gray-200 rounded w-full h-32"></div>
        </div>
      )}
    </section>
  );
}