/**
 * Expertise Mapper
 * 
 * SRP: Combines translation text + data metadata for expertise knowledge.
 * DRY: Reuses translation and data mappers.
 */

import {
  PRIMARY_CATEGORIES,
  DOCUMENT_TYPES,
  SOURCE_TYPES,
  EXPERTISE_DOMAIN_MAP,
} from '../constants.js';
import {
  generateDocumentId,
  generateChunkId,
  normalizeText,
  estimateTokens,
  extractSecondaryCategories,
  createTimestamp,
} from '../utils/normalize.js';
import { findExpertiseById, extractTechnologies } from './dataMapper.js';

/**
 * Build expertise document and chunk
 * 
 * @param {Object} translationData - Expertise translation data
 * @param {string} language - Language code
 * @param {number} index - Chunk index for ID generation
 * @returns {Object} { document, chunk }
 */
export function buildExpertiseKnowledge(translationData, language, index) {
  const { id, title, description, source: translationSource } = translationData;

  // Load data metadata
  const dataMetadata = findExpertiseById(id);
  const technologies = dataMetadata ? extractTechnologies(dataMetadata) : [];
  const domain = EXPERTISE_DOMAIN_MAP[id] || 'general';

  // Create document
  const documentId = generateDocumentId(DOCUMENT_TYPES.EXPERTISE, id, language);
  const timestamp = createTimestamp();

  // Build enriched content
  const content = `${title}: ${description}`;
  
  // Extract secondary categories
  const secondary = extractSecondaryCategories(content, { technologies });

  // Create category
  const category = {
    primary: PRIMARY_CATEGORIES.EXPERTISE,
    secondary,
    domain,
  };

  // Create chunk
  const chunkId = generateChunkId(PRIMARY_CATEGORIES.EXPERTISE, domain, index);
  const chunk = {
    id: chunkId,
    documentId,
    content: normalizeText(content),
    category,
    source: {
      type: SOURCE_TYPES.HYBRID,
      file: `${translationSource.file} + data/expertise.js`,
      path: translationSource.path,
      language,
    },
    metadata: {
      title,
      technologies,
      color: dataMetadata?.color || null,
      icon: dataMetadata?.icon || null,
      explicitTech: technologies.length > 0,
    },
    tokenCount: estimateTokens(content),
    language,
    createdAt: timestamp,
  };

  // Create document
  const document = {
    id: documentId,
    title,
    type: DOCUMENT_TYPES.EXPERTISE,
    category,
    metadata: {
      technologies,
      technologyCount: technologies.length,
      color: dataMetadata?.color || null,
      icon: dataMetadata?.icon || null,
    },
    chunkIds: [chunkId],
    language,
    createdAt: timestamp,
  };

  return { document, chunk };
}

/**
 * Build all expertise knowledge for a language
 * 
 * @param {Array} expertiseTranslations - Array of expertise translation data
 * @param {string} language - Language code
 * @returns {Object} { documents, chunks }
 */
export function buildAllExpertiseKnowledge(expertiseTranslations, language) {
  const documents = [];
  const chunks = [];

  expertiseTranslations.forEach((expertiseData, index) => {
    const { document, chunk } = buildExpertiseKnowledge(expertiseData, language, index + 1);
    documents.push(document);
    chunks.push(chunk);
  });

  return { documents, chunks };
}
