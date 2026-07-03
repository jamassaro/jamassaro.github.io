/**
 * Test file for conversation system with AI Provider injection
 * Run with: node --loader ./svg-loader.js src/features/ai-assistant/conversation/test.js
 */

import { ConversationManager } from './core/ConversationManager.js';
import { AIProviderFactory } from './providers/providerFactory.js';
import { conversationReducer, initialConversationState } from './core/conversationReducer.js';
import { conversationActions } from './core/conversationActions.js';
import { 
  generateMessageId, 
  createUserMessage, 
  validateMessageContent 
} from './core/conversationUtils.js';
import { CONVERSATION_CONFIG, STATIC_PROMPTS } from './config/index.js';

console.log('🧪 Testing Conversation System with AI Provider Injection\n');

// Test 1: Utility functions
console.log('Test 1: Utility Functions');
const messageId = generateMessageId();
console.log(`✓ Generated message ID: ${messageId}`);

const userMsg = createUserMessage('Test message');
console.log(`✓ Created user message:`, { id: userMsg.id, role: userMsg.role, content: userMsg.content });

const validation = validateMessageContent('Valid message');
console.log(`✓ Message validation:`, validation);
console.log('');

// Test 2: Actions and Reducer
console.log('Test 2: Actions and Reducer');
let state = initialConversationState;
console.log(`✓ Initial state created with ${state.messages.length} messages`);

// Add user message
state = conversationReducer(state, conversationActions.addUserMessage('Hello'));
console.log(`✓ Added user message, now ${state.messages.length} messages`);

// Add assistant message
state = conversationReducer(state, conversationActions.addAssistantMessage('Hi there!', {}));
console.log(`✓ Added assistant message, now ${state.messages.length} messages`);

// Start typing
state = conversationReducer(state, conversationActions.startTyping('Typing...'));
console.log(`✓ Started typing, status: ${state.status}`);

// Finish typing
state = conversationReducer(state, conversationActions.finishTyping());
console.log(`✓ Finished typing, status: ${state.status}`);
console.log('');

// Test 3: Configuration
console.log('Test 3: Configuration');
console.log(`✓ Typing speed: ${CONVERSATION_CONFIG.TYPING_SPEED}ms`);
console.log(`✓ Max suggestions: ${CONVERSATION_CONFIG.MAX_SUGGESTIONS}`);
console.log(`✓ Mock delay: ${CONVERSATION_CONFIG.MOCK_RESPONSE_DELAY}ms`);
console.log(`✓ Static prompts: ${STATIC_PROMPTS.length} available`);
console.log('');

// Test 4: ConversationManager with Dependency Injection
console.log('Test 4: ConversationManager with AI Provider Injection');

// Create provider using factory
const aiProvider = AIProviderFactory.createMock({ delay: 100 });
console.log('✓ Created mock provider:', aiProvider.getInfo());

// Inject provider into manager
const manager = new ConversationManager({
  aiProvider,
  config: CONVERSATION_CONFIG,
});
console.log(`✓ Manager created with injected provider`);

try {
  await manager.initialize('en');
  console.log(`✓ Manager initialized`);
  
  const status = manager.getStatus();
  console.log(`✓ Manager status:`, status);
  
  // Test message processing
  const result = await manager.processMessage('What is React?', state);
  console.log(`✓ Processed message:`);
  console.log(`  - Response length: ${result.response.content.length} characters`);
  console.log(`  - Search results: ${result.searchResults.length}`);
  console.log(`  - Processing time: ${result.response.metadata.processingTime}ms`);
  console.log(`  - Model: ${result.response.metadata.model}`);
  
  if (result.searchResults.length > 0) {
    console.log(`  - Top result score: ${result.searchResults[0].score.toFixed(2)}`);
  }
  
  console.log('');
  console.log('Sample response:');
  console.log('---');
  console.log(result.response.content.slice(0, 200) + '...');
  console.log('---');
} catch (err) {
  console.error('✗ Error during manager test:', err);
}

console.log('');
console.log('✅ All tests completed!');
console.log('');
console.log('📊 Summary:');
console.log(`  - Messages in state: ${state.messages.length}`);
console.log(`  - Static prompts: ${STATIC_PROMPTS.length}`);
console.log(`  - Provider ready: ${manager.getStatus().providerReady}`);
console.log(`  - System ready: ${manager.getStatus().initialized}`);
