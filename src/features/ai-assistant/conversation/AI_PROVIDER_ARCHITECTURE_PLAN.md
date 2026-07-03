# AI Provider Abstraction - Architecture Plan

**Goal:** Create a provider abstraction that allows switching between MockAIProvider and WebLLMProvider without modifying UI components.

**Date:** 2026-07-02  
**Status:** 📋 Planning Phase

---

## 🎯 Requirements

1. **Interface-based design** - All providers implement same interface
2. **Dependency injection** - ConversationManager receives provider via constructor
3. **No UI changes needed** - Swapping providers is transparent to components
4. **MockAIProvider first** - Use existing ResponseGenerator logic
5. **WebLLM ready** - Architecture supports future WebLLMProvider
6. **Streaming support** - Interface supports both chat() and stream()

---

## 🏗️ Architecture Design

### Provider Interface

```javascript
/**
 * @typedef {Object} AIProviderConfig
 * @property {string} model - Model name
 * @property {number} temperature - Temperature (0-1)
 * @property {number} maxTokens - Max tokens to generate
 * @property {string} [apiKey] - API key (if needed)
 */

/**
 * @typedef {Object} ChatMessage
 * @property {'system'|'user'|'assistant'} role
 * @property {string} content
 */

/**
 * @typedef {Object} ChatResponse
 * @property {string} content - Generated text
 * @property {number} tokens - Tokens used
 * @property {string} model - Model used
 * @property {number} processingTime - Time taken (ms)
 * @property {boolean} fromCache - Whether from cache
 */

/**
 * AI Provider Interface
 */
interface IAIProvider {
  /**
   * Initialize the provider
   * @returns {Promise<void>}
   */
  initialize(): Promise<void>;
  
  /**
   * Check if provider is ready
   * @returns {boolean}
   */
  isReady(): boolean;
  
  /**
   * Generate a chat completion
   * @param {ChatMessage[]} messages - Conversation messages
   * @param {Partial<AIProviderConfig>} options - Generation options
   * @returns {Promise<ChatResponse>}
   */
  chat(messages, options): Promise<ChatResponse>;
  
  /**
   * Stream a chat completion
   * @param {ChatMessage[]} messages - Conversation messages
   * @param {Partial<AIProviderConfig>} options - Generation options
   * @returns {AsyncGenerator<string>} Text stream
   */
  stream(messages, options): AsyncGenerator<string>;
  
  /**
   * Get provider info
   * @returns {Object} Provider metadata
   */
  getInfo(): { name: string, version: string, type: string };
  
  /**
   * Cleanup resources
   * @returns {Promise<void>}
   */
  dispose(): Promise<void>;
}
```

---

## 📁 File Structure

```
conversation/
├── providers/
│   ├── IAIProvider.js              # Interface definition
│   ├── MockAIProvider.js           # Mock implementation
│   ├── WebLLMProvider.js           # Future: WebLLM implementation
│   ├── providerFactory.js          # Factory for creating providers
│   └── index.js                    # Exports
│
├── core/
│   └── ConversationManager.js      # MODIFIED: Use injected provider
│
└── hooks/
    └── useConversation.js          # MODIFIED: Inject provider via factory
```

---

## 🔧 Implementation Plan

### Phase 1: Interface & Base Class

**File:** `providers/IAIProvider.js`

```javascript
/**
 * Abstract base class for AI providers
 * All providers must extend this class
 */
export class IAIProvider {
  constructor(config = {}) {
    if (new.target === IAIProvider) {
      throw new Error('Cannot instantiate abstract class IAIProvider');
    }
    this.config = config;
    this._isReady = false;
  }
  
  async initialize() {
    throw new Error('initialize() must be implemented');
  }
  
  isReady() {
    return this._isReady;
  }
  
  async chat(messages, options) {
    throw new Error('chat() must be implemented');
  }
  
  async *stream(messages, options) {
    throw new Error('stream() must be implemented');
  }
  
  getInfo() {
    throw new Error('getInfo() must be implemented');
  }
  
  async dispose() {
    this._isReady = false;
  }
}
```

---

### Phase 2: MockAIProvider Implementation

**File:** `providers/MockAIProvider.js`

