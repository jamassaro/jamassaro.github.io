import React, { useState, useEffect } from 'react';
import styles from './ScrollProgress.module.css';

/**
 * ScrollProgress Component - SRP: Displays scroll progress indicator
 * Shows a thin progress bar at the top of the page
 */
const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      setProgress(Math.min(scrollPercent, 100));
      
      // Show progress bar after scrolling past first section
      setIsVisible(scrollTop > windowHeight * 0.3);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`${styles.progressContainer} ${isVisible ? styles.visible : ''}`}>
      <div 
        className={styles.progressBar}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ScrollProgress;
