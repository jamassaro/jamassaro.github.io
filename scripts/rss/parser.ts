import Parser from 'rss-parser';
import type { RSSSource, RSSItem } from '../types/news.js';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; NewsAggregator/1.0)',
  },
});

/**
 * Fetch and parse a single RSS feed
 * @param source RSS feed configuration
 * @returns Array of parsed RSS items
 */
export async function fetchRSSFeed(source: RSSSource): Promise<RSSItem[]> {
  try {
    console.log(`📡 Fetching ${source.name} from ${source.url}`);
    
    const feed = await parser.parseURL(source.url);
    
    if (!feed.items || feed.items.length === 0) {
      console.warn(`⚠️  No items found in ${source.name}`);
      return [];
    }
    
    console.log(`✅ Fetched ${feed.items.length} articles from ${source.name}`);
    return feed.items as RSSItem[];
    
  } catch (error) {
    console.error(`❌ Error fetching ${source.name}:`, error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * Fetch all RSS feeds in parallel
 * @param sources Array of RSS feed configurations
 * @returns Map of source ID to RSS items
 */
export async function fetchAllFeeds(sources: RSSSource[]): Promise<Map<string, RSSItem[]>> {
  console.log(`\n🚀 Starting to fetch ${sources.length} RSS feeds...\n`);
  
  const results = await Promise.allSettled(
    sources.map(async (source) => ({
      sourceId: source.id,
      sourceName: source.name,
      items: await fetchRSSFeed(source),
    }))
  );
  
  const feedMap = new Map<string, RSSItem[]>();
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      feedMap.set(result.value.sourceId, result.value.items);
    } else {
      console.error(`❌ Failed to fetch ${sources[index].name}:`, result.reason);
      feedMap.set(sources[index].id, []);
    }
  });
  
  return feedMap;
}
