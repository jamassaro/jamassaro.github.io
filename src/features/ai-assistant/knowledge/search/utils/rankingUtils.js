/**
 * Ranking Utilities
 * 
 * SRP: Focused on similarity calculations and ranking functions.
 * DRY: Reusable scoring algorithms across strategies.
 */

/**
 * Calculate Jaccard similarity between two sets
 * Measures overlap between two sets
 * 
 * @param {Set} set1 - First set
 * @param {Set} set2 - Second set
 * @returns {number} Jaccard similarity (0-1)
 */
export function jaccardSimilarity(set1, set2) {
  if (set1.size === 0 && set2.size === 0) return 1.0;
  if (set1.size === 0 || set2.size === 0) return 0.0;
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

/**
 * Calculate cosine similarity between two token arrays
 * Treats tokens as a simple vector space
 * 
 * @param {string[]} tokens1 - First token array
 * @param {string[]} tokens2 - Second token array
 * @returns {number} Cosine similarity (0-1)
 */
export function cosineSimilarity(tokens1, tokens2) {
  if (tokens1.length === 0 || tokens2.length === 0) return 0.0;
  
  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);
  
  const intersection = [...set1].filter(x => set2.has(x)).length;
  const magnitude = Math.sqrt(set1.size * set2.size);
  
  return magnitude > 0 ? intersection / magnitude : 0;
}

/**
 * Calculate BM25 score for a term in a document
 * Advanced ranking function used in search engines
 * 
 * @param {number} termFreq - Term frequency in document
 * @param {number} docLength - Document length (word count)
 * @param {number} avgDocLength - Average document length in corpus
 * @param {number} totalDocs - Total number of documents
 * @param {number} docsWithTerm - Number of documents containing term
 * @param {number} [k1=1.5] - Term frequency saturation parameter
 * @param {number} [b=0.75] - Length normalization parameter
 * @returns {number} BM25 score
 */
export function calculateBM25(
  termFreq,
  docLength,
  avgDocLength,
  totalDocs,
  docsWithTerm,
  k1 = 1.5,
  b = 0.75
) {
  // IDF (Inverse Document Frequency)
  const idf = Math.log(
    (totalDocs - docsWithTerm + 0.5) / (docsWithTerm + 0.5) + 1
  );
  
  // TF (Term Frequency) with saturation
  const tf = (termFreq * (k1 + 1)) / 
    (termFreq + k1 * (1 - b + b * (docLength / avgDocLength)));
  
  return idf * tf;
}

/**
 * Calculate overlap ratio between two arrays
 * 
 * @param {any[]} arr1 - First array
 * @param {any[]} arr2 - Second array
 * @returns {number} Overlap ratio (0-1)
 */
export function overlapRatio(arr1, arr2) {
  if (arr1.length === 0 || arr2.length === 0) return 0.0;
  
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  const intersection = [...set1].filter(x => set2.has(x));
  
  return intersection.length / Math.max(set1.size, set2.size);
}

/**
 * Normalize score to [0, 1] range
 * 
 * @param {number} score - Raw score
 * @param {number} [min=0] - Minimum possible score
 * @param {number} [max=1] - Maximum possible score
 * @returns {number} Normalized score
 */
export function normalizeScore(score, min = 0, max = 1) {
  return Math.min(max, Math.max(min, score));
}

/**
 * Combine multiple scores with weights
 * 
 * @param {Object.<string, number>} scores - Score map
 * @param {Object.<string, number>} weights - Weight map (should sum to 1)
 * @returns {number} Combined weighted score
 */
export function weightedScore(scores, weights) {
  let totalScore = 0;
  let totalWeight = 0;
  
  Object.keys(scores).forEach(key => {
    if (weights[key] !== undefined) {
      totalScore += scores[key] * weights[key];
      totalWeight += weights[key];
    }
  });
  
  return totalWeight > 0 ? totalScore / totalWeight : 0;
}
