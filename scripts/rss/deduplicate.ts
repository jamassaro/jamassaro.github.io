import type { NewsArticle } from '../types/news.js';

/**
 * Calculate similarity between two strings (0-1)
 * Simple implementation using Jaccard similarity
 */
function calculateSimilarity(str1: string, str2: string): number {
  const normalize = (s: string) => s.toLowerCase().replace(/[^\w\s]/g, '');
  
  const words1 = new Set(normalize(str1).split(/\s+/));
  const words2 = new Set(normalize(str2).split(/\s+/));
  
  const intersection = new Set([...words1].filter(word => words2.has(word)));
  const union = new Set([...words1, ...words2]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
}

/**
 * Check if two articles are duplicates
 * Considers both URL and title similarity
 */
function areDuplicates(article1: NewsArticle, article2: NewsArticle): boolean {
  // Same URL = definite duplicate
  if (article1.url === article2.url) {
    return true;
  }
  
  // Very similar titles (>90% similarity) = likely duplicate
  const titleSimilarity = calculateSimilarity(article1.title, article2.title);
  if (titleSimilarity > 0.9) {
    return true;
  }
  
  return false;
}

/**
 * Remove duplicate articles
 * When duplicates are found, keeps the one from the most recent source
 * @param articles Array of articles to deduplicate
 * @returns Deduplicated array of articles
 */
export function deduplicateArticles(articles: NewsArticle[]): NewsArticle[] {
  const unique: NewsArticle[] = [];
  const seenUrls = new Set<string>();
  
  for (const article of articles) {
    // Quick check: if we've seen this exact URL, skip it
    if (seenUrls.has(article.url)) {
      continue;
    }
    
    // Check against all unique articles for similarity
    const isDuplicate = unique.some(existingArticle => 
      areDuplicates(article, existingArticle)
    );
    
    if (!isDuplicate) {
      unique.push(article);
      seenUrls.add(article.url);
    }
  }
  
  const duplicatesRemoved = articles.length - unique.length;
  if (duplicatesRemoved > 0) {
    console.log(`🔄 Removed ${duplicatesRemoved} duplicate articles`);
  }
  
  return unique;
}
