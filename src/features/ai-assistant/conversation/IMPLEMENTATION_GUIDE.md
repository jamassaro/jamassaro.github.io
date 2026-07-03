# Conversation System - Implementation Guide

Step-by-step implementation order for the conversation system.

---

## Phase 1: Foundation (Core Types & State)

### Step 1.1: Create Type Definitions
**File:** `types/conversation.types.js`
**Complexity:** Low
**Time:** 30 minutes

```javascript
/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {'user'|'assistant'|'system'} role
 * @property {string} content
 * @property {string} timestamp
 * @property {'pending'|'streaming'|'complete'|'error'} status
 * @property {MessageMetadata} [metadata]
 */

/**
 * @typedef {Object} ConversationState
 * ... (all state types)
 */

// etc.
```

**Test:** Import types, verify JSDoc works in IDE

---

### Step 1.2: Create Conversation Reducer
**File:** `core/conversationReducer.js`
**Complexity:** Medium
**Time:** 1 hour

```javascript
export function conversationReducer(state, action) {
  switch (action.type) {
    case 'ADD_USER_MESSAGE':
      return { ...state, messages: [...state.messages, createUserMessage(action.payload)] };
    
    case 'START_TYPING':
      return { ...state, status: 'typing', currentTypingMessage: action.payload };
    
    // ... more actions
  }
}

export const initialConversationState = {
  messages: [],
  status: 'idle',
  // ... rest
};
```

**Test:** Unit test each action type

---

### Step 1.3: Create Action Creators
**File:** `core/conversationActions.js`
**Complexity:** Low
**Time:** 30 minutes

```javascript
export const conversationActions = {
  addUserMessage: (content) => ({
    type: 'ADD_USER_MESSAGE',
    payload: content,
  }),
  
  startTyping: (message) => ({
    type: 'START_TYPING',
    payload: message,
  }),
  
  // ... more actions
};
```

**Test:** Verify action shape matches reducer expectations

---

### Step 1.4: Create Conversation Utils
**File:** `core/conversationUtils.js`
**Complexity:** Low
**Time:** 30 minutes

```javascript
export function generateMessageId() {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateConversationId() {
  return `conv_${Date.now()}`;
}

export function formatTimestamp(date = new Date()) {
  return date.toISOString();
}
```

**Test:** Unit tests for each utility

---

## Phase 2: State Management Hooks

### Step 2.1: Create useConversationState
**File:** `hooks/useConversationState.js`
**Complexity:** Medium
**Time:** 45 minutes

```javascript
import { useReducer } from 'react';
import { conversationReducer, initialConversationState } from '../core/conversationReducer';

export function useConversationState(initialState = {}) {
  const [state, dispatch] = useReducer(
    conversationReducer,
    { ...initialConversationState, ...initialState }
  );
  
  return { state, dispatch };
}
```

**Test:** Test state updates via dispatch

---

### Step 2.2: Create useMessages
**File:** `hooks/useMessages.js`
**Complexity:** Medium
**Time:** 1 hour

```javascript
export function useMessages(state, dispatch) {
  const addMessage = useCallback((message) => {
    dispatch(conversationActions.addMessage(message));
  }, [dispatch]);
  
  const updateMessage = useCallback((id, updates) => {
    dispatch(conversationActions.updateMessage({ id, updates }));
  }, [dispatch]);
  
  const deleteMessage = useCallback((id) => {
    dispatch(conversationActions.deleteMessage(id));
  }, [dispatch]);
  
  return {
    messages: state.messages,
    addMessage,
    updateMessage,
    deleteMessage,
  };
}
```

**Test:** Test CRUD operations

---

### Step 2.3: Create useTypingAnimation
**File:** `hooks/useTypingAnimation.js`
**Complexity:** Medium
**Time:** 1 hour

```javascript
export function useTypingAnimation(options = {}) {
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const speed = options.speed || CONVERSATION_CONFIG.TYPING_SPEED;
  
  const startTyping = useCallback((fullText) => {
    setIsTyping(true);
    let index = 0;
    
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, index + 1));
      index++;
      
      if (index >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, speed);
    
    return () => clearInterval(interval);
  }, [speed]);
  
  return { isTyping, displayedText, startTyping };
}
```

**Test:** Test animation timing, completion

---

