/**
 * MockAIProvider - Mock Implementation of IAIProvider
 * 
 * SRP: Provides mock responses using ResponseGenerator
 * DRY: Reuses existing ResponseGenerator logic
 * 
 * This provider generates responses based on knowledge search results
 * without requiring an actual LLM. Perfect for development and testing.
 */

import { IAIProvider } from './IAIProvider.js';
import { ResponseGenerator } from '../services/ResponseGenerator.js';

/**
 * Mock AI Provider for development and testing
 * Uses ResponseGenerator with knowledge search results
 */
export class MockAIProvider extends IAIProvider {
  /**
   * @param {Object} [config] - Provider configuration
   * @param {number} [config.delay=500] - Simulated processing delay (ms)
   * @param {number} [config.minDelay=200] - Minimum delay (ms)
   * @param {number} [config.maxDelay=1000] - Maximum delay (ms)
   */
  constructor(config = {}) {
    super(config);
    this.responseGenerator = new ResponseGenerator();
    this.delay = config.delay || 500;
    this.minDelay = config.minDelay || 200;
    this.maxDelay = config.maxDelay || 1000;
  }

  /**
   * Initialize the mock provider (instant)
   * @returns {Promise<void>}
   */
  async initialize() {
    // Simulate minimal initialization delay
    await this._delay(50);
    this._isReady = true;
  }

  /**
   * Generate a chat completion using mock logic
   * @param {import('./IAIProvider').ChatMessage[]} messages - Conversation messages
   * @param {import('./IAIProvider').ChatOptions} [options] - Generation options
   * @returns {Promise<import('./IAIProvider').ChatResponse>} Chat response
   */
  async chat(messages, options = {}) {
    if (!this._isReady) {
      throw new Error('MockAIProvider not initialized. Call initialize() first.');
    }

    const startTime = Date.now();

    // Simulate processing delay
    const processingDelay = this._getRandomDelay();
    await this._delay(processingDelay);

    // Extract the last user message
    const userMessage = this._extractUserMessage(messages);

    // Extract context from options
    const searchResults = options.searchResults || [];
    const language = options.language || 'en';

    // Generate response using existing ResponseGenerator
    const responseData = this.responseGenerator.generateMockResponse(
      userMessage,
      searchResults,
      language
    );

    const processingTime = Date.now() - startTime;

    return {
      content: responseData.content,
      tokens: responseData.metadata.tokens,
      model: 'mock-v1',
      processingTime,
      fromCache: false,
    };
  }

  /**
   * Stream a chat completion (simulated streaming)
   * @param {import('./IAIProvider').ChatMessage[]} messages - Conversation messages
   * @param {import('./IAIProvider').ChatOptions} [options] - Generation options
   * @returns {AsyncGenerator<string>} Text stream
   */
  async *stream(messages, options = {}) {
    if (!this._isReady) {
      throw new Error('MockAIProvider not initialized. Call initialize() first.');
    }

    // Generate full response first
    const response = await this.chat(messages, options);
    const text = response.content;

    // Stream character by character (or in small chunks)
    const chunkSize = 3; // Characters per chunk
    const streamDelay = 30; // ms between chunks

    for (let i = 0; i < text.length; i += chunkSize) {
      await this._delay(streamDelay);
      yield text.slice(i, i + chunkSize);
    }
  }

  /**
   * Get provider information
   * @returns {import('./IAIProvider').ProviderInfo} Provider metadata
   */
  getInfo() {
    return {
      name: 'MockAIProvider',
      version: '1.0.0',
      type: 'mock',
    };
  }

  /**
   * Clean up provider resources
   * @returns {Promise<void>}
   */
  async dispose() {
    await super.dispose();
    this.responseGenerator = null;
  }

  /**
   * Extract user message from messages array
   * @param {import('./IAIProvider').ChatMessage[]} messages - All messages
   * @returns {string} Last user message content
   * @private
   */
  _extractUserMessage(messages) {
    // Find the last user message
    const userMessages = messages.filter(msg => msg.role === 'user');
    return userMessages.length > 0 
      ? userMessages[userMessages.length - 1].content 
      : '';
  }

  /**
   * Get random delay within configured range
   * @returns {number} Delay in milliseconds
   * @private
   */
  _getRandomDelay() {
    if (this.config.randomDelay) {
      return Math.random() * (this.maxDelay - this.minDelay) + this.minDelay;
    }
    return this.delay;
  }

  /**
   * Delay utility
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise<void>}
   * @private
   */
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
