/**
 * Type definitions for AI Assistant Chat System
 * Following SRP: Single source of truth for type documentation
 */

/**
 * @typedef {Object} Message
 * @property {string} id - Unique message identifier
 * @property {'user' | 'assistant'} role - Message sender role
 * @property {string} content - Message text content
 * @property {Date} timestamp - Message creation time
 */

/**
 * @typedef {Object} QuickPrompt
 * @property {string} id - Unique prompt identifier
 * @property {string} label - Display label for button
 * @property {string} prompt - Full prompt text to send
 */

/**
 * @typedef {Object} PipelineStep
 * @property {number} number - Step number (1-5)
 * @property {string} label - Step description
 */

/**
 * @typedef {Object} TechBadge
 * @property {string} id - Unique badge identifier
 * @property {string} label - Badge text
 * @property {'tech' | 'feature'} variant - Badge visual style
 */

export const MESSAGE_ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
};

export const BADGE_VARIANTS = {
  TECH: 'tech',
  FEATURE: 'feature',
};
