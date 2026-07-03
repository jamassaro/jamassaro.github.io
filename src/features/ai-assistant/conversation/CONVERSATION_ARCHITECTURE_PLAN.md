# Conversation Architecture Plan

## Overview
Design a conversation system using custom React hooks, ready for WebLLM integration.

---

## Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    React Components                      │
│              (AIAssistantSection, etc.)                  │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              useConversation (Main Hook)                 │
│  • Orchestrates all conversation functionality           │
│  • Exposes unified API to components                     │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼──────┐ ┌──▼─────┐ ┌───▼──────────┐
│ useMessages  │ │useTyping│ │useSuggestions│
│ • history    │ │• state  │ │• prompts     │
│ • add/update │ │• animate│ │• dynamic     │
└──────────────┘ └─────────┘ └──────────────┘
        │
┌───────▼──────────────────────────────────────────────┐
│           ConversationManager (Class)                 │
│  • State management (Redux-like)                      │
│  • Message processing                                 │
│  • Action dispatching                                 │
│  • Future: WebLLM integration point                   │
└───────────────────────────────────────────────────────┘
```

---

## Core Data Structures

### 1. ConversationState
```typescript
interface ConversationState {
  // Messages
  messages: Message[];
  
  // Current state
  status: 'idle' | 'loading' | 'typing' | 'error';
  currentTypingMessage: string | null;
  
  // Context
  conversationId: string;
  language: string;
  
  // Suggestions
  suggestedPrompts: SuggestedPrompt[];
  
  // Error handling
  error: ConversationError | null;
  
  // Metadata
  metadata: {
    startedAt: string;
    messageCount: number;
    lastInteraction: string;
  };
}
```

### 2. Message
```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  
  // Status
  status: 'pending' | 'streaming' | 'complete' | 'error';
  
  // Metadata
  metadata?: {
    tokens?: number;
    searchResults?: SearchResult[];
    processingTime?: number;
    model?: string;
  };
  
  // Rendering
  chunks?: string[]; // For streaming/typing effect
}
```

### 3. SuggestedPrompt
```typescript
interface SuggestedPrompt {
  id: string;
  text: string;
  category: 'expertise' | 'projects' | 'ventures' | 'general';
  icon?: string;
  
  // Context-aware
  relevance?: number;
  contextual?: boolean; // Generated based on conversation
}
```

### 4. ConversationAction
```typescript
type ConversationAction =
  | { type: 'ADD_USER_MESSAGE'; payload: string }
  | { type: 'ADD_ASSISTANT_MESSAGE'; payload: string }
  | { type: 'START_TYPING'; payload: string }
  | { type: 'UPDATE_TYPING'; payload: string }
  | { type: 'FINISH_TYPING' }
  | { type: 'SET_ERROR'; payload: ConversationError }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_SUGGESTIONS'; payload: SuggestedPrompt[] }
  | { type: 'RESET_CONVERSATION' }
  | { type: 'SET_LANGUAGE'; payload: string };
```

---

## Custom Hooks Architecture

### 1. useConversation (Main Hook)
**Purpose:** Orchestrates entire conversation system
**Location:** `hooks/useConversation.js`

```javascript
const useConversation = (options = {}) => {
  // Returns unified API
  return {
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
  };
};
```

### 2. useMessages
**Purpose:** Manages message history and CRUD operations
**Location:** `hooks/useMessages.js`

```javascript
const useMessages = () => {
  return {
    messages: Message[],
    addMessage: (message: Message) => void,
    updateMessage: (id: string, updates: Partial<Message>) => void,
    deleteMessage: (id: string) => void,
    getMessageById: (id: string) => Message | null,
    clearMessages: () => void,
  };
};
```

### 3. useTypingAnimation
**Purpose:** Handles typing/streaming animation
**Location:** `hooks/useTypingAnimation.js`

```javascript
const useTypingAnimation = (options = {}) => {
  return {
    isTyping: boolean,
    displayedText: string,
    startTyping: (fullText: string, speed?: number) => void,
    stopTyping: () => void,
    skipTyping: () => void, // Skip to full text
  };
};
```

### 4. useSuggestedPrompts
**Purpose:** Manages suggested prompts (static + dynamic)
**Location:** `hooks/useSuggestedPrompts.js`

```javascript
const useSuggestedPrompts = (conversationState) => {
  return {
    prompts: SuggestedPrompt[],
    selectPrompt: (promptId: string) => string,
    updatePrompts: (newPrompts: SuggestedPrompt[]) => void,
    getContextualPrompts: () => SuggestedPrompt[],
  };
};
```

### 5. useConversationHistory
**Purpose:** Manages conversation persistence (localStorage)
**Location:** `hooks/useConversationHistory.js`

```javascript
const useConversationHistory = () => {
  return {
    saveConversation: (state: ConversationState) => void,
    loadConversation: (id: string) => ConversationState | null,
    listConversations: () => ConversationSummary[],
    deleteConversation: (id: string) => void,
    clearAllHistory: () => void,
  };
};
```

### 6. useConversationState
**Purpose:** Core state management (reducer pattern)
**Location:** `hooks/useConversationState.js`

```javascript
const useConversationState = (initialState) => {
  return {
    state: ConversationState,
    dispatch: (action: ConversationAction) => void,
  };
};
```

---

## ConversationManager Class

**Purpose:** Core business logic, future WebLLM integration point
**Location:** `conversation/ConversationManager.js`

```javascript
class ConversationManager {
  constructor(config) {
    this.config = config;
    this.knowledgeSearch = null; // Will hold search service
    this.llmProvider = null; // Future: WebLLM instance
  }
  
