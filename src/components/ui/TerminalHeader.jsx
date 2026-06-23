import React from 'react';
import styles from './TerminalHeader.module.css';

/**
 * TerminalHeader Component - SRP: Handles terminal window decoration dots
 * @param {Object} props
 * @param {string} props.label - Optional label text to display
 * @param {string} props.size - Dot size: 'small', 'default', 'large'
 * @param {boolean} props.animated - Enable pulse animation
 * @param {boolean} props.minimal - Minimal variant without extra spacing
 * @param {string} props.className - Additional CSS classes
 */
const TerminalHeader = ({
  label,
  size = 'default',
  animated = false,
  minimal = false,
  className = '',
  ...rest
}) => {
  const headerClasses = [
    styles.terminalHeader,
    label && styles.withLabel,
    size !== 'default' && styles[size],
    animated && styles.animated,
    minimal && styles.minimal,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={headerClasses} {...rest}>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
};

export default TerminalHeader;
