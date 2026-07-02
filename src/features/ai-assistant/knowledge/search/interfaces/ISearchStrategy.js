/**
 * Search Strategy Interface
 * 
 * SRP: Defines contract for search algorithms.
 * Any search implementation (keyword, embedding, hybrid) must implement this interface.
 */

/**
 * @interface ISearchStrategy
 * 
 * Abstract interface for search strategies.
 * Implementations must provide search logic and return ranked results.
 */
export class ISearchStrategy {
  /**
   * Search knowledge chunks with a question
   * 
   * @param {string} question - User question/query
   * @param {import('../../types/KnowledgeTypes.js').KnowledgeChunk[]} chunks - All knowledge chunks to search
   * @param {import('./ISearchResult.js').SearchOptions} [options] - Search configuration options
   * @returns {Promise<import('./ISearchResult.js').SearchResult[]>} Ranked search results
   * @throws {Error} Must be implemented by subclass
   */
  async search(question, chunks, options = {}) {
    throw new Error('ISearchStrategy.search() must be implemented by subclass');
  }

  /**
   * Get strategy name
   * 
   * @returns {string} Strategy identifier
   * @throws {Error} Must be implemented by subclass
   */
  getName() {
    throw new Error('ISearchStrategy.getName() must be implemented by subclass');
  }
}
