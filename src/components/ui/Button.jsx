import React from 'react';
import styles from './Button.module.css';

/**
 * Button Component - SRP: Handles button rendering with various variants
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - Button style variant: 'primary', 'secondary', 'ghost', 'accent'
 * @param {string} props.size - Button size: 'small', 'default', 'large'
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.fullWidth - Full width button
 * @param {boolean} props.iconOnly - Icon-only button
 * @param {function} props.onClick - Click handler
 * @param {string} props.type - Button type: 'button', 'submit', 'reset'
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.href - If provided, renders as anchor tag
 * @param {string} props.target - Anchor target attribute
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'default',
  disabled = false,
  loading = false,
  fullWidth = false,
  iconOnly = false,
  onClick,
  type = 'button',
  className = '',
  href,
  target,
  ...rest
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    size !== 'default' && styles[size],
    fullWidth && styles.fullWidth,
    iconOnly && styles.iconOnly,
    loading && styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Render as anchor if href is provided
  if (href) {
    return (
      <a
        href={href}
        target={target}
        className={buttonClasses}
        {...rest}
      >
        {children}
      </a>
    );
  }

  // Render as button
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
