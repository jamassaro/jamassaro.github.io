# AI Model Options for News Analysis

Current model: `llama3.1:8b` (5GB)

## Better Alternatives (Similar Size)

### 1. **gemma2:9b** (~5.4GB) ⭐ RECOMMENDED
```bash
ollama pull gemma2:9b
OLLAMA_MODEL=gemma2:9b yarn analyze-news
```
- **Best for**: Factual grounding, following instructions precisely
- **Pros**: Google's model, excellent at structured tasks, less hallucination
- **Cons**: Slightly larger (5.4GB vs 5GB)

### 2. **qwen2.5:7b** (~4.7GB)
```bash
ollama pull qwen2.5:7b
OLLAMA_MODEL=qwen2.5:7b yarn analyze-news
```
- **Best for**: Following complex instructions, JSON generation
- **Pros**: Alibaba's model, very good at structured outputs
- **Cons**: Less known, but performs well

### 3. **mistral:7b** (~4GB)
```bash
ollama pull mistral:7b
OLLAMA_MODEL=mistral:7b yarn analyze-news
```
- **Best for**: General purpose analysis
- **Pros**: Popular, well-tested, smaller size
- **Cons**: Not as strong at factual grounding as gemma2

## What We Fixed (Works with Any Model)

### 1. Temperature Reduction
- Changed from `0.7` → `0.2`
- **Impact**: Much less "creative hallucination", more factual

### 2. Prompt Restructuring
- Moved critical rules to the top
- Added ⚠️ warning symbols for emphasis
- Simplified instructions

### 3. Post-Processing Validation
- Detects misattributions (WhatsApp ≠ Apple)
- Flags invented recommendations
- Checks trends have 3+ article support
- Warns about unsupported integration claims

## Testing Your Changes

Run the analysis again:
```bash
OLLAMA_HOST=http://host.docker.internal:11434 yarn analyze-news
```

You should now see warnings like:
```
⚠️  QUALITY WARNINGS DETECTED:
   ⚠️  Possible misattribution: "Apple Introduces..." - WhatsApp features are not Apple features
   ⚠️  Invented technical detail: CI/CD mentioned but not in articles
   ⚠️  Weak trend: "Major Acquisitions" appears in only 1 article(s), needs 3+
```

## Expected Improvements

With current fixes + better model:
- ✅ Fewer misattributions
- ✅ Less speculation presented as fact
- ✅ More accurate trend detection
- ✅ Grounded technical insights
- ✅ Better distinction between confirmed facts vs questions

## If You Want Even Better Quality

Consider these larger models (requires more RAM):
- `mistral-nemo:latest` (~12GB) - Much better reasoning
- `llama3.1:70b` (~40GB) - Best quality, but very large
