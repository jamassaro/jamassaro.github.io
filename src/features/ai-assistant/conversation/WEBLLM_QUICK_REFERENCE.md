# WebLLM Implementation Quick Reference

## TL;DR
Replace MockAIProvider with WebLLMProvider by creating 1 new file and modifying 2 files. Zero UI changes required.

---

## Step-by-Step Implementation

### Step 1: Install WebLLM (2 min)
```bash
npm install @mlc-ai/web-llm
```

### Step 2: Create WebLLMProvider (30 min)
**File:** `providers/WebLLMProvider.js`

```javascript
import { IAIProvider } from './IAIProvider.js';

export class WebLLMProvider extends IAIProvider {
  constructor(config = {}) {
    super(config);
    this.engine = null;
    this.model = config.model || 'Llama-3.2-3B-Instruct-q4f16_1-MLC';
    this.temperature = config.temperature || 0.7;
    this.maxTokens = config.maxTokens || 500;
    this.onProgress = config.onProgress || null;
  }

  async initialize() {
    const { CreateMLCEngine } = await import('@mlc-ai/web-llm');
    this.engine = await CreateMLCEngine(this.model, {
      initProgressCallback: (progress) => {
        if (this.onProgress) this.onProgress(progress);
        console.log(`[WebLLM] ${progress.text}`);
      }
    });
    this._isReady = true;
  }

  async chat(messages, options = {}) {
    if (!this._isReady) throw new Error('Not initialized');
    
    const startTime = Date.now();
    const chatMessages = this._prepareChatMessages(messages, options);
    
    const completion = await this.engine.chat.completions.create({
      messages: chatMessages,
      temperature: options.temperature || this.temperature,
      max_tokens: options.maxTokens || this.maxTokens,
      stream: false,
    });

    return {
      content: completion.choices[0]?.message?.content || '',
      tokens: completion.usage?.total_tokens || 0,
      model: this.model,
      processingTime: Date.now() - startTime,
      fromCache: false,
    };
  }

  async *stream(messages, options = {}) {
    if (!this._isReady) throw new Error('Not initialized');
    
    const chatMessages = this._prepareChatMessages(messages, options);
    const stream = await this.engine.chat.completions.create({
      messages: chatMessages,
      temperature: options.temperature || this.temperature,
      max_tokens: options.maxTokens || this.maxTokens,
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) yield delta;
    }
  }

  getInfo() {
    return {
      name: 'WebLLMProvider',
      version: '1.0.0',
      type: 'webllm',
      model: this.model,
    };
  }

  async dispose() {
    this.engine = null;
    await super.dispose();
  }

  _prepareChatMessages(messages, options) {
    const systemMessage = this._buildSystemMessage(options);
    return [systemMessage, ...messages];
  }

  _buildSystemMessage(options) {
    const { searchResults, language } = options;
    let content = 'You are José Antonio Massaro\'s AI assistant. ';
    content += 'Answer questions about his expertise, projects, and experience. ';
    content += 'Be professional, concise, and helpful. ';
    
    if (searchResults && searchResults.length > 0) {
      content += '\n\nRelevant information:\n';
      searchResults.slice(0, 5).forEach((result, i) => {
        content += `${i + 1}. ${result.chunk.content}\n`;
      });
    }
    
    return { role: 'system', content };
  }
}
```

### Step 3: Update Factory (5 min)
**File:** `providers/providerFactory.js`

```javascript
// Add import
import { WebLLMProvider } from './WebLLMProvider.js';

// Update create method
static create(type = PROVIDER_TYPES.MOCK, config = {}) {
  switch (type.toLowerCase()) {
    case PROVIDER_TYPES.MOCK:
      return new MockAIProvider(config);

    case PROVIDER_TYPES.WEBLLM:
      return new WebLLMProvider(config);  // ← Add this

    default:
      throw new Error(`Unknown provider type: "${type}"`);
  }
}

// Add convenience method
static createWebLLM(config = {}) {
  return new WebLLMProvider(config);
}
```

### Step 4: Update Exports (1 min)
**File:** `providers/index.js`

