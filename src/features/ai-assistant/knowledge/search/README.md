# Knowledge Search System

A flexible, extensible search system for querying portfolio knowledge base using keyword-based matching.

## Features

- 🔍 **Keyword Search**: Fast term-based matching with intelligent scoring
- 🎯 **Smart Scoring**: Exact match, term frequency, and metadata bonuses
- 📊 **Result Ranking**: Automatic filtering, sorting, and limiting
- 🔌 **Strategy Pattern**: Pluggable search algorithms (extensible for embeddings)
- ⚡ **Performance**: Optimized for ~100 chunks with <10ms search times
- 🌐 **Multi-language**: Works with English and Spanish knowledge bases

## Architecture

### Strategy Pattern
```
ISearchStrategy (Interface)
    ↓
BaseSearchStrategy (Abstract)
    ↓
KeywordSearchStrategy (Concrete)
```

Future strategies: `EmbeddingSearchStrategy`, `HybridSearchStrategy`

### Components

- **Interfaces** (`interfaces/`): Type definitions and contracts
- **Strategies** (`strategies/`): Search algorithm implementations
- **Services** (`services/`): Main search orchestration
- **Utils** (`utils/`): Text processing and ranking utilities
- **Constants** (`constants.js`): Configuration and weights

## Usage

### Quick Search

```javascript
import { quickSearch } from './search/index.js';

// Simple one-liner search
const results = await quickSearch('React TypeScript experience');

results.forEach(result => {
  console.log(result.chunk.title, result.score);
});
```

### Full Service

```javascript
import { createSearchService } from './search/index.js';

// Create search service
const service = await createSearchService('en');

// Search with options
const results = await service.search('backend API development', {
  maxResults: 5,
  minScore: 0.3,
  filterCategory: 'expertise',
  filterTechnologies: ['Node.js', 'TypeScript'],
});

// Get statistics
console.log(service.getStats());
// {
//   totalChunks: 23,
//   totalDocuments: 13,
//   language: 'en',
//   strategy: 'keyword',
//   categories: { expertise: 5, projects: 10, ventures: 8 }
// }
```

### Advanced: Strategy Switching

```javascript
import { KnowledgeSearchService } from './search/index.js';
import { KeywordSearchStrategy } from './search/strategies/index.js';
import { buildKnowledge } from '../builders/knowledgeBuilder.js';

// Build knowledge base
const knowledgeBase = buildKnowledge('en');

// Create custom strategy with config
const strategy = new KeywordSearchStrategy({
  maxResults: 20,
  minScore: 0.2,
});

// Create service with custom strategy
const service = new KnowledgeSearchService(knowledgeBase, strategy);

// Later: switch strategy at runtime
// const embeddingStrategy = new EmbeddingSearchStrategy();
// service.setStrategy(embeddingStrategy);
```

## Search Options

```typescript
interface SearchOptions {
  maxResults?: number;       // Maximum results (default: 10)
  minScore?: number;         // Minimum score threshold (default: 0.1)
  filterCategory?: string;   // Filter by category (e.g., 'expertise')
  filterDomain?: string;     // Filter by domain (e.g., 'frontend')
  filterTechnologies?: string[]; // Filter by technologies (e.g., ['React', 'TypeScript'])
}
```

## Search Results

```typescript
interface SearchResult {
  chunk: KnowledgeChunk;     // Matched knowledge chunk
  score: number;             // Relevance score (0-1)
  matches: {
    terms: string[];         // Matched keywords
    locations: Object;       // Term positions
    exactMatch: boolean;     // Exact phrase match
    partialMatches: number;  // Count of partial matches
    highlight: string;       // Highlighted excerpt
  };
  metadata: {
    strategy: string;        // Strategy name
    timestamp: string;       // ISO timestamp
    processingTime: number;  // Search duration (ms)
  };
}
```

## Scoring Algorithm

### Keyword Search Scoring

1. **Exact Match** (score = 1.0)
   - Entire question phrase found in content

2. **Term Matching** (base score = 0.3-0.7)
   - Per-term score based on frequency
   - Diminishing returns for multiple occurrences

3. **All Terms Bonus** (multiplier = 0.8)
   - Applied when all keywords match

4. **Metadata Bonuses**
   - Category match: +0.1
   - Technology match: +0.1 per tech
   - Domain match: +0.05
   - Jaccard similarity: +0.1 (max)

5. **Final Score** = min(1.0, base + bonuses)

### Score Ranges

- `1.0`: Exact phrase match
- `0.7-0.9`: All terms + multiple bonuses
- `0.5-0.7`: All terms + some bonuses
- `0.3-0.5`: Partial term matches
- `0.1-0.3`: Weak matches (filtered out by default)

## Configuration

### Search Config (`constants.js`)

