# Knowledge Search System - Architecture Plan

## 🎯 Objective

Build a **simple, extensible search system** for the Knowledge Layer that:
- Starts with **keyword-based search** (no embeddings)
- Uses **abstract interfaces** for future extensibility
- Can be **easily replaced** with embedding search later
- Returns **ranked, relevant results**
- Follows **SRP** and **separation of concerns**

---

## 🏗️ Architecture Design

### Design Principles

1. **Interface Segregation** - Define interfaces, not implementations
2. **Strategy Pattern** - Pluggable search algorithms
3. **Dependency Injection** - Service receives strategy, not creates it
4. **Open/Closed** - Open for extension (new strategies), closed for modification

### High-Level Flow

```
User Question
     ↓
KnowledgeSearchService
     ↓
ISearchStrategy (interface)
     ↓
KeywordSearchStrategy (implementation)
     ↓
Knowledge Chunks
     ↓
Ranked Results
```

---

## 📂 File Structure

```
knowledge/
├── search/
│   ├── interfaces/
│   │   ├── IKnowledgeSearchService.js     # Service interface
│   │   ├── ISearchStrategy.js              # Strategy interface
│   │   ├── ISearchResult.js                # Result interface
│   │   └── index.js
│   │
│   ├── strategies/
│   │   ├── BaseSearchStrategy.js           # Abstract base class
│   │   ├── KeywordSearchStrategy.js        # Keyword implementation
│   │   └── index.js
│   │   # Future: EmbeddingSearchStrategy.js
│   │
│   ├── services/
│   │   ├── KnowledgeSearchService.js       # Main service
│   │   └── index.js
│   │
│   ├── utils/
│   │   ├── textProcessor.js                # Tokenization, normalization
│   │   ├── rankingUtils.js                 # Scoring functions
│   │   └── index.js
│   │
│   ├── constants.js                        # Search configuration
│   └── index.js                            # Public API
│
└── (existing files...)
```

---

## 📐 Interface Definitions

### 1. ISearchStrategy

Abstract interface for search algorithms.

```javascript
/**
 * @interface ISearchStrategy
 * 
 * Abstract interface for search strategies.
 * Any search algorithm (keyword, embedding, hybrid) must implement this.
 */
export class ISearchStrategy {
  /**
   * Search knowledge chunks with a question
   * 
   * @param {string} question - User question
   * @param {KnowledgeChunk[]} chunks - All knowledge chunks
   * @param {SearchOptions} options - Search configuration
   * @returns {Promise<SearchResult[]>} Ranked search results
   */
  async search(question, chunks, options) {
    throw new Error('search() must be implemented by subclass');
  }

  /**
   * Get strategy name
   * 
   * @returns {string} Strategy name
   */
  getName() {
    throw new Error('getName() must be implemented by subclass');
  }
}
```

### 2. IKnowledgeSearchService

Abstract interface for the search service.

```javascript
/**
 * @interface IKnowledgeSearchService
 * 
 * Abstract interface for knowledge search service.
 * Decouples consumer from specific strategy implementation.
 */
export class IKnowledgeSearchService {
  /**
   * Search knowledge with a question
   * 
   * @param {string} question - User question
   * @param {SearchOptions} options - Search options
   * @returns {Promise<SearchResult[]>} Top matching results
   */
  async search(question, options) {
    throw new Error('search() must be implemented by subclass');
  }

  /**
   * Set the search strategy
   * 
   * @param {ISearchStrategy} strategy - Search strategy to use
   */
  setStrategy(strategy) {
    throw new Error('setStrategy() must be implemented by subclass');
  }

  /**
   * Get current strategy name
   * 
   * @returns {string} Strategy name
   */
  getStrategyName() {
    throw new Error('getStrategyName() must be implemented by subclass');
  }
}
```

### 3. ISearchResult

Result interface.

```javascript
/**
 * @typedef {Object} SearchResult
 * @property {KnowledgeChunk} chunk - The matched knowledge chunk
 * @property {number} score - Relevance score (0-1)
 * @property {Object} matches - Match details
 * @property {string[]} matches.terms - Matched terms
 * @property {Object} matches.locations - Where terms were found
 * @property {string} matches.highlight - Content with highlights
 * @property {Object} metadata - Additional search metadata
 */
```

