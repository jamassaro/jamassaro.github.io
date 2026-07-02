/**
 * Knowledge Builder
 * 
 * SRP: Orchestrates the knowledge building process.
 * DRY: Delegates to specialized mappers for each content type.
 * 
 * Main entry point for building normalized knowledge base.
 */

import { SUPPORTED_LANGUAGES } from '../constants.js';
import {
  loadTranslations,
  extractExpertiseTranslations,
  extractProjectTranslations,
  extractVentureTranslations,
  extractPersonalTranslations,
} from '../mappers/translationMapper.js';
import { buildAllExpertiseKnowledge } from '../mappers/expertiseMapper.js';
import { buildAllProjectKnowledge } from '../mappers/projectMapper.js';
import { buildAllVentureKnowledge } from '../mappers/ventureMapper.js';
import { buildPersonalKnowledge } from '../mappers/personalMapper.js';

/**
 * Validate knowledge structure
 * 
 * @param {Array} documents - Documents to validate
 * @param {Array} chunks - Chunks to validate
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateKnowledge(documents, chunks) {
  const errors = [];

  // Check that all chunks reference valid documents
  const documentIds = new Set(documents.map(d => d.id));
  chunks.forEach(chunk => {
    if (!documentIds.has(chunk.documentId)) {
      errors.push(`Chunk ${chunk.id} references non-existent document ${chunk.documentId}`);
    }
  });

  // Check that all documents have at least one chunk
  documents.forEach(doc => {
    const hasChunks = doc.chunkIds.some(chunkId => 
      chunks.find(c => c.id === chunkId)
    );
    if (!hasChunks) {
      errors.push(`Document ${doc.id} has no associated chunks`);
    }
  });

  // Check for duplicate IDs
  const chunkIds = chunks.map(c => c.id);
  const uniqueChunkIds = new Set(chunkIds);
  if (chunkIds.length !== uniqueChunkIds.size) {
    errors.push('Duplicate chunk IDs found');
  }

  const docIds = documents.map(d => d.id);
  const uniqueDocIds = new Set(docIds);
  if (docIds.length !== uniqueDocIds.size) {
    errors.push('Duplicate document IDs found');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Extract metadata from knowledge base
 * 
 * @param {Array} documents - All documents
 * @param {Array} chunks - All chunks
 * @param {string} language - Language code
 * @returns {Object} Metadata object
 */
function extractMetadata(documents, chunks, language) {
  // Extract unique categories
  const categories = new Set();
  const domains = new Set();

  chunks.forEach(chunk => {
    if (chunk.category.primary) {
      categories.add(chunk.category.primary);
    }
    if (chunk.category.domain) {
      domains.add(chunk.category.domain);
    }
  });

  return {
    language,
    totalDocuments: documents.length,
    totalChunks: chunks.length,
    categories: Array.from(categories).sort(),
    domains: Array.from(domains).sort(),
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Build complete knowledge base for given language
 * 
 * @param {string} [language='en'] - Language code (en, es)
 * @returns {Promise<Object>} Knowledge base with documents, chunks, and metadata
 */
export async function buildKnowledge(language = 'en') {
  // Validate language
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    throw new Error(`Unsupported language: ${language}. Supported: ${SUPPORTED_LANGUAGES.join(', ')}`);
  }

  console.log(`🧠 Building knowledge base for language: ${language}`);

  try {
    // Step 1: Load translations
    console.log('📚 Loading translations...');
    const translations = await loadTranslations(language);
    if (!translations) {
      throw new Error(`Failed to load translations for language: ${language}`);
    }

    // Step 2: Extract translation data
    console.log('🔍 Extracting translation data...');
    const expertiseTranslations = extractExpertiseTranslations(translations, language);
    const projectTranslations = extractProjectTranslations(translations, language);
    const ventureTranslation = extractVentureTranslations(translations, language);
    const personalTranslation = extractPersonalTranslations(translations, language);

    const allDocuments = [];
    const allChunks = [];
    let chunkIndex = 1;

    // Step 3: Build expertise knowledge
    console.log(`✨ Building expertise knowledge (${expertiseTranslations.length} items)...`);
    const expertiseResult = buildAllExpertiseKnowledge(expertiseTranslations, language);
    allDocuments.push(...expertiseResult.documents);
    allChunks.push(...expertiseResult.chunks);
    chunkIndex += expertiseResult.chunks.length;

    // Step 4: Build project knowledge
    console.log(`🚀 Building project knowledge (${projectTranslations.length} items)...`);
    const projectResult = buildAllProjectKnowledge(projectTranslations, language);
    allDocuments.push(...projectResult.documents);
    allChunks.push(...projectResult.chunks);
    chunkIndex += projectResult.chunks.length;

    // Step 5: Build venture knowledge
    if (ventureTranslation) {
      console.log('🎯 Building venture knowledge...');
      const ventureResult = buildAllVentureKnowledge(ventureTranslation, language, chunkIndex);
      allDocuments.push(...ventureResult.documents);
      allChunks.push(...ventureResult.chunks);
      chunkIndex = ventureResult.nextIndex;
    }

    // Step 6: Build personal knowledge
    if (personalTranslation) {
      console.log('👤 Building personal knowledge...');
      const personalResult = buildPersonalKnowledge(personalTranslation, language, chunkIndex);
      allDocuments.push(personalResult.document);
      allChunks.push(...personalResult.chunks);
    }

    // Step 7: Validate
    console.log('✅ Validating knowledge structure...');
    const validation = validateKnowledge(allDocuments, allChunks);
    if (!validation.valid) {
      console.warn('⚠️  Validation warnings:', validation.errors);
    }

    // Step 8: Generate metadata
    const metadata = extractMetadata(allDocuments, allChunks, language);

    console.log(`✅ Knowledge base built successfully!`);
    console.log(`   📄 Documents: ${metadata.totalDocuments}`);
    console.log(`   🧩 Chunks: ${metadata.totalChunks}`);
    console.log(`   🏷️  Categories: ${metadata.categories.join(', ')}`);
    console.log(`   🌐 Domains: ${metadata.domains.join(', ')}`);

    return {
      documents: allDocuments,
      chunks: allChunks,
      metadata,
    };
  } catch (error) {
    console.error(`❌ Failed to build knowledge base for ${language}:`, error);
    throw error;
  }
}

/**
 * Build knowledge bases for all supported languages
 * 
 * @returns {Promise<Object>} Map of language to knowledge base
 */
export async function buildAllKnowledge() {
  const knowledgeBases = {};

  for (const language of SUPPORTED_LANGUAGES) {
    try {
      knowledgeBases[language] = await buildKnowledge(language);
    } catch (error) {
      console.error(`Failed to build knowledge for ${language}:`, error);
    }
  }

  return knowledgeBases;
}
