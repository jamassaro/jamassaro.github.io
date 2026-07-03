/**
 * Semantic Search Strategy
 * 
 * SRP: Single responsibility - search using semantic embeddings
 * DRY: Reuses BaseSearchStrategy helpers and EmbeddingService
 * 
 * This strategy uses semantic embeddings to find relevant knowledge chunks.
 * Unlike keyword search, it understands meaning and context.
 */

import { BaseSearchStrategy } from './BaseSearchStrategy.js';
import { EmbeddingService } from '../services/EmbeddingService.js';
import { cosineSimilarity } from '../utils/cosineSimilarity.js';

/**
 * Semantic search using embeddings and cosine similarity
 * Finds chunks based on semantic meaning rather than keyword matching
 */
export class SemanticSearchStrategy extends BaseSearchStrategy {
  /**
   * @param {Object} [config] - Strategy configuration
   * @param {string} [config.model] - Embedding model to use
   * @param {boolean} [config.useCache] - Enable embedding cache
   * @param {number} [config.maxResults] - Maximum results to return
   * @param {number} [config.minScore] - Minimum similarity threshold
   */
  constructor(config = {}) {
    super(config);
    
    // Create embedding service
    this.embeddingService = new EmbeddingService({
      model: config.model,
      useCache: config.useCache,
    });
    
    // Cache for chunk embeddings
    this.chunkEmbeddings = new Map();
  }

  /**
   * Get strategy name
   * 
   * @returns {string} Strategy identifier
   */
  getName() {
    return 'embedding';
  }

  /**
   * Initialize the strategy
   * Must be called before first search
   * 
   * @param {Function} [onProgress] - Progress callback for model loading
   * @returns {Promise<void>}
   */
  async initialize(onProgress = null) {
    await this.embeddingService.initialize(onProgress);
  }

  /**
   * Search knowledge chunks using semantic similarity
   * 
   * @param {string} question - Search query
   * @param {import('../../types/KnowledgeTypes.js').KnowledgeChunk[]} chunks - Knowledge chunks to search
   * @param {import('../interfaces/ISearchResult.js').SearchOptions} [options] - Search options
   * @returns {Promise<import('../interfaces/ISearchResult.js').SearchResult[]>} Search results
   */
  async search(question, chunks, options = {}) {
    const startTime = Date.now();
    
    try {
      // Step 1: Generate query embedding
      const queryEmbedding = await this.embeddingService.embed(question);
      
      // Step 2: Generate chunk embeddings (with caching)
      await this._ensureChunkEmbeddings(chunks);
      
      // Step 3: Calculate similarities and create results
      const results = this._scoreChunks(question, queryEmbedding, chunks);
      
      // Step 4: Post-process results (filter, sort, limit)
      const processed = this.postProcess(results, options);
      
      // Add metadata
      const processingTime = Date.now() - startTime;
      return processed.map(result => ({
        ...result,
        metadata: {
          ...result.metadata,
          processingTime,
          strategy: this.getName(),
          timestamp: new Date().toISOString(),
        },
      }));
      
    } catch (err) {
      console.error('[SemanticSearchStrategy] Search failed:', err);
      throw new Error(`Semantic search failed: ${err.message}`);
    }
  }

  /**
   * Ensure all chunks have embeddings (generate if missing)
   * 
   * @param {import('../../types/KnowledgeTypes.js').KnowledgeChunk[]} chunks - Chunks to embed
   * @returns {Promise<void>}
   * @private
   */
  async _ensureChunkEmbeddings(chunks) {
    // Find chunks without embeddings
    const chunksToEmbed = chunks.filter(
      chunk => !this.chunkEmbeddings.has(chunk.id)
    );
    
    if (chunksToEmbed.length === 0) {
      return; // All chunks already embedded
    }
    
    // Generate searchable text for each chunk
    const texts = chunksToEmbed.map(chunk => this._getChunkText(chunk));
    
    // Generate embeddings in batch
    const embeddings = await this.embeddingService.embedBatch(texts);
    
    // Cache embeddings
    chunksToEmbed.forEach((chunk, index) => {
      this.chunkEmbeddings.set(chunk.id, embeddings[index]);
    });
  }

  /**
   * Get searchable text from a chunk
   * Combines content, title, and tags for better matching
   * 
   * @param {import('../../types/KnowledgeTypes.js').KnowledgeChunk} chunk - Knowledge chunk
   * @returns {string} Searchable text
   * @private
   */
  _getChunkText(chunk) {
    const parts = [
      chunk.content,
      chunk.metadata.title || '',
      chunk.metadata.tags ? chunk.metadata.tags.join(' ') : '',
    ];
    
    return parts.filter(Boolean).join(' ');
  }

  /**
   * Score all chunks against query using cosine similarity
   * 
   * @param {string} question - Original question (for matches)
   * @param {number[]} queryEmbedding - Query embedding vector
   * @param {import('../../types/KnowledgeTypes.js').KnowledgeChunk[]} chunks - Chunks to score
   * @returns {import('../interfaces/ISearchResult.js').SearchResult[]} Scored results
   * @private
   */
  _scoreChunks(question, queryEmbedding, chunks) {
    return chunks.map(chunk => {
      // Get chunk embedding from cache
      const chunkEmbedding = this.chunkEmbeddings.get(chunk.id);
      
      if (!chunkEmbedding) {
        console.warn(`[SemanticSearchStrategy] Missing embedding for chunk ${chunk.id}`);
        return null;
      }
      
      // Calculate cosine similarity (returns -1 to 1)
      const similarity = cosineSimilarity(queryEmbedding, chunkEmbedding);
      
      // Normalize to 0-1 range for scoring
      const score = (similarity + 1) / 2;
      
      // Create search result
      return {
        chunk,
        score,
        matches: {
          terms: this._extractTerms(question),
          locations: {},
          exactMatch: false,
          partialMatches: 0,
          highlight: this._generateHighlight(chunk),
        },
        metadata: {
          strategy: this.getName(),
          timestamp: new Date().toISOString(),
          similarity, // Include raw similarity score
        },
      };
    }).filter(Boolean); // Remove null results
  }

  /**
   * Extract terms from question for matches metadata
   * 
   * @param {string} question - Search question
   * @returns {string[]} Extracted terms
   * @private
   */
  _extractTerms(question) {
    return question
      .toLowerCase()
      .split(/\s+/)
      .filter(term => term.length > 2);
  }

  /**
   * Generate highlight snippet from chunk
   * 
   * @param {import('../../types/KnowledgeTypes.js').KnowledgeChunk} chunk - Chunk to highlight
   * @returns {string} Highlight text
   * @private
   */
  _generateHighlight(chunk) {
    const maxLength = 200;
    const content = chunk.content;
    
    if (content.length <= maxLength) {
      return content;
    }
    
    // Return first maxLength characters with ellipsis
    return content.substring(0, maxLength).trim() + '...';
  }

  /**
   * Get cache statistics
   * 
   * @returns {Object} Cache and service stats
   */
  getStats() {
    return {
      strategy: this.getName(),
      chunkEmbeddings: this.chunkEmbeddings.size,
      embeddingService: this.embeddingService.getCacheStats(),
    };
  }

  /**
   * Clear all caches
   */
  clearCache() {
    this.chunkEmbeddings.clear();
    this.embeddingService.clearCache();
  }

  /**
   * Dispose of the strategy and free resources
   */
  async dispose() {
    this.clearCache();
    await this.embeddingService.dispose();
    console.log('[SemanticSearchStrategy] Disposed');
  }
}