```javascript
import { IAIProvider } from './IAIProvider.js';
import { ResponseGenerator } from '../services/ResponseGenerator.js';

/**
 * Mock AI Provider
 * Uses ResponseGenerator with knowledge search results
 */
export class MockAIProvider extends IAIProvider {
  constructor(config = {}) {
    super(config);
    this.responseGenerator = new ResponseGenerator();
    this.delay = config.delay || 500;
  }
  
  async initialize() {
    // Mock initialization - instant
    await this._delay(100);
    this._isReady = true;
  }
  
  async chat(messages, options = {}) {
    if (!this._isReady) {
      throw new Error('Provider not initialized');
    }
    
    const startTime = Date.now();
    
    // Simulate processing delay
    await this._delay(this.delay);
    
    // Extract user message and context
    const userMessage = messages[messages.length - 1]?.content || '';
    const searchResults = options.searchResults || [];
    const language = options.language || 'en';
    
    // Generate response using existing logic
    const response = this.responseGenerator.generateMockResponse(
      userMessage,
      searchResults,
      language
    );
    
    const processingTime = Date.now() - startTime;
    
    return {
      content: response.content,
      tokens: response.metadata.tokens,
      model: 'mock-v1',
      processingTime,
      fromCache: false,
    };
  }
  
  async *stream(messages, options = {}) {
    // For mock, generate full response then stream character by character
    const response = await this.chat(messages, options);
    const text = response.content;
    const chunkSize = 3; // Characters per chunk
    
    for (let i = 0; i < text.length; i += chunkSize) {
      await this._delay(30); // Simulate streaming delay
      yield text.slice(i, i + chunkSize);
    }
  }
  
  getInfo() {
    return {
      name: 'MockAIProvider',
      version: '1.0.0',
      type: 'mock',
    };
  }
  
  async dispose() {
    await super.dispose();
    this.responseGenerator = null;
  }
  
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

---

### Phase 3: Provider Factory

**File:** `providers/providerFactory.js`

```javascript
import { MockAIProvider } from './MockAIProvider.js';

/**
 * Factory for creating AI providers
 * Centralizes provider instantiation
 */
export class AIProviderFactory {
  /**
   * Create a provider by type
   * @param {'mock'|'webllm'} type - Provider type
   * @param {Object} config - Provider configuration
   * @returns {IAIProvider} Provider instance
   */
  static create(type = 'mock', config = {}) {
    switch (type) {
      case 'mock':
        return new MockAIProvider(config);
      
      case 'webllm':
        // Future: return new WebLLMProvider(config);
        throw new Error('WebLLM provider not yet implemented');
      
      default:
        throw new Error(`Unknown provider type: ${type}`);
    }
  }
  
  /**
   * Create default provider (mock for now)
   * @param {Object} config - Configuration
   * @returns {IAIProvider} Provider instance
   */
  static createDefault(config = {}) {
    return AIProviderFactory.create('mock', config);
  }
}
```

---

### Phase 4: Update ConversationManager

**File:** `core/ConversationManager.js` (MODIFIED)

```javascript
export class ConversationManager {
  /**
   * @param {Object} options
   * @param {IAIProvider} options.aiProvider - AI provider instance
   * @param {Object} options.config - Configuration
   */
  constructor({ aiProvider, config = {} } = {}) {
    this.config = { ...CONVERSATION_CONFIG, ...config };
    this.aiProvider = aiProvider; // Injected dependency
    this.knowledgeSearch = null;
    this.contextBuilder = new ContextBuilder();
    this.isInitialized = false;
  }
  
  async initialize(language) {
    try {
      // Initialize knowledge search
      this.knowledgeSearch = await createSearchService(language);
      
      // Initialize AI provider
      if (this.aiProvider && !this.aiProvider.isReady()) {
        await this.aiProvider.initialize();
      }
      
      this.isInitialized = true;
    } catch (err) {
      // Error handling...
    }
  }
  
  async generateResponse(message, context) {
    if (!this.aiProvider || !this.aiProvider.isReady()) {
      throw createError('AI provider not ready', ERROR_CODES.LLM_ERROR);
    }
    
    try {
      // Prepare messages for provider
      const messages = this.contextBuilder.buildChatMessages(context, message);
      
      // Call provider's chat method
      const response = await this.aiProvider.chat(messages, {
        searchResults: context.knowledge,
        language: context.language,
        temperature: 0.7,
        maxTokens: 500,
      });
      
      return {
        content: response.content,
        metadata: {
          searchResults: context.knowledge.map(r => r.chunk.id),
          processingTime: response.processingTime,
          model: response.model,
          tokens: response.tokens,
        },
      };
    } catch (err) {
      throw createError(
        'Failed to generate response',
        ERROR_CODES.GENERATION_FAILED,
        true,
        err
      );
    }
  }
}
```

---

### Phase 5: Update useConversation Hook

**File:** `hooks/useConversation.js` (MODIFIED)

```javascript
import { AIProviderFactory } from '../providers/providerFactory.js';

