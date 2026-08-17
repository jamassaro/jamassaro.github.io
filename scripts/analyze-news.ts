#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { waitForOllama, generateCompletion, ensureModel } from './ai/ollama-client.js';
import { buildAnalysisPrompt } from './ai/prompt-builder.js';
import { parseAndValidate, createFallbackAnalysis } from './ai/response-parser.js';
import type { NewsArticle } from './types/news.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Main function to analyze news and generate insights
 */
async function main() {
  console.log('🤖 AI News Analysis Starting...');
  console.log(`📅 ${new Date().toISOString()}\n`);
  
  try {
    // Step 1: Wait for Ollama server
    console.log('Step 1: Checking Ollama server...');
    await waitForOllama();
    console.log('');
    
    // Step 2: Ensure model is available
    console.log('Step 2: Verifying AI model...');
    await ensureModel();
    console.log('');
    
    // Step 3: Load news articles
    console.log('Step 3: Loading news articles...');
    const newsPath = join(__dirname, '../public/news.json');
    
    let newsData: { articles: NewsArticle[]; lastUpdated: string };
    try {
      newsData = JSON.parse(readFileSync(newsPath, 'utf-8'));
    } catch (error) {
      throw new Error(`Failed to read news.json: ${error}`);
    }
    
    console.log(`✅ Loaded ${newsData.articles.length} articles`);
    console.log(`   Last updated: ${new Date(newsData.lastUpdated).toLocaleString()}`);
    console.log('');
    
    if (newsData.articles.length === 0) {
      throw new Error('No articles found in news.json');
    }
    
    // Step 4: Build analysis prompt
    console.log('Step 4: Building analysis prompt...');
    const prompt = buildAnalysisPrompt(newsData.articles);
    console.log(`✅ Prompt ready (${prompt.length} characters)`);
    console.log('');
    
    // Step 5: Generate AI analysis
    console.log('Step 5: Analyzing with AI...');
    console.log('⏳ This may take 2-4 minutes depending on your system...');
    const startTime = Date.now();
    
    const response = await generateCompletion(prompt);
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`✅ Analysis generated in ${duration}s`);
    console.log('');
    
    // Step 6: Parse and validate response
    console.log('Step 6: Parsing AI response...');
    const analysis = parseAndValidate(response.response, newsData.articles);
    console.log('');
    
    // Step 7: Save to file
    console.log('Step 7: Saving analysis...');
    const outputPath = join(__dirname, '../public/analysis.json');
    writeFileSync(outputPath, JSON.stringify(analysis, null, 2), 'utf-8');
    console.log('✅ Saved to public/analysis.json');
    console.log('');
    
    // Step 8: Display summary
    console.log('📊 Analysis Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Executive Summary:`);
    console.log(`  ${analysis.executiveSummary}\n`);
    console.log(`Takeaways: ${analysis.takeaways.length}`);
    analysis.takeaways.forEach((t, i) => {
      console.log(`  ${i + 1}. ${t.title}`);
    });
    console.log('');
    console.log(`Trending Topics: ${analysis.trends.join(', ')}`);
    console.log('');
    console.log(`Worth Watching: ${analysis.worthWatching.length} items`);
    console.log(`Engineering Insights: ${analysis.engineeringPerspective.length} insights`);
    console.log('');
    console.log(`Statistics:`);
    console.log(`  Total Articles: ${analysis.statistics.totalArticles}`);
    console.log(`  Sources: ${analysis.statistics.totalSources}`);
    console.log(`  Top Topics: ${analysis.statistics.mostMentionedTopics.join(', ')}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n🎉 AI Analysis Complete!\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error);
    console.error('\n⚠️  Generating fallback analysis...\n');
    
    // Create fallback analysis
    const fallback = createFallbackAnalysis();
    const outputPath = join(__dirname, '../public/analysis.json');
    writeFileSync(outputPath, JSON.stringify(fallback, null, 2), 'utf-8');
    
    console.log('✅ Fallback analysis saved');
    console.log('ℹ️  The workflow will continue, but AI insights are unavailable\n');
    
    // Exit successfully (don't fail the workflow)
    process.exit(0);
  }
}

// Run the analysis
main();
