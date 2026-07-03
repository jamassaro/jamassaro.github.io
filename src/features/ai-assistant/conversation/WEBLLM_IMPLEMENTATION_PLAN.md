# WebLLM Provider Implementation Plan

**Date:** 2026-07-02  
**Goal:** Replace MockAIProvider with real WebLLM implementation  
**Constraint:** UI must work exactly as before (no UI modifications)

---

## Phase 1: Installation & Dependencies

### Install WebLLM
```bash
npm install @mlc-ai/web-llm
```

**Package Info:**
- Name: `@mlc-ai/web-llm`
- Purpose: Run LLMs in-browser using WebGPU
- Models: Llama, Phi, Gemma, etc.
- Size: ~50MB (core) + model weights (varies)

---

## Phase 2: WebLLMProvider Implementation

### File: `providers/WebLLMProvider.js`

#### 2.1 Class Structure
```javascript
export class WebLLMProvider extends IAIProvider {
  constructor(config = {}) {
    super(config);
    this.engine = null;
    this.model = config.model || 'Llama-3.2-3B-Instruct-q4f16_1-MLC';
    this.temperature = config.temperature || 0.7;
    this.maxTokens = config.maxTokens || 500;
    this.onProgress = config.onProgress || null;
  }
}
```

#### 2.2 Initialize Method (with Progress Reporting)
```javascript
async initialize() {
  try {
    // Dynamic import to avoid bundling issues
    const { CreateMLCEngine } = await import('@mlc-ai/web-llm');
    
    // Create engine with progress callback
    this.engine = await CreateMLCEngine(
      this.model,
      {
        initProgressCallback: (progress) => {
          // Report progress: { progress: 0-1, text: "Loading..." }
          if (this.onProgress) {
            this.onProgress(progress);
          }
          console.log(`[WebLLM] ${progress.text}`);
        }
      }
    );
    
    this._isReady = true;
    console.log('[WebLLM] Model initialized successfully');
  } catch (err) {
    console.error('[WebLLM] Initialization failed:', err);
    throw new Error(`Failed to initialize WebLLM: ${err.message}`);
  }
}
```

**Progress Events:**
- "Loading model from cache..."
- "Downloading model..." (with percentage)
- "Initializing WebGPU..."
- "Model ready"

#### 2.3 Chat Method (Non-Streaming)
```javascript
async chat(messages, options = {}) {
  if (!this._isReady) {
    throw new Error('WebLLMProvider not initialized. Call initialize() first.');
  }

  const startTime = Date.now();

  try {
    // Prepare messages (convert our format to WebLLM format)
    const chatMessages = this._prepareChatMessages(messages, options);
    
    // Generate completion
    const completion = await this.engine.chat.completions.create({
      messages: chatMessages,
      temperature: options.temperature || this.temperature,
      max_tokens: options.maxTokens || this.maxTokens,
      stream: false,
    });

    const processingTime = Date.now() - startTime;
    const content = completion.choices[0]?.message?.content || '';
    
    return {
      content,
      tokens: completion.usage?.total_tokens || 0,
      model: this.model,
      processingTime,
      fromCache: false,
    };
  } catch (err) {
    console.error('[WebLLM] Chat failed:', err);
    throw new Error(`WebLLM chat failed: ${err.message}`);
  }
}
```

#### 2.4 Stream Method (Streaming Support)
```javascript
async *stream(messages, options = {}) {
  if (!this._isReady) {
    throw new Error('WebLLMProvider not initialized. Call initialize() first.');
  }

  try {
    // Prepare messages
    const chatMessages = this._prepareChatMessages(messages, options);
    
    // Create streaming completion
    const stream = await this.engine.chat.completions.create({
      messages: chatMessages,
      temperature: options.temperature || this.temperature,
      max_tokens: options.maxTokens || this.maxTokens,
      stream: true,
    });

    // Yield chunks as they arrive
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        yield delta;
      }
    }
  } catch (err) {
    console.error('[WebLLM] Streaming failed:', err);
    throw new Error(`WebLLM streaming failed: ${err.message}`);
  }
}
```