---

## 🔄 Strategy Pattern Implementation

### BaseSearchStrategy (Abstract)

```javascript
/**
 * Base class for search strategies
 * Provides common functionality
 */
export class BaseSearchStrategy extends ISearchStrategy {
  constructor(config = {}) {
    super();
    this.config = {
      maxResults: config.maxResults || 10,
      minScore: config.minScore || 0.1,
      ...config
    };
  }

  /**
   * Filter results by minimum score
   */
  filterByScore(results) {
    return results.filter(r => r.score >= this.config.minScore);
  }

  /**
   * Sort results by score descending
   */
  sortByScore(results) {
    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Limit results to max count
   */
  limitResults(results) {
    return results.slice(0, this.config.maxResults);
  }

  /**
   * Post-process results (filter, sort, limit)
   */
  postProcess(results) {
    return this.limitResults(
      this.sortByScore(
        this.filterByScore(results)
      )
    );
  }
}
```

### KeywordSearchStrategy (Concrete)

```javascript
/**
 * Simple keyword-based search strategy
 * 
 * Scoring:
 * - Exact phrase match: 1.0
 * - All terms match: 0.8
 * - Partial match: 0.3-0.7 (based on term count)
 * - Category match bonus: +0.1
 * - Technology match bonus: +0.1
 * - Domain match bonus: +0.05
 */
export class KeywordSearchStrategy extends BaseSearchStrategy {
  getName() {
    return 'keyword';
  }

  async search(question, chunks, options = {}) {
    // 1. Normalize and tokenize question
    const tokens = this.tokenize(question);
    
    // 2. Score each chunk
    const results = chunks.map(chunk => 
      this.scoreChunk(chunk, tokens, question)
    );

    // 3. Post-process (filter, sort, limit)
    return this.postProcess(results);
  }

  /**
   * Tokenize question into search terms
   */
  tokenize(question) {
    // Normalize, remove stop words, extract keywords
    return extractKeywords(question);
  }

  /**
   * Score a single chunk against search tokens
   */
  scoreChunk(chunk, tokens, originalQuestion) {
    let score = 0;
    const matches = {
      terms: [],
      locations: {},
      exactMatch: false,
      partialMatches: 0
    };

    // Check for exact phrase match
    if (this.hasExactMatch(chunk.content, originalQuestion)) {
      score = 1.0;
      matches.exactMatch = true;
    } else {
      // Calculate term-based score
      score = this.calculateTermScore(chunk, tokens, matches);
    }

    // Apply bonuses
    score += this.calculateBonuses(chunk, tokens);

    // Ensure score is in [0, 1]
    score = Math.min(1.0, Math.max(0, score));

    return {
      chunk,
      score,
      matches,
      metadata: {
        strategy: 'keyword',
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Calculate term-based score
   */
  calculateTermScore(chunk, tokens, matches) {
    const content = chunk.content.toLowerCase();
    let matchedTerms = 0;

    tokens.forEach(token => {
      if (content.includes(token)) {
        matchedTerms++;
        matches.terms.push(token);
        matches.locations[token] = content.indexOf(token);
      }
    });

    matches.partialMatches = matchedTerms;

    // Score based on percentage of terms matched
    if (matchedTerms === 0) return 0;
    if (matchedTerms === tokens.length) return 0.8; // All terms
    
    return 0.3 + (matchedTerms / tokens.length) * 0.4; // Partial
  }

  /**
   * Calculate bonus scores
   */
  calculateBonuses(chunk, tokens) {
    let bonus = 0;

    // Category match bonus
    if (this.hasCategoryMatch(chunk, tokens)) {
      bonus += 0.1;
    }

    // Technology match bonus
    if (this.hasTechnologyMatch(chunk, tokens)) {
      bonus += 0.1;
    }

    // Domain match bonus
    if (this.hasDomainMatch(chunk, tokens)) {
      bonus += 0.05;
    }

    return bonus;
  }
}
```

