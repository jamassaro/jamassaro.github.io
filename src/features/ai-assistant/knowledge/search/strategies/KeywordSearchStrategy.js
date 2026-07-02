/**
 * Keyword Search Strategy
 * 
 * SRP: Implements keyword-based search using term matching and scoring.
 * Simple, fast, and effective for structured knowledge.
 */

import { BaseSearchStrategy } from './BaseSearchStrategy.js';
import { SEARCH_STRATEGIES, SEARCH_CONFIG } from '../constants.js';
import { 
  extractKeywords, 
  hasExactPhrase, 
  termFrequency, 
  highlightMatches 
} from '../utils/textProcessor.js';
import { jaccardSimilarity } from '../utils/rankingUtils.js';

/**
 * Keyword-based search strategy
 * Scores chunks based on term matching, frequency, and bonuses
 */
export class KeywordSearchStrategy extends BaseSearchStrategy {
  /**
   * @param {Object} [config] - Strategy configuration
   */
  constructor(config = {}) {
    super(config);
  }

  /**
   * Get strategy name
   * 
   * @returns {string} Strategy identifier
   */
  getName() {
    return SEARCH_STRATEGIES.KEYWORD;
  }

  /**
   * Search knowledge chunks with keyword matching
   * 
   * @param {string} question - User question/query
   * @param {import('../../types/KnowledgeTypes.js').KnowledgeChunk[]} chunks - All knowledge chunks
   * @param {import('../interfaces/ISearchResult.js').SearchOptions} [options] - Search options
   * @returns {Promise<import('../interfaces/ISearchResult.js').SearchResult[]>} Ranked results
   */
  async search(question, chunks, options = {}) {
    const startTime = Date.now();

    // 1. Extract keywords from question
    const keywords = extractKeywords(question);
    
    if (keywords.length === 0) {
      return []; // No valid keywords
    }

    // 2. Score each chunk
    const results = chunks
      .map(chunk => {
        const { score, matches } = this.scoreChunk(chunk, question, keywords);
        
        if (score === 0) return null; // Skip non-matching chunks
        
        const result = this.createResult(chunk, score, matches);
        result.metadata.processingTime = Date.now() - startTime;
        
        return result;
      })
      .filter(Boolean); // Remove null entries

    // 3. Post-process: filter, sort, limit
    return this.postProcess(results, options);
  }

  /**
   * Score a single chunk against keywords
   * 
   * @param {import('../../types/KnowledgeTypes.js').KnowledgeChunk} chunk - Chunk to score
   * @param {string} question - Original question (for exact match)
   * @param {string[]} keywords - Extracted keywords
   * @returns {{score: number, matches: Object}} Score and match details
   */
  scoreChunk(chunk, question, keywords) {
    const content = this.getSearchableContent(chunk);
    const contentLower = content.toLowerCase();

    // 1. Check exact phrase match
    const exactMatch = hasExactPhrase(content, question);
    if (exactMatch) {
      return {
        score: SEARCH_CONFIG.WEIGHTS.EXACT_MATCH,
        matches: {
          terms: keywords,
          exactMatch: true,
          partialMatches: keywords.length,
          highlight: highlightMatches(content, keywords),
        },
      };
    }

    // 2. Calculate term matches
    const matchedTerms = [];
    const termLocations = {};
    let totalTermScore = 0;

    keywords.forEach(keyword => {
      const termScore = this.calculateTermScore(contentLower, keyword);
      if (termScore > 0) {
        matchedTerms.push(keyword);
        termLocations[keyword] = termFrequency(content, keyword);
        totalTermScore += termScore;
      }
    });

    // No matches = score 0
    if (matchedTerms.length === 0) {
      return {
        score: 0,
        matches: {
          terms: [],
          exactMatch: false,
          partialMatches: 0,
        },
      };
    }

    // 3. Calculate base score (average term score)
    let baseScore = totalTermScore / keywords.length;

    // 4. All terms matched bonus
    if (matchedTerms.length === keywords.length) {
      baseScore = baseScore * SEARCH_CONFIG.WEIGHTS.ALL_TERMS_MATCH;
    }

    // 5. Calculate bonuses
    const bonuses = this.calculateBonuses(chunk, keywords, matchedTerms);

    // 6. Final score = base + bonuses (clamped to [0, 1])
    const finalScore = Math.min(1.0, baseScore + bonuses);

    return {
      score: finalScore,
      matches: {
        terms: matchedTerms,
        locations: termLocations,
        exactMatch: false,
        partialMatches: matchedTerms.length,
        highlight: highlightMatches(content, matchedTerms),
      },
    };
  }

