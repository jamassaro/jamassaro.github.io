/**
 * Semantic Search Test
 * 
 * Quick test to verify semantic search is working
 * Usage: node src/features/ai-assistant/knowledge/search/semantic-test.js
 */

import { createSearchService } from './index.js';
import { SEARCH_STRATEGIES } from './constants.js';

async function testSemanticSearch() {
  console.log('🔍 Semantic Search Test\n');
  console.log('='.repeat(60));

  try {
    // Create search service (should use semantic by default)
    console.log('\n📦 Creating semantic search service...');
    console.log('⏳ Loading embedding model (this may take a moment)...\n');
    
    const service = await createSearchService('en', {
      onProgress: (progress) => {
        if (progress.status === 'progress') {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          console.log(`   Loading ${progress.file}: ${percent}%`);
        } else if (progress.status === 'done') {
          console.log(`   ✓ Loaded ${progress.file}`);
        }
      }
    });
    
    console.log('\n✅ Service created successfully');
    console.log(`📊 Strategy: ${service.getStrategyName()}`);
    console.log(`📚 Total chunks: ${service.getStats().totalChunks}`);

    // Test semantic search with sample questions
    const testQuestions = [
      'Tell me about your React expertise',
      'What JavaScript frameworks do you know?',
      'Describe your experience with TypeScript',
    ];

    console.log('\n' + '-'.repeat(60));
    console.log('Running semantic search tests...\n');

    for (const question of testQuestions) {
      console.log(`\n❓ "${question}"`);
      
      const startTime = Date.now();
      const results = await service.search(question, { maxResults: 3 });
      const duration = Date.now() - startTime;
      
      console.log(`   ⏱️  ${duration}ms | 📊 ${results.length} results`);
      
      results.forEach((result, index) => {
        console.log(`   ${index + 1}. [${result.score.toFixed(3)}] ${result.chunk.metadata.title || 'Untitled'}`);
        const similarity = result.metadata.similarity;
        if (similarity !== undefined) {
          console.log(`      Cosine similarity: ${similarity.toFixed(3)}`);
        }
      });
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Semantic search test complete!\n');
    
    // Get stats
    const stats = service.getStrategyStats();
    if (stats) {
      console.log('📈 Cache Statistics:');
      console.log(`   - Chunk embeddings cached: ${stats.chunkEmbeddings}`);
      console.log(`   - Embedding service cache: ${stats.embeddingService.size} entries`);
    }

  } catch (err) {
    console.error('\n❌ Test failed:', err.message);
    console.error(err);
    process.exit(1);
  }
}

// Run test
testSemanticSearch();
