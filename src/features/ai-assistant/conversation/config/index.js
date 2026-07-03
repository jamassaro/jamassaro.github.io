/**
 * Config exports
 * Central export point for configuration
 */

export { CONVERSATION_CONFIG, ERROR_CODES, ERROR_MESSAGES } from './conversationConfig.js';
export { 
  STATIC_PROMPTS, 
  PROMPT_CATEGORIES, 
  getPromptsByCategory, 
  getPromptById, 
  getRandomPrompts 
} from './suggestedPrompts.js';
