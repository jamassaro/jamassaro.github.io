/**
 * useConversationHistory Hook
 * 
 * SRP: Manages conversation persistence to localStorage
 * DRY: Centralized storage operations
 */

import { useCallback, useEffect, useRef } from 'react';
import { CONVERSATION_CONFIG } from '../config/conversationConfig.js';

const STORAGE_KEY = CONVERSATION_CONFIG.STORAGE_KEY;

/**
 * Revive timestamps from JSON (convert ISO strings back to Date objects)
 * @param {Object} obj - Object with potential timestamp strings
 * @returns {Object} Object with Date objects
 */
function reviveTimestamps(obj) {
  if (!obj) return obj;
  
  // Revive message timestamps
  if (obj.messages && Array.isArray(obj.messages)) {
    obj.messages = obj.messages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
    }));
  }
  
  // Revive metadata timestamps
  if (obj.metadata) {
    if (obj.metadata.startedAt) {
      obj.metadata.startedAt = new Date(obj.metadata.startedAt);
    }
    if (obj.metadata.lastInteraction) {
      obj.metadata.lastInteraction = new Date(obj.metadata.lastInteraction);
    }
  }
  
  return obj;
}

/**
 * Hook for managing conversation history persistence
 * @param {Object} [options] - Hook options
 * @param {boolean} [options.autoSave] - Enable auto-save
 * @param {number} [options.debounceDelay] - Debounce delay for auto-save
 * @returns {Object} History operations
 */
export function useConversationHistory(options = {}) {
  const {
    autoSave = CONVERSATION_CONFIG.PERSIST_TO_LOCALSTORAGE,
    debounceDelay = CONVERSATION_CONFIG.AUTO_SAVE_DELAY,
  } = options;

  const saveTimeoutRef = useRef(null);

  /**
   * Load all conversations from storage
   * @returns {Object} Conversations object (keyed by conversation ID)
   */
  const loadFromStorage = useCallback(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (err) {
      console.error('Failed to load conversations from storage:', err);
      return {};
    }
  }, []);

  /**
   * Save all conversations to storage
   * @param {Object} conversations - Conversations object
   */
  const saveToStorage = useCallback((conversations) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (err) {
      console.error('Failed to save conversations to storage:', err);
      // Check if quota exceeded
      if (err.name === 'QuotaExceededError') {
        console.warn('Storage quota exceeded. Clearing old conversations...');
        clearOldConversations();
      }
    }
  }, []);

  /**
   * Save a conversation
   * @param {import('../types/conversation.types').ConversationState} state - Conversation state
   */
  const saveConversation = useCallback((state) => {
    const conversations = loadFromStorage();
    
    conversations[state.conversationId] = {
      conversationId: state.conversationId,
      messages: state.messages,
      metadata: state.metadata,
      language: state.language,
      timestamp: new Date().toISOString(),
    };
    
    saveToStorage(conversations);
  }, [loadFromStorage, saveToStorage]);

  /**
   * Save conversation with debounce
   * @param {import('../types/conversation.types').ConversationState} state - Conversation state
   */
  const debouncedSave = useCallback((state) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      saveConversation(state);
    }, debounceDelay);
  }, [saveConversation, debounceDelay]);

  /**
   * Load a conversation by ID
   * @param {string} conversationId - Conversation ID
   * @returns {Object|null} Conversation data or null
   */
  const loadConversation = useCallback((conversationId) => {
    const conversations = loadFromStorage();
    const conversation = conversations[conversationId] || null;
    return conversation ? reviveTimestamps(conversation) : null;
  }, [loadFromStorage]);

  /**
   * List all saved conversations
   * @returns {Array<Object>} Array of conversation summaries
   */
  const listConversations = useCallback(() => {
    const conversations = loadFromStorage();
    
    return Object.values(conversations)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map(conv => ({
        conversationId: conv.conversationId,
        messageCount: conv.messages?.length || 0,
        lastMessage: conv.messages?.[conv.messages.length - 1]?.content || '',
        timestamp: conv.timestamp,
        language: conv.language,
      }));
  }, [loadFromStorage]);

  /**
   * Delete a conversation
   * @param {string} conversationId - Conversation ID to delete
   */
  const deleteConversation = useCallback((conversationId) => {
    const conversations = loadFromStorage();
    delete conversations[conversationId];
    saveToStorage(conversations);
  }, [loadFromStorage, saveToStorage]);

  /**
   * Clear all conversations
   */
  const clearAllConversations = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear conversations:', err);
    }
  }, []);

  /**
   * Clear old conversations (keep only recent N)
   * @param {number} [keepCount=10] - Number of recent conversations to keep
   */
  const clearOldConversations = useCallback((keepCount = 10) => {
    const conversations = loadFromStorage();
    const sorted = Object.values(conversations)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    const toKeep = sorted.slice(0, keepCount);
    const newConversations = {};
    
    toKeep.forEach(conv => {
      newConversations[conv.conversationId] = conv;
    });
    
    saveToStorage(newConversations);
  }, [loadFromStorage, saveToStorage]);

  /**
   * Export conversation as JSON
   * @param {string} conversationId - Conversation ID
   * @returns {string} JSON string
   */
  const exportConversation = useCallback((conversationId) => {
    const conversation = loadConversation(conversationId);
    return conversation ? JSON.stringify(conversation, null, 2) : '{}';
  }, [loadConversation]);

  /**
   * Import conversation from JSON
   * @param {string} jsonString - JSON string
   * @returns {{success: boolean, error?: string}} Result
   */
  const importConversation = useCallback((jsonString) => {
    try {
      const conversation = JSON.parse(jsonString);
      
      if (!conversation.conversationId || !conversation.messages) {
        return { success: false, error: 'Invalid conversation format' };
      }
      
      const conversations = loadFromStorage();
      conversations[conversation.conversationId] = conversation;
      saveToStorage(conversations);
      
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [loadFromStorage, saveToStorage]);

  /**
   * Get storage statistics
   * @returns {Object} Storage stats
   */
  const getStorageStats = useCallback(() => {
    const conversations = loadFromStorage();
    const count = Object.keys(conversations).length;
    const totalMessages = Object.values(conversations).reduce(
      (sum, conv) => sum + (conv.messages?.length || 0),
      0
    );
    
    // Estimate storage size (rough)
    const jsonSize = JSON.stringify(conversations).length;
    const sizeInKB = (jsonSize / 1024).toFixed(2);
    
    return {
      conversationCount: count,
      totalMessages,
      estimatedSizeKB: parseFloat(sizeInKB),
    };
  }, [loadFromStorage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    // Save operations
    saveConversation,
    debouncedSave,
    
    // Load operations
    loadConversation,
    listConversations,
    
    // Delete operations
    deleteConversation,
    clearAllConversations,
    clearOldConversations,
    
    // Import/Export
    exportConversation,
    importConversation,
    
    // Utilities
    getStorageStats,
    
    // Auto-save flag
    autoSave,
  };
}
