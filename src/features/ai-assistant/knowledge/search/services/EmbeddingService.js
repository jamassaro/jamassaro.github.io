/**
 * Embedding Service
 * 
 * SRP: Single responsibility - generate embeddings using Transformers.js
 * DRY: Centralized embedding generation and caching
 * 
 * This service uses Xenova/Transformers.js to generate semantic embeddings
 * for text. Embeddings are cached to avoid redundant computations.
 */

import { pipeline, env } from '@xenova/transformers';

// Configure Transformers.js environment
// Disable local model storage to use CDN-hosted models
env.allowLocalModels = false;

/**
 * Embedding service for generating text embeddings
 * Uses 'Xenova/all-MiniLM-L6-v2' model (384 dimensions)
 */
export class EmbeddingService {
  /**
   * @param {Object} [config] - Service configuration
   * @param {string} [config.model] - Model identifier
   * @param {boolean} [config.useCache] - Enable embedding cache
   */
  constructor(config = {}) {
    this.model = config.model || 'Xenova/all-MiniLM-L6-v2';
    this.useCache = config.useCache !== false; // Default: true
    this.pipeline = null;
    this.isReady = false;
    this.cache = new Map(); // Cache embeddings
    this.initPromise = null;
  }

  /**
   * Initialize the embedding pipeline
   * Lazy initialization - only loads model when needed
   * 
   * @param {Function} [onProgress] - Progress callback (progress) => void
   * @returns {Promise<void>}
   */
  async initialize(onProgress = null) {
    // Avoid multiple initializations
    if (this.initPromise) {
      return this.initPromise;
    }
    
    if (this.isReady) {
      return Promise.resolve();
    }

    this.initPromise = this._initializePipeline(onProgress);
    await this.initPromise;
    
    return this.initPromise;
  }

  /**
   * Internal initialization logic
   * 
   * @param {Function} [onProgress] - Progress callback
   * @returns {Promise<void>}
   * @private
   */
  async _initializePipeline(onProgress) {
    try {
      console.log(`[EmbeddingService] Initializing model: ${this.model}`);
      
      // Create feature extraction pipeline
      this.pipeline = await pipeline('feature-extraction', this.model, {
        progress_callback: (progress) => {
          if (onProgress) {
            onProgress(progress);
          }
          this._logProgress(progress);
        },
      });
      
      this.isReady = true;
      console.log('[EmbeddingService] Model initialized successfully');
      
    } catch (err) {
      console.error('[EmbeddingService] Initialization failed:', err);
      this.isReady = false;
      throw new Error(`Failed to initialize embedding model: ${err.message}`);
    }
  }

  /**
   * Log model loading progress
   * 
   * @param {Object} progress - Progress object from Transformers.js
   * @private
   */
  _logProgress(progress) {
    if (progress.status === 'progress') {
      const percent = Math.round((progress.loaded / progress.total) * 100);
      console.log(`[EmbeddingService] Loading ${progress.file}: ${percent}%`);
    } else if (progress.status === 'done') {
      console.log(`[EmbeddingService] Loaded ${progress.file}`);
    }
  }

  /**
   * Generate embedding for a single text
   * 
   * @param {string} text - Input text
   * @returns {Promise<number[]>} Embedding vector
   */
  async embed(text) {
    await this._ensureReady();
    
    // Check cache
    if (this.useCache && this.cache.has(text)) {
      return this.cache.get(text);
    }
    
    try {
      // Generate embedding
      const output = await this.pipeline(text, {
        pooling: 'mean',
        normalize: true,
      });
      
      // Convert tensor to array
      const embedding = Array.from(output.data);
      
      // Cache result
      if (this.useCache) {
        this.cache.set(text, embedding);
      }
      
      return embedding;
      
    } catch (err) {
      console.error('[EmbeddingService] Embedding generation failed:', err);
      throw new Error(`Failed to generate embedding: ${err.message}`);
    }
  }

  /**
   * Generate embeddings for multiple texts (batch)
   * More efficient than calling embed() multiple times
   * 
   * @param {string[]} texts - Array of input texts
   * @returns {Promise<number[][]>} Array of embedding vectors
   */
  async embedBatch(texts) {
    await this._ensureReady();
    
    if (!Array.isArray(texts) || texts.length === 0) {
      return [];
    }
    
    // Separate cached and uncached texts
    const uncached = [];
    const results = new Array(texts.length);
    
    texts.forEach((text, index) => {
      if (this.useCache && this.cache.has(text)) {
        results[index] = this.cache.get(text);
      } else {
        uncached.push({ text, index });
      }
    });
    
    // Generate embeddings for uncached texts
    if (uncached.length > 0) {
      try {
        const uncachedTexts = uncached.map(item => item.text);
        const output = await this.pipeline(uncachedTexts, {
          pooling: 'mean',
          normalize: true,
        });
        
        // Process each embedding
        uncached.forEach((item, i) => {
          const embedding = Array.from(output[i].data);
          results[item.index] = embedding;
          
          // Cache result
          if (this.useCache) {
            this.cache.set(item.text, embedding);
          }
        });
        
      } catch (err) {
        console.error('[EmbeddingService] Batch embedding failed:', err);
        throw new Error(`Failed to generate batch embeddings: ${err.message}`);
      }
    }
    
    return results;
  }

  /**
   * Get embedding dimension
   * 
   * @returns {Promise<number>} Embedding vector dimension
   */
  async getDimension() {
    await this._ensureReady();
    
    // Generate a test embedding to get dimension
    const testEmbedding = await this.embed('test');
    return testEmbedding.length;
  }

  /**
   * Clear embedding cache
   */
  clearCache() {
    this.cache.clear();
    console.log('[EmbeddingService] Cache cleared');
  }

  /**
   * Get cache statistics
   * 
   * @returns {{size: number, hits: number}} Cache stats
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      model: this.model,
      ready: this.isReady,
    };
  }

  /**
   * Dispose of the service and free resources
   */
  async dispose() {
    if (this.pipeline) {
      // Transformers.js doesn't have explicit dispose, just clear references
      this.pipeline = null;
    }
    this.clearCache();
    this.isReady = false;
    this.initPromise = null;
    console.log('[EmbeddingService] Disposed');
  }

  /**
   * Ensure service is initialized before operations
   * 
   * @throws {Error} If service is not ready
   * @private
   */
  async _ensureReady() {
    if (!this.isReady) {
      await this.initialize();
    }
  }
}
