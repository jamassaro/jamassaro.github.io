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

    console.log('📤 Sending message:', content);

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
    console.log('🤖 AI would process this message...');

    // Simulate response delay
    setTimeout(() => {
      setIsLoading(false);
      console.log('✅ Message sent (UI-only demo - no actual AI)');
    }, 1500);
  }, []);

  /**
   * Clear all messages
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    console.log('🗑️ Chat cleared');
  }, []);

  return {
    messages,
    sendMessage,
    isLoading,
    clearMessages,
  };
};
