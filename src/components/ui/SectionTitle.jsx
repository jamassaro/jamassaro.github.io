import React from 'react';
import styles from './SectionTitle.module.css';

/**
 * SectionTitle Component - SRP: Handles section heading with index numbering
 * @param {Object} props
 * @param {string} props.title - Main title text
 * @param {string} props.index - Section index (e.g., "01", "02")
 * @param {string} props.indexLabel - Index label (e.g., "Expertise", "Projects")
 * @param {string} props.subtitle - Optional subtitle/description
 * @param {string} props.size - Title size: 'small', 'default', 'large'
 * @param {string} props.align - Alignment: 'left', 'center'
 * @param {boolean} props.gradient - Apply gradient effect to title
 * @param {boolean} props.underline - Add decorative underline
 * @param {string} props.className - Additional CSS classes
 */
const SectionTitle = ({
  title,
  index,
  indexLabel,
  subtitle,
  size = 'default',
  align = 'left',
  gradient = false,
  underline = false,
  className = '',
  ...rest
}) => {
  const containerClasses = [
    styles.sectionTitle,
    size !== 'default' && styles[size],
    align !== 'left' && styles[align],
    underline && styles.underline,
    gradient && styles.gradient,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses} {...rest}>
      <h2 className={styles.title}>
        {(index || indexLabel) && (
          <span className={styles.index}>
            {index && `${index}_`}
            {indexLabel}
          </span>
        )}
        <span className={styles.text}>{title}</span>
      </h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
};

export default SectionTitle;
