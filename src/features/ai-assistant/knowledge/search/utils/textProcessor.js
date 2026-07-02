/**
 * Text Processing Utilities
 * 
 * SRP: Focused on text tokenization, normalization, and highlighting.
 * DRY: Reusable across all search strategies.
 */

import { normalizeText } from '../../utils/normalize.js';
import { STOP_WORDS, TECHNICAL_TERMS_PATTERN, SEARCH_CONFIG } from '../constants.js';

/**
 * Extract keywords from question
 * 
 * @param {string} text - Input text/question
 * @returns {string[]} Extracted keywords (lowercase)
 */
export function extractKeywords(text) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  // 1. Normalize text
  const normalized = normalizeText(text);
  
  // 2. Extract technical terms (preserve for matching)
  const technical = extractTechnicalTerms(text);
  
  // 3. Tokenize (lowercase for matching)
  const tokens = normalized
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  
  // 4. Remove stop words and short tokens
  const filtered = removeStopWords(tokens);
  
  // 5. Combine and deduplicate
  return [...new Set([...filtered, ...technical])];
}

/**
 * Remove stop words from token array
 * 
 * @param {string[]} tokens - Token array
 * @returns {string[]} Filtered tokens
 */
export function removeStopWords(tokens) {
  return tokens.filter(token => 
    !STOP_WORDS.has(token.toLowerCase()) && 
    token.length >= SEARCH_CONFIG.MIN_KEYWORD_LENGTH
  );
}

/**
 * Extract technical terms from text (case-insensitive but preserves original)
 * 
 * @param {string} text - Input text
 * @returns {string[]} Technical terms (lowercase for matching)
 */
export function extractTechnicalTerms(text) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const matches = text.match(TECHNICAL_TERMS_PATTERN);
  if (!matches) return [];

  // Convert to lowercase for consistent matching
  return [...new Set(matches.map(m => m.toLowerCase().replace(/\./g, '')))];
}

/**
 * Highlight matched terms in text
 * 
 * @param {string} text - Content text
 * @param {string[]} terms - Terms to highlight
 * @param {number} [maxLength] - Maximum highlight length
 * @returns {string} Text with matches highlighted using **term** markers
 */
export function highlightMatches(text, terms, maxLength = SEARCH_CONFIG.MAX_HIGHLIGHT_LENGTH) {
  if (!text || !terms || terms.length === 0) {
    return text.slice(0, maxLength) + (text.length > maxLength ? '...' : '');
  }

  let highlighted = text;
  
  // Find first match location for context
  let firstMatchIndex = -1;
  for (const term of terms) {
    const index = text.toLowerCase().indexOf(term.toLowerCase());
    if (index !== -1 && (firstMatchIndex === -1 || index < firstMatchIndex)) {
      firstMatchIndex = index;
    }
  }

  // Extract context around match
  if (firstMatchIndex !== -1) {
    const start = Math.max(0, firstMatchIndex - SEARCH_CONFIG.CONTEXT_CHARS);
    const end = Math.min(text.length, firstMatchIndex + maxLength);
    highlighted = (start > 0 ? '...' : '') + 
                  text.slice(start, end) + 
                  (end < text.length ? '...' : '');
  } else {
    // No match, just truncate
    highlighted = text.slice(0, maxLength) + (text.length > maxLength ? '...' : '');
  }

  // Wrap matched terms in markers (case-insensitive)
  terms.forEach(term => {
    const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
    highlighted = highlighted.replace(regex, '**$1**');
  });

  return highlighted;
}

/**
 * Escape special regex characters
 * 
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Check if text contains exact phrase
 * 
 * @param {string} text - Text to search in
 * @param {string} phrase - Phrase to find
 * @returns {boolean} True if exact phrase found
 */
export function hasExactPhrase(text, phrase) {
  if (!text || !phrase) return false;
  
  const normalizedText = text.toLowerCase();
  const normalizedPhrase = phrase.toLowerCase().trim();
  
  return normalizedText.includes(normalizedPhrase);
}

/**
 * Calculate term frequency in text
 * 
 * @param {string} text - Text to analyze
 * @param {string} term - Term to count
 * @returns {number} Term frequency count
 */
export function termFrequency(text, term) {
  if (!text || !term) return 0;
  
  const normalizedText = text.toLowerCase();
  const normalizedTerm = term.toLowerCase();
  const regex = new RegExp(`\\b${escapeRegex(normalizedTerm)}\\b`, 'gi');
  const matches = normalizedText.match(regex);
  
  return matches ? matches.length : 0;
}
