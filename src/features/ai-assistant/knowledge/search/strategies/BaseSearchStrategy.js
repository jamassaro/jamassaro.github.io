/**
 * Base Search Strategy
 * 
 * SRP: Provides common search functionality for all strategies.
 * DRY: Shared filtering, sorting, and limiting logic.
 */

import { ISearchStrategy } from '../interfaces/ISearchStrategy.js';
import { SEARCH_CONFIG } from '../constants.js';

/**
 * Abstract base class for search strategies
 * Provides common post-processing functionality
 */
export class BaseSearchStrategy extends ISearchStrategy {
  /**
   * @param {Object} [config] - Strategy configuration
   * @param {number} [config.maxResults] - Maximum results to return
   * @param {number} [config.minScore] - Minimum score threshold
   */
  constructor(config = {}) {
    super();
    this.config = {
      maxResults: config.maxResults || SEARCH_CONFIG.DEFAULT_MAX_RESULTS,
      minScore: config.minScore || SEARCH_CONFIG.MIN_SCORE_THRESHOLD,
      ...config,
    };
  }

  /**
   * Filter results by minimum score threshold
   * 
   * @param {import('../interfaces/ISearchResult.js').SearchResult[]} results - Results to filter
   * @returns {import('../interfaces/ISearchResult.js').SearchResult[]} Filtered results
   */
  filterByScore(results) {
    return results.filter(r => r.score >= this.config.minScore);
  }

  /**
   * Sort results by score descending (highest first)
   * 
   * @param {import('../interfaces/ISearchResult.js').SearchResult[]} results - Results to sort
   * @returns {import('../interfaces/ISearchResult.js').SearchResult[]} Sorted results
   */
  sortByScore(results) {
    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Limit results to maximum count
   * 
   * @param {import('../interfaces/ISearchResult.js').SearchResult[]} results - Results to limit
   * @returns {import('../interfaces/ISearchResult.js').SearchResult[]} Limited results
   */
  limitResults(results) {
    return results.slice(0, this.config.maxResults);
  }

  /**
   * Apply filters based on options
   * 
   * @param {import('../interfaces/ISearchResult.js').SearchResult[]} results - Results to filter
   * @param {import('../interfaces/ISearchResult.js').SearchOptions} options - Filter options
   * @returns {import('../interfaces/ISearchResult.js').SearchResult[]} Filtered results
   */
  applyFilters(results, options) {
    let filtered = results;

    // Filter by category
    if (options.filterCategory) {
      filtered = filtered.filter(r => 
        r.chunk.category.primary === options.filterCategory
      );
    }

    // Filter by domain
    if (options.filterDomain) {
      filtered = filtered.filter(r => 
        r.chunk.category.domain === options.filterDomain
      );
    }

    // Filter by technologies
    if (options.filterTechnologies && options.filterTechnologies.length > 0) {
      filtered = filtered.filter(r => {
        const chunkTechs = r.chunk.metadata.technologies || [];
        return options.filterTechnologies.some(tech => 
          chunkTechs.some(ct => ct.toLowerCase() === tech.toLowerCase())
        );
      });
    }

    return filtered;
  }

  /**
   * Post-process results: filter, sort, limit
   * 
   * @param {import('../interfaces/ISearchResult.js').SearchResult[]} results - Raw results
   * @param {import('../interfaces/ISearchResult.js').SearchOptions} [options] - Processing options
   * @returns {import('../interfaces/ISearchResult.js').SearchResult[]} Processed results
   */
  postProcess(results, options = {}) {
    let processed = results;

    // Apply custom filters
    processed = this.applyFilters(processed, options);

    // Filter by score
    processed = this.filterByScore(processed);

    // Sort by score
    processed = this.sortByScore(processed);

    // Limit results
    processed = this.limitResults(processed);

    return processed;
  }

  /**
   * Create base search result object
   * 
   * @param {import('../../types/KnowledgeTypes.js').KnowledgeChunk} chunk - Knowledge chunk
   * @param {number} score - Relevance score
   * @param {Object} matches - Match details
   * @returns {import('../interfaces/ISearchResult.js').SearchResult} Search result
   */
  createResult(chunk, score, matches = {}) {
    return {
      chunk,
      score: Math.min(1.0, Math.max(0, score)), // Clamp to [0, 1]
      matches: {
        terms: [],
        locations: {},
        exactMatch: false,
        partialMatches: 0,
        ...matches,
      },
      metadata: {
        strategy: this.getName(),
        timestamp: new Date().toISOString(),
      },
    };
  }
}