---

## 🔧 Utility Functions

### textProcessor.js

```javascript
/**
 * Extract keywords from question
 * 
 * @param {string} text - Input text
 * @returns {string[]} Keywords
 */
export function extractKeywords(text) {
  // 1. Normalize
  const normalized = normalizeText(text);
  
  // 2. Tokenize
  const tokens = normalized.toLowerCase().split(/\s+/);
  
  // 3. Remove stop words
  const filtered = removeStopWords(tokens);
  
  // 4. Extract technical terms (preserve case)
  const technical = extractTechnicalTerms(text);
  
  return [...new Set([...filtered, ...technical])];
}

/**
 * Common English stop words
 */
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were',
  'i', 'you', 'he', 'she', 'it', 'we', 'they',
  'what', 'which', 'who', 'when', 'where', 'why', 'how',
  'can', 'could', 'would', 'should', 'do', 'does', 'did',
  'have', 'has', 'had', 'be', 'been', 'being',
  'to', 'from', 'in', 'on', 'at', 'by', 'for', 'with',
  'about', 'tell', 'me', 'your', 'my'
]);

/**
 * Remove stop words
 */
export function removeStopWords(tokens) {
  return tokens.filter(token => 
    !STOP_WORDS.has(token) && token.length > 2
  );
}

/**
 * Extract technical terms (preserve case)
 */
export function extractTechnicalTerms(text) {
  const techPattern = /\b(React|TypeScript|JavaScript|Python|Node\.js|Next\.js|AWS|GCP|Docker|PostgreSQL|AI|ML|API|REST|GraphQL|CSS|HTML|SQL)\b/g;
  const matches = text.match(techPattern);
  return matches ? [...new Set(matches.map(m => m.toLowerCase()))] : [];
}

/**
 * Highlight matched terms in text
 */
export function highlightMatches(text, terms, maxLength = 200) {
  let highlighted = text;
  
  // Find first match location
  let firstMatchIndex = -1;
  for (const term of terms) {
    const index = text.toLowerCase().indexOf(term.toLowerCase());
    if (index !== -1 && (firstMatchIndex === -1 || index < firstMatchIndex)) {
      firstMatchIndex = index;
    }
  }

  // Extract context around match
  if (firstMatchIndex !== -1) {
    const start = Math.max(0, firstMatchIndex - 50);
    const end = Math.min(text.length, firstMatchIndex + maxLength);
    highlighted = (start > 0 ? '...' : '') + 
                  text.slice(start, end) + 
                  (end < text.length ? '...' : '');
  } else {
    // No match, just truncate
    highlighted = text.slice(0, maxLength) + (text.length > maxLength ? '...' : '');
  }

  // Wrap matched terms in markers
  terms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    highlighted = highlighted.replace(regex, '**$1**');
  });

  return highlighted;
}
```

### rankingUtils.js

```javascript
/**
 * Calculate BM25 score (optional, for advanced ranking)
 */
export function calculateBM25(termFreq, docLength, avgDocLength, totalDocs, docsWithTerm) {
  const k1 = 1.5;
  const b = 0.75;
  
  const idf = Math.log((totalDocs - docsWithTerm + 0.5) / (docsWithTerm + 0.5) + 1);
  const tf = (termFreq * (k1 + 1)) / (termFreq + k1 * (1 - b + b * (docLength / avgDocLength)));
  
  return idf * tf;
}

/**
 * Calculate Jaccard similarity
 */
export function jaccardSimilarity(set1, set2) {
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

/**
 * Calculate cosine similarity (for token sets)
 */
export function cosineSimilarity(tokens1, tokens2) {
  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);
  
  const intersection = [...set1].filter(x => set2.has(x)).length;
  const magnitude = Math.sqrt(set1.size * set2.size);
  
  return magnitude > 0 ? intersection / magnitude : 0;
}
```

---

## 🎯 Service Implementation

### KnowledgeSearchService

