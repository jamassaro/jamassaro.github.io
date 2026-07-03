/**
 * useMessages Hook
 * 
 * SRP: Handles message CRUD operations
 * DRY: Centralized message management logic
 */

import { useCallback } from 'react';
import { conversationActions } from '../core/conversationActions.js';
import {
  validateMessageContent,
  filterMessagesByRole,
  getLastMessages,
  isMessageComplete,
  isMessageError,
} from '../core/conversationUtils.js';

/**
 * Hook for managing messages
 * @param {import('../types/conversation.types').ConversationState} state - Current conversation state
 * @param {Function} dispatch - Dispatch function from reducer
 * @returns {Object} Message operations
 */
export function useMessages(state, dispatch) {
  /**
   * Add a user message
   * @param {string} content - Message content
   * @returns {{success: boolean, error?: string}} Result
   */
  const addUserMessage = useCallback((content) => {
    const validation = validateMessageContent(content);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }
    
    dispatch(conversationActions.addUserMessage(content));
    return { success: true };
  }, [dispatch]);

  /**
   * Add an assistant message
   * @param {string} content - Message content
   * @param {import('../types/conversation.types').MessageMetadata} [metadata] - Message metadata
   */
  const addAssistantMessage = useCallback((content, metadata) => {
    dispatch(conversationActions.addAssistantMessage(content, metadata));
  }, [dispatch]);

  /**
   * Add a system message
   * @param {string} content - Message content
   */
  const addSystemMessage = useCallback((content) => {
    dispatch(conversationActions.addSystemMessage(content));
  }, [dispatch]);

  /**
   * Update an existing message
   * @param {string} id - Message ID
   * @param {Partial<import('../types/conversation.types').Message>} updates - Updates to apply
   */
  const updateMessage = useCallback((id, updates) => {
    dispatch(conversationActions.updateMessage(id, updates));
  }, [dispatch]);

  /**
   * Delete a message
   * @param {string} id - Message ID
   */
  const deleteMessage = useCallback((id) => {
    dispatch(conversationActions.deleteMessage(id));
  }, [dispatch]);

  /**
   * Get messages by role
   * @param {import('../types/conversation.types').MessageRole} role - Role to filter by
   * @returns {import('../types/conversation.types').Message[]} Filtered messages
   */
  const getMessagesByRole = useCallback((role) => {
    return filterMessagesByRole(state.messages, role);
  }, [state.messages]);

  /**
   * Get last N messages
   * @param {number} count - Number of messages
   * @returns {import('../types/conversation.types').Message[]} Last N messages
   */
  const getRecentMessages = useCallback((count) => {
    return getLastMessages(state.messages, count);
  }, [state.messages]);

  /**
   * Get message by ID
   * @param {string} id - Message ID
   * @returns {import('../types/conversation.types').Message|undefined} Message or undefined
   */
  const getMessageById = useCallback((id) => {
    return state.messages.find(msg => msg.id === id);
  }, [state.messages]);

  /**
   * Check if last message is complete
   * @returns {boolean} True if last message is complete
   */
  const isLastMessageComplete = useCallback(() => {
    if (state.messages.length === 0) return true;
    const lastMessage = state.messages[state.messages.length - 1];
    return isMessageComplete(lastMessage);
  }, [state.messages]);

  /**
   * Check if last message has error
   * @returns {boolean} True if last message has error
   */
  const isLastMessageError = useCallback(() => {
    if (state.messages.length === 0) return false;
    const lastMessage = state.messages[state.messages.length - 1];
    return isMessageError(lastMessage);
  }, [state.messages]);

  /**
   * Get conversation statistics
   * @returns {Object} Message statistics
   */
  const getStatistics = useCallback(() => {
    const userMessages = filterMessagesByRole(state.messages, 'user');
    const assistantMessages = filterMessagesByRole(state.messages, 'assistant');
    const systemMessages = filterMessagesByRole(state.messages, 'system');
    
    return {
      total: state.messages.length,
      user: userMessages.length,
      assistant: assistantMessages.length,
      system: systemMessages.length,
      complete: state.messages.filter(isMessageComplete).length,
      error: state.messages.filter(isMessageError).length,
    };
  }, [state.messages]);

  return {
    // State
    messages: state.messages,
    
    // CRUD operations
    addUserMessage,
    addAssistantMessage,
    addSystemMessage,
    updateMessage,
    deleteMessage,
    
    // Queries
    getMessagesByRole,
    getRecentMessages,
    getMessageById,
    isLastMessageComplete,
    isLastMessageError,
    getStatistics,
  };
}