## Phase 3: Business Logic

### Step 3.1: Create ResponseGenerator
**File:** `services/ResponseGenerator.js`
**Complexity:** Medium
**Time:** 1.5 hours

```javascript
export class ResponseGenerator {
  generateMockResponse(message, searchResults, language) {
    if (searchResults.length === 0) {
      return this.generateNoResultsResponse(message, language);
    }
    
    // Build response from search results
    const chunks = searchResults.map(r => r.chunk);
    const response = this.formatResponse(chunks, message);
    
    return {
      content: response,
      metadata: {
        searchResults: searchResults.map(r => r.chunk.id),
        processingTime: Math.random() * 500 + 200,
        model: 'mock-v1',
      }
    };
  }
  
  formatResponse(chunks, message) {
    // Smart formatting based on content
    // Use markdown, lists, code blocks
  }
}
```

**Test:** Test with various search result scenarios

---

### Step 3.2: Create ContextBuilder
**File:** `services/ContextBuilder.js`
**Complexity:** Low
**Time:** 30 minutes

```javascript
export class ContextBuilder {
  buildContext(conversationState, searchResults) {
    return {
      history: conversationState.messages.slice(-5),
      knowledge: searchResults,
      language: conversationState.language,
      systemPrompt: this.buildSystemPrompt(conversationState.language),
    };
  }
  
  buildSystemPrompt(language) {
    // Build system prompt based on language
  }
}
```

**Test:** Test context structure

---

### Step 3.3: Create ConversationManager
**File:** `core/ConversationManager.js`
**Complexity:** High
**Time:** 2 hours

```javascript
export class ConversationManager {
  constructor(config = {}) {
    this.config = { ...CONVERSATION_CONFIG, ...config };
    this.knowledgeSearch = null;
    this.responseGenerator = new ResponseGenerator();
    this.contextBuilder = new ContextBuilder();
  }
  
  async initialize(language) {
    // Initialize knowledge search
    this.knowledgeSearch = await createSearchService(language);
  }
  
  async processMessage(message, conversationState) {
    // 1. Search knowledge
    const searchResults = await this.searchKnowledge(message);
    
    // 2. Build context
    const context = this.contextBuilder.buildContext(conversationState, searchResults);
    
    // 3. Generate response
    const response = await this.generateResponse(message, context);
    
    // 4. Generate suggestions
    const suggestions = this.generateSuggestions(conversationState, searchResults);
    
    return { response, searchResults, suggestions };
  }
  
  async generateResponse(message, context) {
    // Mock for now, WebLLM later
    await this.delay(this.config.MOCK_RESPONSE_DELAY);
    return this.responseGenerator.generateMockResponse(
      message,
      context.knowledge,
      context.language
    );
  }
}
```

**Test:** Test full message processing flow

---

## Phase 4: Suggestion System

### Step 4.1: Create Static Prompts Config
**File:** `config/suggestedPrompts.js`
**Complexity:** Low
**Time:** 20 minutes

```javascript
export const STATIC_PROMPTS = [
  {
    id: 'expertise-react',
    text: 'What is your React experience?',
    category: 'expertise',
    icon: '⚛️',
  },
  // ... more prompts
];
```

**Test:** Import and verify structure

---

### Step 4.2: Create useSuggestedPrompts
**File:** `hooks/useSuggestedPrompts.js`
**Complexity:** Medium
**Time:** 1 hour

```javascript
export function useSuggestedPrompts(conversationState) {
  const [prompts, setPrompts] = useState(STATIC_PROMPTS);
  
  useEffect(() => {
    // Update prompts based on conversation context
    const contextualPrompts = generateContextualPrompts(conversationState);
    const combined = [...STATIC_PROMPTS, ...contextualPrompts];
    const ranked = rankPrompts(combined, conversationState);
    const top = ranked.slice(0, CONVERSATION_CONFIG.MAX_SUGGESTIONS);
    
    setPrompts(top);
  }, [conversationState.messages.length]);
  
  const selectPrompt = useCallback((promptId) => {
    const prompt = prompts.find(p => p.id === promptId);
    return prompt?.text || '';
  }, [prompts]);
  
  return { prompts, selectPrompt };
}
```

**Test:** Test prompt updates, selection

---

## Phase 5: Persistence

