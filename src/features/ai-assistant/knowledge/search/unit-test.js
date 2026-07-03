/**
 * Semantic Search Components Unit Test
 * 
 * Tests the core components without requiring full knowledge base
 * Usage: node src/features/ai-assistant/knowledge/search/unit-test.js
 */

import { 
  cosineSimilarity, 
  normalizeCosineSimilarity, 
  batchCosineSimilarity 
} from './utils/cosineSimilarity.js';
import { EmbeddingService } from './services/EmbeddingService.js';

/**
 * Test cosine similarity calculations
 */
function testCosineSimilarity() {
  console.log('🧮 Testing Cosine Similarity\n');
  
  // Test 1: Identical vectors
  const v1 = [1, 2, 3];
  const v2 = [1, 2, 3];
  const sim1 = cosineSimilarity(v1, v2);
  console.log(`  Identical vectors: ${sim1.toFixed(4)} (expected: 1.0000)`);
  console.assert(Math.abs(sim1 - 1.0) < 0.0001, 'Identical vectors should have similarity 1.0');
  
  // Test 2: Orthogonal vectors
  const v3 = [1, 0, 0];
  const v4 = [0, 1, 0];
  const sim2 = cosineSimilarity(v3, v4);
  console.log(`  Orthogonal vectors: ${sim2.toFixed(4)} (expected: 0.0000)`);
  console.assert(Math.abs(sim2) < 0.0001, 'Orthogonal vectors should have similarity 0.0');
  
  // Test 3: Opposite vectors
  const v5 = [1, 2, 3];
  const v6 = [-1, -2, -3];
  const sim3 = cosineSimilarity(v5, v6);
  console.log(`  Opposite vectors: ${sim3.toFixed(4)} (expected: -1.0000)`);
  console.assert(Math.abs(sim3 + 1.0) < 0.0001, 'Opposite vectors should have similarity -1.0');
  
  // Test 4: Similar vectors
  const v7 = [1, 2, 3];
  const v8 = [1, 2, 4];
  const sim4 = cosineSimilarity(v7, v8);
  console.log(`  Similar vectors: ${sim4.toFixed(4)} (expected: ~0.99)`);
  console.assert(sim4 > 0.9 && sim4 < 1.0, 'Similar vectors should have high similarity');
  
  // Test 5: Normalization
  const normalized = normalizeCosineSimilarity(0.5);
  console.log(`  Normalized (0.5): ${normalized.toFixed(4)} (expected: 0.7500)`);
  console.assert(Math.abs(normalized - 0.75) < 0.0001, 'Normalization should work correctly');
  
  console.log('  ✅ All cosine similarity tests passed!\n');
}

/**
 * Test batch similarity
 */
function testBatchSimilarity() {
  console.log('📊 Testing Batch Cosine Similarity\n');
  
  const query = [1, 2, 3];
  const vectors = [
    [1, 2, 3],   // Identical
    [1, 2, 4],   // Similar
    [0, 1, 0],   // Different
    [-1, -2, -3] // Opposite
  ];
  
  const similarities = batchCosineSimilarity(query, vectors);
  
  console.log('  Batch results:');
  similarities.forEach((sim, i) => {
    console.log(`    Vector ${i}: ${sim.toFixed(4)}`);
  });
  
  console.assert(similarities.length === 4, 'Should return 4 results');
  console.assert(Math.abs(similarities[0] - 1.0) < 0.0001, 'First should be 1.0');
  console.assert(Math.abs(similarities[3] + 1.0) < 0.0001, 'Last should be -1.0');
  
  console.log('  ✅ Batch similarity tests passed!\n');
}

/**
 * Test embedding service
 */
async function testEmbeddingService() {
  console.log('🤖 Testing Embedding Service\n');
  
  try {
    const service = new EmbeddingService();
    console.log('  ✓ Service created');
    
    console.log('  ⏳ Initializing model (this may take a moment)...');
    await service.initialize((progress) => {
      if (progress.status === 'progress') {
        const percent = Math.round((progress.loaded / progress.total) * 100);
        console.log(`    Loading ${progress.file}: ${percent}%`);
      }
    });
    console.log('  ✓ Model initialized');
    
    // Test single embedding
    console.log('\n  Testing single embedding...');
    const text1 = 'React is a JavaScript library';
    const embedding1 = await service.embed(text1);
    console.log(`  ✓ Generated embedding: ${embedding1.length} dimensions`);
    console.assert(Array.isArray(embedding1), 'Should return array');
    console.assert(embedding1.length > 0, 'Should have dimensions');
    
    // Test cache
    console.log('\n  Testing cache...');
    const embedding1Again = await service.embed(text1);
    console.log('  ✓ Retrieved from cache');
    console.assert(embedding1 === embedding1Again, 'Should return same reference from cache');
    
    // Test batch embeddings
    console.log('\n  Testing batch embeddings...');
    const texts = [
      'JavaScript programming',
      'Python development',
      'Machine learning'
    ];
    const embeddings = await service.embedBatch(texts);
    console.log(`  ✓ Generated ${embeddings.length} embeddings`);
    console.assert(embeddings.length === 3, 'Should return 3 embeddings');
    
    // Test similarity between embeddings
    console.log('\n  Testing semantic similarity...');
    const sim1_2 = cosineSimilarity(embeddings[0], embeddings[1]);
    const sim1_3 = cosineSimilarity(embeddings[0], embeddings[2]);
    console.log(`    JS ↔ Python: ${sim1_2.toFixed(4)}`);
    console.log(`    JS ↔ ML:     ${sim1_3.toFixed(4)}`);
    console.log('  ✓ Similarity calculations work');
    
    // Test stats
    const stats = service.getCacheStats();
    console.log('\n  Cache stats:');
    console.log(`    Size: ${stats.size} entries`);
    console.log(`    Model: ${stats.model}`);
    console.log(`    Ready: ${stats.ready}`);
    
    // Cleanup
    await service.dispose();
    console.log('\n  ✓ Service disposed');
    
    console.log('\n  ✅ All embedding service tests passed!\n');
    
  } catch (err) {
    console.error('  ❌ Embedding service test failed:', err.message);
    throw err;
  }
}

/**
 * Run all unit tests
 */
async function runUnitTests() {
  console.log('🔍 Semantic Search Components - Unit Tests\n');
  console.log('='.repeat(60));
  console.log();
  
  try {
    // Test 1: Cosine Similarity
    testCosineSimilarity();
    
    // Test 2: Batch Similarity
    testBatchSimilarity();
    
    // Test 3: Embedding Service
    await testEmbeddingService();
    
    console.log('='.repeat(60));
    console.log('✅ All unit tests passed!\n');
    
  } catch (err) {
    console.error('\n❌ Tests failed:', err.message);
    console.error(err);
    process.exit(1);
  }
}

// Run tests
runUnitTests();
