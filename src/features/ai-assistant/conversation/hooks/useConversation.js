/**
 * useConversation Hook - Main Orchestrator
 * 
 * SRP: Orchestrates all conversation functionality through sub-hooks
 * DRY: Single unified interface for components
 * 
 * This is the main hook that components should use.
 * It combines all sub-hooks and the ConversationManager.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useConversationState } from './useConversationState.js';
import { useMessages } from './useMessages.js';
import { useTypingAnimation } from './useTypingAnimation.js';
import { useSuggestedPrompts } from './useSuggestedPrompts.js';
import { useConversationHistory } from './useConversationHistory.js';
import { useActionHandler } from './useActionHandler.js';
import { ConversationManager } from '../core/ConversationManager.js';
import { conversationActions } from '../core/conversationActions.js';
import { validateMessageContent, createError } from '../core/conversationUtils.js';
import { CONVERSATION_CONFIG, ERROR_CODES, ERROR_MESSAGES } from '../config/conversationConfig.js';
import { AIProviderFactory, PROVIDER_TYPES } from '../providers/providerFactory.js';

/**
 * Main conversation hook - unified interface for components
 * @param {import('../types/conversation.types').ConversationHookOptions} [options] - Hook options
 * @returns {import('../types/conversation.types').ConversationHookResult} Conversation interface
 */
