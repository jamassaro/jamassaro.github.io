/**
 * PipelineStep Component
 * Following SRP: Renders numbered pipeline step
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './PipelineStep.module.css';

const PipelineStep = ({ number, label }) => {
  return (
    <div className={styles.step}>
      <span className={styles.number}>{number}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
};

PipelineStep.propTypes = {
  number: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
};

export default PipelineStep;
