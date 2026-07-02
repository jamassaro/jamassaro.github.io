/**
 * ArchitecturePanel Component
 * Following SRP: Displays RAG pipeline architecture and technical details
 */

import React from 'react';
import PropTypes from 'prop-types';
import PipelineStep from '../PipelineStep';
import TechBadge from '../TechBadge';
import styles from './ArchitecturePanel.module.css';

const ArchitecturePanel = ({
  title,
  subtitle,
  steps,
  techBadges,
  featureBadges,
  howItWorksTitle,
  howItWorksContent,
  disclaimer,
}) => {
  return (
    <div className={styles.panel}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.terminalDots}>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      {/* Pipeline Steps */}
      <div className={styles.section}>
        <div className={styles.steps}>
          {steps.map((step) => (
            <PipelineStep
              key={`step-${step.number}`}
              number={step.number}
              label={step.label}
            />
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>TECH_STACK</h4>
        <div className={styles.badgeGrid}>
          {techBadges.map((badge) => (
            <TechBadge
              key={badge.id}
              label={badge.label}
              variant={badge.variant}
            />
          ))}
        </div>
      </div>

      {/* Features */}
      <div className={styles.section}>
        <div className={styles.badgeGrid}>
          {featureBadges.map((badge) => (
            <TechBadge
              key={badge.id}
              label={badge.label}
              variant={badge.variant}
            />
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>{howItWorksTitle}</h4>
        <p className={styles.description}>{howItWorksContent}</p>
      </div>

      {/* Disclaimer */}
      {disclaimer && (
        <div className={styles.disclaimer}>
          <p>{disclaimer}</p>
        </div>
      )}
    </div>
  );
};

ArchitecturePanel.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      number: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  techBadges: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      variant: PropTypes.string.isRequired,
    })
  ).isRequired,
  featureBadges: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      variant: PropTypes.string.isRequired,
    })
  ).isRequired,
  howItWorksTitle: PropTypes.string.isRequired,
  howItWorksContent: PropTypes.string.isRequired,
  disclaimer: PropTypes.string,
};

export default ArchitecturePanel;