#### 2.5 Helper Methods
```javascript
_prepareChatMessages(messages, options) {
  // Add system context from knowledge search results
  const systemMessage = this._buildSystemMessage(options);
  
  // Convert messages to WebLLM format
  const chatMessages = [
    systemMessage,
    ...messages
  ];
  
  return chatMessages;
}

_buildSystemMessage(options) {
  const { searchResults, language } = options;
  
  let systemContent = 'You are José Antonio Massaro\'s AI assistant. ';
  systemContent += 'Answer questions about his expertise, projects, and experience. ';
  systemContent += 'Be professional, concise, and helpful. ';
  
  if (searchResults && searchResults.length > 0) {
    systemContent += '\n\nRelevant information:\n';
    searchResults.slice(0, 5).forEach((result, i) => {
      systemContent += `${i + 1}. ${result.chunk.content}\n`;
    });
  }
  
  return {
    role: 'system',
    content: systemContent
  };
}
```

#### 2.6 Other Required Methods
```javascript
getInfo() {
  return {
    name: 'WebLLMProvider',
    version: '1.0.0',
    type: 'webllm',
    model: this.model,
  };
}

async dispose() {
  if (this.engine) {
    // WebLLM doesn't have explicit dispose, but we clean up references
    this.engine = null;
  }
  await super.dispose();
}
```

---

## Phase 3: Factory Update

### File: `providers/providerFactory.js`

#### 3.1 Add WebLLM Import
```javascript
import { WebLLMProvider } from './WebLLMProvider.js';
```

#### 3.2 Update Factory Create Method
```javascript
static create(type = PROVIDER_TYPES.MOCK, config = {}) {
  switch (type.toLowerCase()) {
    case PROVIDER_TYPES.MOCK:
      return new MockAIProvider(config);

    case PROVIDER_TYPES.WEBLLM:
      return new WebLLMProvider(config);  // ← Changed from error

    default:
      throw new Error(
        `Unknown provider type: "${type}". ` +
        `Supported types: ${Object.values(PROVIDER_TYPES).join(', ')}`
      );
  }
}
```

#### 3.3 Add Convenience Method
```javascript
static createWebLLM(config = {}) {
  return new WebLLMProvider(config);
}
```

---

## Phase 4: Export Updates

### File: `providers/index.js`

```javascript
export { IAIProvider } from './IAIProvider.js';
export { MockAIProvider } from './MockAIProvider.js';
export { WebLLMProvider } from './WebLLMProvider.js';  // ← Add this
export { AIProviderFactory, PROVIDER_TYPES } from './providerFactory.js';
```

---

## Phase 5: Error Handling Strategy

### 5.1 Initialization Errors
```javascript
// Browser doesn't support WebGPU
if (!navigator.gpu) {
  throw new Error('WebGPU not supported. Please use a compatible browser.');
}

// Model not found
catch (err) {
  if (err.message.includes('404')) {
    throw new Error(`Model "${this.model}" not found. Check model name.`);
  }
}

// Out of memory
catch (err) {
  if (err.message.includes('memory')) {
    throw new Error('Not enough memory to load model. Try a smaller model.');
  }
}
```

### 5.2 Runtime Errors
```javascript
// Context length exceeded
if (err.message.includes('context')) {
  throw new Error('Message too long. Try a shorter conversation.');
}

// Generation timeout
if (err.message.includes('timeout')) {
  throw new Error('Request timed out. Please try again.');
}
```

### 5.3 Fallback Strategy
```javascript
// If WebLLM fails during initialization, the UI can catch the error
// and fall back to MockAIProvider without code changes:

try {
  const provider = AIProviderFactory.create('webllm');
  await provider.initialize();
} catch (err) {
  console.warn('WebLLM failed, falling back to mock:', err);
  const provider = AIProviderFactory.create('mock');
  await provider.initialize();
}
```