export function useConversation(options = {}) {
  const {
    language = 'en',
    persistHistory = true,
    config: userConfig = {},
    providerType = 'mock', // NEW: Allow provider selection
    providerConfig = {},   // NEW: Provider-specific config
  } = options;
  
  // Initialize ConversationManager with injected provider
  const [manager] = useState(() => {
    const aiProvider = AIProviderFactory.create(providerType, providerConfig);
    return new ConversationManager({
      aiProvider,
      config: userConfig,
    });
  });
  
  // Rest of hook remains the same...
}
```

---

## 🔄 Usage Examples

### Example 1: Default (Mock) Usage

```javascript
// Component
function ChatComponent() {
  const conversation = useConversation({
    language: 'en',
    // No provider specified = uses MockAIProvider by default
  });
  
  return <ChatUI {...conversation} />;
}
```

### Example 2: Explicit Mock Provider

```javascript
const conversation = useConversation({
  language: 'en',
  providerType: 'mock',
  providerConfig: {
    delay: 300, // Custom delay
  },
});
```

### Example 3: Future WebLLM Provider

```javascript
const conversation = useConversation({
  language: 'en',
  providerType: 'webllm',
  providerConfig: {
    model: 'Llama-3.2-3B-Instruct',
    temperature: 0.7,
  },
});
```

### Example 4: Direct Injection (Advanced)

```javascript
import { MockAIProvider } from './providers';
import { ConversationManager } from './core';

// Create custom provider
const customProvider = new MockAIProvider({ delay: 100 });

// Inject into manager
const manager = new ConversationManager({
  aiProvider: customProvider,
});
```

---

## 🎯 Benefits of This Design

### 1. **Dependency Injection** ✅
- ConversationManager receives provider via constructor
- Easy to test with mock providers
- No hard-coded dependencies

### 2. **Open/Closed Principle** ✅
- Open for extension (add new providers)
- Closed for modification (no changes to existing code)

### 3. **Liskov Substitution** ✅
- Any IAIProvider implementation is interchangeable
- UI doesn't know or care which provider is used

### 4. **Single Responsibility** ✅
- IAIProvider: Define interface
- MockAIProvider: Mock implementation
- WebLLMProvider: Real LLM implementation
- AIProviderFactory: Create providers
- ConversationManager: Orchestrate conversation

### 5. **Testability** ✅
```javascript
// Easy to test with mock
const mockProvider = new MockAIProvider();
const manager = new ConversationManager({ aiProvider: mockProvider });

// Or with spy
const spyProvider = createSpyProvider();
const manager = new ConversationManager({ aiProvider: spyProvider });
```

---

## 🔮 Future: WebLLM Provider

**File:** `providers/WebLLMProvider.js` (Future)

```javascript
import { IAIProvider } from './IAIProvider.js';

export class WebLLMProvider extends IAIProvider {
  constructor(config = {}) {
    super(config);
    this.engine = null;
    this.modelName = config.model || 'Llama-3.2-3B-Instruct';
  }
  
  async initialize() {
    const { CreateMLCEngine } = await import('@mlc-ai/web-llm');
    
    this.engine = await CreateMLCEngine({
      model: this.modelName,
      chatOptions: {
        temperature: this.config.temperature || 0.7,
        max_tokens: this.config.maxTokens || 500,
      },
    });
    
    this._isReady = true;
  }
  
  async chat(messages, options = {}) {
    const startTime = Date.now();
    
    const completion = await this.engine.chat.completions.create({
      messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 500,
    });
    
    return {
      content: completion.choices[0].message.content,
      tokens: completion.usage.total_tokens,
      model: this.modelName,
      processingTime: Date.now() - startTime,
      fromCache: false,
    };
  }
  
  async *stream(messages, options = {}) {
    const stream = await this.engine.chat.completions.create({
      messages,
      stream: true,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 500,
    });
    
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  }
  
  getInfo() {
    return {
      name: 'WebLLMProvider',
      version: '1.0.0',
      type: 'webllm',
    };
  }
  