  // Initialize services
  async initialize(language) {
    await this.initializeKnowledgeSearch(language);
    // Future: await this.initializeWebLLM();
  }
  
  // Process user message
  async processMessage(message, conversationContext) {
    // 1. Search knowledge base
    const searchResults = await this.searchKnowledge(message);
    
    // 2. Build context
    const context = this.buildContext(conversationContext, searchResults);
    
    // 3. Generate response (mock for now, WebLLM later)
    const response = await this.generateResponse(message, context);
    
    // 4. Update suggestions
    const suggestions = this.generateSuggestions(conversationContext);
    
    return { response, searchResults, suggestions };
  }
  
  // Future WebLLM integration
  async initializeWebLLM() {
    // Will load WebLLM model
  }
  
  async generateResponse(message, context) {
    // Mock implementation for now
    // Future: Use WebLLM
    return this.mockResponse(message, context);
  }
  
  // Knowledge search integration
  async searchKnowledge(query) {
    return await this.knowledgeSearch.search(query, { maxResults: 3 });
  }
  
  // Context building
  buildContext(conversation, searchResults) {
    return {
      history: conversation.messages.slice(-5), // Last 5 messages
      knowledge: searchResults,
      language: conversation.language,
    };
  }
  
  // Suggestion generation
  generateSuggestions(conversation) {
    // Based on conversation state
    // Based on last message
    // Based on knowledge results
  }
  
  // Mock response (temporary)
  mockResponse(message, context) {
    // Use search results to build response
    // Format nicely
    // Return with metadata
  }
}
```

---

## Action Workflow

### User Sends Message Flow
```
1. User types message in AIChatInput
2. Component calls sendMessage(text)
3. useConversation dispatches ADD_USER_MESSAGE
4. ConversationManager.processMessage() called
   ├─ Search knowledge base
   ├─ Build context
   └─ Generate response (mock or WebLLM)
