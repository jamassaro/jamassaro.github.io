/**
 * IAIProvider - Abstract Base Class for AI Providers
 * 
 * SRP: Defines the contract that all AI providers must follow
 * DRY: Single interface definition for all provider implementations
 * 
 * This abstract class ensures all providers have a consistent interface,
 * enabling dependency injection and easy provider swapping.
 */

/**
 * @typedef {Object} ChatMessage
 * @property {'system'|'user'|'assistant'} role - Message role
 * @property {string} content - Message content
 */

/**
 * @typedef {Object} ChatResponse
 * @property {string} content - Generated response text
 * @property {number} tokens - Number of tokens used
 * @property {string} model - Model identifier
 * @property {number} processingTime - Time taken in milliseconds
 * @property {boolean} fromCache - Whether response was cached
 */

/**
 * @typedef {Object} ChatOptions
 * @property {Array} [searchResults] - Knowledge search results
 * @property {string} [language] - Response language
 * @property {number} [temperature] - Temperature (0-1)
 * @property {number} [maxTokens] - Maximum tokens to generate
 */

/**
 * @typedef {Object} ProviderInfo
 * @property {string} name - Provider name
 * @property {string} version - Provider version
 * @property {string} type - Provider type (mock, webllm, etc.)
 */

/**
 * Abstract base class for AI providers
 * All concrete providers must extend this class
 */
export class IAIProvider {
  /**
   * @param {Object} [config] - Provider configuration
   */
  constructor(config = {}) {
    if (new.target === IAIProvider) {
      throw new Error('Cannot instantiate abstract class IAIProvider');
    }
    this.config = config;
    this._isReady = false;
  }

  /**
   * Initialize the provider
   * Must be called before using the provider
   * @returns {Promise<void>}
   */
  async initialize() {
    throw new Error('initialize() must be implemented by subclass');
  }

  /**
   * Check if provider is ready to use
   * @returns {boolean} True if provider is initialized and ready
   */
  isReady() {
    return this._isReady;
  }

  /**
   * Generate a chat completion
   * @param {ChatMessage[]} messages - Conversation messages
   * @param {ChatOptions} [options] - Generation options
   * @returns {Promise<ChatResponse>} Chat response
   */
  async chat(messages, options = {}) {
    throw new Error('chat() must be implemented by subclass');
  }

  /**
   * Stream a chat completion
   * @param {ChatMessage[]} messages - Conversation messages
   * @param {ChatOptions} [options] - Generation options
   * @returns {AsyncGenerator<string>} Text stream
   */
  async *stream(messages, options = {}) {
    throw new Error('stream() must be implemented by subclass');
  }

  /**
   * Get provider information
   * @returns {ProviderInfo} Provider metadata
   */
  getInfo() {
    throw new Error('getInfo() must be implemented by subclass');
  }

  /**
   * Clean up provider resources
   * @returns {Promise<void>}
   */
  async dispose() {
    this._isReady = false;
  }
}
