# AI News Analysis

This module adds AI-powered analysis to the news aggregation pipeline using Ollama.

## Architecture

```
scripts/
├── analyze-news.ts              # Main orchestrator
├── ai/
│   ├── ollama-client.ts        # Ollama API wrapper
│   ├── prompt-builder.ts       # Prompt construction
│   └── response-parser.ts      # Response validation
└── types/
    └── analysis.ts             # TypeScript interfaces
```

## Local Testing

### Prerequisites

1. **Install Ollama**
   ```bash
   # macOS/Linux
   curl -fsSL https://ollama.com/install.sh | sh
   
   # Or download from: https://ollama.com
   ```

2. **Start Ollama server**
   ```bash
   ollama serve
   ```

3. **Pull the AI model**
   ```bash
   ollama pull llama3.2:1b
   ```

### Run Analysis

```bash
# Make sure news.json exists first
yarn fetch-news

# Run AI analysis
yarn analyze-news
```

### Expected Output

The script will:
1. Connect to Ollama (localhost:11434)
2. Verify the model is available
3. Load articles from `public/news.json`
4. Generate AI analysis (2-4 minutes)
5. Save results to `public/analysis.json`

## Output Format

```json
{
  "generatedAt": "2026-08-02T...",
  "executiveSummary": "Overview of today's tech landscape",
  "takeaways": [
    {
      "title": "Trend name",
      "description": "Why it matters"
    }
  ],
  "trends": ["AI", "Apple", "Hardware"],
  "worthWatching": ["Future trend 1", "Future trend 2"],
  "engineeringPerspective": [
    "Insight 1",
    "Insight 2"
  ],
  "statistics": {
    "totalArticles": 30,
    "totalSources": 4,
    "mostMentionedTopics": ["AI", "Apple", "iPhone"]
  }
}
```

## Model Selection

Current model: `llama3.2:1b` (~1.3GB)

**Alternative models:**
- `llama3.2:3b` - Better quality, slower (3GB)
- `phi3:mini` - Alternative option (2.3GB)
- `qwen2.5:0.5b` - Fastest, lower quality (500MB)

To change model, edit `MODEL` in `scripts/ai/ollama-client.ts`

## Troubleshooting

### "Ollama server not available"
- Make sure `ollama serve` is running
- Check: `curl http://localhost:11434/api/tags`

### "Model not available"
- Run: `ollama pull llama3.2:1b`
- Verify: `ollama list`

### "Analysis takes too long"
- Expected: 2-4 minutes on CPU
- Try smaller model: `qwen2.5:0.5b`
- Check system resources

### "Invalid JSON response"
- The prompt is engineered to return valid JSON
- Check model output in error logs
- Try regenerating (may be a one-time issue)

## GitHub Actions

The workflow will:
1. Install Ollama on Ubuntu runner
2. Pull and cache the model (~1.3GB)
3. Run analysis after news fetch
4. Commit both news.json and analysis.json

First run: ~6 minutes (download model)
Subsequent runs: ~4 minutes (cached model)

## Cost

- **Compute:** $0 (runs on GitHub Actions free tier)
- **Storage:** ~1.3GB (model cache)
- **API:** $0 (no external API calls)

## Next Steps

After Phase 1 is working:
- Phase 2: GitHub Actions integration
- Phase 3: Frontend data hook
- Phase 4: UI components
