/**
 * Knowledge Layer Test
 * 
 * Simple test to validate the knowledge building process.
 * Run this in the browser console or Node.js to test.
 */

import { buildKnowledge, buildAllKnowledge } from './index.js';

/**
 * Test building knowledge for English
 */
async function testEnglishKnowledge() {
  console.log('\n🧪 Testing English Knowledge Build...\n');
  
  try {
    const knowledge = await buildKnowledge('en');
    
    console.log('📊 Knowledge Base Statistics:');
    console.log(`   Total Documents: ${knowledge.documents.length}`);
    console.log(`   Total Chunks: ${knowledge.chunks.length}`);
    console.log(`   Categories: ${knowledge.metadata.categories.join(', ')}`);
    console.log(`   Domains: ${knowledge.metadata.domains.join(', ')}`);
    
    console.log('\n📄 Sample Document:');
    console.log(JSON.stringify(knowledge.documents[0], null, 2));
    
    console.log('\n🧩 Sample Chunk:');
    console.log(JSON.stringify(knowledge.chunks[0], null, 2));
    
    console.log('\n✅ English knowledge test passed!');
    return knowledge;
  } catch (error) {
    console.error('❌ English knowledge test failed:', error);
    throw error;
  }
}

/**
 * Test building knowledge for Spanish
 */
async function testSpanishKnowledge() {
  console.log('\n🧪 Testing Spanish Knowledge Build...\n');
  
  try {
    const knowledge = await buildKnowledge('es');
    
    console.log('📊 Knowledge Base Statistics:');
    console.log(`   Total Documents: ${knowledge.documents.length}`);
    console.log(`   Total Chunks: ${knowledge.chunks.length}`);
    console.log(`   Categories: ${knowledge.metadata.categories.join(', ')}`);
    console.log(`   Domains: ${knowledge.metadata.domains.join(', ')}`);
    
    console.log('\n✅ Spanish knowledge test passed!');
    return knowledge;
  } catch (error) {
    console.error('❌ Spanish knowledge test failed:', error);
    throw error;
  }
}

/**
 * Test filtering and querying chunks
 */
function testQuerying(knowledge) {
  console.log('\n🧪 Testing Knowledge Queries...\n');
  
  // Test 1: Filter by category
  const expertiseChunks = knowledge.chunks.filter(
    c => c.category.primary === 'expertise'
  );
  console.log(`✓ Found ${expertiseChunks.length} expertise chunks`);
  
  // Test 2: Filter by domain
  const frontendChunks = knowledge.chunks.filter(
    c => c.category.domain === 'frontend'
  );
  console.log(`✓ Found ${frontendChunks.length} frontend chunks`);
  
  // Test 3: Find by technology
  const reactChunks = knowledge.chunks.filter(
    c => c.metadata.technologies?.includes('React')
  );
  console.log(`✓ Found ${reactChunks.length} chunks mentioning React`);
  
  // Test 4: Search content
  const aiChunks = knowledge.chunks.filter(
    c => c.content.toLowerCase().includes('ai')
  );
  console.log(`✓ Found ${aiChunks.length} chunks mentioning AI`);
  
  // Test 5: Get document with chunks
  const doc = knowledge.documents[0];
  const docChunks = knowledge.chunks.filter(
    c => doc.chunkIds.includes(c.id)
  );
  console.log(`✓ Document "${doc.title}" has ${docChunks.length} chunks`);
  
  console.log('\n✅ Query tests passed!');
}

/**
 * Test building all languages
 */
async function testAllLanguages() {
  console.log('\n🧪 Testing All Languages Build...\n');
  
  try {
    const allKnowledge = await buildAllKnowledge();
    
    console.log('📊 All Languages Statistics:');
    Object.entries(allKnowledge).forEach(([lang, kb]) => {
      console.log(`   ${lang.toUpperCase()}: ${kb.documents.length} docs, ${kb.chunks.length} chunks`);
    });
    
    console.log('\n✅ All languages test passed!');
    return allKnowledge;
  } catch (error) {
    console.error('❌ All languages test failed:', error);
    throw error;
  }
}

/**
 * Run all tests
 */
export async function runAllTests() {
  console.log('🚀 Starting Knowledge Layer Tests...');
  console.log('═══════════════════════════════════\n');
  
  try {
    // Test English
    const enKnowledge = await testEnglishKnowledge();
    
    // Test Spanish
    const esKnowledge = await testSpanishKnowledge();
    
    // Test querying
    testQuerying(enKnowledge);
    
    // Test all languages
    await testAllLanguages();
    
    console.log('\n═══════════════════════════════════');
    console.log('🎉 All tests passed successfully!');
    console.log('═══════════════════════════════════\n');
    
    return { enKnowledge, esKnowledge };
  } catch (error) {
    console.log('\n═══════════════════════════════════');
    console.error('💥 Tests failed:', error);
    console.log('═══════════════════════════════════\n');
    throw error;
  }
}

// Auto-run tests if this file is executed directly
if (typeof window !== 'undefined') {
  console.log('💡 To test the Knowledge Layer, run: runAllTests()');
}
