import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Footer.module.css';

/**
 * Footer Component - SRP: Handles footer rendering with contact info and links
 */
const Footer = () => {
  const [t] = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Contact Section */}
          <div className={styles.contactSection}>
            <span className={styles.heading}>04_CONTACT_INFO</span>
            <h2 className={styles.title}>
              Let's build something<br />precise.
            </h2>
            <div className={styles.contactInfo}>
              <a href="mailto:jamassaro@gmail.com" className={styles.contactLink}>
                📧 jamassaro@gmail.com
              </a>
              <a href="tel:+17183003187" className={styles.contactLink}>
                📞 +1 (718) 300-3187
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className={styles.socialSection}>
            <span className={styles.socialHeading}>CONNECT</span>
            <div className={styles.socialLinks}>
              <a
                href="https://www.linkedin.com/in/jose-antonio-massaro-mayorga-716a2736/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/jamassaro"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                GitHub
              </a>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                {t('footer.resume') || 'Resume'}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} Jose A. Massaro • Built with precision
          </p>
          <span className={styles.badge}>ALL_SYSTEMS_OPERATIONAL</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
