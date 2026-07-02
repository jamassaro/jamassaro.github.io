/**
 * Knowledge Layer Demo
 * 
 * Quick demo to test the Knowledge Layer in browser console.
 * 
 * Usage:
 * 1. Open browser console
 * 2. Paste this file's content
 * 3. Run: await demoKnowledgeLayer()
 */

/**
 * Simple demo function to showcase Knowledge Layer
 */
async function demoKnowledgeLayer() {
  console.log('🚀 Knowledge Layer Demo');
  console.log('═══════════════════════\n');

  try {
    // Import the builder
    const { buildKnowledge } = await import('./index.js');

    // Build English knowledge
    console.log('📚 Building English knowledge base...\n');
    const knowledge = await buildKnowledge('en');

    // Show statistics
    console.log('📊 Statistics:');
    console.log(`   Documents: ${knowledge.documents.length}`);
    console.log(`   Chunks: ${knowledge.chunks.length}`);
    console.log(`   Categories: ${knowledge.metadata.categories.join(', ')}`);
    console.log(`   Domains: ${knowledge.metadata.domains.join(', ')}\n`);

    // Show sample document
    console.log('📄 Sample Document (First Expertise):');
    const sampleDoc = knowledge.documents[0];
    console.table({
      ID: sampleDoc.id,
      Title: sampleDoc.title,
      Type: sampleDoc.type,
      Domain: sampleDoc.category.domain,
      'Chunk Count': sampleDoc.chunkIds.length,
    });

    // Show sample chunk
    console.log('\n🧩 Sample Chunk:');
    const sampleChunk = knowledge.chunks[0];
    console.table({
      ID: sampleChunk.id,
      'Document ID': sampleChunk.documentId,
      Category: sampleChunk.category.primary,
      Domain: sampleChunk.category.domain,
      'Token Count': sampleChunk.tokenCount,
      Content: sampleChunk.content.slice(0, 80) + '...',
    });

    // Show filtering examples
    console.log('\n🔍 Query Examples:\n');

    const expertiseChunks = knowledge.chunks.filter(
      c => c.category.primary === 'expertise'
    );
    console.log(`   ✓ Expertise chunks: ${expertiseChunks.length}`);

    const frontendChunks = knowledge.chunks.filter(
      c => c.category.domain === 'frontend'
    );
    console.log(`   ✓ Frontend chunks: ${frontendChunks.length}`);

    const reactChunks = knowledge.chunks.filter(
      c => c.metadata.technologies?.includes('React')
    );
    console.log(`   ✓ React mentions: ${reactChunks.length}`);

    const aiChunks = knowledge.chunks.filter(
      c => c.content.toLowerCase().includes('ai')
    );
    console.log(`   ✓ AI-related chunks: ${aiChunks.length}`);

    // Show all documents by type
    console.log('\n📚 Documents by Type:');
    const byType = {};
    knowledge.documents.forEach(doc => {
      byType[doc.type] = (byType[doc.type] || 0) + 1;
    });
    console.table(byType);

    // Show all chunks by category
    console.log('\n🏷️  Chunks by Category:');
    const byCategory = {};
    knowledge.chunks.forEach(chunk => {
      byCategory[chunk.category.primary] = (byCategory[chunk.category.primary] || 0) + 1;
    });
    console.table(byCategory);

    // Show technology distribution
    console.log('\n💻 Technology Distribution:');
    const techCount = {};
    knowledge.chunks.forEach(chunk => {
      if (chunk.metadata.technologies) {
        chunk.metadata.technologies.forEach(tech => {
          techCount[tech] = (techCount[tech] || 0) + 1;
        });
      }
    });
    const topTechs = Object.entries(techCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    console.table(Object.fromEntries(topTechs));

    console.log('\n✅ Demo completed successfully!');
    console.log('═══════════════════════\n');

    // Return knowledge for further exploration
    console.log('💡 Tip: The knowledge object is returned. Try:');
    console.log('   - knowledge.documents');
    console.log('   - knowledge.chunks');
    console.log('   - knowledge.metadata');

    return knowledge;
  } catch (error) {
    console.error('❌ Demo failed:', error);
    throw error;
  }
}

// Make it globally available
if (typeof window !== 'undefined') {
  window.demoKnowledgeLayer = demoKnowledgeLayer;
  console.log('💡 Run: await demoKnowledgeLayer()');
}

export { demoKnowledgeLayer };
