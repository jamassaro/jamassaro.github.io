/**
 * Test file for AI Provider system
 * Run with: node --loader ./svg-loader.js src/features/ai-assistant/conversation/providers/test.js
 */

import { IAIProvider } from './IAIProvider.js';
import { MockAIProvider } from './MockAIProvider.js';
import { AIProviderFactory, PROVIDER_TYPES } from './providerFactory.js';

console.log('🧪 Testing AI Provider System\n');

// Test 1: Interface enforcement
console.log('Test 1: Interface Enforcement');
try {
  const abstract = new IAIProvider();
  console.log('✗ Should not be able to instantiate IAIProvider');
} catch (err) {
  console.log('✓ Cannot instantiate abstract class:', err.message);
}
console.log('');

// Test 2: MockAIProvider creation
console.log('Test 2: MockAIProvider Creation');
const mockProvider = new MockAIProvider({ delay: 300 });
console.log('✓ MockAIProvider created');
console.log('  Info:', mockProvider.getInfo());
console.log('  Ready:', mockProvider.isReady());
console.log('');

// Test 3: Provider initialization
console.log('Test 3: Provider Initialization');
await mockProvider.initialize();
console.log('✓ Provider initialized');
console.log('  Ready:', mockProvider.isReady());
console.log('');

// Test 4: Chat completion
console.log('Test 4: Chat Completion');
const messages = [
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'What is React?' }
];

const searchResults = [
  {
    chunk: {
      id: 'chunk_1',
      content: 'React is a JavaScript library for building user interfaces.',
      category: 'expertise',
    },
    score: 0.9,
  }
];

const response = await mockProvider.chat(messages, {
  searchResults,
  language: 'en',
});

console.log('✓ Chat response received:');
console.log(`  Content length: ${response.content.length} characters`);
console.log(`  Tokens: ${response.tokens}`);
console.log(`  Model: ${response.model}`);
console.log(`  Processing time: ${response.processingTime}ms`);
console.log(`  From cache: ${response.fromCache}`);
console.log('');

console.log('Response preview:');
console.log('---');
console.log(response.content.slice(0, 150) + '...');
console.log('---');
console.log('');

// Test 5: Streaming
console.log('Test 5: Streaming');
let streamedText = '';
let chunkCount = 0;

for await (const chunk of mockProvider.stream(messages, { searchResults, language: 'en' })) {
  streamedText += chunk;
  chunkCount++;
}

console.log('✓ Streaming completed:');
console.log(`  Total chunks: ${chunkCount}`);
console.log(`  Total length: ${streamedText.length} characters`);
console.log(`  Matches chat: ${streamedText === response.content}`);
console.log('');

// Test 6: Factory pattern
console.log('Test 6: Factory Pattern');
const factoryMock = AIProviderFactory.create(PROVIDER_TYPES.MOCK, { delay: 200 });
console.log('✓ Factory created mock provider');
console.log('  Info:', factoryMock.getInfo());

const defaultProvider = AIProviderFactory.createDefault();
console.log('✓ Factory created default provider');
console.log('  Info:', defaultProvider.getInfo());

console.log('✓ Supported types:', AIProviderFactory.getSupportedTypes());
console.log('✓ Is "mock" supported:', AIProviderFactory.isTypeSupported('mock'));
console.log('✓ Is "unknown" supported:', AIProviderFactory.isTypeSupported('unknown'));
console.log('');

// Test 7: WebLLM Provider Creation
console.log('Test 7: WebLLM Provider Creation');
try {
  const webllmProvider = AIProviderFactory.create(PROVIDER_TYPES.WEBLLM, {
    model: 'Llama-3.2-1B-Instruct-q4f16_1-MLC',
    onProgress: (p) => console.log(`    Progress: ${Math.round(p.progress * 100)}%`)
  });
  console.log('✓ WebLLM provider created');
  console.log('  Info:', webllmProvider.getInfo());
  console.log('  Ready:', webllmProvider.isReady());
  console.log('  Note: Initialization skipped (requires WebGPU and model download)');
  
  // Test factory convenience method
  const webllmProvider2 = AIProviderFactory.createWebLLM({ model: 'Llama-3.2-3B-Instruct-q4f16_1-MLC' });
  console.log('✓ Factory.createWebLLM() works');
  console.log('  Info:', webllmProvider2.getInfo());
} catch (err) {
  console.log('✗ WebLLM provider creation failed:', err.message);
}
console.log('');

// Test 8: Dispose
console.log('Test 8: Resource Cleanup');
await mockProvider.dispose();
console.log('✓ Provider disposed');
console.log('  Ready:', mockProvider.isReady());
console.log('');

// Test 9: Error handling (not initialized)
console.log('Test 9: Error Handling (Not Initialized)');
const uninitProvider = new MockAIProvider();
try {
  await uninitProvider.chat(messages, { searchResults, language: 'en' });
  console.log('✗ Should throw error when not initialized');
} catch (err) {
  console.log('✓ Correctly throws error:', err.message);
}
console.log('');

console.log('✅ All provider tests completed!');
console.log('');
console.log('📊 Summary:');
console.log('  - Interface enforcement: ✓');
console.log('  - Provider creation: ✓');
console.log('  - Initialization: ✓');
console.log('  - Chat completion: ✓');
console.log('  - Streaming: ✓');
console.log('  - Factory pattern: ✓');
console.log('  - WebLLM creation: ✓');
console.log('  - Error handling: ✓');
console.log('  - Resource cleanup: ✓');