```javascript
export { IAIProvider } from './IAIProvider.js';
export { MockAIProvider } from './MockAIProvider.js';
export { WebLLMProvider } from './WebLLMProvider.js';  // ← Add this
export { AIProviderFactory, PROVIDER_TYPES } from './providerFactory.js';
```

### Step 5: Test (10 min)
**Update:** `providers/test.js`

```javascript
// Test WebLLM
console.log('Test: WebLLM Provider');
const webllmProvider = AIProviderFactory.createWebLLM({
  model: 'Llama-3.2-1B-Instruct-q4f16_1-MLC',  // Smallest for testing
  onProgress: (p) => console.log(`Progress: ${Math.round(p.progress * 100)}%`)
});

await webllmProvider.initialize();
console.log('✓ Initialized');

const response = await webllmProvider.chat(messages, { searchResults });
console.log('✓ Chat response:', response.content.slice(0, 100));
```

### Step 6: Use in App (Change config only!)
**File:** Component using `useConversation`

```javascript
// Before (Mock)
const conversation = useConversation({
  language: 'en',
  providerType: 'mock'
});

// After (WebLLM)
const conversation = useConversation({
  language: 'en',
  providerType: 'webllm',
  providerConfig: {
    model: 'Llama-3.2-3B-Instruct-q4f16_1-MLC',
    onProgress: (p) => console.log(`Loading: ${Math.round(p.progress * 100)}%`)
  }
});
```

---

## Error Handling Template

```javascript
async initialize() {
  try {
    // Check WebGPU support
    if (!navigator.gpu) {
      throw new Error('WebGPU not supported. Please use Chrome/Edge 113+.');
    }

    const { CreateMLCEngine } = await import('@mlc-ai/web-llm');
    
    this.engine = await CreateMLCEngine(this.model, {
      initProgressCallback: (progress) => {
        if (this.onProgress) this.onProgress(progress);
        console.log(`[WebLLM] ${progress.text}`);
      }
    });
    
    this._isReady = true;
    console.log('[WebLLM] Initialized successfully');
    
  } catch (err) {
    console.error('[WebLLM] Initialization failed:', err);
    
    // Provide helpful error messages
    if (err.message.includes('404')) {
      throw new Error(`Model "${this.model}" not found. Check model name.`);
    } else if (err.message.includes('memory')) {
      throw new Error('Not enough memory. Try a smaller model.');
    } else if (err.message.includes('WebGPU')) {
      throw new Error('WebGPU not available. Use Chrome/Edge 113+.');
    } else {
      throw new Error(`WebLLM initialization failed: ${err.message}`);
    }
  }
}
```

---

## Model Size Reference

| Model | Size | Speed | Quality | Recommended For |
|-------|------|-------|---------|-----------------|
| Llama-3.2-1B-Instruct-q4f16_1-MLC | ~1GB | Fast | Good | Testing, Mobile |
| Llama-3.2-3B-Instruct-q4f16_1-MLC | ~2.5GB | Medium | Better | Production |
| Llama-3.1-8B-Instruct-q4f16_1-MLC | ~5GB | Slow | Best | Desktop |

---

## Browser Detection Code

```javascript
// Add to useConversation or App initialization
function detectWebLLMSupport() {
  if (!navigator.gpu) {
    console.warn('WebGPU not supported, using MockAIProvider');
    return 'mock';
  }
  
  // Check memory
  if (performance.memory?.jsHeapSizeLimit < 2e9) {
    console.warn('Low memory detected, recommend smaller model or mock');
  }
  
  return 'webllm';
}

// Use it
const providerType = detectWebLLMSupport();
const conversation = useConversation({
  language: 'en',
  providerType,
  providerConfig: { 
    model: 'Llama-3.2-1B-Instruct-q4f16_1-MLC'  // Smallest for compatibility
  }
});
```

---

## Progressive Enhancement Pattern