---

## Phase 6: Configuration

### 6.1 Recommended Models
```javascript
// Fastest (recommended for portfolio)
'Llama-3.2-1B-Instruct-q4f16_1-MLC'  // ~1GB, fast inference

// Balanced (default)
'Llama-3.2-3B-Instruct-q4f16_1-MLC'  // ~2.5GB, good quality

// Best quality (slower)
'Llama-3.1-8B-Instruct-q4f16_1-MLC'  // ~5GB, best responses
```

### 6.2 Default Configuration
```javascript
const defaultConfig = {
  model: 'Llama-3.2-3B-Instruct-q4f16_1-MLC',
  temperature: 0.7,
  maxTokens: 500,
  onProgress: (progress) => {
    console.log(`Loading: ${Math.round(progress.progress * 100)}%`);
  }
};
```

---

## Phase 7: Testing Strategy

### 7.1 Update Test File
```javascript
// Test WebLLM initialization (will take time)
console.log('Test: WebLLM Initialization');
const webllmProvider = AIProviderFactory.createWebLLM({
  model: 'Llama-3.2-1B-Instruct-q4f16_1-MLC',  // Smallest for testing
  onProgress: (p) => console.log(`  Progress: ${Math.round(p.progress * 100)}%`)
});

await webllmProvider.initialize();
console.log('✓ WebLLM initialized');

// Test chat
const response = await webllmProvider.chat(messages, { searchResults });
console.log('✓ WebLLM chat response:', response.content.slice(0, 100));

// Test streaming
for await (const chunk of webllmProvider.stream(messages, { searchResults })) {
  process.stdout.write(chunk);
}
```

### 7.2 Browser Testing
- Open DevTools → Console
- Watch for progress messages
- Verify GPU usage in Task Manager
- Check Network tab for model downloads
- Test on multiple browsers (Chrome, Edge)

---

## Phase 8: UI Integration (No Changes Required!)

### 8.1 Current Usage (Still Works)
```javascript
// In useConversation hook
const { messages, sendMessage } = useConversation({
  language: 'en',
  providerType: 'webllm',  // ← Just change this!
  providerConfig: {
    model: 'Llama-3.2-3B-Instruct-q4f16_1-MLC',
    temperature: 0.7,
  }
});
```

### 8.2 Why No UI Changes Needed
✅ Same interface (IAIProvider)  
✅ Same method signatures  
✅ Same response format (ChatResponse)  
✅ Same state management  
✅ Same error handling  
✅ Same typing animation

**The UI is completely decoupled from the provider implementation!**

---

## Phase 9: Performance Considerations

### 9.1 First Load (Cold Start)
- Download model: ~2-5GB (cached after first load)
- Initialize WebGPU: ~2-5 seconds
- **Total: 30-60 seconds first time**

### 9.2 Subsequent Loads (Warm Start)
- Load from cache: ~5-10 seconds
- Initialize WebGPU: ~2-5 seconds
- **Total: 7-15 seconds**

### 9.3 Inference Performance
- Small model (1B): ~50-100 tokens/sec
- Medium model (3B): ~20-50 tokens/sec
- Large model (8B): ~10-20 tokens/sec

### 9.4 Memory Usage
- Browser overhead: ~500MB
- Model weights: 1-5GB
- Runtime: ~200-500MB
- **Total: 2-6GB RAM required**

---

## Phase 10: Browser Compatibility

### Supported Browsers
✅ Chrome 113+ (WebGPU stable)  
✅ Edge 113+ (WebGPU stable)  
✅ Opera 99+ (Chromium-based)  
⚠️ Safari 18+ (WebGPU experimental)  
❌ Firefox (WebGPU not yet enabled)

