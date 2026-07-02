/**
 * Knowledge Layer Type Definitions
 * 
 * Type definitions for the knowledge normalization system.
 * All types use JSDoc for documentation and IDE support.
 */

/**
 * Origin of a knowledge chunk
 * 
 * @typedef {Object} KnowledgeSource
 * @property {'translation' | 'data' | 'hybrid'} type - Source type
 * @property {string} file - Original file name/path
 * @property {string} path - JSON path or data key
 * @property {string} language - Language code (en, es)
 */

/**
 * Semantic categorization for retrieval
 * 
 * @typedef {Object} KnowledgeCategory
 * @property {string} primary - Main category (expertise, projects, etc.)
 * @property {string[]} secondary - Sub-categories/tags
 * @property {string} domain - Knowledge domain (frontend, backend, etc.)
 */

/**
 * A logical grouping of related knowledge
 * 
 * @typedef {Object} KnowledgeDocument
 * @property {string} id - Unique identifier
 * @property {string} title - Document title
 * @property {string} type - Document type
 * @property {KnowledgeCategory} category - Categorization
 * @property {Object} metadata - Additional structured data
 * @property {string[]} chunkIds - IDs of associated chunks
 * @property {string} language - Language code
 * @property {string} [parentId] - Parent document ID (for hierarchical structures)
 * @property {Date} createdAt - Creation timestamp
 */

/**
 * The smallest unit of searchable knowledge
 * 
 * @typedef {Object} KnowledgeChunk
 * @property {string} id - Unique chunk identifier
 * @property {string} documentId - Parent document ID
 * @property {string} content - The actual knowledge text
 * @property {KnowledgeCategory} category - Categorization
 * @property {KnowledgeSource} source - Origin information
 * @property {Object} metadata - Structured metadata
 * @property {number} tokenCount - Approximate token count
 * @property {string} language - Language code
 * @property {Date} createdAt - Timestamp
 */

/**
 * Result from knowledge building process
 * 
 * @typedef {Object} KnowledgeBase
 * @property {KnowledgeDocument[]} documents - All documents
 * @property {KnowledgeChunk[]} chunks - All chunks
 * @property {KnowledgeMetadata} metadata - Build metadata
 */

/**
 * Metadata about the knowledge base
 * 
 * @typedef {Object} KnowledgeMetadata
 * @property {string} language - Language code
 * @property {number} totalDocuments - Total document count
 * @property {number} totalChunks - Total chunk count
 * @property {string[]} categories - All categories present
 * @property {string[]} domains - All domains present
 * @property {string} generatedAt - ISO timestamp
 */

// Export empty object to make this a module
export {};
