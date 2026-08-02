import type { RSSSource } from '../types/news.js';

/**
 * List of RSS feeds to aggregate
 * Easy to extend - just add more sources to this array
 */
export const RSS_SOURCES: RSSSource[] = [
  {
    id: 'TECHCRUNCH',
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    category: 'Tech News',
  },
  {
    id: 'THE_VERGE',
    name: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
    category: 'Tech News',
  },
  {
    id: 'MACRUMORS',
    name: 'MacRumors',
    url: 'https://feeds.macrumors.com/MacRumors-All',
    category: 'Apple News',
  },
  {
    id: '9TO5MAC',
    name: '9to5Mac',
    url: 'https://9to5mac.com/feed/',
    category: 'Apple News',
  },
];
