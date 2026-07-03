/**
 * AIProviderFactory - Factory for Creating AI Providers
 * 
 * SRP: Responsible only for creating provider instances
 * DRY: Centralized provider instantiation logic
 * 
 * This factory allows easy creation and switching between different
 * AI provider implementations without modifying consumer code.
 */

import { MockAIProvider } from './MockAIProvider.js';
import { WebLLMProvider } from './WebLLMProvider.js';

/**
 * Supported provider types
 */
export const PROVIDER_TYPES = {
  MOCK: 'mock',
  WEBLLM: 'webllm',
};

/**
 * Factory class for creating AI provider instances
 */
export class AIProviderFactory {
  /**
   * Create a provider instance by type
   * @param {string} [type='mock'] - Provider type ('mock' or 'webllm')
   * @param {Object} [config={}] - Provider configuration
   * @returns {import('./IAIProvider').IAIProvider} Provider instance
   * @throws {Error} If provider type is unknown
   */
  static create(type = PROVIDER_TYPES.MOCK, config = {}) {
    switch (type.toLowerCase()) {
      case PROVIDER_TYPES.MOCK:
        return new MockAIProvider(config);

      case PROVIDER_TYPES.WEBLLM:
        return new WebLLMProvider(config);

      default:
        throw new Error(
          `Unknown provider type: "${type}". ` +
          `Supported types: ${Object.values(PROVIDER_TYPES).join(', ')}`
        );
    }
  }

  /**
   * Create default provider (mock)
   * @param {Object} [config={}] - Provider configuration
   * @returns {import('./IAIProvider').IAIProvider} Mock provider instance
   */
  static createDefault(config = {}) {
    return AIProviderFactory.create(PROVIDER_TYPES.MOCK, config);
  }

  /**
   * Create mock provider (alias for clarity)
   * @param {Object} [config={}] - Provider configuration
   * @returns {MockAIProvider} Mock provider instance
   */
  static createMock(config = {}) {
    return new MockAIProvider(config);
  }

  /**
   * Create WebLLM provider (alias for clarity)
   * @param {Object} [config={}] - Provider configuration
   * @returns {WebLLMProvider} WebLLM provider instance
   */
  static createWebLLM(config = {}) {
    return new WebLLMProvider(config);
  }

  /**
   * Get list of supported provider types
   * @returns {string[]} Array of supported provider types
   */
  static getSupportedTypes() {
    return Object.values(PROVIDER_TYPES);
  }

  /**
   * Check if a provider type is supported
   * @param {string} type - Provider type to check
   * @returns {boolean} True if supported
   */
  static isTypeSupported(type) {
    return Object.values(PROVIDER_TYPES).includes(type.toLowerCase());
  }
}
