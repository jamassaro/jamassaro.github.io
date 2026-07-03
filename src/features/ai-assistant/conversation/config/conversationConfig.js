/**
 * Configuration constants for conversation system
 * 
 * SRP: Centralized configuration in one place
 * DRY: Single source of truth for all config values
 */

/**
 * @type {import('../types/conversation.types').ConversationConfig}
 */
export const CONVERSATION_CONFIG = {
  // Typing animation (optimized for smoothness)
  TYPING_SPEED: 10, // ms per character (fast, smooth UX)
  TYPING_SPEED_FAST: 5, // ms per character (instant mode)
  
  // History management
  MAX_HISTORY_MESSAGES: 50, // Maximum messages to keep in state
  
  // Suggestions
  MAX_SUGGESTIONS: 4, // Maximum prompt suggestions to display
  UPDATE_SUGGESTIONS_ON_MESSAGE: true, // Update prompts after each message
  
  // Knowledge search
  MAX_SEARCH_RESULTS: 3, // Maximum knowledge chunks to use
  MIN_SEARCH_SCORE: 0.3, // Minimum relevance score threshold
  
  // Response generation
  MOCK_RESPONSE_DELAY: 500, // Artificial delay for mock responses (ms)
  MOCK_RESPONSE_MIN_LENGTH: 50, // Minimum response length (characters)
  MOCK_RESPONSE_MAX_LENGTH: 500, // Maximum response length (characters)
  
  // Persistence
  PERSIST_TO_LOCALSTORAGE: true, // Enable localStorage persistence
  STORAGE_KEY: 'ai-assistant-conversations', // localStorage key
  AUTO_SAVE_DELAY: 1000, // Debounce delay for auto-save (ms)
  
  // Validation
  MAX_MESSAGE_LENGTH: 2000, // Maximum user message length
  MIN_MESSAGE_LENGTH: 1, // Minimum user message length
  
  // Error handling
  MAX_RETRY_ATTEMPTS: 3, // Maximum retry attempts for errors
  RETRY_DELAY: 1000, // Delay between retries (ms)
  
  // Performance
  DEBOUNCE_TYPING: 300, // Debounce delay for typing input (ms)
  THROTTLE_SEARCH: 500, // Throttle delay for search requests (ms)
};

/**
 * Error codes
 */
export const ERROR_CODES = {
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  SEARCH_FAILED: 'SEARCH_FAILED',
  GENERATION_FAILED: 'GENERATION_FAILED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  STORAGE_ERROR: 'STORAGE_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  LLM_ERROR: 'LLM_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
};

/**
 * Default error messages
 */
export const ERROR_MESSAGES = {
  [ERROR_CODES.VALIDATION_FAILED]: 'Invalid message content',
  [ERROR_CODES.SEARCH_FAILED]: 'Failed to search knowledge base',
  [ERROR_CODES.GENERATION_FAILED]: 'Failed to generate response',
  [ERROR_CODES.NETWORK_ERROR]: 'Network connection error',
  [ERROR_CODES.STORAGE_ERROR]: 'Failed to save conversation',
  [ERROR_CODES.UNKNOWN_ERROR]: 'An unexpected error occurred',
  [ERROR_CODES.LLM_ERROR]: 'Language model error',
  [ERROR_CODES.TIMEOUT_ERROR]: 'Request timed out',
};
