import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MobileNav from './MobileNav';
import styles from './Navbar.module.css';
import { scrollToElement } from '../../utils/constants';

/**
 * Navbar Component - SRP: Handles main navigation rendering and state
 * Features: Sticky header, scroll effect, language switcher, mobile menu
 */
const Navbar = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['expertise', 'projects', 'entrepreneurship'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (sectionId) => {
    navigate('/');
    setTimeout(() => {
      scrollToElement(sectionId, 80);
    }, 100);
    setIsMenuOpen(false);
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const navItems = [
    { id: 'expertise', label: t('navigation.expertise'), index: '01' },
    { id: 'projects', label: t('navigation.projects'), index: '02' },
    { id: 'entrepreneurship', label: t('navigation.entrepreneurship'), index: '03' },
  ];

  return (
    <>
      <header className={`${styles.navbar} ${isScrolled ? styles.navbarScrolled : ''}`}>
        <div className={styles.container}>
          {/* Logo */}
          <Link to="/" className={styles.logo}>
            JAM.DEV
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.nav}>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`${styles.navLink} ${activeSection === item.id ? styles.active : ''}`}
              >
                {item.index}_{item.label}
              </button>
            ))}
          </nav>

          {/* Right Side: Language Switcher + Actions */}
          <div className={styles.rightSection}>
            {/* Language Switcher */}
            <div className={styles.languageSwitcher}>
              <button
                onClick={() => changeLanguage('en')}
                className={`${styles.langButton} ${i18n.language === 'en' ? styles.active : ''}`}
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage('es')}
                className={`${styles.langButton} ${i18n.language === 'es' ? styles.active : ''}`}
              >
                ES
              </button>
            </div>

            {/* Resume Button */}
            <a
              href="/PDF/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.actionsButton}
            >
              {t('navigation.resume')}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`${styles.mobileMenuButton} ${isMenuOpen ? styles.open : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span className={styles.hamburger} />
          </button>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <MobileNav
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        navItems={navItems}
        activeSection={activeSection}
        onNavigate={handleNavigation}
        currentLanguage={i18n.language}
        onChangeLanguage={changeLanguage}
      />
    </>
  );
};

export default Navbar;