```javascript
/**
 * Main search service
 * Uses Strategy pattern to delegate to search algorithms
 */
export class KnowledgeSearchService extends IKnowledgeSearchService {
  /**
   * @param {ISearchStrategy} strategy - Search strategy to use
   * @param {KnowledgeBase} knowledgeBase - Knowledge base (documents + chunks)
   */
  constructor(strategy, knowledgeBase) {
    super();
    this.strategy = strategy;
    this.knowledgeBase = knowledgeBase;
  }

  /**
   * Search knowledge with a question
   */
  async search(question, options = {}) {
    // Validate input
    if (!question || typeof question !== 'string') {
      throw new Error('Question must be a non-empty string');
    }

    // Ensure we have chunks
    if (!this.knowledgeBase?.chunks || this.knowledgeBase.chunks.length === 0) {
      console.warn('No knowledge chunks available');
      return [];
    }

    // Delegate to strategy
    const results = await this.strategy.search(
      question,
      this.knowledgeBase.chunks,
      options
    );

    // Add highlights
    results.forEach(result => {
      result.matches.highlight = highlightMatches(
        result.chunk.content,
        result.matches.terms
      );
    });

    return results;
  }

  /**
   * Set search strategy (allows runtime switching)
   */
  setStrategy(strategy) {
    if (!(strategy instanceof ISearchStrategy)) {
      throw new Error('Strategy must implement ISearchStrategy');
    }
    this.strategy = strategy;
  }

  /**
   * Get current strategy name
   */
  getStrategyName() {
    return this.strategy.getName();
  }

  /**
   * Update knowledge base (for dynamic updates)
   */
  updateKnowledgeBase(knowledgeBase) {
    this.knowledgeBase = knowledgeBase;
  }
}
```

---

## 📊 Configuration

### constants.js

```javascript
/**
 * Search configuration constants
 */

export const SEARCH_CONFIG = {
  // Result limits
  DEFAULT_MAX_RESULTS: 10,
  MIN_SCORE_THRESHOLD: 0.1,
  
  // Scoring weights
  WEIGHTS: {
    EXACT_MATCH: 1.0,
    ALL_TERMS_MATCH: 0.8,
    PARTIAL_MATCH_BASE: 0.3,
    PARTIAL_MATCH_MAX: 0.7,
    CATEGORY_BONUS: 0.1,
    TECHNOLOGY_BONUS: 0.1,
    DOMAIN_BONUS: 0.05,
  },
  
  // Text processing
  MIN_KEYWORD_LENGTH: 3,
  MAX_HIGHLIGHT_LENGTH: 200,
  CONTEXT_CHARS: 50,
};

export const SEARCH_STRATEGIES = {
  KEYWORD: 'keyword',
  EMBEDDING: 'embedding', // Future
  HYBRID: 'hybrid',       // Future
};
```

---

## 🎯 Public API

### index.js

```javascript
/**
 * Knowledge Search - Public API
 */

// Interfaces
export { IKnowledgeSearchService } from './interfaces/IKnowledgeSearchService.js';
export { ISearchStrategy } from './interfaces/ISearchStrategy.js';

// Services
export { KnowledgeSearchService } from './services/KnowledgeSearchService.js';

// Strategies
export { KeywordSearchStrategy } from './strategies/KeywordSearchStrategy.js';

// Utils
export {
  extractKeywords,
  highlightMatches,
  removeStopWords,
} from './utils/textProcessor.js';

// Constants
export { SEARCH_CONFIG, SEARCH_STRATEGIES } from './constants.js';

/**
 * Factory function to create search service with default strategy
 */
export function createSearchService(knowledgeBase, strategyType = 'keyword') {
  let strategy;
  
  switch (strategyType) {
    case 'keyword':
      strategy = new KeywordSearchStrategy();
      break;
    // Future: case 'embedding': ...
    default:
      throw new Error(`Unknown strategy type: ${strategyType}`);
  }
  
  return new KnowledgeSearchService(strategy, knowledgeBase);
}
```

---

## 🧪 Usage Examples

### Example 1: Basic Search

