# AI Provider Abstraction - Quick Reference

Quick reference for implementing the AI provider abstraction layer.

---

## 🎯 Goal

Replace direct `ResponseGenerator` usage with an **injectable AI provider abstraction** that supports both mock and real LLM implementations.

---

## 📝 Core Interface

```javascript
interface IAIProvider {
  initialize(): Promise<void>
  isReady(): boolean
  chat(messages, options): Promise<ChatResponse>
  stream(messages, options): AsyncGenerator<string>
  getInfo(): { name, version, type }
  dispose(): Promise<void>
}
```

---

## 📁 Files to Create

```
providers/
├── IAIProvider.js              # Abstract base class
├── MockAIProvider.js           # Mock implementation
├── providerFactory.js          # Factory for creating providers
└── index.js                    # Exports
```

---

## 🔧 Files to Modify

```
core/
└── ConversationManager.js      # Accept injected provider

hooks/
└── useConversation.js          # Create provider via factory
```

---

## 💡 Key Changes

### 1. ConversationManager Constructor

**Before:**
```javascript
constructor(config = {}) {
  this.responseGenerator = new ResponseGenerator();
}
```

**After:**
```javascript
constructor({ aiProvider, config = {} } = {}) {
  this.aiProvider = aiProvider; // Injected!
}
```

### 2. Response Generation

**Before:**
```javascript
const response = this.responseGenerator.generateMockResponse(
  message, searchResults, language
);
```

**After:**
```javascript
const response = await this.aiProvider.chat(messages, {
  searchResults,
  language,
});
```

### 3. Hook Usage

**Before:**
```javascript
const [manager] = useState(() => new ConversationManager(config));
```

**After:**
```javascript
const [manager] = useState(() => {
  const provider = AIProviderFactory.create('mock');
  return new ConversationManager({ aiProvider: provider, config });
});
```

---

## 🎨 Usage Examples

### Default (Mock)
```javascript
useConversation({ language: 'en' })
```

### Explicit Provider
```javascript
useConversation({ 
  providerType: 'mock',
  providerConfig: { delay: 300 }
})
```

### Future WebLLM
```javascript
useConversation({ 
  providerType: 'webllm',
  providerConfig: { 
    model: 'Llama-3.2-3B-Instruct',
    temperature: 0.7
  }
})
```

---

## ✅ Implementation Checklist

### Phase 1: Interface
- [ ] Create `IAIProvider.js`
- [ ] Define abstract base class
- [ ] Add method stubs
- [ ] Add JSDoc types

### Phase 2: Mock Provider
- [ ] Create `MockAIProvider.js`
- [ ] Extend IAIProvider
- [ ] Implement initialize()
- [ ] Implement chat()
- [ ] Implement stream()
- [ ] Integrate ResponseGenerator

### Phase 3: Factory
- [ ] Create `providerFactory.js`
- [ ] Implement create() method
- [ ] Add 'mock' case
- [ ] Add 'webllm' placeholder

### Phase 4: Update Manager
- [ ] Modify constructor
- [ ] Update initialize()
- [ ] Update generateResponse()
- [ ] Remove direct ResponseGenerator

### Phase 5: Update Hook
- [ ] Add providerType option
- [ ] Add providerConfig option
- [ ] Use factory
- [ ] Inject into manager

### Phase 6: Test
- [ ] Test mock provider
- [ ] Test factory
- [ ] Test manager with provider
- [ ] Test hook end-to-end

---

## 🧪 Test Commands

```bash
# Test provider system
node --loader ./svg-loader.js src/features/ai-assistant/conversation/providers/test.js

# Test conversation system
node --loader ./svg-loader.js src/features/ai-assistant/conversation/test.js
```

---

## 📊 Type Definitions

```javascript
/**
 * @typedef {Object} ChatMessage
 * @property {'system'|'user'|'assistant'} role
 * @property {string} content
 */

/**
 * @typedef {Object} ChatResponse
 * @property {string} content
 * @property {number} tokens
 * @property {string} model
 * @property {number} processingTime
 * @property {boolean} fromCache
 */

/**
 * @typedef {Object} ChatOptions
 * @property {Array} [searchResults]
 * @property {string} [language]
 * @property {number} [temperature]
 * @property {number} [maxTokens]
 */
```

---

## 🎯 Benefits

✅ **Testable** - Easy to mock providers  
✅ **Flexible** - Swap implementations easily  
✅ **Maintainable** - Clean separation of concerns  
✅ **Extensible** - Add new providers without UI changes  
✅ **Type-safe** - Interface ensures consistency  

---

## 🚀 Provider Comparison

| Feature | MockAIProvider | WebLLMProvider |
|---------|---------------|----------------|
| Speed | ~500ms | ~1-3s |
| Quality | ⭐⭐ | ⭐⭐⭐⭐ |
| Offline | ✅ | ✅ |
| Cost | Free | Free |
| Setup | Instant | ~5-10s |
| Use Case | Development | Production |

---

## 💡 Pro Tips

1. **Always inject providers** - Never instantiate inside manager
2. **Use factory** - Centralized creation logic
3. **Test with mock** - Fast, deterministic tests
4. **Async initialize** - Handle provider setup properly
5. **Cleanup resources** - Call dispose() when done

---

## 🔮 Future Extensions

```javascript
// Easy to add new providers!

// Google Gemini
class GeminiProvider extends IAIProvider { ... }

// Anthropic Claude
class ClaudeProvider extends IAIProvider { ... }

// OpenAI API
class OpenAIProvider extends IAIProvider { ... }

// Hybrid (mock + real)
class HybridProvider extends IAIProvider { ... }

// Just register in factory:
case 'gemini': return new GeminiProvider(config);
```

---

## 📚 Related Documentation

- [AI_PROVIDER_ARCHITECTURE_PLAN.md](./AI_PROVIDER_ARCHITECTURE_PLAN.md) - Complete spec
- [AI_PROVIDER_ARCHITECTURE_VISUAL.md](./AI_PROVIDER_ARCHITECTURE_VISUAL.md) - Visual diagrams
- [CONVERSATION_ARCHITECTURE_PLAN.md](./CONVERSATION_ARCHITECTURE_PLAN.md) - Overall architecture

---

**Status:** 📋 Planning Complete  
**Ready for:** Implementation  
**Estimated Time:** 2-3 hours
