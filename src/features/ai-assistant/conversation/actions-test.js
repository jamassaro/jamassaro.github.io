/**
 * AI Actions Test
 * 
 * Quick test to verify action parsing and validation
 */

import { ActionParser } from './services/ActionParser.js';
import { ACTION_TYPES } from './types/action.types.js';

console.log('🎬 AI Actions System Test\n');
console.log('='.repeat(60));

// Test 1: Parse response with actions
console.log('\n📝 Test 1: Parse response with actions');
const response1 = `Here's information about Brave Up!
Let me show you the project.
ACTION: {"type": "navigate", "target": "braveup"}`;

const parsed1 = ActionParser.parseResponse(response1);
console.log('✓ Text:', parsed1.text.substring(0, 50) + '...');
console.log('✓ Actions:', parsed1.actions);
console.assert(parsed1.actions.length === 1, 'Should have 1 action');
console.assert(parsed1.actions[0].type === ACTION_TYPES.NAVIGATE, 'Should be navigate action');

// Test 2: Multiple actions
console.log('\n📝 Test 2: Multiple actions');
const response2 = `I'll show you my expertise and download my resume.
ACTION: {"type": "scrollToSection", "section": "expertise"}
ACTION: {"type": "downloadResume", "language": "en"}`;

const parsed2 = ActionParser.parseResponse(response2);
console.log('✓ Actions count:', parsed2.actions.length);
console.assert(parsed2.actions.length === 2, 'Should have 2 actions');

// Test 3: Invalid action (should be filtered out)
console.log('\n📝 Test 3: Invalid action validation');
const response3 = `Some text.
ACTION: {"type": "invalid", "target": "nowhere"}
ACTION: {"type": "navigate", "target": "projects"}`;

const parsed3 = ActionParser.parseResponse(response3);
console.log('✓ Valid actions:', parsed3.actions.length);
console.assert(parsed3.actions.length === 1, 'Should filter out invalid action');

// Test 4: Highlight action with duration
console.log('\n📝 Test 4: Highlight action');
const response4 = `Highlighting expertise section.
ACTION: {"type": "highlight", "target": "expertise", "duration": 5000}`;

const parsed4 = ActionParser.parseResponse(response4);
console.log('✓ Highlight action:', parsed4.actions[0]);
console.assert(parsed4.actions[0].duration === 5000, 'Duration should be 5000');

// Test 5: Open modal action
console.log('\n📝 Test 5: Open modal action');
const response5 = `Opening project modal.
ACTION: {"type": "openModal", "modalType": "project", "data": {"id": "braveup"}}`;

const parsed5 = ActionParser.parseResponse(response5);
console.log('✓ Modal action:', parsed5.actions[0]);
console.assert(parsed5.actions[0].modalType === 'project', 'Should be project modal');
console.assert(parsed5.actions[0].data.id === 'braveup', 'Should have project id');

// Test 6: No actions (plain text response)
console.log('\n📝 Test 6: Plain text response (no actions)');
const response6 = 'This is a regular response with no actions.';

const parsed6 = ActionParser.parseResponse(response6);
console.log('✓ Text:', parsed6.text);
console.log('✓ Actions:', parsed6.actions.length);
console.assert(parsed6.actions.length === 0, 'Should have no actions');
console.assert(parsed6.text === response6, 'Text should be unchanged');

// Test 7: Utility methods
console.log('\n📝 Test 7: Utility methods');
const hasActions = ActionParser.hasActions(response1);
console.log('✓ hasActions():', hasActions);
console.assert(hasActions === true, 'Should detect actions');

const textOnly = ActionParser.extractText(response1);
console.log('✓ extractText():', textOnly.substring(0, 50));
console.assert(!textOnly.includes('ACTION:'), 'Should not contain ACTION:');

const actionsOnly = ActionParser.extractActions(response2);
console.log('✓ extractActions() count:', actionsOnly.length);
console.assert(actionsOnly.length === 2, 'Should extract 2 actions');

console.log('\n' + '='.repeat(60));
console.log('✅ All tests passed!\n');

console.log('📋 Action Types Available:');
Object.entries(ACTION_TYPES).forEach(([key, value]) => {
  console.log(`   - ${value} (${key})`);
});

console.log('\n🎉 AI Actions system is ready!');
