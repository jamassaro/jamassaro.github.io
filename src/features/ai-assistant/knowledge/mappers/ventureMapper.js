/**
 * Venture Mapper
 * 
 * SRP: Handles hierarchical venture structure (parent venture + sub-projects).
 * DRY: Reuses utilities and creates consistent structure.
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
import { loadVenturesData, extractVentureMetadata } from './dataMapper.js';

/**
 * Build main venture document and chunks
 * 
 * @param {Object} ventureTranslation - Venture translation data
 * @param {string} language - Language code
 * @param {number} startIndex - Starting chunk index
 * @returns {Object} { document, chunks, nextIndex }
 */
export function buildMainVentureKnowledge(ventureTranslation, language, startIndex) {
  const { title, description, cards, source: translationSource } = ventureTranslation;

  const documentId = generateDocumentId(DOCUMENT_TYPES.VENTURE, 'braveup', language);
  const timestamp = createTimestamp();
  const chunks = [];
  let currentIndex = startIndex;

  // Create main venture story chunk
  const mainContent = `${title}: ${description}`;
  const mainCategory = {
    primary: PRIMARY_CATEGORIES.VENTURES,
    secondary: ['edtech', 'leadership', 'product'],
    domain: DOMAINS.LEADERSHIP,
  };

  const mainChunkId = generateChunkId(PRIMARY_CATEGORIES.VENTURES, DOMAINS.LEADERSHIP, currentIndex++);
  chunks.push({
    id: mainChunkId,
    documentId,
    content: normalizeText(mainContent),
    category: mainCategory,
    source: {
      type: SOURCE_TYPES.TRANSLATION,
      file: translationSource.file,
      path: translationSource.path,
      language,
    },
    metadata: {
      ventureName: title,
      type: 'story',
    },
    tokenCount: estimateTokens(mainContent),
    language,
    createdAt: timestamp,
  });

  // Create chunks for each card (Product Platform, AI & Analytics, Leadership)
  cards.forEach((card, cardIndex) => {
    const cardContent = `${card.title}: ${card.description}`;
    const cardDomain = cardIndex === 0 ? DOMAINS.PRODUCT : 
                       cardIndex === 1 ? DOMAINS.AI : 
                       DOMAINS.LEADERSHIP;
    
    const cardCategory = {
      primary: PRIMARY_CATEGORIES.VENTURES,
      secondary: extractSecondaryCategories(cardContent, {}),
      domain: cardDomain,
    };

    const cardChunkId = generateChunkId(PRIMARY_CATEGORIES.VENTURES, cardDomain, currentIndex++);
    chunks.push({
      id: cardChunkId,
      documentId,
      content: normalizeText(cardContent),
      category: cardCategory,
      source: card.source,
      metadata: {
        ventureName: title,
        cardTitle: card.title,
        type: 'card',
        cardIndex,
      },
      tokenCount: estimateTokens(cardContent),
      language,
      createdAt: timestamp,
    });
  });

  // Create main venture document
  const document = {
    id: documentId,
    title,
    type: DOCUMENT_TYPES.VENTURE,
    category: mainCategory,
    metadata: {
      ventureName: title,
      cardCount: cards.length,
    },
    chunkIds: chunks.map(c => c.id),
    language,
    createdAt: timestamp,
  };

  return { document, chunks, nextIndex: currentIndex };
}

/**
 * Build venture project document and chunk
 * 
 * @param {Object} ventureData - Venture data from data file
 * @param {string} parentId - Parent venture document ID
 * @param {string} language - Language code
 * @param {number} index - Chunk index
 * @returns {Object} { document, chunk }
 */
export function buildVentureProjectKnowledge(ventureData, parentId, language, index) {
  const { id, title, description, technologies, url, images } = ventureData;
  const metadata = extractVentureMetadata(ventureData);

  const documentId = generateDocumentId(DOCUMENT_TYPES.VENTURE_PROJECT, id, language);
  const timestamp = createTimestamp();

  // Infer domain from technologies
  const techStr = (technologies || []).join(' ').toLowerCase();
  const domain = techStr.includes('react') || techStr.includes('next') ? DOMAINS.FRONTEND :
                 techStr.includes('node') || techStr.includes('python') ? DOMAINS.BACKEND :
                 DOMAINS.PRODUCT;

  // Build content
  const content = description ? `${title}: ${description}` : title;
  
  // Extract secondary categories
  const secondary = extractSecondaryCategories(content, { technologies });

  // Create category
  const category = {
    primary: PRIMARY_CATEGORIES.VENTURES,
    secondary,
    domain,
  };

  // Create chunk
  const chunkId = generateChunkId(PRIMARY_CATEGORIES.VENTURES, domain, index);
  const chunk = {
    id: chunkId,
    documentId,
    content: normalizeText(content),
    category,
    source: {
      type: SOURCE_TYPES.DATA,
      file: 'data/ventures.js',
      path: id,
      language,
    },
    metadata: {
      projectName: title,
      technologies: metadata.technologies,
      url: metadata.url,
      parentVenture: 'Brave Up!',
    },
    tokenCount: estimateTokens(content),
    language,
    createdAt: timestamp,
  };

  // Create document
  const document = {
    id: documentId,
    title,
    type: DOCUMENT_TYPES.VENTURE_PROJECT,
    category,
    metadata: {
      projectName: title,
      technologies: metadata.technologies,
      technologyCount: metadata.technologies.length,
      url: metadata.url,
      images: metadata.images,
      logo: metadata.logo,
    },
    chunkIds: [chunkId],
    language,
    parentId,
    createdAt: timestamp,
  };

  return { document, chunk };
}

/**
 * Build all venture knowledge for a language
 * 
 * @param {Object} ventureTranslation - Venture translation data
 * @param {string} language - Language code
 * @param {number} startIndex - Starting chunk index
 * @returns {Object} { documents, chunks, nextIndex }
 */
export function buildAllVentureKnowledge(ventureTranslation, language, startIndex) {
  const documents = [];
  const chunks = [];
  let currentIndex = startIndex;

  // Build main venture
  const mainResult = buildMainVentureKnowledge(ventureTranslation, language, currentIndex);
  documents.push(mainResult.document);
  chunks.push(...mainResult.chunks);
  currentIndex = mainResult.nextIndex;

  // Build venture projects from data
  const venturesData = loadVenturesData();
  venturesData.forEach(ventureData => {
    const projectResult = buildVentureProjectKnowledge(
      ventureData,
      mainResult.document.id,
      language,
      currentIndex++
    );
    documents.push(projectResult.document);
    chunks.push(projectResult.chunk);
  });

  return { documents, chunks, nextIndex: currentIndex };
}
