/**
 * Chunk Splitting Utilities
 * 
 * Follows SRP: Focused on splitting large text into manageable chunks.
 * Currently most content fits in single chunks - this is for future scalability.
 */

import { CHUNK_CONSTRAINTS } from '../constants.js';

/**
 * Split large text into smaller chunks with overlap
 * 
 * @param {string} text - Text to split
 * @param {number} [maxChars] - Maximum characters per chunk
 * @param {number} [overlap] - Overlap between chunks for context
 * @returns {string[]} Array of text chunks
 */
export function splitIntoChunks(
  text,
  maxChars = CHUNK_CONSTRAINTS.MAX_CHARS,
  overlap = CHUNK_CONSTRAINTS.OVERLAP_CHARS
) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  // If text fits in one chunk, return as-is
  if (text.length <= maxChars) {
    return [text];
  }

  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + maxChars, text.length);
    
    // Try to find a good break point (period, newline, space)
    let breakPoint = end;
    if (end < text.length) {
      // Look for period or newline
      const periodIndex = text.lastIndexOf('. ', end);
      const newlineIndex = text.lastIndexOf('\n', end);
      const spaceIndex = text.lastIndexOf(' ', end);

      const bestBreak = Math.max(
        periodIndex !== -1 && periodIndex > start ? periodIndex + 2 : start,
        newlineIndex !== -1 && newlineIndex > start ? newlineIndex + 1 : start,
        spaceIndex !== -1 && spaceIndex > start ? spaceIndex + 1 : start
      );

      if (bestBreak > start) {
        breakPoint = bestBreak;
      }
    }

    const chunk = text.slice(start, breakPoint).trim();
    if (chunk) {
      chunks.push(chunk);
    }

    // Move start position with overlap for context
    start = breakPoint - overlap;
    if (start <= 0 || start >= text.length) {
      break;
    }
  }

  return chunks;
}

/**
 * Check if text needs splitting
 * 
 * @param {string} text - Text to check
 * @param {number} [maxChars] - Maximum characters
 * @returns {boolean} True if text needs splitting
 */
export function needsSplitting(text, maxChars = CHUNK_CONSTRAINTS.MAX_CHARS) {
  return text && typeof text === 'string' && text.length > maxChars;
}
