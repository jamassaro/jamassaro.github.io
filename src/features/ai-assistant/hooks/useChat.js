/**
 * useChat Hook
 * Following SRP: Manages chat state and message handling
 */

import { useState, useCallback } from 'react';
import { mockMessages } from '../data';

/**
 * Custom hook for managing chat functionality
 * @returns {Object} { messages, sendMessage, isLoading, clearMessages }
 */
export const useChat = () => {
  const [messages, setMessages] = useState(mockMessages);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Send a new message (currently just logs to console)
   * Following DRY: Centralized message sending logic
   */
  const sendMessage = useCallback((content) => {
    if (!content.trim()) return;

    // Create new user message
    const userMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    // Add user message
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI processing
    setIsLoading(true);

    // Simulate response delay
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  /**
   * Clear all messages
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    sendMessage,
    isLoading,
    clearMessages,
  };
};
