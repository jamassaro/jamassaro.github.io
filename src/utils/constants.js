// Constants and Utility Functions
// Centralized constants following DRY principle

// Breakpoint utilities
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200,
};

// Check if current viewport matches breakpoint
export const isMobile = () => window.innerWidth < BREAKPOINTS.mobile;
export const isTablet = () => window.innerWidth >= BREAKPOINTS.mobile && window.innerWidth < BREAKPOINTS.tablet;
export const isDesktop = () => window.innerWidth >= BREAKPOINTS.desktop;

// Smooth scroll to element
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
};

// Debounce function for performance
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for performance
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

// Get contrast color (black or white) based on background
export const getContrastColor = (hexColor) => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

// Clamp number between min and max
export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

// Linear interpolation
export const lerp = (start, end, amount) => start + (end - start) * amount;
