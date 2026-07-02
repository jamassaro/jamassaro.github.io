/**
 * useScroll Hook
 * Following SRP: Handles auto-scrolling to bottom of container
 */

import { useRef, useEffect } from 'react';

/**
 * Custom hook for managing scroll behavior in chat windows
 * @param {Array} dependencies - Array of dependencies that trigger scroll (e.g., messages)
 * @returns {Object} { scrollRef, scrollToBottom }
 */
export const useScroll = (dependencies = []) => {
  const scrollRef = useRef(null);

  const scrollToBottom = (behavior = 'smooth') => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior,
      });
    }
  };

  useEffect(() => {
    // Auto-scroll when dependencies change (e.g., new message added)
    scrollToBottom();
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    scrollRef,
    scrollToBottom,
  };
};
