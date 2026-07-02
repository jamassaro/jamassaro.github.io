/**
 * Knowledge Search Service
 * 
 * SRP: Coordinates search operations using pluggable strategies.
 * Main entry point for searching knowledge base.
 */

import { IKnowledgeSearchService } from '../interfaces/IKnowledgeSearchService.js';
import { KeywordSearchStrategy } from '../strategies/KeywordSearchStrategy.js';

/**
 * Main search service implementation
 * Delegates search to pluggable strategies
 */
export class KnowledgeSearchService extends IKnowledgeSearchService {
  /**
   * @param {import('../../types/KnowledgeTypes.js').KnowledgeBase} knowledgeBase - Knowledge base to search
   * @param {import('../interfaces/ISearchStrategy.js').ISearchStrategy} [strategy] - Initial search strategy
   */
  constructor(knowledgeBase, strategy = null) {
    super();
    
    if (!knowledgeBase || !knowledgeBase.chunks) {
      throw new Error('KnowledgeSearchService requires valid knowledge base with chunks');
    }

    this.knowledgeBase = knowledgeBase;
    this.strategy = strategy || new KeywordSearchStrategy();
  }

  /**
   * Search knowledge with a question
   * 
   * @param {string} question - User question/query
   * @param {import('../interfaces/ISearchResult.js').SearchOptions} [options] - Search options
   * @returns {Promise<import('../interfaces/ISearchResult.js').SearchResult[]>} Top matching results
   */
  async search(question, options = {}) {
    if (!question || typeof question !== 'string') {
      throw new Error('Search question must be a non-empty string');
    }

    const trimmed = question.trim();
    if (trimmed.length === 0) {
      return [];
    }

    // Delegate to strategy
    return await this.strategy.search(trimmed, this.knowledgeBase.chunks, options);
  }

  /**
   * Set the search strategy (allows runtime switching)
   * 
   * @param {import('../interfaces/ISearchStrategy.js').ISearchStrategy} strategy - Search strategy to use
   */
  setStrategy(strategy) {
    if (!strategy || typeof strategy.search !== 'function') {
      throw new Error('Strategy must implement ISearchStrategy interface');
    }
    
    this.strategy = strategy;
  }

  /**
   * Get current strategy name
   * 
   * @returns {string} Strategy identifier
   */
  getStrategyName() {
    return this.strategy.getName();
  }

  /**
   * Update knowledge base (for dynamic updates)
   * 
   * @param {import('../../types/KnowledgeTypes.js').KnowledgeBase} knowledgeBase - New knowledge base
   */
  updateKnowledgeBase(knowledgeBase) {
    if (!knowledgeBase || !knowledgeBase.chunks) {
      throw new Error('Knowledge base must contain chunks array');
    }
    
    this.knowledgeBase = knowledgeBase;
  }

  /**
   * Get knowledge base statistics
   * 
   * @returns {Object} Statistics about current knowledge base
   */
  getStats() {
    return {
      totalChunks: this.knowledgeBase.chunks.length,
      totalDocuments: this.knowledgeBase.documents ? this.knowledgeBase.documents.length : 0,
      language: this.knowledgeBase.metadata?.language || 'unknown',
      strategy: this.getStrategyName(),
      categories: this.getCategoryDistribution(),
    };
  }

  /**
   * Get distribution of chunks by category
   * 
   * @returns {Object.<string, number>} Category counts
   */
  getCategoryDistribution() {
    const distribution = {};
    
    this.knowledgeBase.chunks.forEach(chunk => {
      const category = chunk.category.primary;
      distribution[category] = (distribution[category] || 0) + 1;
    });
    
    return distribution;
  }
}
