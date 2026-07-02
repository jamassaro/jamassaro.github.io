/**
 * Project Mapper
 * 
 * SRP: Combines translation text + data metadata for project knowledge.
 * DRY: Reuses shared utilities and mappers.
 */

import {
  PRIMARY_CATEGORIES,
  DOCUMENT_TYPES,
  SOURCE_TYPES,
  DOMAINS,
} from '../constants.js';
import {
  generateDocumentId,
  generateChunkId,
  normalizeText,
  estimateTokens,
  extractSecondaryCategories,
  createTimestamp,
} from '../utils/normalize.js';
import { findProjectByIndex, extractProjectMetadata } from './dataMapper.js';

/**
 * Infer domain from project technologies
 * 
 * @param {string[]} technologies - Technology array
 * @returns {string} Domain
 */
function inferProjectDomain(technologies) {
  if (!technologies || technologies.length === 0) return 'general';

  const techStr = technologies.join(' ').toLowerCase();

  if (techStr.includes('ai') || techStr.includes('openai') || techStr.includes('claude')) {
    return DOMAINS.AI;
  }
  if (techStr.includes('react') || techStr.includes('next') || techStr.includes('tailwind')) {
    return DOMAINS.FRONTEND;
  }
  if (techStr.includes('node') || techStr.includes('python') || techStr.includes('fastapi')) {
    return DOMAINS.BACKEND;
  }
  if (techStr.includes('aws') || techStr.includes('gcp') || techStr.includes('docker')) {
    return DOMAINS.CLOUD;
  }

  return DOMAINS.FRONTEND; // Default for web projects
}

/**
 * Build project document and chunk
 * 
 * @param {Object} translationData - Project translation data
 * @param {string} language - Language code
 * @param {number} index - Chunk index for ID generation
 * @returns {Object} { document, chunk }
 */
export function buildProjectKnowledge(translationData, language, index) {
  const { id, title, description, summary, source: translationSource } = translationData;

  // Extract project index from id (e.g., 'project-1' -> 1)
  const projectIndex = parseInt(id.split('-')[1], 10);

  // Load data metadata
  const dataMetadata = findProjectByIndex(projectIndex);
  const metadata = dataMetadata ? extractProjectMetadata(dataMetadata) : {};
  const technologies = metadata.technologies || [];
  const domain = inferProjectDomain(technologies);

  // Create normalized ID from title
  const normalizedId = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  // Create document
  const documentId = generateDocumentId(DOCUMENT_TYPES.PROJECT, normalizedId, language);
  const timestamp = createTimestamp();

  // Build enriched content (include both description and summary if available)
  const contentParts = [title, description];
  if (summary && summary !== description) {
    contentParts.push(summary);
  }
  const content = contentParts.join(': ');

  // Extract secondary categories
  const secondary = extractSecondaryCategories(content, { technologies });

  // Create category
  const category = {
    primary: PRIMARY_CATEGORIES.PROJECTS,
    secondary,
    domain,
  };

  // Create chunk
  const chunkId = generateChunkId(PRIMARY_CATEGORIES.PROJECTS, domain, index);
  const chunk = {
    id: chunkId,
    documentId,
    content: normalizeText(content),
    category,
    source: {
      type: SOURCE_TYPES.HYBRID,
      file: `${translationSource.file} + data/projects.js`,
      path: translationSource.path,
      language,
    },
    metadata: {
      projectName: title,
      technologies,
      url: metadata.link || null,
      github: metadata.github || null,
      status: metadata.status || null,
      year: metadata.year || null,
    },
    tokenCount: estimateTokens(content),
    language,
    createdAt: timestamp,
  };

  // Create document
  const document = {
    id: documentId,
    title,
    type: DOCUMENT_TYPES.PROJECT,
    category,
    metadata: {
      projectName: title,
      technologies,
      technologyCount: technologies.length,
      url: metadata.link || null,
      github: metadata.github || null,
      status: metadata.status || null,
      year: metadata.year || null,
    },
    chunkIds: [chunkId],
    language,
    createdAt: timestamp,
  };

  return { document, chunk };
}

/**
 * Build all project knowledge for a language
 * 
 * @param {Array} projectTranslations - Array of project translation data
 * @param {string} language - Language code
 * @returns {Object} { documents, chunks }
 */
export function buildAllProjectKnowledge(projectTranslations, language) {
  const documents = [];
  const chunks = [];

  projectTranslations.forEach((projectData, index) => {
    const { document, chunk } = buildProjectKnowledge(projectData, language, index + 1);
    documents.push(document);
    chunks.push(chunk);
  });

  return { documents, chunks };
}