```javascript
import { buildKnowledge } from '@/features/ai-assistant/knowledge';
import { createSearchService } from '@/features/ai-assistant/knowledge/search';

// Build knowledge base
const knowledge = await buildKnowledge('en');

// Create search service (default: keyword strategy)
const searchService = createSearchService(knowledge);

// Search
const results = await searchService.search('What is your React experience?');

console.log(`Found ${results.length} results`);
results.forEach(result => {
  console.log(`Score: ${result.score.toFixed(2)}`);
  console.log(`Content: ${result.matches.highlight}`);
  console.log(`Matched terms: ${result.matches.terms.join(', ')}`);
});
```

### Example 2: Custom Strategy Configuration

```javascript
import { KeywordSearchStrategy, KnowledgeSearchService } from '@/features/ai-assistant/knowledge/search';

// Create custom strategy with config
const strategy = new KeywordSearchStrategy({
  maxResults: 5,
  minScore: 0.3,
});

// Create service with custom strategy
const searchService = new KnowledgeSearchService(strategy, knowledge);

// Search
const results = await searchService.search('TypeScript and Next.js projects');
```

### Example 3: Runtime Strategy Switching

```javascript
// Start with keyword search
const searchService = createSearchService(knowledge, 'keyword');

// Use keyword search
let results = await searchService.search('AI projects');
console.log(`Strategy: ${searchService.getStrategyName()}`); // 'keyword'

// Later: Switch to embedding search (future)
// const embeddingStrategy = new EmbeddingSearchStrategy();
// searchService.setStrategy(embeddingStrategy);
// results = await searchService.search('AI projects');
// console.log(`Strategy: ${searchService.getStrategyName()}`); // 'embedding'
```

### Example 4: Filtered Search

```javascript
// Search with category filter
const results = await searchService.search('React experience', {
  filterCategory: 'expertise',
  filterDomain: 'frontend',
});

// Search with technology filter
const results = await searchService.search('database', {
  filterTechnologies: ['PostgreSQL', 'MongoDB'],
});
```

---

## 🔮 Future Extension: Embedding Search

When ready to add embedding search, create:

```javascript
/**
 * Embedding-based search strategy (FUTURE)
 */
export class EmbeddingSearchStrategy extends BaseSearchStrategy {
  constructor(embeddingModel, config = {}) {
    super(config);
    this.embeddingModel = embeddingModel;
  }

  getName() {
    return 'embedding';
  }

  async search(question, chunks, options = {}) {
    // 1. Generate question embedding
    const questionEmbedding = await this.embeddingModel.embed(question);
    
    // 2. Calculate similarity with each chunk
    const results = chunks.map(chunk => ({
      chunk,
      score: this.cosineSimilarity(questionEmbedding, chunk.embedding),
      matches: { strategy: 'embedding' },
      metadata: { strategy: 'embedding' }
    }));

    // 3. Post-process
    return this.postProcess(results);
  }

  cosineSimilarity(vec1, vec2) {
    // Vector math...
  }
}
```

**No changes to consumer code needed!** Just swap the strategy:

```javascript
const embeddingStrategy = new EmbeddingSearchStrategy(model);
searchService.setStrategy(embeddingStrategy);
```

---

## 📋 Implementation Checklist

### Phase 1: Interfaces
- [ ] Create `interfaces/ISearchStrategy.js`
- [ ] Create `interfaces/IKnowledgeSearchService.js`
- [ ] Create `interfaces/ISearchResult.js`
- [ ] Create `interfaces/index.js`

### Phase 2: Utilities
- [ ] Create `utils/textProcessor.js`
  - [ ] `extractKeywords()`
  - [ ] `removeStopWords()`
  - [ ] `extractTechnicalTerms()`
  - [ ] `highlightMatches()`
- [ ] Create `utils/rankingUtils.js`
  - [ ] `jaccardSimilarity()`
  - [ ] `cosineSimilarity()`
- [ ] Create `utils/index.js`

### Phase 3: Base Strategy
- [ ] Create `strategies/BaseSearchStrategy.js`
  - [ ] `filterByScore()`
  - [ ] `sortByScore()`
  - [ ] `limitResults()`
  - [ ] `postProcess()`

