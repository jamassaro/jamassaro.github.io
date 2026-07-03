/**
 * Cosine Similarity Utility
 * 
 * SRP: Single responsibility - calculate cosine similarity between vectors
 * DRY: Reusable math functions for vector operations
 * 
 * Cosine similarity measures the cosine of the angle between two vectors.
 * Returns value between -1 and 1, where:
 * - 1: Vectors point in same direction (identical)
 * - 0: Vectors are orthogonal (unrelated)
 * - -1: Vectors point in opposite directions
 */

/**
 * Calculate dot product of two vectors
 * 
 * @param {number[]} vectorA - First vector
 * @param {number[]} vectorB - Second vector
 * @returns {number} Dot product
 * @private
 */
function dotProduct(vectorA, vectorB) {
  if (vectorA.length !== vectorB.length) {
    throw new Error('Vectors must have same length for dot product');
  }
  
  let sum = 0;
  for (let i = 0; i < vectorA.length; i++) {
    sum += vectorA[i] * vectorB[i];
  }
  
  return sum;
}

/**
 * Calculate magnitude (length) of a vector
 * 
 * @param {number[]} vector - Input vector
 * @returns {number} Magnitude
 * @private
 */
function magnitude(vector) {
  let sum = 0;
  for (let i = 0; i < vector.length; i++) {
    sum += vector[i] * vector[i];
  }
  
  return Math.sqrt(sum);
}

/**
 * Calculate cosine similarity between two vectors
 * 
 * Formula: cos(θ) = (A · B) / (||A|| * ||B||)
 * 
 * @param {number[]} vectorA - First embedding vector
 * @param {number[]} vectorB - Second embedding vector
 * @returns {number} Similarity score between -1 and 1
 * @throws {Error} If vectors have different lengths or are invalid
 */
export function cosineSimilarity(vectorA, vectorB) {
  // Validate inputs
  if (!Array.isArray(vectorA) || !Array.isArray(vectorB)) {
    throw new Error('Both inputs must be arrays');
  }
  
  if (vectorA.length === 0 || vectorB.length === 0) {
    throw new Error('Vectors cannot be empty');
  }
  
  if (vectorA.length !== vectorB.length) {
    throw new Error(
      `Vectors must have same length. Got ${vectorA.length} and ${vectorB.length}`
    );
  }
  
  // Calculate dot product
  const dot = dotProduct(vectorA, vectorB);
  
  // Calculate magnitudes
  const magA = magnitude(vectorA);
  const magB = magnitude(vectorB);
  
  // Avoid division by zero
  if (magA === 0 || magB === 0) {
    return 0;
  }
  
  // Calculate cosine similarity
  const similarity = dot / (magA * magB);
  
  // Clamp to [-1, 1] range to handle floating point errors
  return Math.max(-1, Math.min(1, similarity));
}

/**
 * Normalize cosine similarity from [-1, 1] to [0, 1]
 * Useful for scores that should be positive
 * 
 * @param {number} similarity - Cosine similarity (-1 to 1)
 * @returns {number} Normalized score (0 to 1)
 */
export function normalizeCosineSimilarity(similarity) {
  return (similarity + 1) / 2;
}

/**
 * Calculate similarities between one query vector and multiple vectors
 * Optimized for batch processing
 * 
 * @param {number[]} queryVector - Query embedding
 * @param {number[][]} vectors - Array of embedding vectors
 * @returns {number[]} Array of similarity scores
 */
export function batchCosineSimilarity(queryVector, vectors) {
  if (!Array.isArray(vectors) || vectors.length === 0) {
    return [];
  }
  
  return vectors.map(vector => cosineSimilarity(queryVector, vector));
}

/**
 * Find top K most similar vectors
 * 
 * @param {number[]} queryVector - Query embedding
 * @param {number[][]} vectors - Array of embedding vectors
 * @param {number} k - Number of top results to return
 * @returns {Array<{index: number, similarity: number}>} Top K results
 */
export function topKSimilar(queryVector, vectors, k = 10) {
  // Calculate all similarities
  const similarities = vectors.map((vector, index) => ({
    index,
    similarity: cosineSimilarity(queryVector, vector),
  }));
  
  // Sort by similarity (descending)
  similarities.sort((a, b) => b.similarity - a.similarity);
  
  // Return top K
  return similarities.slice(0, k);
}