export function useConversation(options = {}) {
  const {
    language = 'en',
    persistHistory = true,
    config: userConfig = {},
    providerType = PROVIDER_TYPES.MOCK,
    providerConfig = {},
    autoInitialize = true,
  } = options;

  // Initialize conversation state
  const { state, dispatch } = useConversationState({
    language,
  });

  // Initialize ConversationManager with injected AI provider
  const [manager] = useState(() => {
    // Create AI provider using factory
    const aiProvider = AIProviderFactory.create(providerType, providerConfig);
    
    // Inject provider into manager
    return new ConversationManager({
      aiProvider,
      config: userConfig,
    });
  });
  
  const [isInitializing, setIsInitializing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [shouldInitialize, setShouldInitialize] = useState(autoInitialize);

  // Initialize manager (auto or manual)
  useEffect(() => {
    if (shouldInitialize && !isInitializing && !isReady) {
      setIsInitializing(true);
      
      manager.initialize(language)
        .then(() => {
          setIsReady(true);
          setIsInitializing(false);
        })
        .catch((err) => {
          console.error('Failed to initialize conversation:', err);
          dispatch(conversationActions.setError(err));
          setIsInitializing(false);
        });
    }
  }, [shouldInitialize, manager, language, dispatch, isReady, isInitializing]);

  // Update language when changed
  useEffect(() => {
    if (isReady && state.language !== language) {
      manager.updateLanguage(language)
        .then(() => {
          dispatch(conversationActions.setLanguage(language));
        })
        .catch((err) => {
          console.error('Failed to update language:', err);
        });
    }
  }, [language, state.language, manager, isReady, dispatch]);

  // Sub-hooks
  const messages = useMessages(state, dispatch);
  const typing = useTypingAnimation();
  const suggestions = useSuggestedPrompts(state);
  const history = useConversationHistory({ autoSave: persistHistory });
  const actionHandler = useActionHandler();

  // Auto-save conversation when messages change (debounced)
  useEffect(() => {
    if (persistHistory && state.messages.length > 0 && isReady) {
      history.debouncedSave(state);
    }
  }, [state.messages.length, persistHistory, isReady]);
  // Note: history.debouncedSave is stable (useCallback), state is passed as arg

  /**
   * Send a user message
   * @param {string} text - Message text
   * @returns {Promise<void>}
   */
  const sendMessage = useCallback(async (text) => {
    // Validate message
    const validation = validateMessageContent(text);
    if (!validation.valid) {
      const error = createError(
        validation.error,
        ERROR_CODES.VALIDATION_FAILED,
        true
      );
      dispatch(conversationActions.setError(error));
      return;
    }

    if (!isReady) {
      const error = createError(
        'Conversation system not ready',
        ERROR_CODES.UNKNOWN_ERROR,
        true
      );
      dispatch(conversationActions.setError(error));
      return;
    }

    try {
      // Clear any previous errors
      dispatch(conversationActions.clearError());

      // Add user message
      dispatch(conversationActions.addUserMessage(text));

      // Set loading state
      dispatch(conversationActions.setLoading());

      // Process message
      const result = await manager.processMessage(text, state);

      // Start typing animation
      dispatch(conversationActions.startTyping(result.response.content));
      typing.startTyping(result.response.content);

      // Wait for typing animation to complete
      await waitForTyping(typing);

      // Add assistant message
      dispatch(conversationActions.addAssistantMessage(
        result.response.content,
        result.response.metadata
      ));

      // Finish typing
      dispatch(conversationActions.finishTyping());

      // Execute actions if any
      if (result.response.actions && result.response.actions.length > 0) {
        // Execute actions after a small delay to let user see the message
        setTimeout(async () => {
          try {
            await actionHandler.executeActions(result.response.actions);
          } catch (actionErr) {
            // Don't fail the entire conversation on action errors
          }
        }, 500);
      }

      // Update suggestions if available
      if (result.suggestions && result.suggestions.length > 0) {
        dispatch(conversationActions.updateSuggestions(result.suggestions));
      }

      // Set back to idle
      dispatch(conversationActions.setIdle());
    } catch (err) {
      
      const error = err.code 
        ? err 
        : createError(
            err.message || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR],
            ERROR_CODES.UNKNOWN_ERROR,
            true,
            err
          );
      
      dispatch(conversationActions.setError(error));
      dispatch(conversationActions.finishTyping());
      
      // IMPORTANT: Reset to idle after error to allow retry
      setTimeout(() => {
        dispatch(conversationActions.setIdle());
      }, 100);
    }
  }, [isReady, state, dispatch, manager, typing, actionHandler]);

  /**
   * Manually initialize the conversation system
   * Used for on-demand initialization
   */
  const initialize = useCallback(() => {
    if (!isReady && !isInitializing) {
      setShouldInitialize(true);
    }
  }, [isReady, isInitializing]);

  /**
   * Regenerate the last assistant response
   * @param {string} [messageId] - Message ID to regenerate (defaults to last)
   * @returns {Promise<void>}
   */
  const regenerateResponse = useCallback(async (messageId) => {
    // Find the message to regenerate
    const targetMessage = messageId 
      ? messages.getMessageById(messageId)
      : state.messages.filter(m => m.role === 'assistant').pop();

    if (!targetMessage) {
      console.warn('No message to regenerate');
      return;
    }

    // Find the user message before it
    const messageIndex = state.messages.findIndex(m => m.id === targetMessage.id);
    const userMessage = state.messages
      .slice(0, messageIndex)
      .filter(m => m.role === 'user')
      .pop();

    if (!userMessage) {
      console.warn('No user message found');
      return;
    }

    try {
      // Delete the old assistant message
      messages.deleteMessage(targetMessage.id);

      // Process again
      dispatch(conversationActions.setLoading());
      const result = await manager.processMessage(userMessage.content, state);

      // Start typing
      dispatch(conversationActions.startTyping(result.response.content));
      typing.startTyping(result.response.content);

      await waitForTyping(typing);

      // Add new response
      dispatch(conversationActions.addAssistantMessage(
        result.response.content,
        result.response.metadata
      ));

      dispatch(conversationActions.finishTyping());
      dispatch(conversationActions.setIdle());
    } catch (err) {
      console.error('Error regenerating response:', err);
      dispatch(conversationActions.setError(err));
    }
  }, [state, messages, dispatch, manager, typing]);

  /**
   * Clear conversation history
   */
  const clearHistory = useCallback(() => {
    dispatch(conversationActions.resetConversation());
  }, [dispatch]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    dispatch(conversationActions.clearError());
  }, [dispatch]);

  /**
   * Select a suggested prompt
   * @param {string} promptId - Prompt ID
   */
  const selectPrompt = useCallback((promptId) => {
    const text = suggestions.selectPrompt(promptId);
    if (text) {
      sendMessage(text);
    }
  }, [suggestions, sendMessage]);

  /**
   * Export conversation as JSON
   * @returns {string} JSON string
   */
  const exportConversation = useCallback(() => {
    return JSON.stringify({
      conversationId: state.conversationId,
      messages: state.messages,
      metadata: state.metadata,
      language: state.language,
      timestamp: new Date().toISOString(),
    }, null, 2);
  }, [state]);

  /**
   * Reset conversation to initial state
   */
  const resetConversation = useCallback(() => {
    dispatch(conversationActions.resetConversation());
  }, [dispatch]);

  /**
   * Load a saved conversation
   * @param {string} conversationId - Conversation ID to load
   */
  const loadConversation = useCallback((conversationId) => {
    const saved = history.loadConversation(conversationId);
    if (saved) {
      dispatch(conversationActions.loadConversation(saved));
    }
  }, [history, dispatch]);

  // Computed values
  const isLoading = state.status === 'loading';
  const isTyping = state.status === 'typing' || typing.isTyping;

  /**
   * Skip typing animation
   */
  const skipTyping = useCallback(() => {
    typing.skipToEnd();
    dispatch(conversationActions.finishTyping());
    dispatch(conversationActions.setIdle());
  }, [typing, dispatch]);

  return {
    // State
    state,
    messages: state.messages,
    isLoading,
    isTyping,
    error: state.error,
    isReady,
    isInitializing,
    
    // Actions
    sendMessage,
    regenerateResponse,
    clearHistory,
    clearError,
    initialize,
    skipTyping,
    
    // Suggestions
    suggestedPrompts: suggestions.prompts,
    selectPrompt,
    refreshSuggestions: suggestions.refreshPrompts,
    
    // Utilities
    exportConversation,
    resetConversation,
    loadConversation,
    
    // History
    listConversations: history.listConversations,
    deleteConversation: history.deleteConversation,
    
    // Advanced
    manager,
    dispatch,
  };
}

/**
 * Wait for typing animation to complete
 * @param {Object} typing - Typing animation object
 * @returns {Promise<void>}
 */
function waitForTyping(typing) {
  return new Promise((resolve) => {
    let checkCount = 0;
    const maxChecks = 200; // 10 seconds max (200 * 50ms)
    
    const checkInterval = setInterval(() => {
      checkCount++;
      
      if (!typing.isTyping) {
        clearInterval(checkInterval);
        resolve();
      } else if (checkCount >= maxChecks) {
        clearInterval(checkInterval);
        resolve(); // Resolve anyway to prevent hanging
      }
    }, 50); // Poll every 50ms instead of 100ms for better responsiveness
  });
}
