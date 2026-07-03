/**
 * ConversationManager - Core Business Logic
 * 
 * SRP: Orchestrates conversation flow and response generation
 * DRY: Centralized conversation processing logic
 * 
 * Uses dependency injection for AI providers, making it easy to swap
 * between mock and real LLM implementations without modifying code.
 */

import { createSearchService } from '../../knowledge/search/index.js';
import { PromptBuilder } from '../services/PromptBuilder.js';
import { ContextBuilder } from '../services/ContextBuilder.js';
import { ActionParser } from '../services/ActionParser.js';
import { CONVERSATION_CONFIG, ERROR_CODES, ERROR_MESSAGES } from '../config/conversationConfig.js';
import { createError } from './conversationUtils.js';

/**
 * Main conversation manager class
 */
export class ConversationManager {
  /**
   * @param {Object} options - Manager options
   * @param {import('../providers/IAIProvider').IAIProvider} [options.aiProvider] - AI provider instance (injected)
   * @param {Partial<import('../types/conversation.types').ConversationConfig>} [options.config] - Configuration overrides
   */
  constructor({ aiProvider = null, config = {} } = {}) {
    this.config = { ...CONVERSATION_CONFIG, ...config };
    this.aiProvider = aiProvider; // Injected dependency
    this.knowledgeSearch = null;
    this.promptBuilder = new PromptBuilder();
    this.contextBuilder = new ContextBuilder();
    this.isInitialized = false;
  }

  /**
   * Initialize the conversation manager
   * @param {string} language - Language code
   */
  async initialize(language) {
    try {
      // Initialize knowledge search
      this.knowledgeSearch = await createSearchService(language);
      
      // Initialize AI provider if present and not ready
      if (this.aiProvider && !this.aiProvider.isReady()) {
        await this.aiProvider.initialize();
      }
      
      this.isInitialized = true;
    } catch (err) {
      console.error('Failed to initialize ConversationManager:', err);
      throw createError(
        'Failed to initialize conversation system',
        ERROR_CODES.UNKNOWN_ERROR,
        false,
        err
      );
    }
  }

  /**
   * Process a user message and generate response
   * @param {string} message - User message
   * @param {import('../types/conversation.types').ConversationState} conversationState - Current state
   * @returns {Promise<import('../types/conversation.types').ProcessMessageResult>} Processing result
   */
  async processMessage(message, conversationState) {
    if (!this.isInitialized) {
      throw createError(
        'ConversationManager not initialized',
        ERROR_CODES.UNKNOWN_ERROR,
        true
      );
    }

    try {
      // 1. Search knowledge base
      const searchResults = await this.searchKnowledge(message);
      
      // 2. Build context
      const context = this.contextBuilder.buildContext(conversationState, searchResults);
      
      // 3. Generate response
      const response = await this.generateResponse(message, context);
      
      // 4. Generate suggestions (future: based on response)
      const suggestions = this.generateSuggestions(conversationState, searchResults);
      
      return {
        response,
        searchResults,
        suggestions,
      };
    } catch (err) {
      console.error('Error processing message:', err);
      throw this.handleError(err);
    }
  }

  /**
   * Search knowledge base
   * @param {string} query - Search query
   * @returns {Promise<import('../types/conversation.types').SearchResult[]>} Search results
   */
  async searchKnowledge(query) {
    try {
      if (!this.knowledgeSearch) {
        return [];
      }
      
      const results = await this.knowledgeSearch.search(query);
      return results;
    } catch (err) {
      console.error('Knowledge search failed:', err);
      throw createError(
        ERROR_MESSAGES[ERROR_CODES.SEARCH_FAILED],
        ERROR_CODES.SEARCH_FAILED,
        true,
        err
      );
    }
  }

  /**
   * Generate response using AI provider
   * @param {string} message - User message
   * @param {import('../types/conversation.types').ConversationContext} context - Context
   * @returns {Promise<import('../types/conversation.types').ResponseData>} Response data
   */
  async generateResponse(message, context) {
    if (!this.aiProvider || !this.aiProvider.isReady()) {
      throw createError(
        'AI provider not available or not ready',
        ERROR_CODES.LLM_ERROR,
        true
      );
    }

    try {
      // Build messages for provider
      const messages = this.promptBuilder.buildChatMessages(context, message);
      
      // Call provider's chat method
      const response = await this.aiProvider.chat(messages, {
        searchResults: context.knowledge,
        language: context.language,
        temperature: this.config.temperature || 0.7,
        maxTokens: this.config.maxTokens || 500,
      });
      
      // Parse response to extract actions
      const { text, actions } = ActionParser.parseResponse(response.content);
      
      return {
        content: text,
        actions: actions,
        metadata: {
          searchResults: context.knowledge.map(r => r.chunk.id),
          processingTime: response.processingTime,
          model: response.model,
          tokens: response.tokens,
          hasActions: actions.length > 0,
        },
      };
    } catch (err) {
      console.error('Response generation failed:', err);
      throw createError(
        ERROR_MESSAGES[ERROR_CODES.GENERATION_FAILED],
        ERROR_CODES.GENERATION_FAILED,
        true,
        err
      );
    }
  }

  /**
   * Generate suggested prompts
   * @param {import('../types/conversation.types').ConversationState} state - Conversation state
   * @param {import('../types/conversation.types').SearchResult[]} searchResults - Search results
   * @returns {import('../types/conversation.types').SuggestedPrompt[]} Suggestions
   */
  generateSuggestions(state, searchResults) {
    // For now, return empty array (handled by useSuggestedPrompts hook)
    // Future: Generate dynamic suggestions based on response content
    return [];
  }

  /**
   * Update language
   * @param {string} language - New language code
   */
  async updateLanguage(language) {
    if (this.knowledgeSearch) {
      this.knowledgeSearch = await createSearchService(language);
    }
  }

  /**
   * Handle errors
   * @param {Error} err - Original error
   * @returns {import('../types/conversation.types').ConversationError} Formatted error
   */
  handleError(err) {
    if (err.code && ERROR_MESSAGES[err.code]) {
      return err;
    }
    
    return createError(
      err.message || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR],
      ERROR_CODES.UNKNOWN_ERROR,
      true,
      err
    );
  }

  /**
   * Delay utility (for mock responses)
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise<void>}
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get manager status
   * @returns {Object} Status information
   */
  getStatus() {
    return {
      initialized: this.isInitialized,
      hasProvider: !!this.aiProvider,
      providerReady: this.aiProvider ? this.aiProvider.isReady() : false,
      providerInfo: this.aiProvider ? this.aiProvider.getInfo() : null,
      hasSearch: !!this.knowledgeSearch,
    };
  }

  /**
   * Clean up resources
   * @returns {Promise<void>}
   */
  async dispose() {
    if (this.aiProvider) {
      await this.aiProvider.dispose();
    }
    this.knowledgeSearch = null;
    this.isInitialized = false;
  }
}

