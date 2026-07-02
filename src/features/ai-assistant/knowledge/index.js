/**
 * Knowledge Layer - Public API
 * 
 * Main entry point for the Knowledge Layer system.
 * Provides normalized, searchable knowledge chunks from portfolio content.
 * 
 * @module knowledge
 */

// Main builder functions
export { buildKnowledge, buildAllKnowledge } from './builders/knowledgeBuilder.js';

// Constants
export {
  PRIMARY_CATEGORIES,
  DOMAINS,
  DOCUMENT_TYPES,
  SOURCE_TYPES,
  SUPPORTED_LANGUAGES,
  CHUNK_CONSTRAINTS,
} from './constants.js';

// Types (for JSDoc reference)
export * from './types/index.js';

// Utilities (advanced usage)
export {
  normalizeText,
  estimateTokens,
  generateChunkId,
  generateDocumentId,
} from './utils/normalize.js';

/**
 * Quick usage example:
 * 
 * ```javascript
 * import { buildKnowledge } from '@/features/ai-assistant/knowledge';
 * 
 * const knowledge = await buildKnowledge('en');
 * console.log(`Generated ${knowledge.chunks.length} knowledge chunks`);
 * 
 * // Filter by category
 * const expertiseChunks = knowledge.chunks.filter(
 *   c => c.category.primary === 'expertise'
 * );
 * ```
 */
