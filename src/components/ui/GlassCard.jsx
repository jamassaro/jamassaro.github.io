import React from 'react';
import styles from './GlassCard.module.css';

/**
 * GlassCard Component - SRP: Handles glassmorphism card rendering
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.variant - Card variant: 'default', 'primary', 'secondary', 'accent', 'error'
 * @param {boolean} props.hoverable - Enable hover effects
 * @param {boolean} props.clickable - Make card clickable
 * @param {function} props.onClick - Click handler
 * @param {string} props.padding - Padding size: 'default', 'none', 'small', 'large'
 * @param {boolean} props.withTerminal - Show terminal header decoration
 * @param {boolean} props.glowing - Enable glow animation
 * @param {string} props.className - Additional CSS classes
 */
const GlassCard = ({
  children,
  variant = 'default',
  hoverable = false,
  clickable = false,
  onClick,
  padding = 'default',
  withTerminal = false,
  glowing = false,
  className = '',
  ...rest
}) => {
  const cardClasses = [
    styles.glassCard,
    variant !== 'default' && styles[variant],
    hoverable && styles.hoverable,
    clickable && styles.clickable,
    padding !== 'default' && styles[`${padding}Padding`],
    withTerminal && styles.withTerminal,
    glowing && styles.glowing,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={cardClasses}
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.(e);
              }
            }
          : undefined
      }
      {...rest}
    >
      {children}
    </div>
  );
};

export default GlassCard;
