/**
 * Core data structure for a news article
 */
export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  image?: string;
  url: string;
  source: string;
  category: string;
  publishedAt: string;
}

/**
 * Configuration for an RSS feed source
 */
export interface RSSSource {
  id: string;
  name: string;
  url: string;
  category: string;
}

/**
 * Raw RSS item from rss-parser
 */
export interface RSSItem {
  title?: string;
  link?: string;
  pubDate?: string;
  content?: string;
  contentSnippet?: string;
  guid?: string;
  isoDate?: string;
  enclosure?: {
    url?: string;
  };
  'media:content'?: {
    $?: {
      url?: string;
    };
  };
  'media:thumbnail'?: {
    $?: {
      url?: string;
    };
  };
}

/**
 * Structure of the final JSON output
 */
export interface NewsOutput {
  articles: NewsArticle[];
  lastUpdated: string;
  sources: string[];
  totalArticles: number;
}
