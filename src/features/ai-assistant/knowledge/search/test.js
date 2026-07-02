/**
 * Knowledge Search System - Test & Demo
 * 
 * Run this file to test the search system.
 * Usage: node src/features/ai-assistant/knowledge/search/test.js
 */

import { createSearchService, quickSearch } from './index.js';
import { SEARCH_STRATEGIES } from './constants.js';

/**
 * Test search system with sample questions
 */
async function testSearchSystem() {
  console.log('🔍 Knowledge Search System Test\n');
  console.log('='.repeat(60));

  // Test questions
  const testQuestions = [
    {
      question: 'What is your React experience?',
      description: 'Testing expertise matching',
    },
    {
      question: 'Tell me about Brave Up!',
      description: 'Testing venture project matching',
    },
    {
      question: 'What backend technologies do you use?',
      description: 'Testing technology filtering',
    },
    {
      question: 'TypeScript and Node.js projects',
      description: 'Testing multiple technology matches',
    },
    {
      question: 'fullstack development',
      description: 'Testing domain matching',
    },
  ];

  // Create search service
  console.log('\n📦 Creating search service...');
  const service = await createSearchService('en');
  
  console.log(`✅ Service created with ${service.getStats().totalChunks} chunks`);
  console.log(`📊 Strategy: ${service.getStrategyName()}`);
  console.log(`📁 Categories:`, service.getStats().categories);

  // Run test questions
  for (const { question, description } of testQuestions) {
    console.log('\n' + '-'.repeat(60));
    console.log(`\n❓ Question: "${question}"`);
    console.log(`📝 Test: ${description}`);
    
    const startTime = Date.now();
    const results = await service.search(question, { maxResults: 3 });
    const duration = Date.now() - startTime;
    
    console.log(`⏱️  Search time: ${duration}ms`);
    console.log(`📊 Results: ${results.length}`);
    
    if (results.length > 0) {
      results.forEach((result, index) => {
        console.log(`\n  ${index + 1}. Score: ${result.score.toFixed(3)}`);
        console.log(`     Category: ${result.chunk.category.primary}`);
        console.log(`     Domain: ${result.chunk.category.domain || 'N/A'}`);
        console.log(`     Title: ${result.chunk.title}`);
        console.log(`     Matched terms: ${result.matches.terms.join(', ')}`);
        if (result.matches.highlight) {
          console.log(`     Highlight: ${result.matches.highlight.slice(0, 150)}...`);
        }
      });
    } else {
      console.log('  ❌ No results found');
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ All tests complete!\n');
}

/**
 * Test quick search function
 */
async function testQuickSearch() {
  console.log('🚀 Testing Quick Search API\n');
  
  const results = await quickSearch('React TypeScript', 'en', { maxResults: 5 });
  
  console.log(`Found ${results.length} results`);
  results.forEach((r, i) => {
    console.log(`${i + 1}. ${r.chunk.title} (${r.score.toFixed(3)})`);
  });
}

/**
 * Test search options (filtering)
 */
async function testSearchOptions() {
  console.log('\n🎯 Testing Search Options (Filtering)\n');
  
  const service = await createSearchService('en');
  
  // Test 1: Filter by category
  console.log('Test 1: Filter by category = "expertise"');
  const expertiseResults = await service.search('JavaScript', {
    filterCategory: 'expertise',
    maxResults: 3,
  });
  console.log(`  Results: ${expertiseResults.length}`);
  expertiseResults.forEach(r => {
    console.log(`    - ${r.chunk.title} (category: ${r.chunk.category.primary})`);
  });
  
  // Test 2: Filter by technologies
  console.log('\nTest 2: Filter by technologies = ["React"]');
  const reactResults = await service.search('development', {
    filterTechnologies: ['React'],
    maxResults: 3,
  });
  console.log(`  Results: ${reactResults.length}`);
  reactResults.forEach(r => {
    console.log(`    - ${r.chunk.title} (techs: ${r.chunk.metadata.technologies?.join(', ')})`);
  });
}

/**
 * Test strategy switching
 */
async function testStrategySwitch() {
  console.log('\n🔄 Testing Strategy Switching\n');
  
  const service = await createSearchService('en');
  
  console.log(`Initial strategy: ${service.getStrategyName()}`);
  
  // In the future, we can switch to embedding strategy:
  // const embeddingStrategy = new EmbeddingSearchStrategy();
  // service.setStrategy(embeddingStrategy);
  // console.log(`New strategy: ${service.getStrategyName()}`);
}

// Run all tests
async function runAllTests() {
  try {
    await testSearchSystem();
    await testQuickSearch();
    await testSearchOptions();
    await testStrategySwitch();
    
    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}

export { testSearchSystem, testQuickSearch, testSearchOptions };
