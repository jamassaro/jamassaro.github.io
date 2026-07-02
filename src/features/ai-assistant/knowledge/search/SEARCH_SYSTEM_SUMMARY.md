# Knowledge Search System - Quick Summary

## 🎯 What We're Building

A **simple, pluggable search system** that:
- Starts with keyword search (no embeddings)
- Uses abstract interfaces (easy to extend)
- Returns ranked, relevant results
- Can be replaced with embedding search later

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    User Question                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         KnowledgeSearchService (Concrete)                │
│  ┌─────────────────────────────────────────────────┐   │
│  │  IKnowledgeSearchService (Interface)            │   │
│  │  - search(question, options)                    │   │
│  │  - setStrategy(strategy)                        │   │
│  │  - getStrategyName()                            │   │
│  └─────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              ISearchStrategy (Interface)                 │
│  - search(question, chunks, options)                     │
│  - getName()                                             │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────────┐   ┌──────────────────────┐
│ KeywordSearch    │   │ EmbeddingSearch      │
│ Strategy         │   │ Strategy (FUTURE)    │
│                  │   │                      │
│ • Tokenize       │   │ • Generate embedding │
│ • Match terms    │   │ • Cosine similarity  │
│ • Score chunks   │   │ • Rank by similarity │
│ • Rank results   │   │                      │
└──────────────────┘   └──────────────────────┘
```

---

## 📂 File Structure (9 files)

```
search/
├── interfaces/          (3 files) - Abstract definitions
│   ├── IKnowledgeSearchService.js
│   ├── ISearchStrategy.js
│   └── ISearchResult.js
│
├── strategies/          (2 files) - Search algorithms
│   ├── BaseSearchStrategy.js      (Abstract base)
│   └── KeywordSearchStrategy.js   (Keyword impl)
│
├── services/            (1 file) - Main service
│   └── KnowledgeSearchService.js
│
├── utils/               (2 files) - Helpers
│   ├── textProcessor.js           (Tokenization)
│   └── rankingUtils.js            (Scoring)
│
└── constants.js         (1 file) - Configuration
```

---

## 🔄 Design Pattern: Strategy

### Why Strategy Pattern?

**Problem**: We want to support multiple search algorithms (keyword, embedding, hybrid) without changing the service.

**Solution**: Define an interface (`ISearchStrategy`) and let concrete strategies implement it.

### Benefits

✅ **Open/Closed Principle** - Open for extension, closed for modification  
✅ **Runtime Flexibility** - Switch strategies on the fly  
✅ **Testability** - Mock strategies easily  
✅ **Future-Proof** - Add embedding search without changing existing code  

---

## 📊 Keyword Search Algorithm

### Scoring System

```
Final Score = Base Score + Bonuses

Base Score:
├─ Exact phrase match: 1.0
├─ All terms match: 0.8
└─ Partial match: 0.3 + (matched/total × 0.4)

Bonuses:
├─ Category match: +0.1
├─ Technology match: +0.1
└─ Domain match: +0.05
```

### Example

**Question**: "What are your React and TypeScript skills?"

**Tokenization**:
```javascript
Original: "What are your React and TypeScript skills?"
Keywords: ["react", "typescript", "skills"]
         (stop words removed: "what", "are", "your", "and")
```

**Chunk Matching**:
```javascript
Chunk: "Frontend Engineering: Building modern UIs with React, TypeScript..."

Matched terms: ["react", "typescript"]
Base score: 0.3 + (2/3 × 0.4) = 0.57
Category match: expertise → +0.1
Technology match: React, TypeScript → +0.1
Final score: 0.77
```

---

## 🎯 API Design

### Simple API

```javascript
// 1. Build knowledge base
const knowledge = await buildKnowledge('en');

// 2. Create search service
const searchService = createSearchService(knowledge);

// 3. Search!
const results = await searchService.search('What is your React experience?');

// 4. Use results
results.forEach(result => {
  console.log(`Score: ${result.score}`);
  console.log(`Content: ${result.matches.highlight}`);
});
```

### Result Structure

```javascript
{
  chunk: { /* KnowledgeChunk */ },
  score: 0.77,                    // Relevance (0-1)
  matches: {
    terms: ['react', 'typescript'],
    locations: { react: 45, typescript: 52 },
    exactMatch: false,
    highlight: "...Building modern UIs with **React**, **TypeScript**..."
  },
  metadata: {
    strategy: 'keyword',
    timestamp: '2026-07-02T...'
  }
}
```

---

## 🔧 Key Components

### 1. TextProcessor

**Responsibility**: Tokenize and normalize text

```javascript
extractKeywords('What is your React experience?')
// → ['react', 'experience']

highlightMatches('Text with React and TypeScript', ['react', 'typescript'])
// → 'Text with **React** and **TypeScript**'
```

### 2. KeywordSearchStrategy

**Responsibility**: Score chunks against search terms

```javascript
strategy.search(question, chunks, options)
// → Ranked SearchResult[]
```

### 3. KnowledgeSearchService

**Responsibility**: Orchestrate search, manage strategy

```javascript
service.search(question)           // Use current strategy
service.setStrategy(newStrategy)   // Switch algorithm
service.getStrategyName()          // 'keyword' or 'embedding'
```

---

## 🚀 Usage Examples

### Example 1: Basic Search

```javascript
import { createSearchService } from '@/features/ai-assistant/knowledge/search';

const searchService = createSearchService(knowledge);
const results = await searchService.search('React projects');

