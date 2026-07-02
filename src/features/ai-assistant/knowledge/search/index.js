/**
 * Knowledge Search System
 * 
 * Public API for searching knowledge base.
 * Provides factory functions and exports for easy integration.
 */

// Core exports
export * from './interfaces/index.js';
export * from './strategies/index.js';
export * from './services/index.js';
export * from './utils/index.js';
export * from './constants.js';

// Factory functions
import { buildKnowledge } from '../builders/knowledgeBuilder.js';
import { KnowledgeSearchService } from './services/KnowledgeSearchService.js';
import { KeywordSearchStrategy } from './strategies/KeywordSearchStrategy.js';
import { SEARCH_STRATEGIES } from './constants.js';

/**
 * Create a fully configured search service
 * 
 * @param {string} language - Language code ('en' or 'es')
 * @param {Object} [options] - Configuration options
 * @param {string} [options.strategy] - Strategy type from SEARCH_STRATEGIES
 * @param {Object} [options.strategyConfig] - Strategy-specific configuration
 * @returns {Promise<KnowledgeSearchService>} Configured search service
 */
export async function createSearchService(language = 'en', options = {}) {
  // Build knowledge base (await the async function)
  const knowledgeBase = await buildKnowledge(language);
  
  // Create strategy
  let strategy;
  switch (options.strategy) {
    case SEARCH_STRATEGIES.KEYWORD:
    default:
      strategy = new KeywordSearchStrategy(options.strategyConfig);
      break;
    // Future: Add EMBEDDING and HYBRID strategies
  }
  
  // Create and return service
  return new KnowledgeSearchService(knowledgeBase, strategy);
}

/**
 * Quick search function (convenience wrapper)
 * 
 * @param {string} question - User question
 * @param {string} [language='en'] - Language code
 * @param {Object} [options] - Search options
 * @returns {Promise<import('./interfaces/ISearchResult.js').SearchResult[]>} Search results
 */
export async function quickSearch(question, language = 'en', options = {}) {
  const service = await createSearchService(language);
  return await service.search(question, options);
}
