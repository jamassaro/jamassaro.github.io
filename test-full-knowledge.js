// Test script to verify ALL knowledge in AI's database
// Run in browser console after loading the app

(async () => {
  console.log('🔍 TESTING FULL KNOWLEDGE BASE...\n');

  const { buildKnowledge } = await import('/src/features/ai-assistant/knowledge/index.js');
  const knowledge = await buildKnowledge('en');

  console.log('📊 KNOWLEDGE BASE STATISTICS');
  console.log('Total documents:', knowledge.documents.length);
  console.log('Total chunks:', knowledge.chunks.length);
  console.log('Total tokens:', knowledge.metadata.totalTokens);
  console.log('Language:', knowledge.metadata.language);
  console.log('\n');

  // Group by category
  const byCategory = {};
  knowledge.chunks.forEach(chunk => {
    const cat = chunk.category.primary;
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(chunk);
  });

  console.log('📂 CONTENT BY CATEGORY:\n');

  // PERSONAL INFO
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👤 PERSONAL INFO');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const personal = byCategory['personal'] || [];
  if (personal.length === 0) {
    console.warn('⚠️  NO PERSONAL INFO FOUND!');
  } else {
    personal.forEach(chunk => {
      console.log('\n📌', chunk.metadata.section || 'General');
      console.log('Content:', chunk.content.substring(0, 200) + '...');
    });
  }

  // EXPERTISE
  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('💡 EXPERTISE');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const expertise = byCategory['expertise'] || [];
  if (expertise.length === 0) {
    console.warn('⚠️  NO EXPERTISE FOUND!');
  } else {
    expertise.forEach(chunk => {
      console.log('\n📌', chunk.metadata.expertiseArea);
      console.log('Technologies:', chunk.metadata.technologies.join(', '));
      console.log('Content:', chunk.content.substring(0, 150) + '...');
    });
  }

  // PROJECTS
  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚀 PROJECTS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const projects = byCategory['projects'] || [];
  if (projects.length === 0) {
    console.warn('⚠️  NO PROJECTS FOUND!');
  } else {
    projects.forEach(chunk => {
      console.log('\n📌', chunk.metadata.projectName);
      console.log('URL:', chunk.metadata.url || 'N/A');
      console.log('Technologies:', chunk.metadata.technologies.join(', '));
      console.log('Content:', chunk.content.substring(0, 300));
    });
  }

  // VENTURES
  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🌟 VENTURES/ENTREPRENEURSHIP');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const ventures = byCategory['ventures'] || [];
  if (ventures.length === 0) {
    console.warn('⚠️  NO VENTURES FOUND!');
  } else {
    ventures.forEach(chunk => {
      console.log('\n📌', chunk.metadata.ventureName);
      console.log('URL:', chunk.metadata.url || 'N/A');
      console.log('Card:', chunk.metadata.cardTitle || 'Main description');
      console.log('Technologies:', chunk.metadata.technologies.join(', '));
      console.log('Content:', chunk.content.substring(0, 200) + '...');
    });
  }

  // CHECK FOR MISSING CONTENT
  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ VERIFICATION');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const checks = {
    'Personal bio/introduction': personal.length > 0,
    'Contact information (email, phone)': personal.some(c => c.content.includes('jamassaro@gmail.com')),
    'Expertise areas': expertise.length >= 5,
    'Frontend technologies': expertise.some(c => c.metadata.expertiseArea?.toLowerCase().includes('frontend')),
    'Backend/AI technologies': expertise.some(c => c.metadata.expertiseArea?.toLowerCase().includes('backend')),
    'Cloud infrastructure': expertise.some(c => c.metadata.expertiseArea?.toLowerCase().includes('cloud')),
    'Projects (Deal Advisor)': projects.some(c => c.metadata.projectName?.includes('DEAL ADVISOR')),
    'Projects (Data Brew)': projects.some(c => c.metadata.projectName?.includes('DATA BREW')),
    'Project URLs included': projects.some(c => c.content.includes('http')),
    'Venture (Brave Up!)': ventures.length > 0,
    'Venture metrics (users, schools)': ventures.some(c => c.content.includes('100K') || c.content.includes('Users')),
  };

  Object.entries(checks).forEach(([check, passed]) => {
    console.log(passed ? '✅' : '❌', check);
  });

  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('💾 SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Personal chunks: ${personal.length}`);
  console.log(`Expertise chunks: ${expertise.length}`);
  console.log(`Project chunks: ${projects.length}`);
  console.log(`Venture chunks: ${ventures.length}`);
  console.log(`Total: ${knowledge.chunks.length} chunks`);
  console.log(`Coverage: ${Object.values(checks).filter(Boolean).length}/${Object.keys(checks).length} checks passed`);

  const coverage = (Object.values(checks).filter(Boolean).length / Object.keys(checks).length) * 100;
  console.log(`\n${coverage.toFixed(0)}% of expected content is available to the AI`);

  if (coverage < 100) {
    console.log('\n⚠️  Some content might be missing. Check the failed items above.');
  } else {
    console.log('\n🎉 All expected content is available!');
  }
})();