console.log(`Found ${results.length} results`);
```

### Example 2: Custom Configuration

```javascript
import { KeywordSearchStrategy, KnowledgeSearchService } from '@/features/ai-assistant/knowledge/search';

const strategy = new KeywordSearchStrategy({
  maxResults: 5,
  minScore: 0.3,
});

const searchService = new KnowledgeSearchService(strategy, knowledge);
```

### Example 3: Runtime Strategy Switch

```javascript
// Start with keyword
const searchService = createSearchService(knowledge, 'keyword');

// Later: Switch to embedding (when implemented)
// searchService.setStrategy(new EmbeddingSearchStrategy());
```

---

## 🔮 Future: Adding Embedding Search

**No changes to consumer code!** Just add new strategy:

```javascript
// 1. Create new strategy
class EmbeddingSearchStrategy extends BaseSearchStrategy {
  async search(question, chunks) {
    const embedding = await generateEmbedding(question);
    return chunks.map(chunk => ({
      chunk,
      score: cosineSimilarity(embedding, chunk.embedding)
    }));
  }
}

// 2. Use it
searchService.setStrategy(new EmbeddingSearchStrategy());

// 3. Same API!
const results = await searchService.search('AI projects');
```

---

## 📋 Implementation Steps

### Phase 1: Interfaces (30 min)
- [ ] Define `ISearchStrategy` interface
- [ ] Define `IKnowledgeSearchService` interface
- [ ] Define `SearchResult` type

### Phase 2: Utilities (45 min)
- [ ] Implement `textProcessor.js`
  - Keyword extraction
  - Stop word removal
  - Highlighting
- [ ] Implement `rankingUtils.js`
  - Similarity functions

### Phase 3: Base Strategy (30 min)
- [ ] Implement `BaseSearchStrategy`
  - Filtering
  - Sorting
  - Limiting

### Phase 4: Keyword Strategy (60 min)
- [ ] Implement `KeywordSearchStrategy`
  - Tokenization
  - Chunk scoring
  - Bonus calculation

### Phase 5: Service (30 min)
- [ ] Implement `KnowledgeSearchService`
  - Search orchestration
  - Strategy management

### Phase 6: Testing & Polish (45 min)
- [ ] Create test suite
- [ ] Create demo
- [ ] Documentation

**Total: ~4 hours**

---

## ✅ Success Metrics

### Functional
- ✅ Returns relevant results for typical questions
- ✅ Exact matches score highest (1.0)
- ✅ Partial matches score proportionally (0.3-0.8)
- ✅ Technology/category bonuses applied (+0.1, +0.05)

### Performance
- ✅ Search < 100ms for 50 chunks
- ✅ Memory efficient (no caching needed yet)

### Code Quality
- ✅ Abstract interfaces
- ✅ Strategy pattern implemented correctly
- ✅ SRP & DRY followed
- ✅ Zero coupling to specific algorithm

---

## 🎯 Key Design Decisions

### ✅ Interface-First Design
**Why**: Decouples service from strategy implementation  
**Benefit**: Easy to add new search algorithms

### ✅ Strategy Pattern
**Why**: Multiple search algorithms needed (keyword now, embedding later)  
**Benefit**: Runtime flexibility, testability

### ✅ Simple Keyword Search First
**Why**: Fast to implement, no dependencies, good baseline  
**Benefit**: Working search quickly, upgrade path clear

### ✅ Scoring with Bonuses
**Why**: Relevance requires more than term matching  
**Benefit**: Category/tech matches boost relevant results

---

## 📚 Comparison: Keyword vs Embedding

| Feature | Keyword Search | Embedding Search |
|---------|---------------|------------------|
| **Speed** | Very fast (~10ms) | Slower (~100ms) |
| **Accuracy** | 70-80% | 85-95% |
| **Memory** | Low (~1MB) | Higher (~10MB) |
| **Dependencies** | None | WebLLM/Transformers.js |
| **Semantic** | No | Yes |
| **Implementation** | Simple | Complex |
| **Status** | **NOW** | **LATER** |

---

## 🧪 Test Plan

### Unit Tests
```javascript
// Test tokenization
extractKeywords('React experience') → ['react', 'experience']

// Test stop word removal
removeStopWords(['what', 'is', 'react']) → ['react']

// Test scoring
scoreChunk(chunk, ['react']) → 0.8 (if matches)

// Test highlighting
highlightMatches('React is great', ['react']) → '**React** is great'
```

### Integration Tests
```javascript
// Test full search flow
const results = await searchService.search('React projects');
assert(results.length > 0);
assert(results[0].score >= results[1].score); // Sorted
```

### E2E Tests
```javascript
// Test real questions
'What is your React experience?' → Expertise chunks
'Tell me about your AI projects' → Project chunks
'What technologies do you use?' → Multiple chunks
```

---

## 💡 Pro Tips

### For Keyword Search
1. **Include technical terms**: Don't remove "React", "TypeScript" as stop words
2. **Case-insensitive matching**: Normalize to lowercase
3. **Partial word matching**: "React" should match "ReactJS"
4. **Bonus scoring**: Boost results in relevant categories

### For Future Embedding Search
1. **Batch embedding generation**: Generate all embeddings once
2. **Cache embeddings**: Store with chunks, don't regenerate
3. **Hybrid search**: Combine keyword + embedding scores
4. **Rerank**: Use embedding to rerank top keyword results

---

**Knowledge Search System Summary Complete** 🔍✨

Ready for implementation review!
