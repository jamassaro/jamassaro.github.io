/**
 * Type definitions for the conversation system
 * 
 * These types provide IDE support and documentation for the conversation architecture.
 * All types are defined using JSDoc for compatibility without TypeScript.
 */

/**
 * @typedef {'user'|'assistant'|'system'} MessageRole
 * The role of a message participant
 */

/**
 * @typedef {'pending'|'streaming'|'complete'|'error'} MessageStatus
 * The status of a message in its lifecycle
 */

/**
 * @typedef {'idle'|'loading'|'typing'|'error'} ConversationStatus
 * The overall status of the conversation
 */

/**
 * @typedef {Object} MessageMetadata
 * Additional metadata for a message
 * @property {string[]} [searchResults] - IDs of knowledge chunks used
 * @property {number} [tokens] - Token count (for LLM messages)
 * @property {number} [processingTime] - Time taken to generate (ms)
 * @property {string} [model] - Model used (e.g., 'mock-v1', 'Llama-3.2-3B')
 * @property {number} [score] - Relevance score (0-1)
 */

/**
 * @typedef {Object} Message
 * A single message in the conversation
 * @property {string} id - Unique message identifier
 * @property {MessageRole} role - Message sender role
 * @property {string} content - Message text content
 * @property {string} timestamp - ISO timestamp of message creation
 * @property {MessageStatus} status - Current message status
 * @property {MessageMetadata} [metadata] - Optional metadata
 */

/**
 * @typedef {Object} ConversationMetadata
 * Metadata about the conversation
 * @property {string} startedAt - ISO timestamp when conversation started
 * @property {number} messageCount - Total number of messages
 * @property {string} lastInteraction - ISO timestamp of last message
 * @property {number} totalTokens - Total tokens used (when available)
 */

/**
 * @typedef {Object} ConversationError
 * Error information for conversation issues
 * @property {string} message - Human-readable error message
 * @property {string} code - Error code (e.g., 'SEARCH_FAILED', 'GENERATION_FAILED')
 * @property {string} timestamp - ISO timestamp when error occurred
 * @property {boolean} recoverable - Whether the error can be retried
 * @property {*} [details] - Additional error details
 */

/**
 * @typedef {Object} ConversationState
 * Complete state of the conversation
 * @property {Message[]} messages - All conversation messages
 * @property {ConversationStatus} status - Current conversation status
 * @property {string|null} currentTypingMessage - Text being typed (null if not typing)
 * @property {string} conversationId - Unique conversation identifier
 * @property {string} language - Current language code ('en' or 'es')
 * @property {SuggestedPrompt[]} suggestedPrompts - Available prompt suggestions
 * @property {ConversationError|null} error - Current error (null if none)
 * @property {ConversationMetadata} metadata - Conversation metadata
 */

/**
 * @typedef {'expertise'|'projects'|'ventures'|'general'} PromptCategory
 * Category of a suggested prompt
 */

/**
 * @typedef {Object} SuggestedPrompt
 * A suggested prompt for the user
 * @property {string} id - Unique prompt identifier
 * @property {string} text - Prompt text to display
 * @property {PromptCategory} category - Prompt category
 * @property {string} [icon] - Optional emoji icon
 * @property {number} [relevanceScore] - Relevance to current context (0-1)
 */

/**
 * @typedef {Object} ConversationAction
 * Redux-style action for state updates
 * @property {string} type - Action type constant
 * @property {*} [payload] - Action payload data
 */

/**
 * @typedef {Object} SearchResult
 * Result from knowledge search
 * @property {import('../../knowledge/types/KnowledgeTypes').KnowledgeChunk} chunk - The knowledge chunk
 * @property {number} score - Relevance score (0-1)
 * @property {string[]} matchedTerms - Terms that matched in the search
 */

/**
 * @typedef {Object} ResponseData
 * Data for generating an assistant response
 * @property {string} content - Response text content
 * @property {import('./action.types.js').AIAction[]} [actions] - Actions to execute
 * @property {MessageMetadata} metadata - Response metadata
 */

/**
 * @typedef {Object} ProcessMessageResult
 * Result of processing a user message
 * @property {ResponseData} response - Generated response
 * @property {SearchResult[]} searchResults - Knowledge search results
 * @property {SuggestedPrompt[]} suggestions - Updated prompt suggestions
 */

/**
 * @typedef {Object} ConversationContext
 * Context for generating responses
 * @property {Message[]} history - Recent message history
 * @property {SearchResult[]} knowledge - Relevant knowledge chunks
 * @property {string} language - Current language
 * @property {string} systemPrompt - System prompt for LLM
 */

/**
 * @typedef {Object} ConversationConfig
 * Configuration for conversation behavior
 * @property {number} TYPING_SPEED - Milliseconds per character in typing animation
 * @property {number} TYPING_SPEED_FAST - Fast typing speed (ms/char)
 * @property {number} MAX_HISTORY_MESSAGES - Maximum messages to keep
 * @property {number} MAX_SUGGESTIONS - Maximum prompt suggestions to show
 * @property {number} MAX_SEARCH_RESULTS - Maximum knowledge results to use
 * @property {number} MIN_SEARCH_SCORE - Minimum relevance score threshold
 * @property {number} MOCK_RESPONSE_DELAY - Artificial delay for mock responses (ms)
 * @property {boolean} PERSIST_TO_LOCALSTORAGE - Enable localStorage persistence
 * @property {boolean} UPDATE_SUGGESTIONS_ON_MESSAGE - Update prompts after each message
 */

/**
 * @typedef {Object} ConversationHookOptions
 * Options for useConversation hook
 * @property {string} [language='en'] - Language code
 * @property {boolean} [persistHistory=true] - Enable persistence
 * @property {Partial<ConversationConfig>} [config] - Override config values
 */

/**
 * @typedef {Object} ConversationHookResult
 * Return value of useConversation hook
 * @property {ConversationState} state - Current state
 * @property {Message[]} messages - All messages
 * @property {boolean} isLoading - Loading state
 * @property {boolean} isTyping - Typing animation active
 * @property {ConversationError|null} error - Current error
 * @property {(text: string) => Promise<void>} sendMessage - Send user message
 * @property {(messageId: string) => Promise<void>} regenerateResponse - Regenerate response
 * @property {() => void} clearHistory - Clear all messages
 * @property {SuggestedPrompt[]} suggestedPrompts - Available prompts
 * @property {(promptId: string) => void} selectPrompt - Use a suggested prompt
 * @property {() => string} exportConversation - Export as JSON
 * @property {() => void} resetConversation - Reset to initial state
 * @property {() => void} clearError - Clear error state
 */

// Export empty object to make this a proper ES module
export {};
