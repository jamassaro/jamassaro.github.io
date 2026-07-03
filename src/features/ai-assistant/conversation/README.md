# Conversation System

A comprehensive conversation management system for the AI Assistant, built with custom React hooks and designed for future WebLLM integration.

## Overview

This system provides a complete conversation architecture including state management, message handling, typing animations, suggested prompts, and persistence - all without requiring an LLM backend initially.

## Key Features

- 🎯 **Hook-Based Architecture** - Clean, composable React hooks
- 💬 **Message Management** - Full CRUD operations with history
- ⌨️ **Typing Animation** - Smooth character-by-character display
- 💡 **Smart Suggestions** - Context-aware prompt recommendations
- 💾 **Persistence** - Auto-save to localStorage
- 🔌 **WebLLM Ready** - Designed for future LLM integration
- 🔍 **Knowledge Integration** - Connected to search system
- 🎨 **State Management** - Reducer pattern for predictability
- ❌ **Error Handling** - Comprehensive error recovery

## Architecture

### Main Hook: useConversation

The primary interface for components:

```javascript
import { useConversation } from './conversation/hooks';

function ChatComponent() {
  const {
    messages,              // All conversation messages
    sendMessage,           // Send user message
    isTyping,             // Animation in progress
    isLoading,            // Generating response
    error,                // Error state
    suggestedPrompts,     // Available suggestions
    selectPrompt,         // Send a suggested prompt
  } = useConversation({ language: 'en' });
  
  return (/* UI components */);
}
```

### Core Components

1. **Custom Hooks** (6 hooks)
   - `useConversation` - Main orchestrator
   - `useConversationState` - State with reducer
   - `useMessages` - Message CRUD
   - `useTypingAnimation` - Typing effects
   - `useSuggestedPrompts` - Prompt management
   - `useConversationHistory` - Persistence

2. **Business Logic**
   - `ConversationManager` - Core processing
   - `ResponseGenerator` - Mock responses
   - `PromptBuilder` - Prompt construction
   - `ContextBuilder` - Context assembly

3. **Services**
   - Knowledge search integration
   - Response generation (mock → WebLLM)
   - Suggestion generation

## Quick Start

### Installation

No external dependencies required. Uses:
- React (already installed)
- Knowledge Layer (already built)
- Search System (already built)

### Basic Usage

```javascript
import { AIAssistantSection } from './features/ai-assistant';

function App() {
  return (
    <div>
      <AIAssistantSection />
    </div>
  );
}
```

### Custom Integration

```javascript
import { useConversation } from './conversation/hooks';

function CustomChat() {
  const { 
    messages, 
    sendMessage, 
    isTyping,
    suggestedPrompts 
  } = useConversation();
  
  const handleSend = async (text) => {
    await sendMessage(text);
  };
  
  return (
    <div>
      <MessageList messages={messages} />
      {isTyping && <TypingIndicator />}
      <PromptSuggestions prompts={suggestedPrompts} />
      <ChatInput onSend={handleSend} />
    </div>
  );
}
```

## Documentation

- **[CONVERSATION_ARCHITECTURE_PLAN.md](./CONVERSATION_ARCHITECTURE_PLAN.md)** - Complete architecture specification
- **[CONVERSATION_ARCHITECTURE_VISUAL.md](./CONVERSATION_ARCHITECTURE_VISUAL.md)** - Visual diagrams and flows
- **[CONVERSATION_QUICK_REF.md](./CONVERSATION_QUICK_REF.md)** - Quick reference guide

## File Structure

```
conversation/
├── core/                          # Core logic
│   ├── ConversationManager.js     # Main business logic
│   ├── conversationReducer.js     # State reducer
│   ├── conversationActions.js     # Action creators
│   └── conversationUtils.js       # Utilities
│
├── hooks/                         # Custom React hooks
│   ├── useConversation.js         # Main hook
│   ├── useConversationState.js    # State management
│   ├── useMessages.js             # Message CRUD
│   ├── useTypingAnimation.js      # Typing animation
│   ├── useSuggestedPrompts.js     # Suggestions
│   └── useConversationHistory.js  # Persistence
│
├── services/                      # Business services
│   ├── ResponseGenerator.js       # Response creation
│   ├── PromptBuilder.js           # Prompt building
│   └── ContextBuilder.js          # Context assembly
│
├── types/                         # Type definitions
│   └── conversation.types.js      # JSDoc types
│
└── config/                        # Configuration
    ├── conversationConfig.js      # Settings
    └── suggestedPrompts.js        # Static prompts
```

## API Reference

### useConversation(options)

**Parameters:**
- `options.language` - Language code ('en' or 'es')
- `options.persistHistory` - Enable localStorage (default: true)

**Returns:**
```javascript
{
  // State
  state: ConversationState,
  messages: Message[],
  isLoading: boolean,
  isTyping: boolean,
  error: ConversationError | null,
  
  // Actions
  sendMessage: (text: string) => Promise<void>,
  regenerateResponse: (messageId: string) => Promise<void>,
  clearHistory: () => void,
  
  // Suggestions
  suggestedPrompts: SuggestedPrompt[],
  selectPrompt: (promptId: string) => void,
  
  // Utilities
  exportConversation: () => string,
  resetConversation: () => void,
}
```

