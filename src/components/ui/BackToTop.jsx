import React, { useState, useEffect } from 'react';
import styles from './BackToTop.module.css';

/**
 * BackToTop Component - SRP: Handles scroll-to-top button
 * Appears after scrolling down and scrolls to top on click
 */
const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 300px
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollToTop();
    }
  };

  return (
    <button
      className={`${styles.backToTop} ${isVisible ? styles.visible : ''}`}
      onClick={scrollToTop}
      onKeyDown={handleKeyDown}
      aria-label="Scroll to top"
      title="Back to top"
    >
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={styles.icon}
      >
        <path 
          d="M12 19V5M12 5L5 12M12 5L19 12" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default BackToTop;
