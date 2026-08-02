import { createHash } from 'crypto';
import type { NewsArticle, RSSItem, RSSSource } from '../types/news.js';

/**
 * Generate a unique ID for an article based on URL and title
 */
function generateArticleId(url: string, title: string): string {
  const hash = createHash('md5');
  hash.update(`${url}-${title}`);
  return hash.digest('hex').substring(0, 16);
}

/**
 * Extract image URL from RSS item
 * Tries multiple common RSS image fields
 */
function extractImage(item: RSSItem): string | undefined {
  // Try enclosure (common in podcasts and media RSS)
  if (item.enclosure?.url) {
    return item.enclosure.url;
  }
  
  // Try media:content
  if (item['media:content']?.$?.url) {
    return item['media:content'].$.url;
  }
  
  // Try media:thumbnail
  if (item['media:thumbnail']?.$?.url) {
    return item['media:thumbnail'].$.url;
  }
  
  // Try to extract image from content HTML
  if (item.content) {
    const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1];
    }
  }
  
  return undefined;
}

/**
 * Clean HTML tags from text
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

/**
 * Normalize a single RSS item to NewsArticle format
 */
export function normalizeArticle(item: RSSItem, source: RSSSource): NewsArticle | null {
  // Required fields validation
  if (!item.title || !item.link) {
    console.warn(`⚠️  Skipping article from ${source.name}: missing title or link`);
    return null;
  }
  
  // Get description from contentSnippet or content, fallback to empty string
  const rawDescription = item.contentSnippet || item.content || '';
  const description = stripHtml(rawDescription).substring(0, 300);
  
  // Use isoDate if available, otherwise pubDate
  const publishedAt = item.isoDate || item.pubDate || new Date().toISOString();
  
  // Generate unique ID
  const id = generateArticleId(item.link, item.title);
  
  return {
    id,
    title: item.title.trim(),
    description,
    image: extractImage(item),
    url: item.link,
    source: source.name,
    category: source.category,
    publishedAt,
  };
}

/**
 * Normalize all RSS items from a source
 */
export function normalizeArticles(items: RSSItem[], source: RSSSource): NewsArticle[] {
  const normalized: NewsArticle[] = [];
  
  for (const item of items) {
    const article = normalizeArticle(item, source);
    if (article) {
      normalized.push(article);
    }
  }
  
  console.log(`📝 Normalized ${normalized.length}/${items.length} articles from ${source.name}`);
  return normalized;
}
