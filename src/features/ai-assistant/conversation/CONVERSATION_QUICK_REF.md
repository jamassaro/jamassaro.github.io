# Conversation Architecture - Quick Reference

## 📋 Core Components at a Glance

### Custom Hooks (6 total)
1. **useConversation** - Main orchestrator, exposes unified API
2. **useConversationState** - State management with reducer
3. **useMessages** - Message CRUD operations
4. **useTypingAnimation** - Character-by-character animation
5. **useSuggestedPrompts** - Prompt management (static + dynamic)
6. **useConversationHistory** - localStorage persistence

### Business Logic (1 class + 3 services)
1. **ConversationManager** - Core logic, WebLLM integration point
2. **ResponseGenerator** - Mock response creation
3. **PromptBuilder** - Build LLM prompts (future)
4. **ContextBuilder** - Build context from knowledge + history

---

## 🎯 Key Interfaces

### ConversationState
```javascript
{
  messages: Message[],
  status: 'idle' | 'loading' | 'typing' | 'error',
  currentTypingMessage: string | null,
  conversationId: string,
  language: string,
  suggestedPrompts: SuggestedPrompt[],
  error: ConversationError | null,
  metadata: { startedAt, messageCount, lastInteraction }
}
```

### Message
```javascript
{
  id: string,
  role: 'user' | 'assistant' | 'system',
  content: string,
  timestamp: string,
  status: 'pending' | 'streaming' | 'complete' | 'error',
  metadata: { tokens, searchResults, processingTime, model }
}
```

### useConversation API
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
  resetConversation: () => void
}
```

---

## 🔄 Action Types

```javascript
'ADD_USER_MESSAGE'      // User sends message
'ADD_ASSISTANT_MESSAGE' // Add assistant response
'START_TYPING'          // Begin typing animation
'UPDATE_TYPING'         // Update typing text (streaming)
'FINISH_TYPING'         // Complete typing animation
'SET_ERROR'             // Set error state
'CLEAR_ERROR'           // Clear error
'UPDATE_SUGGESTIONS'    // Update suggested prompts
'RESET_CONVERSATION'    // Clear all messages
'SET_LANGUAGE'          // Change language
```

---

## 📁 File Structure

```
conversation/
├── README.md
├── CONVERSATION_ARCHITECTURE_PLAN.md      # Full spec (this doc)
├── CONVERSATION_ARCHITECTURE_VISUAL.md    # Visual diagrams
├── CONVERSATION_QUICK_REF.md              # Quick reference
│
├── core/
│   ├── ConversationManager.js             # Main business logic
│   ├── conversationReducer.js             # State reducer
│   ├── conversationActions.js             # Action creators
│   └── conversationUtils.js               # Utilities
│
├── hooks/
│   ├── index.js                           # Hook exports
│   ├── useConversation.js                 # Main hook ★
│   ├── useConversationState.js            # State management
│   ├── useMessages.js                     # Message CRUD
│   ├── useTypingAnimation.js              # Typing effect
│   ├── useSuggestedPrompts.js             # Suggestions
│   └── useConversationHistory.js          # Persistence
│
├── services/
│   ├── ResponseGenerator.js               # Mock responses
│   ├── PromptBuilder.js                   # LLM prompts
│   ├── ContextBuilder.js                  # Context assembly
│   └── index.js
│
├── types/
│   ├── conversation.types.js              # Type definitions
│   └── index.js
│
├── config/
│   ├── conversationConfig.js              # Configuration
│   └── suggestedPrompts.js                # Static prompts
│
└── index.js                               # Public API
```

---

## 🚀 Implementation Checklist

### Phase 1: Core Hooks ⏳
- [ ] `hooks/useConversationState.js` - Reducer-based state
- [ ] `hooks/useMessages.js` - Message CRUD
- [ ] `hooks/useConversation.js` - Main orchestrator
- [ ] `core/conversationReducer.js` - Reducer logic
- [ ] `core/conversationActions.js` - Action creators
- [ ] `types/conversation.types.js` - Type definitions

### Phase 2: Animation & UX ⏳
- [ ] `hooks/useTypingAnimation.js` - Typing effect
- [ ] `hooks/useSuggestedPrompts.js` - Prompt suggestions
- [ ] `hooks/useConversationHistory.js` - Persistence
- [ ] `config/suggestedPrompts.js` - Static prompt library

### Phase 3: Business Logic ⏳
- [ ] `core/ConversationManager.js` - Main class
- [ ] `services/ResponseGenerator.js` - Mock responses
- [ ] `services/PromptBuilder.js` - Prompt building
- [ ] `services/ContextBuilder.js` - Context assembly
- [ ] `core/conversationUtils.js` - Utilities

### Phase 4: Integration ⏳
- [ ] Connect to Knowledge Search System
- [ ] Update `AIAssistantSection.jsx`
- [ ] Update `AIChatWindow.jsx`
- [ ] Update `AIChatInput.jsx`
- [ ] Update `QuickPromptList.jsx`
- [ ] Error handling components

### Phase 5: Testing & Polish ⏳
- [ ] Unit tests for hooks
- [ ] Integration tests
- [ ] Error recovery testing
- [ ] Performance optimization
- [ ] Documentation

### Phase 6: WebLLM (Future) 📅
- [ ] WebLLM initialization
- [ ] Streaming support
- [ ] Prompt engineering
- [ ] Model loading UI
- [ ] Fallback handling

---

## 🔧 Configuration Values

```javascript
TYPING_SPEED: 30,              // ms per character
TYPING_SPEED_FAST: 10,         // Fast mode
MAX_HISTORY_MESSAGES: 50,      // Message limit
PERSIST_TO_LOCALSTORAGE: true, // Auto-save
MAX_SUGGESTIONS: 4,            // Prompt count
MAX_SEARCH_RESULTS: 3,         // Knowledge results
MIN_SEARCH_SCORE: 0.3,         // Search threshold
MOCK_RESPONSE_DELAY: 500,      // Artificial delay (ms)
```

---

## 💡 Usage Examples

### Basic Integration
```javascript
import { useConversation } from './conversation/hooks';

