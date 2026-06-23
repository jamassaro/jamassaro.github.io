import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Footer.module.css';

/**
 * Footer Component - SRP: Handles footer rendering with contact info and links
 */
const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Contact Section */}
          <div className={styles.contactSection}>
            <span className={styles.heading}>04_{t('footer.tag')}</span>
            <h2 className={styles.title}>
              {t('footer.title')}
            </h2>
            <div className={styles.contactInfo}>
              <a href={`mailto:${t('footer.email')}`} className={styles.contactLink}>
                📧 {t('footer.email')}
              </a>
              <a href={`tel:${t('footer.phone').replace(/\s/g, '')}`} className={styles.contactLink}>
                📞 {t('footer.phone')}
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className={styles.socialSection}>
            <span className={styles.socialHeading}>{t('footer.connect')}</span>
            <div className={styles.socialLinks}>
              <a
                href="https://www.linkedin.com/in/jose-antonio-massaro-mayorga-716a2736/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                {t('footer.linkedin')}
              </a>
              <a
                href="https://github.com/jamassaro"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                {t('footer.github')}
              </a>
              <a
                href="/PDF/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                {t('footer.resume')}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} {t('footer.copyright')}
          </p>
          <span className={styles.badge}>{t('footer.badge')}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
