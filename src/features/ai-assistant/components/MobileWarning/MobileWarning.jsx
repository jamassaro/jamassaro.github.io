/**
 * MobileWarning Component
 * 
 * Purpose: Inform mobile/tablet users that AI assistant requires desktop
 * Displays when device cannot handle 2.2GB model download
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MobileWarning.module.css';

const MobileWarning = ({ onViewArchitecture }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Icon */}
        <div className={styles.icon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12" y2="18" />
          </svg>
        </div>

        {/* Title */}
        <h3 className={styles.title}>
          {t('ai-assistant.mobile-warning.title', 'Desktop Only Feature')}
        </h3>

        {/* Subtitle */}
        <p className={styles.subtitle}>
          {t(
            'ai-assistant.mobile-warning.subtitle',
            'This AI assistant requires a desktop or laptop computer for optimal performance.'
          )}
        </p>

        {/* Requirements Box */}
        <div className={styles.requirementsBox}>
          <div className={styles.requirementsTitle}>
            {t('ai-assistant.mobile-warning.requirements-title', 'Technical Requirements:')}
          </div>
          <ul className={styles.requirementsList}>
            <li>{t('ai-assistant.mobile-warning.requirement-1', '2.2GB model download')}</li>
            <li>{t('ai-assistant.mobile-warning.requirement-2', 'WebGPU support (Chrome 113+, Safari 18+)')}</li>
            <li>{t('ai-assistant.mobile-warning.requirement-3', 'Stable internet connection')}</li>
            <li>{t('ai-assistant.mobile-warning.requirement-4', 'Sufficient memory (4GB+ RAM)')}</li>
          </ul>
        </div>

        {/* Message */}
        <p className={styles.message}>
          {t(
            'ai-assistant.mobile-warning.message',
            'Mobile browsers may crash or refresh during the model download. For the best experience, please visit this page on a desktop or laptop.'
          )}
        </p>

        {/* Alternatives Section */}
        <div className={styles.alternatives}>
          <div className={styles.alternativesTitle}>
            {t('ai-assistant.mobile-warning.alternatives-title', 'Meanwhile, you can:')}
          </div>
          <ul className={styles.alternativesList}>
            <li>
              <a href="#projects">
                {t('ai-assistant.mobile-warning.alternative-1', '✓ Browse my projects')}
              </a>
            </li>
            <li>
              <a href="#expertise">
                {t('ai-assistant.mobile-warning.alternative-2', '✓ Check out my expertise')}
              </a>
            </li>
            <li>
              <a href="#entrepreneurship">
                {t('ai-assistant.mobile-warning.alternative-3', '✓ View my startup journey')}
              </a>
            </li>
            <li>
              <a href="#footer">
                {t('ai-assistant.mobile-warning.alternative-4', '✓ Download my resume')}
              </a>
            </li>
          </ul>
        </div>

        {/* View Architecture Button */}
        {onViewArchitecture && (
          <button className={styles.architectureButton} onClick={onViewArchitecture}>
            {t('ai-assistant.mobile-warning.view-architecture', 'View Architecture Panel →')}
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileWarning;