### Detection Code
```javascript
if (!navigator.gpu) {
  console.warn('WebGPU not available. Using MockAIProvider instead.');
  // Fall back to mock
}
```

---

## Phase 11: Deployment Considerations

### 11.1 CDN Hosting
- WebLLM loads models from CDN
- Default: `https://huggingface.co/mlc-ai/`
- No need to host models yourself

### 11.2 HTTPS Required
- WebGPU requires secure context
- Must serve over HTTPS in production

### 11.3 CORS Headers
- WebLLM handles CORS automatically
- No server-side configuration needed

---

## Implementation Checklist

### Phase 1: Setup
- [ ] Install @mlc-ai/web-llm package
- [ ] Verify package.json updated

### Phase 2: Create WebLLMProvider
- [ ] Create providers/WebLLMProvider.js
- [ ] Implement constructor with config
- [ ] Implement initialize() with progress
- [ ] Implement chat() method
- [ ] Implement stream() method
- [ ] Implement getInfo() method
- [ ] Implement dispose() method
- [ ] Add _prepareChatMessages() helper
- [ ] Add _buildSystemMessage() helper
- [ ] Add comprehensive error handling

### Phase 3: Update Factory
- [ ] Import WebLLMProvider
- [ ] Update create() method
- [ ] Add createWebLLM() convenience method
- [ ] Remove "not implemented" error

### Phase 4: Update Exports
- [ ] Add WebLLMProvider to index.js

### Phase 5: Testing
- [ ] Test WebLLM initialization
- [ ] Test chat() method
- [ ] Test stream() method
- [ ] Test error handling
- [ ] Test fallback to mock
- [ ] Verify UI still works

### Phase 6: Documentation
- [ ] Update README with WebLLM info
- [ ] Document configuration options
- [ ] Document browser requirements
- [ ] Add troubleshooting guide

---

## Risk Mitigation

### Risk 1: Initialization Failure
**Mitigation:** Graceful fallback to MockAIProvider
```javascript
try {
  await provider.initialize();
} catch (err) {
  console.warn('WebLLM failed, using mock');
  provider = new MockAIProvider();
}
```

### Risk 2: Browser Incompatibility
**Mitigation:** Detect WebGPU support before initialization
```javascript
if (!navigator.gpu) {
  throw new Error('WebGPU not supported');
}
```

### Risk 3: Memory Issues
**Mitigation:** Use smaller model or show warning
```javascript
if (performance.memory?.jsHeapSizeLimit < 2e9) {
  console.warn('Low memory, recommend smaller model');
}
```

### Risk 4: Slow First Load
**Mitigation:** Show progress UI (already have onProgress callback)

---

## Success Criteria

✅ WebLLM installs without errors  
✅ WebLLMProvider implements all IAIProvider methods  
✅ Model initializes with progress reporting  
✅ Chat completions work correctly  
✅ Streaming works correctly  
✅ Errors are handled gracefully  
✅ UI works without any modifications  
✅ Can switch between mock and WebLLM via config  
✅ All tests pass  
✅ Zero breaking changes to existing code

---

## Next Steps After Planning

1. Review this plan
2. Get approval from user
3. Implement Phase 1 (Installation)
4. Implement Phase 2 (WebLLMProvider)
5. Implement Phase 3 (Factory update)
6. Implement Phase 4 (Exports)
7. Test thoroughly
8. Update documentation

---

## Estimated Timeline

- **Installation:** 2 minutes
- **WebLLMProvider implementation:** 30 minutes
- **Factory & exports update:** 5 minutes
- **Testing:** 15 minutes (+ model download time)
- **Documentation:** 10 minutes
- **Total:** ~1 hour (excluding first model download)

---

## Notes

- This is a **non-breaking change** - all existing code continues to work
- MockAIProvider remains available for development/testing
- The abstraction layer (IAIProvider) proves its value here!
- Zero UI modifications required (as requested)
- Clean separation of concerns makes this straightforward