5. Dispatch START_TYPING with response
6. useTypingAnimation animates text
7. Dispatch FINISH_TYPING
8. Update suggestions
9. Save to history (localStorage)
```

### Suggested Prompt Flow
```
1. User clicks suggested prompt
2. selectPrompt(id) called
3. Prompt text extracted
4. sendMessage(promptText) called
5. Normal message flow continues
```

---

## State Management Strategy

### Reducer Pattern
```javascript
function conversationReducer(state, action) {
  switch (action.type) {
    case 'ADD_USER_MESSAGE':
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: generateId(),
            role: 'user',
            content: action.payload,
            timestamp: new Date().toISOString(),
            status: 'complete',
          }
        ],
        metadata: {
          ...state.metadata,
          messageCount: state.metadata.messageCount + 1,
          lastInteraction: new Date().toISOString(),
        }
      };
      
    case 'START_TYPING':
      return {
        ...state,
        status: 'typing',
        currentTypingMessage: action.payload,
      };
      
    case 'FINISH_TYPING':
      return {
        ...state,
        status: 'idle',
        messages: [
          ...state.messages,
          {
            id: generateId(),
            role: 'assistant',
            content: state.currentTypingMessage,
            timestamp: new Date().toISOString(),
            status: 'complete',
          }
        ],
        currentTypingMessage: null,
      };
      
    // ... more actions
  }
}
```

---

## Integration Points for WebLLM

### 1. ConversationManager
```javascript
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
    return this.mockResponse(message, context);
  }
  
  const prompt = this.buildPrompt(message, context);
  
  const completion = await this.llmProvider.chat.completions.create({
    messages: [
      { role: "system", content: context.systemPrompt },
      ...context.history,
      { role: "user", content: message }
    ],
    stream: true,
  });
  
  return completion; // Will stream chunks
}
```

### 2. Streaming Support
```javascript
const useStreamingResponse = () => {
  const [chunks, setChunks] = useState([]);
  
  const streamResponse = async (generator) => {
    for await (const chunk of generator) {
      setChunks(prev => [...prev, chunk.choices[0].delta.content]);
    }
  };
  
  return { chunks, streamResponse };
};
```

---

## File Structure

```
src/features/ai-assistant/conversation/
├── README.md
├── CONVERSATION_ARCHITECTURE_PLAN.md (this file)
│
├── core/
│   ├── ConversationManager.js          # Main business logic
│   ├── conversationReducer.js          # State reducer
│   ├── conversationActions.js          # Action creators
│   └── conversationUtils.js            # Utilities
│
├── hooks/
│   ├── index.js
│   ├── useConversation.js              # Main orchestrator hook
│   ├── useConversationState.js         # State management
│   ├── useMessages.js                  # Message CRUD
│   ├── useTypingAnimation.js           # Typing effect
│   ├── useSuggestedPrompts.js          # Prompt suggestions
│   ├── useConversationHistory.js       # Persistence
│   └── useStreamingResponse.js         # Future: WebLLM streaming
│
├── types/
│   ├── conversation.types.js           # TypeScript-style JSDoc types
│   └── index.js
│
├── services/
│   ├── ResponseGenerator.js            # Mock response generator
│   ├── PromptBuilder.js                # Build prompts for LLM
│   ├── ContextBuilder.js               # Build context from knowledge
│   └── index.js
│
├── config/
│   ├── conversationConfig.js           # Configuration
│   └── suggestedPrompts.js             # Static prompt library
│
└── index.js                            # Public exports
```

---

## Configuration

```javascript
// conversationConfig.js
export const CONVERSATION_CONFIG = {
  // Typing animation
  TYPING_SPEED: 30, // ms per character
  TYPING_SPEED_FAST: 10,
  
  // History
  MAX_HISTORY_MESSAGES: 50,
  PERSIST_TO_LOCALSTORAGE: true,
  STORAGE_KEY: 'ai-assistant-conversations',
  
  // Suggestions
  MAX_SUGGESTIONS: 4,
  UPDATE_SUGGESTIONS_ON_MESSAGE: true,
  
  // Knowledge search
  MAX_SEARCH_RESULTS: 3,
  MIN_SEARCH_SCORE: 0.3,
  
  // Response generation
  MOCK_RESPONSE_DELAY: 500, // ms
  MOCK_RESPONSE_LENGTH: 'medium', // short, medium, long
  
  // Future: WebLLM config
  WEBLLM_MODEL: 'Llama-3.2-3B-Instruct',
  WEBLLM_TEMPERATURE: 0.7,
  WEBLLM_MAX_TOKENS: 500,
};
```

---

## Static Suggested Prompts

```javascript
// suggestedPrompts.js
export const STATIC_PROMPTS = [
  {
    id: 'expertise-react',
    text: 'What is your React experience?',
    category: 'expertise',
    icon: '⚛️',
  },
  {
    id: 'projects-recent',
    text: 'Tell me about your recent projects',
    category: 'projects',
    icon: '🚀',
  },
  {
    id: 'ventures-braveup',
    text: 'What is Brave Up!?',
    category: 'ventures',
    icon: '🎯',
  },
  {
    id: 'general-contact',
    text: 'How can I contact you?',
    category: 'general',
    icon: '📧',
  },
];
```

---

## Component Integration

### AIAssistantSection.jsx (Updated)
```javascript
import { useConversation } from '../conversation/hooks';

