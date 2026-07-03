/**
 * useTypingAnimation Hook
 * 
 * SRP: Handles typing animation logic
 * DRY: Reusable typing effect for any text
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { CONVERSATION_CONFIG } from '../config/conversationConfig.js';

/**
 * Hook for typing animation effect
 * @param {Object} [options] - Animation options
 * @param {number} [options.speed] - Typing speed (ms per character)
 * @param {boolean} [options.autoStart] - Auto-start animation
 * @returns {Object} Typing animation controls
 */
export function useTypingAnimation(options = {}) {
  const {
    speed = CONVERSATION_CONFIG.TYPING_SPEED,
    autoStart = false,
  } = options;

  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [fullText, setFullText] = useState('');
  const intervalRef = useRef(null);
  const indexRef = useRef(0);

  /**
   * Start typing animation
   * @param {string} text - Full text to type out
   * @param {Object} [animationOptions] - Override options for this animation
   * @param {number} [animationOptions.speed] - Override typing speed
   */
  const startTyping = useCallback((text, animationOptions = {}) => {
    const effectiveSpeed = animationOptions.speed || speed;
    
    // Clear any existing animation
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setFullText(text);
    setDisplayedText('');
    setIsTyping(true);
    indexRef.current = 0;

    intervalRef.current = setInterval(() => {
      indexRef.current += 1;
      
      if (indexRef.current > text.length) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsTyping(false);
        setDisplayedText(text);
      } else {
        setDisplayedText(text.slice(0, indexRef.current));
      }
    }, effectiveSpeed);
  }, [speed]);

  /**
   * Stop typing animation immediately
   */
  const stopTyping = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsTyping(false);
    setDisplayedText(fullText);
  }, [fullText]);

  /**
   * Skip to end of animation
   */
  const skipToEnd = useCallback(() => {
    stopTyping();
  }, [stopTyping]);

  /**
   * Reset animation state
   */
  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsTyping(false);
    setDisplayedText('');
    setFullText('');
    indexRef.current = 0;
  }, []);

  /**
   * Get animation progress (0-1)
   */
  const getProgress = useCallback(() => {
    if (!fullText) return 0;
    return displayedText.length / fullText.length;
  }, [displayedText, fullText]);

  /**
   * Check if animation is complete
   */
  const isComplete = useCallback(() => {
    return !isTyping && displayedText === fullText && fullText !== '';
  }, [isTyping, displayedText, fullText]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Auto-start if text is provided and autoStart is true
  useEffect(() => {
    if (autoStart && fullText && !isTyping) {
      startTyping(fullText);
    }
  }, [autoStart, fullText, isTyping, startTyping]);

  return {
    // State
    isTyping,
    displayedText,
    fullText,
    
    // Actions
    startTyping,
    stopTyping,
    skipToEnd,
    reset,
    
    // Utilities
    getProgress,
    isComplete,
  };
}

/**
 * Hook for simple typing effect (simpler API)
 * @param {string} text - Text to animate
 * @param {Object} [options] - Animation options
 * @returns {{displayedText: string, isTyping: boolean}} Animation state
 */
export function useSimpleTyping(text, options = {}) {
  const { isTyping, displayedText, startTyping } = useTypingAnimation(options);

  useEffect(() => {
    if (text) {
      startTyping(text);
    }
  }, [text, startTyping]);

  return { displayedText, isTyping };
}
