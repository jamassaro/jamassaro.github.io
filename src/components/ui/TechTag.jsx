import React from 'react';
import styles from './TechTag.module.css';

/**
 * TechTag Component - SRP: Handles technology badge rendering
 * @param {Object} props
 * @param {React.ReactNode} props.children - Tag content (tech name)
 * @param {string} props.color - Tag color variant: 'blue', 'green', 'red', 'purple', 'yellow'
 * @param {string} props.size - Tag size: 'small', 'default', 'large'
 * @param {boolean} props.clickable - Make tag clickable
 * @param {function} props.onClick - Click handler
 * @param {string} props.icon - Icon source (image URL)
 * @param {string} props.className - Additional CSS classes
 */
const TechTag = ({
  children,
  color = 'default',
  size = 'default',
  clickable = false,
  onClick,
  icon,
  className = '',
  ...rest
}) => {
  const tagClasses = [
    styles.techTag,
    color !== 'default' && styles[color],
    size !== 'default' && styles[size],
    clickable && styles.clickable,
    icon && styles.withIcon,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = (e) => {
    if (clickable && onClick) {
      onClick(e);
    }
  };

  const handleKeyDown = (e) => {
    if (clickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.(e);
    }
  };

  return (
    <span
      className={tagClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      {...rest}
    >
      {icon && <img src={icon} alt="" className={styles.icon} />}
      {children}
    </span>
  );
};

export default TechTag;