### Step 5.1: Create useConversationHistory
**File:** `hooks/useConversationHistory.js`
**Complexity:** Medium
**Time:** 1 hour

```javascript
const STORAGE_KEY = 'ai-assistant-conversations';

export function useConversationHistory() {
  const saveConversation = useCallback((state) => {
    const conversations = loadFromStorage();
    conversations[state.conversationId] = {
      messages: state.messages,
      metadata: state.metadata,
      timestamp: new Date().toISOString(),
    };
    saveToStorage(conversations);
  }, []);
  
  const loadConversation = useCallback((id) => {
    const conversations = loadFromStorage();
    return conversations[id] || null;
  }, []);
  
  return {
    saveConversation,
    loadConversation,
    listConversations,
    deleteConversation,
  };
}

function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (err) {
    console.error('Failed to load conversations:', err);
    return {};
  }
}
```

**Test:** Test save/load/delete operations

---

## Phase 6: Main Hook (Orchestrator)

### Step 6.1: Create useConversation
**File:** `hooks/useConversation.js`
**Complexity:** High
**Time:** 2 hours

```javascript
export function useConversation(options = {}) {
  const { language = 'en', persistHistory = true } = options;
  
  // Initialize state
  const { state, dispatch } = useConversationState({
    language,
    conversationId: generateConversationId(),
  });
  
  // Initialize manager
  const [manager] = useState(() => new ConversationManager());
  useEffect(() => {
    manager.initialize(language);
  }, [manager, language]);
  
  // Sub-hooks
  const messages = useMessages(state, dispatch);
  const typing = useTypingAnimation();
  const suggestions = useSuggestedPrompts(state);
  const history = useConversationHistory();
  
  // Main action: send message
  const sendMessage = useCallback(async (text) => {
    try {
      // Add user message
      dispatch(conversationActions.addUserMessage(text));
      
      // Process message
      const result = await manager.processMessage(text, state);
      
      // Start typing animation
      typing.startTyping(result.response.content);
      dispatch(conversationActions.startTyping(result.response.content));
      
      // Wait for typing to complete
      await new Promise(resolve => {
        const checkTyping = setInterval(() => {
          if (!typing.isTyping) {
            clearInterval(checkTyping);
            resolve();
          }
        }, 100);
      });
      
      // Complete message
      dispatch(conversationActions.finishTyping());
      dispatch(conversationActions.updateSuggestions(result.suggestions));
      
      // Save to history
      if (persistHistory) {
        history.saveConversation(state);
      }
    } catch (error) {
      dispatch(conversationActions.setError(error));
    }
  }, [state, dispatch, manager, typing, history, persistHistory]);
  
  // Return unified API
  return {
    state,
    messages: state.messages,
    isLoading: state.status === 'loading',
    isTyping: state.status === 'typing',
    error: state.error,
    sendMessage,
    suggestedPrompts: suggestions.prompts,
    selectPrompt: suggestions.selectPrompt,
    // ... more methods
  };
}
```

**Test:** Integration test for full flow

---

## Phase 7: Component Integration

### Step 7.1: Update AIAssistantSection
**File:** `components/AIAssistantSection/AIAssistantSection.jsx`
**Complexity:** Medium
**Time:** 1 hour

```javascript
import { useConversation } from '../../conversation/hooks';

export function AIAssistantSection() {
  const {
    messages,
    isTyping,
    isLoading,
    error,
    sendMessage,
    suggestedPrompts,
    selectPrompt,
  } = useConversation({ language: i18n.language });
  
  const handlePromptSelect = (promptId) => {
    const text = selectPrompt(promptId);
    sendMessage(text);
  };
  
  return (
    <section className={styles.container}>
      <AIChatWindow 
        messages={messages}
        isTyping={isTyping}
      />
      
      <QuickPromptList
        prompts={suggestedPrompts}
        onSelectPrompt={handlePromptSelect}
      />
      
      <AIChatInput
        onSend={sendMessage}
        disabled={isLoading || isTyping}
      />
      
      {error && (
        <ErrorMessage 
          error={error}
          onDismiss={() => clearError()}
        />
      )}
    </section>
  );
}
```

**Test:** Component renders, interactions work

---

### Step 7.2: Update AIChatWindow
**File:** `components/AIChatWindow/AIChatWindow.jsx`
**Complexity:** Low
**Time:** 30 minutes

