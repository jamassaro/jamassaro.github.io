import React, { useEffect } from 'react';
import styles from './MobileNav.module.css';

/**
 * MobileNav Component - SRP: Handles mobile navigation overlay
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the mobile menu is open
 * @param {function} props.onClose - Function to close the menu
 * @param {Array} props.navItems - Navigation items to render
 * @param {string} props.activeSection - Currently active section
 * @param {function} props.onNavigate - Navigation handler
 * @param {string} props.currentLanguage - Current language code
 * @param {function} props.onChangeLanguage - Language change handler
 */
const MobileNav = ({
  isOpen,
  onClose,
  navItems,
  activeSection,
  onNavigate,
  currentLanguage,
  onChangeLanguage,
}) => {
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <div className={`${styles.mobileNav} ${isOpen ? styles.open : ''}`}>
      <span className={styles.logo}>JAM.DEV</span>

      <nav>
        <ul className={styles.navList}>
          {navItems.map((item, index) => (
            <li key={item.id} className={styles.navItem}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`${styles.navLink} ${activeSection === item.id ? styles.active : ''}`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.languageSwitcher}>
        <button
          onClick={() => onChangeLanguage('en')}
          className={`${styles.langButton} ${currentLanguage === 'en' ? styles.active : ''}`}
        >
          EN
        </button>
        <button
          onClick={() => onChangeLanguage('es')}
          className={`${styles.langButton} ${currentLanguage === 'es' ? styles.active : ''}`}
        >
          ES
        </button>
      </div>

      <div className={styles.socialLinks}>
        <a
          href="https://www.linkedin.com/in/jose-antonio-massaro-mayorga-716a2736/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
        >
          → LinkedIn
        </a>
        <a
          href="https://github.com/jamassaro"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
        >
          → GitHub
        </a>
      </div>

      <div className={styles.footer}>
        <p className={styles.footerText}>© 2026 JAM • BUILT_WITH_PRECISION</p>
      </div>
    </div>
  );
};

export default MobileNav;
