/**
 * Knowledge Search Service Interface
 * 
 * SRP: Defines contract for search service.
 * Decouples consumers from specific strategy implementations.
 */

/**
 * @interface IKnowledgeSearchService
 * 
 * Abstract interface for knowledge search service.
 * Provides high-level search API while delegating to pluggable strategies.
 */
export class IKnowledgeSearchService {
  /**
   * Search knowledge with a question
   * 
   * @param {string} question - User question/query
   * @param {import('./ISearchResult.js').SearchOptions} [options] - Search options
   * @returns {Promise<import('./ISearchResult.js').SearchResult[]>} Top matching results
   * @throws {Error} Must be implemented by subclass
   */
  async search(question, options = {}) {
    throw new Error('IKnowledgeSearchService.search() must be implemented by subclass');
  }

  /**
   * Set the search strategy (allows runtime switching)
   * 
   * @param {import('./ISearchStrategy.js').ISearchStrategy} strategy - Search strategy to use
   * @throws {Error} Must be implemented by subclass
   */
  setStrategy(strategy) {
    throw new Error('IKnowledgeSearchService.setStrategy() must be implemented by subclass');
  }

  /**
   * Get current strategy name
   * 
   * @returns {string} Strategy identifier
   * @throws {Error} Must be implemented by subclass
   */
  getStrategyName() {
    throw new Error('IKnowledgeSearchService.getStrategyName() must be implemented by subclass');
  }

  /**
   * Update knowledge base (for dynamic updates)
   * 
   * @param {import('../../types/KnowledgeTypes.js').KnowledgeBase} knowledgeBase - New knowledge base
   * @throws {Error} Must be implemented by subclass
   */
  updateKnowledgeBase(knowledgeBase) {
    throw new Error('IKnowledgeSearchService.updateKnowledgeBase() must be implemented by subclass');
  }
}
