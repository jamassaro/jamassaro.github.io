/**
 * WebLLMProvider - Real LLM Implementation using WebLLM
 * 
 * SRP: Provides real LLM inference using WebGPU acceleration
 * DRY: Reuses base class functionality and follows IAIProvider interface
 * 
 * This provider runs LLMs directly in the browser using WebGPU.
 * Supports progress reporting, streaming, and graceful error handling.
 */

import { IAIProvider } from './IAIProvider.js';

/**
 * WebLLM AI Provider for production inference
 * Uses @mlc-ai/web-llm for in-browser LLM execution
 */
export class WebLLMProvider extends IAIProvider {
  /**
   * @param {Object} [config] - Provider configuration
   * @param {string} [config.model='Llama-3.2-3B-Instruct-q4f16_1-MLC'] - Model to load
   * @param {number} [config.temperature=0.7] - Temperature (0-1)
   * @param {number} [config.maxTokens=500] - Maximum tokens to generate
   * @param {Function} [config.onProgress] - Progress callback (progress) => void
   */
  constructor(config = {}) {
    super(config);
    this.engine = null;
    // Using Llama-3.2-1B: Smallest model (~0.9GB) for fastest download
    this.model = config.model || 'Llama-3.2-1B-Instruct-q4f16_1-MLC';
    this.temperature = config.temperature || 0.7;
    this.maxTokens = config.maxTokens || 500;
    this.onProgress = config.onProgress || null;
  }

  /**
   * Initialize the WebLLM engine with progress reporting
   * @returns {Promise<void>}
   */
  async initialize() {
    try {
      // Check WebGPU support
      this._checkWebGPUSupport();
      
      // Check if model is already cached
      await this._checkCache();
      
      // Dynamic import to avoid bundling issues
      const { CreateMLCEngine } = await import('@mlc-ai/web-llm');
      
      // Create engine with progress callback and cache configuration
      this.engine = await CreateMLCEngine(
        this.model,
        {
          initProgressCallback: (progress) => {
            this._handleProgress(progress);
          },
          // Explicitly enable caching (default behavior)
          useIndexedDBCache: true,
        }
      );
      
      this._isReady = true;
      
    } catch (err) {
      throw this._createInitializationError(err);
    }
  }

  /**
   * Generate a chat completion
   * @param {import('./IAIProvider').ChatMessage[]} messages - Conversation messages
   * @param {import('./IAIProvider').ChatOptions} [options] - Generation options
   * @returns {Promise<import('./IAIProvider').ChatResponse>} Chat response
   */
  async chat(messages, options = {}) {
    this._ensureReady();

    const startTime = Date.now();

    try {
      // Prepare messages with system context
      const chatMessages = this._prepareChatMessages(messages, options);
      
      // Generate completion
      const completion = await this.engine.chat.completions.create({
        messages: chatMessages,
        temperature: this._getTemperature(options),
        max_tokens: this._getMaxTokens(options),
        stream: false,
      });

      const processingTime = Date.now() - startTime;
      
      return this._formatChatResponse(completion, processingTime);
      
    } catch (err) {
      console.error('[WebLLM] Chat failed:', err);
      throw this._createChatError(err);
    }
  }