function MyComponent() {
  const { 
    messages, 
    sendMessage, 
    isTyping 
  } = useConversation({ language: 'en' });
  
  return (
    <div>
      {messages.map(msg => <Message key={msg.id} {...msg} />)}
      {isTyping && <TypingIndicator />}
      <Input onSend={sendMessage} />
    </div>
  );
}
```

### With Suggestions
```javascript
const { 
  messages, 
  sendMessage, 
  suggestedPrompts,
  selectPrompt 
} = useConversation();

return (
  <>
    <ChatWindow messages={messages} />
    <PromptList 
      prompts={suggestedPrompts}
      onSelect={(id) => selectPrompt(id)}
    />
    <ChatInput onSend={sendMessage} />
  </>
);
```

### Error Handling
```javascript
const { 
  error, 
  clearError,
  sendMessage 
} = useConversation();

const handleSend = async (text) => {
  try {
    await sendMessage(text);
  } catch (err) {
    console.error('Failed to send:', err);
  }
};

return (
  <>
    {error && (
      <ErrorBanner 
        error={error} 
        onDismiss={clearError}
      />
    )}
    <ChatInput onSend={handleSend} />
  </>
);
```

---

## 🎬 Message Flow

```
1. User types message
   ↓
2. sendMessage() called
   ↓
3. ADD_USER_MESSAGE dispatched
   ↓
4. ConversationManager.processMessage()
   ├─ Search knowledge
   ├─ Build context
   └─ Generate response
   ↓
5. START_TYPING dispatched
   ↓
6. useTypingAnimation renders character-by-character
   ↓
7. FINISH_TYPING dispatched
   ↓
