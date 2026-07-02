/**
 * Text Normalization Utilities
 * 
 * Follows SRP: Each function has a single, focused responsibility.
 * Follows DRY: Reusable normalization logic across all mappers.
 */

import { CHUNK_CONSTRAINTS } from '../constants.js';

/**
 * Normalize text for consistent processing
 * 
 * @param {string} text - Raw text
 * @returns {string} Normalized text
 */
export function normalizeText(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .trim()
    .replace(/\s+/g, ' ')           // Collapse whitespace
    .replace(/\n+/g, ' ')           // Remove newlines
    .replace(/[""]/g, '"')          // Normalize quotes
    .replace(/['']/g, "'")          // Normalize apostrophes
    .replace(/\u00A0/g, ' ');       // Replace non-breaking spaces
}

/**
 * Estimate token count (rough approximation)
 * Uses chars_per_token from constants
 * 
 * @param {string} text - Text to count
 * @returns {number} Estimated token count
 */
export function estimateTokens(text) {
  if (!text || typeof text !== 'string') {
    return 0;
  }

  return Math.ceil(text.length / CHUNK_CONSTRAINTS.CHARS_PER_TOKEN);
}

/**
 * Generate stable chunk ID
 * 
 * @param {string} primary - Primary category
 * @param {string} domain - Domain
 * @param {number} index - Chunk index
 * @returns {string} Chunk ID
 */
export function generateChunkId(primary, domain, index) {
  const normalizedPrimary = primary.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const normalizedDomain = (domain || 'general').toLowerCase().replace(/[^a-z0-9]/g, '-');
  const paddedIndex = String(index).padStart(3, '0');
  
  return `chunk-${normalizedPrimary}-${normalizedDomain}-${paddedIndex}`;
}

/**
 * Generate stable document ID
 * 
 * @param {string} type - Document type
 * @param {string} identifier - Unique identifier
 * @param {string} language - Language code
 * @returns {string} Document ID
 */
export function generateDocumentId(type, identifier, language) {
  const normalizedType = type.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const normalizedId = identifier.toLowerCase().replace(/[^a-z0-9]/g, '-');
  
  return `${normalizedType}-${normalizedId}-${language}`;
}

/**
 * Extract secondary categories from text and metadata
 * 
 * @param {string} content - Content text
 * @param {Object} metadata - Metadata object
 * @returns {string[]} Secondary categories
 */
export function extractSecondaryCategories(content, metadata) {
  const categories = new Set();

  // Extract from technologies
  if (metadata.technologies && Array.isArray(metadata.technologies)) {
    metadata.technologies.forEach(tech => {
      // Handle both string and object formats
      const techName = typeof tech === 'string' ? tech : (tech?.name || '');
      if (techName) {
        // Normalize technology names to lowercase tags
        const normalized = techName.toLowerCase().replace(/\./g, '').replace(/\s+/g, '-');
        categories.add(normalized);
      }
    });
  }

  // Extract key terms from content (simple approach)
  if (content && typeof content === 'string') {
    const keywords = ['react', 'typescript', 'python', 'ai', 'cloud', 'testing', 'nextjs', 'node'];
    const lowerContent = content.toLowerCase();
    
    keywords.forEach(keyword => {
      if (lowerContent.includes(keyword)) {
        categories.add(keyword);
      }
    });
  }

  return Array.from(categories);
}

/**
 * Validate required fields
 * 
 * @param {Object} obj - Object to validate
 * @param {string[]} requiredFields - Required field names
 * @returns {boolean} True if all required fields present
 */
export function validateRequiredFields(obj, requiredFields) {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  return requiredFields.every(field => {
    const value = obj[field];
    return value !== undefined && value !== null && value !== '';
  });
}

/**
 * Create timestamp
 * 
 * @returns {Date} Current timestamp
 */
export function createTimestamp() {
  return new Date();
}
