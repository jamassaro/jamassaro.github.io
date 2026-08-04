import React from 'react';
import { useTranslation } from 'react-i18next';
import { trackLinkClick } from '../../configs/analytics';
import styles from './HeroSection.module.css';

/**
 * HeroSection Component - SRP: Handles hero/main section rendering
 * Features: Name with gradient, role, description, social links
 */
const HeroSection = () => {
  const [t] = useTranslation();

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* System Label */}
          <span className={styles.systemLabel}>{t('main-section.tag')}</span>

          {/* Name with Gradient */}
          <h1 className={styles.name}>JOSE A. MASSARO.</h1>

          {/* Role */}
          <h2 className={styles.role}> Senior FullStack Engineer</h2>
        
          {/* Description */}
          <p className={styles.description}>
            {t('main-section.description')}
          </p>

          {/* Social Links */}
          <div className={styles.socialLinks}>
            <a
              href="https://www.linkedin.com/in/jose-antonio-massaro-mayorga-716a2736/"
              target="_blank"
              onClick={() => trackLinkClick('LinkedIn link clicked', 'https://www.linkedin.com/in/jose-antonio-massaro-mayorga-716a2736/')}
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/jamassaro"
              target="_blank"
              onClick={() => trackLinkClick('GitHub link clicked', 'https://github.com/jamassaro')}
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              GitHub
            </a>
            <a
              href="/PDF/resume.pdf"
              target="_blank"
              onClick={() => trackLinkClick('Resume link clicked', '/PDF/resume.pdf')}  
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              {t('main-section.resume') || 'Resume'}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