  async dispose() {
    if (this.engine) {
      // WebLLM cleanup
      this.engine = null;
    }
    await super.dispose();
  }
}
```

**To switch to WebLLM, just change one line:**

```javascript
// Before (Mock)
providerType: 'mock'

// After (WebLLM)
providerType: 'webllm'
```

**No UI changes needed!** 🎉

---

## 📊 Implementation Checklist

### Phase 1: Interface & Base ✅
- [ ] Create `IAIProvider.js` with abstract class
- [ ] Define all required methods
- [ ] Add JSDoc types
- [ ] Test interface enforcement

### Phase 2: Mock Implementation ✅
- [ ] Create `MockAIProvider.js`
- [ ] Integrate with ResponseGenerator
- [ ] Implement chat() method
- [ ] Implement stream() method
- [ ] Add delay simulation
- [ ] Test mock responses

### Phase 3: Factory ✅
- [ ] Create `providerFactory.js`
- [ ] Implement create() method
- [ ] Add default provider logic
- [ ] Test factory creation

### Phase 4: Update ConversationManager ✅
- [ ] Modify constructor for DI
- [ ] Update initialize() method
- [ ] Update generateResponse() to use provider
- [ ] Remove direct ResponseGenerator usage
- [ ] Test with injected provider

### Phase 5: Update useConversation ✅
- [ ] Add providerType option
- [ ] Add providerConfig option
- [ ] Use factory to create provider
- [ ] Inject into ConversationManager
- [ ] Test hook with mock provider

### Phase 6: Testing ✅
- [ ] Unit test IAIProvider interface
- [ ] Unit test MockAIProvider
- [ ] Unit test Factory
- [ ] Integration test with ConversationManager
- [ ] End-to-end test with useConversation

### Phase 7: Documentation ✅
- [ ] Update README with provider usage
- [ ] Document provider interface
- [ ] Add migration guide
- [ ] Add WebLLM integration guide

---

## 🎯 Success Criteria

- [x] **Interface defined** - Clear IAIProvider interface
- [ ] **Mock implemented** - MockAIProvider working
- [ ] **DI working** - Manager accepts any provider
- [ ] **No UI changes** - Components unchanged
- [ ] **Factory working** - Easy provider creation
- [ ] **Tests passing** - All tests green
- [ ] **WebLLM ready** - Architecture supports future integration

---

## 🚀 Migration Path

### Current Code:
```javascript
// ConversationManager directly uses ResponseGenerator
this.responseGenerator = new ResponseGenerator();
const response = this.responseGenerator.generateMockResponse(...);
```

### New Code:
```javascript
// ConversationManager uses injected provider
this.aiProvider = injectedProvider;
const response = await this.aiProvider.chat(messages, options);
```

### User Code:
```javascript
// Before: No changes needed, still works
useConversation({ language: 'en' })

// After: Same API, just works with new architecture
useConversation({ language: 'en' })

// Future: Easy to switch provider
useConversation({ 
  language: 'en',
  providerType: 'webllm'
})
```

---

## ⚡ Performance Considerations

1. **Provider initialization** - Done once on mount
2. **No overhead** - Direct method calls (no proxies)
3. **Lazy loading** - WebLLM only loaded when needed
4. **Streaming** - Supports efficient token streaming
5. **Disposal** - Clean resource cleanup

---

## 🎨 Design Patterns Used

1. **Strategy Pattern** - IAIProvider interface with multiple implementations
2. **Dependency Injection** - Manager receives provider via constructor
3. **Factory Pattern** - AIProviderFactory creates providers
4. **Template Method** - Base class defines structure, subclasses implement details
5. **Adapter Pattern** - Providers adapt different APIs to common interface

---

## 📝 Next Steps

1. **Review this plan** - Approve architecture
2. **Implement Phase 1** - Create interface
3. **Implement Phase 2** - Create MockAIProvider
4. **Implement Phase 3** - Create factory
5. **Implement Phase 4** - Update ConversationManager
6. **Implement Phase 5** - Update useConversation
7. **Test everything** - Ensure it works
8. **Document** - Update guides

---

**Status:** 📋 Planning Complete - Ready for Implementation  
**Estimated Time:** 2-3 hours  
**Complexity:** Medium  
**Risk:** Low (well-isolated changes)

---

## 💡 Key Insight

**The beauty of this design:** Switching from Mock to WebLLM is literally a one-line change in user code, with ZERO UI modifications needed. The abstraction layer handles everything! 🎉
