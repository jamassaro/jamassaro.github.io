/**
 * Personal Info Mapper
 * 
 * SRP: Handles personal information (bio, contact).
 * DRY: Consistent chunk creation.
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
  createTimestamp,
} from '../utils/normalize.js';

/**
 * Build personal info document and chunks
 * 
 * @param {Object} personalTranslation - Personal translation data
 * @param {string} language - Language code
 * @param {number} startIndex - Starting chunk index
 * @returns {Object} { document, chunks }
 */
export function buildPersonalKnowledge(personalTranslation, language, startIndex) {
  const { bio, email, phone, source } = personalTranslation;

  const documentId = generateDocumentId(DOCUMENT_TYPES.PERSONAL, 'info', language);
  const timestamp = createTimestamp();
  const chunks = [];
  let currentIndex = startIndex;

  // Create bio chunk
  if (bio) {
    const bioCategory = {
      primary: PRIMARY_CATEGORIES.PERSONAL_INFO,
      secondary: ['bio', 'introduction'],
      domain: DOMAINS.PRODUCT,
    };

    const bioChunkId = generateChunkId(PRIMARY_CATEGORIES.PERSONAL_INFO, 'bio', currentIndex++);
    chunks.push({
      id: bioChunkId,
      documentId,
      content: normalizeText(bio),
      category: bioCategory,
      source: {
        type: SOURCE_TYPES.TRANSLATION,
        file: source.file,
        path: 'main-section.description',
        language,
      },
      metadata: {
        type: 'bio',
      },
      tokenCount: estimateTokens(bio),
      language,
      createdAt: timestamp,
    });
  }

  // Create contact chunk
  if (email || phone) {
    const contactContent = `Contact: ${email}${phone ? `, ${phone}` : ''}`;
    const contactCategory = {
      primary: PRIMARY_CATEGORIES.PERSONAL_INFO,
      secondary: ['contact'],
      domain: DOMAINS.PRODUCT,
    };

    const contactChunkId = generateChunkId(PRIMARY_CATEGORIES.PERSONAL_INFO, 'contact', currentIndex++);
    chunks.push({
      id: contactChunkId,
      documentId,
      content: normalizeText(contactContent),
      category: contactCategory,
      source: {
        type: SOURCE_TYPES.TRANSLATION,
        file: source.file,
        path: 'footer',
        language,
      },
      metadata: {
        type: 'contact',
        email,
        phone,
      },
      tokenCount: estimateTokens(contactContent),
      language,
      createdAt: timestamp,
    });
  }

  // Create document
  const document = {
    id: documentId,
    title: 'Personal Information',
    type: DOCUMENT_TYPES.PERSONAL,
    category: {
      primary: PRIMARY_CATEGORIES.PERSONAL_INFO,
      secondary: ['bio', 'contact'],
      domain: DOMAINS.PRODUCT,
    },
    metadata: {
      email,
      phone,
      hasContact: !!(email || phone),
    },
    chunkIds: chunks.map(c => c.id),
    language,
    createdAt: timestamp,
  };

  return { document, chunks };
}