```javascript
function ChatComponent() {
  const [providerType, setProviderType] = useState('mock');
  
  useEffect(() => {
    // Try WebLLM, fall back to mock
    if (navigator.gpu) {
      setProviderType('webllm');
    }
  }, []);
  
  const conversation = useConversation({
    language: 'en',
    providerType,
    providerConfig: {
      model: 'Llama-3.2-3B-Instruct-q4f16_1-MLC',
      onProgress: (p) => {
        console.log(`Loading model: ${Math.round(p.progress * 100)}%`);
      }
    }
  });
  
  return (
    <div>
      <p>Using: {providerType === 'webllm' ? 'AI Model' : 'Mock'}</p>
      {/* Rest of component */}
    </div>
  );
}
```

---

## Testing Checklist

```
Initialization:
□ Model downloads (first time)
□ Model loads from cache (subsequent)
□ Progress reporting works
□ Error messages are helpful
□ Fallback to mock works

Chat:
□ Responses are coherent
□ Search results included in context
□ Response time acceptable (1-3s)
□ Token count reported
□ Processing time measured

Streaming:
□ Tokens arrive progressively
□ UI updates smoothly
□ Complete message matches non-streaming
□ Error handling works

Resources:
□ dispose() cleans up properly
□ Memory doesn't leak
□ Can reinitialize after dispose

Browser Support:
□ Chrome/Edge 113+ works
□ Safari shows appropriate message
□ Firefox falls back to mock
□ Detection works correctly
```

---

## Common Issues & Solutions

### Issue: "WebGPU not supported"
**Solution:** Use Chrome/Edge 113+ or fall back to mock

### Issue: "Out of memory"
**Solution:** Use smaller model (1B instead of 3B) or increase browser memory

### Issue: "Model download stuck"
**Solution:** Check network, try clearing cache, or use different CDN

### Issue: "Slow inference"
**Solution:** Use smaller model, check GPU usage, or reduce max_tokens

### Issue: "Context too long"
**Solution:** Limit conversation history or reduce search results

---

## Performance Tips

1. **First Load Optimization**
   - Use smallest model for testing (1B)
   - Show loading UI with progress
   - Cache model aggressively

2. **Inference Optimization**
   - Keep max_tokens reasonable (500-1000)
   - Limit conversation history (last 5-10 messages)
   - Reduce search results (top 5)

3. **Memory Optimization**
   - Dispose provider when not needed
   - Clear KV cache periodically
   - Monitor memory usage

---

## Files Summary

```
📁 src/features/ai-assistant/conversation/providers/
├── 📄 IAIProvider.js           (Unchanged)
├── 📄 MockAIProvider.js        (Unchanged)
├── 📄 WebLLMProvider.js        (New - ~200 lines)
├── 📄 providerFactory.js       (Modified - 2 lines)
├── 📄 index.js                 (Modified - 1 line)
└── 📄 test.js                  (Optional - add WebLLM test)

Total changes: 1 new file + 2 modified files
```

---

## Verification Commands

```bash
# Install
npm install @mlc-ai/web-llm

# Verify installation
npm list @mlc-ai/web-llm

# Test providers
node --loader ./svg-loader.js src/features/ai-assistant/conversation/providers/test.js

# Run dev server
npm run dev
```

---

## Success Metrics

✅ Installation completes without errors  
✅ WebLLMProvider implements all 6 methods  
✅ Model initializes with progress reporting  
✅ Chat responses are coherent and relevant  
✅ Streaming works smoothly  
✅ Errors are handled gracefully  
✅ UI works without any modifications  
✅ Can switch between mock and WebLLM via config  

---

## Time Estimates

- **Installation:** 2 minutes
- **Implementation:** 30 minutes
- **Testing:** 15 minutes (+ model download ~5 min first time)
- **Integration:** 5 minutes
- **Total:** ~1 hour

---

## Next Steps After Implementation

1. ✅ Verify all tests pass
2. Update documentation
3. Add UI for provider selection (optional)
4. Add progress indicator in UI (optional)
5. Deploy and monitor performance
6. Collect user feedback
7. Optimize model size based on usage

---

**Remember:** The abstraction layer makes this easy. Just implement the interface! 🎯
