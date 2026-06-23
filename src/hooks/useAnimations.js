import { useEffect } from 'react';

/**
 * usePageTransition Hook
 * Handles page load animation and transitions
 */
export const usePageTransition = () => {
  useEffect(() => {
    // Add page-loaded class after mount
    document.body.classList.add('page-loading');
    
    const timer = setTimeout(() => {
      document.body.classList.remove('page-loading');
      document.body.classList.add('page-loaded');
    }, 100);

    return () => clearTimeout(timer);
  }, []);
};

/**
 * useSmoothScroll Hook
 * Enhanced smooth scrolling with custom easing
 */
export const useSmoothScroll = () => {
  useEffect(() => {
    // Smooth scroll for anchor links
    const handleAnchorClick = (e) => {
      const href = e.target.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const navbarHeight = 80; // Height of fixed navbar
          const targetPosition = targetElement.offsetTop - navbarHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);
};

/**
 * useScrollProgress Hook
 * Tracks scroll progress for animations
 */
export const useScrollProgress = (callback) => {
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      
      if (callback) {
        callback(scrollPercent);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [callback]);
};

/**
 * useHoverAnimation Hook
 * Manages hover state for animations
 */
export const useHoverAnimation = (ref, animationClass) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseEnter = () => {
      element.classList.add(animationClass);
    };

    const handleMouseLeave = () => {
      element.classList.remove(animationClass);
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref, animationClass]);
};

/**
 * useIntersectionAnimation Hook
 * Simplified intersection observer for elements
 */
export const useIntersectionAnimation = (ref, options = {}) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            if (options.once) {
              observer.unobserve(entry.target);
            }
          } else if (!options.once) {
            entry.target.classList.remove('in-view');
          }
        });
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, options]);
};

/**
 * useParallax Hook
 * Simple parallax effect on scroll
 */
export const useParallax = (ref, speed = 0.5) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const elementTop = element.offsetTop;
      const elementHeight = element.offsetHeight;
      
      if (scrolled > elementTop - window.innerHeight && scrolled < elementTop + elementHeight) {
        const yPos = (scrolled - elementTop) * speed;
        element.style.transform = `translateY(${yPos}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref, speed]);
};