```javascript
export const SEARCH_CONFIG = {
  DEFAULT_MAX_RESULTS: 10,
  MIN_SCORE_THRESHOLD: 0.1,
  
  WEIGHTS: {
    EXACT_MATCH: 1.0,
    ALL_TERMS_MATCH: 0.8,
    PARTIAL_MATCH_BASE: 0.3,
    CATEGORY_BONUS: 0.1,
    TECHNOLOGY_BONUS: 0.1,
    DOMAIN_BONUS: 0.05,
  },
  
  MIN_KEYWORD_LENGTH: 3,
  MAX_HIGHLIGHT_LENGTH: 200,
};
```

### Stop Words

Common words filtered from queries: 'a', 'an', 'the', 'is', 'are', 'what', 'how', etc.

### Technical Terms

Preserved during filtering: React, TypeScript, Node.js, Python, AWS, etc.

## Testing

```bash
# Run all tests
node src/features/ai-assistant/knowledge/search/test.js

# In browser (ESM)
<script type="module">
  import { testSearchSystem } from './search/test.js';
  await testSearchSystem();
</script>
```

## Design Principles

### Single Responsibility Principle (SRP)

- **Constants**: Configuration only
- **Interfaces**: Type contracts only
- **Strategies**: Search algorithms only
- **Services**: Orchestration only
- **Utils**: Reusable functions only

### Don't Repeat Yourself (DRY)

- Shared filtering/sorting in `BaseSearchStrategy`
- Reusable text processing in `textProcessor.js`
- Centralized scoring utilities in `rankingUtils.js`

### Open/Closed Principle

- Open for extension: Add new strategies
- Closed for modification: Existing strategies stable

## Future Extensions

### Embedding Search (Planned)

```javascript
import { EmbeddingSearchStrategy } from './strategies/index.js';

const strategy = new EmbeddingSearchStrategy({
  model: 'text-embedding-3-small',
  dimensions: 1536,
});

service.setStrategy(strategy);
```

### Hybrid Search (Planned)

```javascript
import { HybridSearchStrategy } from './strategies/index.js';

const strategy = new HybridSearchStrategy({
  keywordWeight: 0.4,
  embeddingWeight: 0.6,
});
```

## Performance

- **Search Time**: <10ms for ~100 chunks (keyword search)
- **Memory**: ~500KB for complete knowledge base
- **Scalability**: Linear O(n) with chunk count

## Dependencies

- Knowledge Layer: `../builders/knowledgeBuilder.js`
- Utilities: `../utils/normalize.js`
- No external dependencies (pure JS)

## File Structure

```
search/
├── index.js                          # Public API
├── constants.js                      # Configuration
├── test.js                           # Test suite
├── README.md                         # Documentation
├── interfaces/
│   ├── ISearchStrategy.js            # Strategy interface
│   ├── IKnowledgeSearchService.js    # Service interface
│   ├── ISearchResult.js              # Result types
│   └── index.js
├── strategies/
│   ├── BaseSearchStrategy.js         # Abstract base
│   ├── KeywordSearchStrategy.js      # Keyword implementation
│   └── index.js
├── services/
│   ├── KnowledgeSearchService.js     # Main service
│   └── index.js
└── utils/
    ├── textProcessor.js              # Text utilities
    ├── rankingUtils.js               # Scoring utilities
    └── index.js
```

## Examples

### Example 1: Basic Search

```javascript
const results = await quickSearch('React experience');
// Returns chunks about React expertise, sorted by relevance
```

### Example 2: Filtered Search

```javascript
const service = await createSearchService('en');
const results = await service.search('API development', {
  filterDomain: 'backend',
  filterTechnologies: ['Node.js'],
  maxResults: 3,
});
```

### Example 3: Multi-language

```javascript
// English
const enService = await createSearchService('en');
const enResults = await enService.search('React experience');

// Spanish
const esService = await createSearchService('es');
const esResults = await esService.search('experiencia en React');
```

## Troubleshooting

### No Results

1. Check stop words - short/common words are filtered
2. Verify keywords are >= 3 characters
3. Lower `minScore` threshold
4. Check category/technology filters

### Low Scores

1. Increase keyword specificity
2. Use technical terms (React, TypeScript, etc.)
3. Match chunk categories/technologies
4. Use exact phrases for best scores

### Performance Issues

1. Reduce `maxResults` limit
2. Increase `minScore` threshold
3. Apply category filters early

## Contributing

When adding new strategies:

1. Extend `BaseSearchStrategy`
2. Implement `search()` and `getName()`
3. Add strategy to `SEARCH_STRATEGIES`
4. Update factory in `index.js`
5. Add tests in `test.js`

---

**Status**: ✅ Production Ready (Keyword Search)  
**Version**: 1.0.0  
**Last Updated**: 2024
