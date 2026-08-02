#!/usr/bin/env node

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { NewsArticle, NewsOutput } from './types/news.js';
import { RSS_SOURCES } from './rss/sources.js';
import { fetchAllFeeds } from './rss/parser.js';
import { normalizeArticles } from './rss/normalize.js';
import { deduplicateArticles } from './rss/deduplicate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Main function to fetch, normalize, deduplicate, and save news articles
 */
async function main() {
  console.log('📰 News Feed Aggregator Starting...\n');
  console.log(`📅 ${new Date().toISOString()}\n`);
  
  try {
    // Step 1: Fetch all RSS feeds in parallel
    const feedMap = await fetchAllFeeds(RSS_SOURCES);
    
    // Step 2: Normalize all articles
    console.log('\n📝 Normalizing articles...\n');
    const allArticles: NewsArticle[] = [];
    
    for (const source of RSS_SOURCES) {
      const items = feedMap.get(source.id) || [];
      const normalized = normalizeArticles(items, source);
      allArticles.push(...normalized);
    }
    
    console.log(`\n✅ Total articles collected: ${allArticles.length}`);
    
    // Step 3: Remove duplicates
    console.log('\n🔄 Deduplicating articles...\n');
    const uniqueArticles = deduplicateArticles(allArticles);
    
    // Step 4: Sort by publish date (newest first)
    console.log('📊 Sorting by publish date...\n');
    uniqueArticles.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return dateB - dateA; // Newest first
    });
    
    // Step 5: Keep only the latest 30 articles
    const finalArticles = uniqueArticles.slice(0, 30);
    console.log(`✂️  Keeping top 30 articles (removed ${uniqueArticles.length - finalArticles.length})`);
    
    // Step 6: Create output structure
    const output: NewsOutput = {
      articles: finalArticles,
      lastUpdated: new Date().toISOString(),
      sources: RSS_SOURCES.map(s => s.name),
      totalArticles: finalArticles.length,
    };
    
    // Step 7: Write to public/news.json
    const outputPath = join(__dirname, '../public/news.json');
    writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
    
    console.log(`\n✅ Successfully wrote ${finalArticles.length} articles to public/news.json`);
    console.log('\n📊 Summary by source:');
    
    // Print summary statistics
    const sourceStats = new Map<string, number>();
    finalArticles.forEach(article => {
      sourceStats.set(article.source, (sourceStats.get(article.source) || 0) + 1);
    });
    
    sourceStats.forEach((count, source) => {
      console.log(`   ${source}: ${count} articles`);
    });
    
    console.log('\n🎉 News feed update complete!\n');
    
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
main();
