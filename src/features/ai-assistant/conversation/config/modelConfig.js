/**
 * WebLLM Model Configurations
 * 
 * Available models optimized for different use cases
 */

export const AVAILABLE_MODELS = {
  // Lightweight models (recommended for web)
  LLAMA_1B: {
    id: 'Llama-3.2-1B-Instruct-q4f16_1-MLC',
    name: 'Llama 3.2 1B',
    size: '0.9GB',
    downloadTime: '30s - 2min',
    quality: 'Good',
    speed: 'Very Fast',
    recommended: true, // Best for quick testing
    description: 'Fastest download, good for testing and demos',
  },
  
  QWEN_1_5B: {
    id: 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',
    name: 'Qwen 2.5 1.5B',
    size: '1.2GB',
    downloadTime: '1-3min',
    quality: 'Very Good',
    speed: 'Fast',
    recommended: false,
    description: 'Balanced performance and size',
  },
  
  PHI_3_5_MINI: {
    id: 'Phi-3.5-mini-instruct-q4f16_1-MLC',
    name: 'Phi-3.5 Mini',
    size: '2.2GB',
    downloadTime: '2-5min',
    quality: 'Excellent',
    speed: 'Fast',
    recommended: false,
    description: 'Best quality-to-size ratio, production ready',
  },
  
  LLAMA_3B: {
    id: 'Llama-3.2-3B-Instruct-q4f16_1-MLC',
    name: 'Llama 3.2 3B',
    size: '2.0GB',
    downloadTime: '2-5min',
    quality: 'Excellent',
    speed: 'Medium',
    recommended: false,
    description: 'Higher quality but slower',
  },
};

// Default model - Phi-3.5 Mini for best quality-to-size ratio
export const DEFAULT_MODEL = AVAILABLE_MODELS.PHI_3_5_MINI;

/**
 * Check if WebGPU is supported in the current browser
 * @returns {boolean}
 */
export function isWebGPUSupported() {
  return typeof navigator !== 'undefined' && 'gpu' in navigator;
}

/**
 * Get browser compatibility info
 * @returns {Object}
 */
export function getBrowserInfo() {
  if (typeof navigator === 'undefined') {
    return { supported: false, reason: 'Not in browser environment' };
  }

  const hasWebGPU = 'gpu' in navigator;
  
  if (!hasWebGPU) {
    return {
      supported: false,
      reason: 'WebGPU not available',
      recommendation: 'Use Chrome 113+, Edge 113+, or Safari 18+ for best experience',
    };
  }

  return {
    supported: true,
    reason: 'WebGPU available',
  };
}