### Message Flow

1. User sends message via `sendMessage(text)`
2. User message added to state
3. Knowledge search performed (3 most relevant chunks)
4. Context built from search + history
5. Response generated (mock or WebLLM)
6. Typing animation starts
7. Text displayed character-by-character
8. Message marked complete
9. Suggestions updated
10. State saved to localStorage

## Configuration

```javascript
// config/conversationConfig.js
export const CONVERSATION_CONFIG = {
  TYPING_SPEED: 30,              // ms per character
  MAX_HISTORY_MESSAGES: 50,      // Message limit
  MAX_SUGGESTIONS: 4,            // Prompt count
  MAX_SEARCH_RESULTS: 3,         // Knowledge results
  MOCK_RESPONSE_DELAY: 500,      // Artificial delay
  PERSIST_TO_LOCALSTORAGE: true, // Auto-save
};
```

## Message Types

### User Message
```javascript
{
  id: 'msg_123',
  role: 'user',
  content: 'What is your React experience?',
  timestamp: '2024-01-01T12:00:00Z',
  status: 'complete'
}
```

### Assistant Message
```javascript
{
  id: 'msg_124',
  role: 'assistant',
  content: 'I have extensive React experience...',
  timestamp: '2024-01-01T12:00:01Z',
  status: 'complete',
  metadata: {
    searchResults: ['chunk_1', 'chunk_2'],
    processingTime: 450,
    model: 'mock-v1'
  }
}
```

## Suggested Prompts

### Static Prompts
Pre-defined prompts shown by default:
- "What is your React experience?"
- "Tell me about your recent projects"
- "What is Brave Up!?"
- "How can I contact you?"

### Dynamic Prompts
Generated based on conversation context:
- Follow-up questions
- Related topics
- Unexplored areas

## Error Handling

All errors are captured and exposed via the `error` state:

```javascript
const { error, clearError } = useConversation();

if (error) {
  return (
    <ErrorBanner 
      message={error.message}
      onRetry={() => {
        clearError();
        // Retry action
      }}
    />
  );
}
```

## Persistence

Conversations are automatically saved to localStorage:

```javascript
// Saved on:
- New message sent
- Response received
- Conversation ended

// Loaded on:
- Component mount
- User navigates back
```

Storage key: `ai-assistant-conversations`

## Future: WebLLM Integration

The system is designed to seamlessly integrate WebLLM:

```javascript
// ConversationManager.js
async initializeWebLLM() {
  const { CreateMLCEngine } = await import("@mlc-ai/web-llm");
  
  this.llmProvider = await CreateMLCEngine({
    model: "Llama-3.2-3B-Instruct",
    chatOptions: {
      temperature: 0.7,
      max_tokens: 500,
    }
  });
}

async generateResponse(message, context) {
  if (!this.llmProvider) {
    return this.mockResponse(message, context); // Fallback
  }
  
  const completion = await this.llmProvider.chat.completions.create({
    messages: [...context.history, { role: "user", content: message }],
    stream: true,
  });
  
  return completion;
}
```

## Testing

```bash
# Run hook tests
npm test conversation/hooks

# Run integration tests
npm test conversation/integration

# Run all tests
npm test conversation
```

## Performance

- **Message Add**: < 100ms
- **Knowledge Search**: < 50ms (14 chunks)
- **Response Generation**: < 500ms (mock mode)
- **Typing Animation**: 30ms/char
- **Suggestion Update**: < 50ms
- **Storage Save**: < 20ms

## Implementation Status

- [x] Architecture planned
- [ ] Types defined
- [ ] Reducer implemented
- [ ] Hooks created
- [ ] Services built
- [ ] Components updated
- [ ] Tests written
- [ ] Documentation complete
- [ ] WebLLM integration (future)

## Contributing

### Adding a New Hook

1. Create hook file in `hooks/`
2. Define JSDoc types
3. Implement hook logic
4. Add tests
5. Export from `hooks/index.js`
6. Update documentation

### Adding a Suggested Prompt

```javascript
// config/suggestedPrompts.js
export const STATIC_PROMPTS = [
  {
    id: 'my-prompt',
    text: 'Your prompt text here',
    category: 'expertise' | 'projects' | 'ventures' | 'general',
    icon: '🚀',
  },
];
```

## Troubleshooting

### Messages not persisting
- Check localStorage is enabled
- Check storage quota (max 5-10MB)
- Clear old conversations: `clearAllHistory()`

### Typing animation laggy
- Reduce `TYPING_SPEED` in config
- Check for excessive re-renders
- Use `React.memo` on message components

### Suggestions not updating
- Check conversation context is passed
- Verify `UPDATE_SUGGESTIONS_ON_MESSAGE` config
- Check knowledge search is working

## License

Part of the portfolio project.

## Related

- [Knowledge Layer](../knowledge/README.md)
- [Search System](../knowledge/search/README.md)
- [AI Assistant Components](../components/README.md)

---

**Status**: 📋 Planning Complete
**Next**: Implementation Phase 1 - Core Hooks
**ETA**: 2-3 sessions
