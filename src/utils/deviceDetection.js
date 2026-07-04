/**
 * Device Detection Utility
 * 
 * Purpose: Detect if user is on mobile/tablet device
 * Used to disable heavy features like AI model downloads (2.2GB+)
 * that can crash mobile browsers or cause auto-refresh
 */

/**
 * Check if current device is mobile or tablet
 * 
 * Strategy:
 * - Check user agent for mobile/tablet keywords
 * - Check screen width (tablets can be large but still problematic)
 * - Use 1024px threshold to catch tablets in landscape mode
 * 
 * @returns {boolean} True if mobile/tablet device
 */
export function isMobileDevice() {
  // SSR safety check
  if (typeof window === 'undefined') {
    return false;
  }

  // Check user agent for mobile/tablet identifiers
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobileUA = /mobile|android|iphone|ipad|ipod|tablet|webos|blackberry|windows phone/.test(userAgent);
  
  // Check screen width (tablets ≤ 1024px)
  const isSmallScreen = window.innerWidth <= 1024;
  
  // Device is mobile if EITHER condition is true
  return isMobileUA || isSmallScreen;
}

/**
 * Get device type string for analytics/debugging
 * 
 * @returns {string} 'mobile' | 'tablet' | 'desktop'
 */
export function getDeviceType() {
  if (typeof window === 'undefined') {
    return 'unknown';
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const width = window.innerWidth;

  // Check for phone-sized devices
  if (/mobile|android|iphone|ipod|blackberry|windows phone/.test(userAgent) && width <= 768) {
    return 'mobile';
  }

  // Check for tablets
  if (/ipad|tablet|android/.test(userAgent) || (width > 768 && width <= 1024)) {
    return 'tablet';
  }

  // Desktop
  return 'desktop';
}

/**
 * Check if device has touch capability
 * Note: Not reliable alone (many laptops have touch screens)
 * 
 * @returns {boolean} True if touch-capable
 */
export function isTouchDevice() {
  if (typeof window === 'undefined') {
    return false;
  }

  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}
