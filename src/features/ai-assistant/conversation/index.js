/**
 * Conversation System - Public API
 * 
 * Main entry point for the conversation architecture.
 * Import from here to use the conversation system.
 */

// Main hook (primary export)
export { useConversation } from './hooks/useConversation.js';

// Sub-hooks (for advanced use)
export {
  useConversationState,
  useMessages,
  useTypingAnimation,
  useSimpleTyping,
  useSuggestedPrompts,
  useConversationHistory,
} from './hooks/index.js';

// Core
export {
  ConversationManager,
  conversationReducer,
  initialConversationState,
  conversationActions,
  ActionTypes,
} from './core/index.js';

// Services
export {
  ResponseGenerator,
  PromptBuilder,
  ContextBuilder,
} from './services/index.js';

// Configuration
export {
  CONVERSATION_CONFIG,
  ERROR_CODES,
  ERROR_MESSAGES,
  STATIC_PROMPTS,
  PROMPT_CATEGORIES,
  getPromptsByCategory,
  getPromptById,
  getRandomPrompts,
} from './config/index.js';

// Types (JSDoc definitions)
export * from './types/index.js';