```javascript
export function AIChatWindow({ messages, isTyping }) {
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isTyping]);
  
  return (
    <div className={styles.chatWindow}>
      {messages.map((message) => (
        <AIMessage key={message.id} message={message} />
      ))}
      
      {isTyping && (
        <div className={styles.typingIndicator}>
          <span>●</span>
          <span>●</span>
          <span>●</span>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
```

**Test:** Messages render, scroll works

---

## Phase 8: Testing & Polish

### Step 8.1: Hook Unit Tests
**Time:** 2 hours

Test each hook in isolation:
- useConversationState
- useMessages
- useTypingAnimation
- useSuggestedPrompts
- useConversationHistory
- useConversation

---

### Step 8.2: Integration Tests
**Time:** 2 hours

Test full conversation flows:
- User sends message → response appears
- Suggested prompts update
- History persistence
- Error recovery

---

### Step 8.3: Performance Optimization
**Time:** 1 hour

- Memoize expensive computations
- Optimize re-renders
- Test with many messages
- Profile typing animation

---

### Step 8.4: Documentation
**Time:** 1 hour

- JSDoc for all functions
- Usage examples
- Update README
- Add inline comments

---

## Total Time Estimate

| Phase | Time |
|-------|------|
| Phase 1: Foundation | 2.5 hours |
| Phase 2: State Hooks | 2.75 hours |
| Phase 3: Business Logic | 4 hours |
| Phase 4: Suggestions | 1.25 hours |
| Phase 5: Persistence | 1 hour |
| Phase 6: Main Hook | 2 hours |
| Phase 7: Integration | 1.5 hours |
| Phase 8: Testing | 6 hours |
| **TOTAL** | **~21 hours (3 sessions)** |

---

## Implementation Checklist

- [ ] Phase 1: Foundation (2.5h)
  - [ ] 1.1 Type definitions
  - [ ] 1.2 Conversation reducer
  - [ ] 1.3 Action creators
  - [ ] 1.4 Conversation utils

- [ ] Phase 2: State Hooks (2.75h)
  - [ ] 2.1 useConversationState
  - [ ] 2.2 useMessages
  - [ ] 2.3 useTypingAnimation

- [ ] Phase 3: Business Logic (4h)
  - [ ] 3.1 ResponseGenerator
  - [ ] 3.2 ContextBuilder
  - [ ] 3.3 ConversationManager

- [ ] Phase 4: Suggestions (1.25h)
  - [ ] 4.1 Static prompts config
  - [ ] 4.2 useSuggestedPrompts

- [ ] Phase 5: Persistence (1h)
  - [ ] 5.1 useConversationHistory

- [ ] Phase 6: Main Hook (2h)
  - [ ] 6.1 useConversation

- [ ] Phase 7: Integration (1.5h)
  - [ ] 7.1 Update AIAssistantSection
  - [ ] 7.2 Update AIChatWindow

- [ ] Phase 8: Testing (6h)
  - [ ] 8.1 Hook unit tests
  - [ ] 8.2 Integration tests
  - [ ] 8.3 Performance optimization
  - [ ] 8.4 Documentation

---

## Dependencies Between Steps

```
1.1 (Types) ──┬──► 1.2 (Reducer) ──► 2.1 (useConversationState)
              │                            │
              └──► 1.3 (Actions) ──────────┤
                      │                    │
                      └──► 2.2 (useMessages)
                                          │
1.4 (Utils) ──────────────────────────────┤
                                          │
3.1 (ResponseGen) ──┬──► 3.3 (Manager) ◄─┤
3.2 (ContextBuild) ─┘        │            │
                             │            │
4.1 (Static) ──► 4.2 (useSuggestions) ◄───┤
                             │            │
2.3 (useTyping) ─────────────┤            │
                             │            │
5.1 (useHistory) ────────────┤            │
                             │            │
                             └──► 6.1 (useConversation)
                                      │
                                      └──► 7.1 & 7.2 (Integration)
```

---

## Next Steps

1. **Review this plan** with the team
2. **Start with Phase 1** - Foundation
3. **Test incrementally** after each phase
4. **Commit frequently** with clear messages
5. **Document as you go** - don't leave it to the end

---

**Ready to implement?** Let's start with Phase 1! 🚀
