/**
 * Search Result Interface
 * 
 * Defines the structure of search results returned by strategies.
 */

/**
 * @typedef {Object} SearchResult
 * @property {import('../../types/KnowledgeTypes.js').KnowledgeChunk} chunk - The matched knowledge chunk
 * @property {number} score - Relevance score (0-1, higher is better)
 * @property {SearchMatches} matches - Match details and highlights
 * @property {SearchMetadata} metadata - Additional search metadata
 */

/**
 * @typedef {Object} SearchMatches
 * @property {string[]} terms - Matched search terms
 * @property {Object.<string, number>} locations - Term positions in content
 * @property {boolean} exactMatch - Whether exact phrase was matched
 * @property {number} partialMatches - Count of partial term matches
 * @property {string} [highlight] - Content with matched terms highlighted
 */

/**
 * @typedef {Object} SearchMetadata
 * @property {string} strategy - Strategy name that produced this result
 * @property {string} timestamp - ISO timestamp of search
 * @property {number} [processingTime] - Time taken to process (ms)
 */

/**
 * @typedef {Object} SearchOptions
 * @property {number} [maxResults] - Maximum results to return
 * @property {number} [minScore] - Minimum score threshold
 * @property {string} [filterCategory] - Filter by category
 * @property {string} [filterDomain] - Filter by domain
 * @property {string[]} [filterTechnologies] - Filter by technologies
 */

// Export empty object to make this a module
export {};