  /**
   * Calculate term score for a single keyword
   * 
   * @param {string} contentLower - Lowercase content
   * @param {string} keyword - Keyword to match
   * @returns {number} Term score (0-1)
   */
  calculateTermScore(contentLower, keyword) {
    const keywordLower = keyword.toLowerCase();
    
    // Term frequency in content
    const freq = (contentLower.match(new RegExp(`\\b${this.escapeRegex(keywordLower)}\\b`, 'g')) || []).length;
    
    if (freq === 0) return 0;
    
    // Score with diminishing returns for frequency
    // freq=1: 0.3, freq=2: 0.45, freq=3+: 0.6-0.7
    const baseScore = SEARCH_CONFIG.WEIGHTS.PARTIAL_MATCH_BASE;
    const freqBonus = Math.min(0.4, freq * 0.15);
    
    return Math.min(1.0, baseScore + freqBonus);
  }

  /**
   * Calculate bonuses based on metadata matches
   * 
   * @param {import('../../types/KnowledgeTypes.js').KnowledgeChunk} chunk - Chunk being scored
   * @param {string[]} keywords - All keywords
   * @param {string[]} matchedTerms - Terms that matched content
   * @returns {number} Total bonus score
   */
  calculateBonuses(chunk, keywords, matchedTerms) {
    let bonus = 0;

    const keywordSet = new Set(keywords.map(k => k.toLowerCase()));

    // 1. Category bonus
    if (chunk.category.primary && 
        keywordSet.has(chunk.category.primary.toLowerCase())) {
      bonus += SEARCH_CONFIG.WEIGHTS.CATEGORY_BONUS;
    }

    // Check secondary categories
    if (chunk.category.secondary && chunk.category.secondary.length > 0) {
      const categoryOverlap = chunk.category.secondary.filter(cat => 
        keywordSet.has(cat.toLowerCase())
      ).length;
      bonus += categoryOverlap * (SEARCH_CONFIG.WEIGHTS.CATEGORY_BONUS * 0.5);
    }

    // 2. Technology bonus
    if (chunk.metadata.technologies && chunk.metadata.technologies.length > 0) {
      const techSet = new Set(chunk.metadata.technologies.map(t => t.toLowerCase()));
      const techMatches = [...keywordSet].filter(k => techSet.has(k));
      bonus += techMatches.length * SEARCH_CONFIG.WEIGHTS.TECHNOLOGY_BONUS;
    }

    // 3. Domain bonus
    if (chunk.category.domain && 
        keywordSet.has(chunk.category.domain.toLowerCase())) {
      bonus += SEARCH_CONFIG.WEIGHTS.DOMAIN_BONUS;
    }

    // 4. Jaccard similarity bonus (overall keyword overlap)
    const contentWords = new Set(
      this.getSearchableContent(chunk)
        .toLowerCase()
        .split(/\s+/)
        .filter(w => w.length >= 3)
    );
    const similarity = jaccardSimilarity(keywordSet, contentWords);
    bonus += similarity * 0.1; // Small bonus for overall similarity

    return bonus;
  }

  /**
   * Get searchable content from chunk
   * Combines title and content for comprehensive search
   * 
   * @param {import('../../types/KnowledgeTypes.js').KnowledgeChunk} chunk - Knowledge chunk
   * @returns {string} Searchable text
   */
  getSearchableContent(chunk) {
    const parts = [];
    
    if (chunk.title) parts.push(chunk.title);
    if (chunk.content) parts.push(chunk.content);
    
    // Add metadata for richer matching
    if (chunk.metadata.technologies) {
      parts.push(chunk.metadata.technologies.join(' '));
    }
    
    return parts.join(' ');
  }

  /**
   * Escape special regex characters
   * 
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