  /**
   * Stream a chat completion
   * @param {import('./IAIProvider').ChatMessage[]} messages - Conversation messages
   * @param {import('./IAIProvider').ChatOptions} [options] - Generation options
   * @returns {AsyncGenerator<string>} Text stream
   */
  async *stream(messages, options = {}) {
    this._ensureReady();

    try {
      // Prepare messages with system context
      const chatMessages = this._prepareChatMessages(messages, options);
      
      // Create streaming completion
      const stream = await this.engine.chat.completions.create({
        messages: chatMessages,
        temperature: this._getTemperature(options),
        max_tokens: this._getMaxTokens(options),
        stream: true,
      });

      // Yield chunks as they arrive
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) {
          yield delta;
        }
      }
      
    } catch (err) {
      console.error('[WebLLM] Streaming failed:', err);
      throw this._createStreamError(err);
    }
  }

  /**
   * Get provider information
   * @returns {import('./IAIProvider').ProviderInfo} Provider metadata
   */
  getInfo() {
    return {
      name: 'WebLLMProvider',
      version: '1.0.0',
      type: 'webllm',
      model: this.model,
    };
  }

  /**
   * Clean up provider resources
   * @returns {Promise<void>}
   */
  async dispose() {
    if (this.engine) {
      // WebLLM doesn't have explicit dispose, but we clear references
      this.engine = null;
    }
    await super.dispose();
  }

  // ==================== Private Helper Methods ====================
  // SRP: Each helper has a single, focused responsibility
  // DRY: Reusable logic extracted into methods

  /**
   * Check if WebGPU is supported
   * @throws {Error} If WebGPU is not available
   * @private
   */
  _checkWebGPUSupport() {
    if (!navigator.gpu) {
      throw new Error(
        'WebGPU not supported. Please use Chrome/Edge 113+ or a compatible browser.'
      );
    }
  }

  /**
   * Ensure provider is ready before operations
   * @throws {Error} If provider is not initialized
   * @private
   */
  _ensureReady() {
    if (!this._isReady) {
      throw new Error('WebLLMProvider not initialized. Call initialize() first.');
    }
  }

  /**
   * Handle progress callback
   * @param {Object} progress - Progress object from WebLLM
   * @private
   */
  _handleProgress(progress) {
    if (this.onProgress) {
      this.onProgress(progress);
    }
  }

  /**
   * Prepare chat messages with system context
   * @param {import('./IAIProvider').ChatMessage[]} messages - Original messages
   * @param {import('./IAIProvider').ChatOptions} options - Chat options
   * @returns {import('./IAIProvider').ChatMessage[]} Prepared messages
   * @private
   */
  _prepareChatMessages(messages, options) {
    // Filter out any existing system messages (PromptBuilder adds one)
    // WebLLM requires exactly one system message at the start
    const nonSystemMessages = messages.filter(msg => msg.role !== 'system');
    
    // Build our own system message with search results
    const systemMessage = this._buildSystemMessage(options);
    
    // System message must be first
    return [systemMessage, ...nonSystemMessages];
  }

  /**
   * Build system message with knowledge context
   * @param {import('./IAIProvider').ChatOptions} options - Chat options
   * @returns {import('./IAIProvider').ChatMessage} System message
   * @private
   */
  _buildSystemMessage(options) {
    const { searchResults, language } = options;
    
    let content = this._getBaseSystemPrompt(language);
    
    if (searchResults && searchResults.length > 0) {
      content += this._formatSearchResults(searchResults);
    }
    
    return {
      role: 'system',
      content
    };
  }

  /**
   * Get base system prompt
   * @param {string} [language='en'] - Response language
   * @returns {string} Base system prompt
   * @private
   */
  _getBaseSystemPrompt(language) {
    let prompt = 'You are José Antonio Massaro\'s AI assistant. ';
    prompt += 'Answer questions about his expertise, projects, and experience. ';
    prompt += 'Be professional, concise, and helpful. ';
    
    if (language === 'es') {
      prompt = 'Eres el asistente de IA de José Antonio Massaro. ';
      prompt += 'Responde preguntas sobre su experiencia, proyectos y habilidades. ';
      prompt += 'Sé profesional, conciso y útil. ';
    }
    
    return prompt;
  }

  /**
   * Format search results for system prompt
   * @param {Array} searchResults - Knowledge search results
   * @returns {string} Formatted search results
   * @private
   */
  _formatSearchResults(searchResults) {
    let formatted = '\n\nRelevant information:\n';
    
    searchResults.slice(0, 5).forEach((result, index) => {
      formatted += `${index + 1}. ${result.chunk.content}\n`;
    });
    
    return formatted;
  }

  /**
   * Get temperature from options or use default
   * @param {import('./IAIProvider').ChatOptions} options - Chat options
   * @returns {number} Temperature value
   * @private
   */
  _getTemperature(options) {
    return options.temperature !== undefined ? options.temperature : this.temperature;
  }

  /**
   * Get max tokens from options or use default
   * @param {import('./IAIProvider').ChatOptions} options - Chat options
   * @returns {number} Max tokens value
   * @private
   */
  _getMaxTokens(options) {
    return options.maxTokens !== undefined ? options.maxTokens : this.maxTokens;
  }

  /**
   * Format completion into ChatResponse
   * @param {Object} completion - WebLLM completion object
   * @param {number} processingTime - Time taken in milliseconds
   * @returns {import('./IAIProvider').ChatResponse} Formatted response
   * @private
   */
  _formatChatResponse(completion, processingTime) {
    const content = completion.choices[0]?.message?.content || '';
    const tokens = completion.usage?.total_tokens || 0;
    
    return {
      content,
      tokens,
      model: this.model,
      processingTime,
      fromCache: false,
    };
  }

  /**
   * Create initialization error with helpful message
   * @param {Error} err - Original error
   * @returns {Error} Enhanced error
   * @private
   */
  _createInitializationError(err) {
    const message = err.message.toLowerCase();
    
    if (message.includes('404') || message.includes('not found')) {
      return new Error(
        `Model "${this.model}" not found. Please check the model name. ` +
        `Available models: Llama-3.2-1B, Llama-3.2-3B, Llama-3.1-8B.`
      );
    }
    
    if (message.includes('memory') || message.includes('oom')) {
      return new Error(
        'Not enough memory to load model. Try a smaller model like Llama-3.2-1B-Instruct-q4f16_1-MLC.'
      );
    }
    
    if (message.includes('webgpu') || message.includes('gpu')) {
      return new Error(
        'WebGPU initialization failed. Please ensure you have a compatible GPU and updated drivers.'
      );
    }
    
    return new Error(`Failed to initialize WebLLM: ${err.message}`);
  }

  /**
   * Create chat error with helpful message
   * @param {Error} err - Original error
   * @returns {Error} Enhanced error
   * @private
   */
  _createChatError(err) {
    const message = err.message.toLowerCase();
    
    if (message.includes('context') || message.includes('length')) {
      return new Error(
        'Message too long. Try shortening your conversation or question.'
      );
    }
    
    if (message.includes('timeout')) {
      return new Error(
        'Request timed out. Please try again.'
      );
    }
    
    return new Error(`WebLLM chat failed: ${err.message}`);
  }

  /**
   * Create stream error with helpful message
   * @param {Error} err - Original error
   * @returns {Error} Enhanced error
   * @private
   */
  _createStreamError(err) {
    const message = err.message.toLowerCase();
    
    if (message.includes('context') || message.includes('length')) {
      return new Error(
        'Message too long for streaming. Try shortening your conversation.'
      );
    }
    
    return new Error(`WebLLM streaming failed: ${err.message}`);
  }

  /**
   * Check if model is cached in browser
   * @returns {Promise<{cached: boolean, entries: number}>} Cache status
   * @private
   */
  async _checkCache() {
    try {
      // Check Cache API for WebLLM model cache
      const cacheNames = await caches.keys();
      const modelCacheName = 'webllm/model';
      
      if (cacheNames.includes(modelCacheName)) {
        const cache = await caches.open(modelCacheName);
        const keys = await cache.keys();
        
        return {
          cached: keys.length > 0,
          entries: keys.length
        };
      }
      
      return { cached: false, entries: 0 };
    } catch (err) {
      console.warn('[WebLLM] Could not check cache:', err);
      return { cached: false, entries: 0 };
    }
  }
}
