import React, { useState, useEffect } from 'react';
import styles from './PageLoader.module.css';

/**
 * PageLoader Component - SRP: Displays initial page loading animation
 * Shows a minimal loading animation while the page initializes
 */
const PageLoader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide loader after a short delay to ensure content is ready
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loaderContent}>
        <div className={styles.logo}>
          <span className={styles.logoText}>JAM.DEV</span>
        </div>
        <div className={styles.loadingBar}>
          <div className={styles.loadingProgress}></div>
        </div>
        <div className={styles.statusText}>INITIALIZING_SYSTEM</div>
      </div>
    </div>
  );
};

export default PageLoader;