8. Update suggestions
   ↓
9. Save to localStorage
```

---

## 🔌 WebLLM Integration Points

```javascript
// Future: ConversationManager.js
class ConversationManager {
  async initializeWebLLM() {
    const { CreateMLCEngine } = await import("@mlc-ai/web-llm");
    this.llmProvider = await CreateMLCEngine({
      model: "Llama-3.2-3B-Instruct"
    });
  }
  
  async generateResponse(message, context) {
    if (!this.llmProvider) {
      return this.mockResponse(message, context);
    }
    
    const completion = await this.llmProvider.chat.completions.create({
      messages: [
        { role: "system", content: context.systemPrompt },
        ...context.history,
        { role: "user", content: message }
      ],
      stream: true,
    });
    
    return completion;
  }
}
```

---

## 🧪 Testing Strategy

### Hook Tests
```javascript
// Test useConversation
test('sends message and updates state', async () => {
  const { result } = renderHook(() => useConversation());
  
  await act(async () => {
    await result.current.sendMessage('Hello');
  });
  
  expect(result.current.messages).toHaveLength(2); // User + Assistant
  expect(result.current.messages[0].role).toBe('user');
  expect(result.current.messages[1].role).toBe('assistant');
});
```

### Integration Tests
```javascript
test('full conversation flow', async () => {
  render(<AIAssistantSection />);
  
  const input = screen.getByRole('textbox');
  const sendBtn = screen.getByRole('button', { name: /send/i });
  
  fireEvent.change(input, { target: { value: 'Test message' } });
  fireEvent.click(sendBtn);
  
  // Wait for response
  await waitFor(() => {
    expect(screen.getByText(/Test message/i)).toBeInTheDocument();
  });
  
  // Check typing animation
  expect(screen.getByTestId('typing-indicator')).toBeInTheDocument();
});
```

---

## 🚨 Error Scenarios

1. **Network Error** → Retry with exponential backoff
2. **Search Error** → Use fallback response without knowledge
3. **LLM Error** → Use mock response generator
4. **Storage Error** → Continue without persistence
5. **Unknown Error** → Display generic error, allow retry

---

## 📊 Performance Targets

- **Message Send**: < 100ms (add to state)
- **Knowledge Search**: < 50ms (14 chunks)
- **Response Generation**: < 500ms (mock mode)
- **Typing Animation**: 30ms/char = ~300ms for 10 words
- **Suggestion Update**: < 50ms
- **localStorage Save**: < 20ms

---

## ✅ Definition of Done

- [ ] All hooks implemented and tested
- [ ] ConversationManager integrated with Knowledge Search
- [ ] Mock responses work with search results
- [ ] Typing animation smooth (30ms)
- [ ] Suggestions update dynamically
- [ ] localStorage persistence works
- [ ] Error handling complete
- [ ] Components updated and working
- [ ] Zero TypeScript/JSDoc errors
- [ ] Documentation complete
- [ ] Ready for WebLLM integration

---

## 📚 Key Dependencies

- ✅ Knowledge Layer (src/features/ai-assistant/knowledge/)
- ✅ Search System (src/features/ai-assistant/knowledge/search/)
- ⏳ React hooks (built-in)
- 📅 WebLLM (future - @mlc-ai/web-llm)

---

## 🎯 Next Immediate Steps

1. **Review this plan** - Approve architecture
2. **Create types file** - Define all TypeScript-style JSDoc types
3. **Build reducer** - Implement conversationReducer.js
4. **Create useConversationState** - Hook wrapping reducer
5. **Create useMessages** - Message CRUD hook
6. **Create useConversation** - Main orchestrator
7. **Test hooks** - Unit tests for each hook

---

**Status**: 📋 Planning Complete - Ready for Implementation
**Complexity**: Medium-High
**Estimated Time**: 2-3 coding sessions
**Risk Level**: Low (well-defined, no external dependencies yet)
