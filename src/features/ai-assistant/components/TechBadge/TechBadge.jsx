/**
 * TechBadge Component
 * Following SRP: Renders technology or feature badge
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './TechBadge.module.css';

const TechBadge = ({ label, variant = 'tech' }) => {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {label}
    </span>
  );
};

TechBadge.propTypes = {
  label: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['tech', 'feature']),
};

export default TechBadge;