### Phase 4: Keyword Strategy
- [ ] Create `strategies/KeywordSearchStrategy.js`
  - [ ] `search()` - Main search logic
  - [ ] `tokenize()` - Question tokenization
  - [ ] `scoreChunk()` - Chunk scoring
  - [ ] `calculateTermScore()` - Term matching
  - [ ] `calculateBonuses()` - Bonus scoring
  - [ ] Helper methods for matching
- [ ] Create `strategies/index.js`

### Phase 5: Service
- [ ] Create `services/KnowledgeSearchService.js`
  - [ ] `search()` - Main API
  - [ ] `setStrategy()` - Strategy switching
  - [ ] `getStrategyName()` - Introspection
  - [ ] `updateKnowledgeBase()` - Dynamic updates
- [ ] Create `services/index.js`

### Phase 6: Configuration & API
- [ ] Create `constants.js`
- [ ] Create `index.js` (public API)
- [ ] Create factory function `createSearchService()`

### Phase 7: Testing
- [ ] Create `search/test.js`
  - [ ] Test keyword search
  - [ ] Test scoring
  - [ ] Test filtering
  - [ ] Test highlighting
- [ ] Create `search/demo.js`
  - [ ] Interactive search demo

### Phase 8: Documentation
- [ ] Create `search/README.md`
- [ ] Update main `knowledge/README.md`

---

## 🎯 Success Criteria

✅ **Functional Requirements**
- [ ] Search returns relevant results for typical questions
- [ ] Exact matches score highest
- [ ] Partial matches score proportionally
- [ ] Technology/category matches get bonuses
- [ ] Results are ranked by relevance
- [ ] Top N results returned

✅ **Non-Functional Requirements**
- [ ] Search response < 100ms for 50 chunks
- [ ] Abstract interfaces allow strategy swapping
- [ ] Zero changes needed to add embedding search
- [ ] Clear separation: interfaces vs implementations
- [ ] Comprehensive documentation

✅ **Code Quality**
- [ ] Follows SRP (Single Responsibility Principle)
- [ ] Follows DRY (Don't Repeat Yourself)
- [ ] Uses Strategy pattern correctly
- [ ] Proper error handling
- [ ] JSDoc documentation
- [ ] Zero linting errors

---

## 📊 Expected Performance

### Keyword Search (50 chunks)
- Search time: ~10-50ms
- Memory: ~1MB
- Accuracy: 70-80% for exact/partial matches

### Future Embedding Search (50 chunks)
- Search time: ~50-200ms (including embedding generation)
- Memory: ~5-10MB (embeddings)
- Accuracy: 85-95% (semantic understanding)

---

## 🔮 Future Enhancements (Out of Scope)

1. **Hybrid Search** - Combine keyword + embedding
2. **Query Expansion** - Synonyms, related terms
3. **Fuzzy Matching** - Handle typos
4. **Phrase Matching** - Quoted phrases
5. **Field-Specific Search** - Search only titles, etc.
6. **Result Caching** - Cache frequent queries
7. **Search Analytics** - Track search patterns
8. **Auto-complete** - Suggest queries
9. **Faceted Search** - Filter by category/domain/tech
10. **Relevance Feedback** - Learn from user clicks

---

## 📚 Related Documentation

- [Knowledge Layer README](../README.md)
- [Knowledge Builder](../builders/knowledgeBuilder.js)
- [Strategy Pattern](https://refactoring.guru/design-patterns/strategy)

---

## ✅ Design Review

### Architecture Strengths

✅ **Abstraction** - Interfaces allow any search algorithm  
✅ **Extensibility** - Add new strategies without changing service  
✅ **Testability** - Each component testable in isolation  
✅ **Maintainability** - Clear separation of concerns  
✅ **Performance** - Lightweight keyword search, scalable to embeddings  

### Design Trade-offs

⚖️ **Simplicity vs Features** - Start simple, add complexity later  
⚖️ **Speed vs Accuracy** - Keyword fast but less accurate than embeddings  
⚖️ **Memory vs Accuracy** - Embeddings need more memory but better results  

---

**Knowledge Search System Plan Complete** 🔍✨

Ready to implement when approved!