function AIAssistantSection() {
  const {
    messages,
    isTyping,
    isLoading,
    error,
    sendMessage,
    suggestedPrompts,
    selectPrompt,
  } = useConversation({ language: 'en' });
  
  return (
    <div className={styles.container}>
      <AIChatWindow 
        messages={messages}
        isTyping={isTyping}
      />
      
      <QuickPromptList
        prompts={suggestedPrompts}
        onSelectPrompt={selectPrompt}
      />
      
      <AIChatInput
        onSend={sendMessage}
        disabled={isLoading || isTyping}
      />
      
      {error && <ErrorMessage error={error} />}
    </div>
  );
}
```

---

## Mock Response Strategy

Since we don't have WebLLM yet, the mock response generator will:

1. **Use knowledge search results** to build context-aware responses
2. **Format responses** with markdown, code blocks, lists
3. **Include metadata** (processing time, search results used)
4. **Simulate realistic typing** delays

```javascript
// ResponseGenerator.js
class ResponseGenerator {
  generateMockResponse(message, searchResults, language) {
    // Analyze search results
    if (searchResults.length === 0) {
      return this.generateNoResultsResponse(message, language);
    }
    
    // Build response from search results
    const response = this.buildResponseFromKnowledge(searchResults, language);
    
    // Add conversational elements
    const formatted = this.formatResponse(response);
    
    return {
      content: formatted,
      metadata: {
        searchResults: searchResults.map(r => r.chunk.id),
        processingTime: Math.random() * 500 + 200,
        model: 'mock-v1',
      }
    };
  }
}
```

---

## Testing Strategy

### 1. Hook Testing
- Test each hook in isolation
- Mock dependencies
- Test state transitions
- Test error handling

### 2. Integration Testing
- Test full conversation flow
- Test persistence
- Test suggestion updates
- Test error recovery

### 3. Component Testing
- Test component integration with hooks
- Test user interactions
- Test loading/typing states
- Test error displays

---

## Implementation Phases

### Phase 1: Core Hooks (Priority 1)
- [x] useConversationState (reducer)
- [x] useMessages (CRUD)
- [x] useConversation (orchestrator)

### Phase 2: Animation & UX (Priority 2)
- [x] useTypingAnimation
- [x] useSuggestedPrompts
- [x] useConversationHistory

### Phase 3: Business Logic (Priority 3)
- [x] ConversationManager class
- [x] ResponseGenerator service
- [x] PromptBuilder service
- [x] ContextBuilder service

### Phase 4: Integration (Priority 4)
- [x] Connect to Knowledge Layer
- [x] Update AIAssistantSection component
- [x] Add error handling
- [x] Add persistence

### Phase 5: Polish (Priority 5)
- [x] Typing animations
- [x] Dynamic suggestions
- [x] Export conversation
- [x] Testing

### Phase 6: WebLLM Integration (Future)
- [ ] Initialize WebLLM
- [ ] Streaming support
- [ ] Prompt engineering
- [ ] Model loading UI

---

## Key Design Decisions

### 1. **Hook-Based Architecture**
- **Why:** React best practices, composability, testability
- **Alternative:** Context API, Redux
- **Trade-off:** More hooks to manage, but better separation of concerns

### 2. **Reducer Pattern for State**
- **Why:** Predictable state updates, easier debugging, scalability
- **Alternative:** useState everywhere
- **Trade-off:** More boilerplate, but better maintainability

### 3. **ConversationManager Class**
- **Why:** Single integration point for WebLLM, encapsulates business logic
- **Alternative:** Hooks only
- **Trade-off:** Class vs functional, but easier WebLLM integration

### 4. **Mock Response Generator**
- **Why:** Development/testing without LLM, fallback mechanism
- **Alternative:** No fallback
- **Trade-off:** Extra code, but better UX during development

### 5. **Knowledge-First Approach**
- **Why:** Search results inform responses, even in mock mode
- **Alternative:** Generic responses
- **Trade-off:** Tighter coupling, but better quality responses

---

## Performance Considerations

1. **Message Limit:** Cap history at 50 messages
2. **Debounce Typing:** Batch typing updates for smooth animation
3. **Lazy Loading:** Load ConversationManager only when needed
4. **Memoization:** Memoize expensive computations (suggestions, search)
5. **Virtual Scrolling:** For long message lists (future)

---

## Accessibility

1. **ARIA Labels:** All interactive elements
2. **Keyboard Navigation:** Full keyboard support
3. **Screen Reader:** Announce new messages
4. **Focus Management:** Maintain focus on input
5. **Loading States:** Clear loading indicators

---

## Next Steps

1. **Review this plan** - Approve/modify architecture
2. **Implement Phase 1** - Core hooks
3. **Implement Phase 2** - Animation hooks
4. **Implement Phase 3** - Business logic
5. **Integrate** - Connect everything
6. **Test** - Comprehensive testing
7. **Polish** - UX improvements

---

## Questions to Resolve

1. **Message Format:** Markdown? Plain text? HTML?
2. **Suggestion Algorithm:** Static only? Context-aware from start?
3. **Error Recovery:** Retry? Fallback? User prompt?
4. **Persistence:** Local only? Backend sync later?
5. **Export Format:** JSON? Markdown? PDF?

---

**Status:** 📋 PLANNING COMPLETE - Ready for Review & Implementation
**Estimated Implementation Time:** 2-3 sessions
**Complexity:** Medium-High
**Dependencies:** Knowledge Layer (✅ Complete), Search System (✅ Complete)
