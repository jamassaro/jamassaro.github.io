// Quick test to see what knowledge the AI has about projects
// Paste this in browser console at http://localhost:5175/

(async () => {
  try {
    console.log('🔄 Loading knowledge base...');
    const { buildKnowledge } = await import('/src/features/ai-assistant/knowledge/index.js');
    const knowledge = await buildKnowledge('en');
    
    console.log('\n📊 KNOWLEDGE BASE STATS');
    console.log('='.repeat(60));
    console.log('Total Documents:', knowledge.documents.length);
    console.log('Total Chunks:', knowledge.chunks.length);
    console.log('Categories:', knowledge.metadata.categories.join(', '));
    
    console.log('\n📁 PROJECT INFORMATION');
    console.log('='.repeat(60));
    const projectChunks = knowledge.chunks.filter(c => c.category.primary === 'projects');
    console.log('Total Project Chunks:', projectChunks.length);
    
    if (projectChunks.length === 0) {
      console.error('❌ NO PROJECT CHUNKS FOUND!');
      console.log('This means the knowledge builder is not finding your projects.');
    } else {
      projectChunks.forEach((chunk, i) => {
        console.log(`\n${'─'.repeat(60)}`);
        console.log(`PROJECT ${i + 1}`);
        console.log(`${'─'.repeat(60)}`);
        console.log('📌 Project Name:', chunk.metadata.projectName || 'N/A');
        console.log('🔧 Technologies:', chunk.metadata.technologies?.join(', ') || 'None listed');
        console.log('🌐 URL:', chunk.metadata.url || 'No URL');
        console.log('📅 Year:', chunk.metadata.year || 'N/A');
        console.log('📝 Content:');
        console.log(chunk.content);
      });
    }
    
    console.log('\n✅ Test complete! If you see your projects above, the AI can access them.');
    console.log('💡 Try asking: "What projects have you built?" or "Tell me about Deal Advisor"');
    
  } catch (err) {
    console.error('❌ Error building knowledge:', err);
    console.error('Stack:', err.stack);
  }
})();
