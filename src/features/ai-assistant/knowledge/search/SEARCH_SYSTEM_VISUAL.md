# Knowledge Search System - Visual Guide

## 🎨 System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                        KNOWLEDGE SEARCH SYSTEM                        │
│                     (Interface-Driven Architecture)                   │
└──────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                              │
│                                                                     │
│  const results = await searchService.search(question);             │
└─────────────────────────────┬──────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER (Concrete)                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │       KnowledgeSearchService                                   │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │  IKnowledgeSearchService (Interface)                     │  │  │
│  │  │  • search(question, options) → SearchResult[]           │  │  │
│  │  │  • setStrategy(strategy)                                 │  │  │
│  │  │  • getStrategyName() → string                           │  │  │
│  │  │  • updateKnowledgeBase(kb)                              │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  │                                                                 │  │
│  │  Properties:                                                    │  │
│  │  • strategy: ISearchStrategy                                   │  │
│  │  • knowledgeBase: { documents, chunks, metadata }             │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   STRATEGY LAYER (Abstract)                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │          ISearchStrategy (Interface)                           │  │
│  │  • search(question, chunks, options) → SearchResult[]        │  │
│  │  • getName() → string                                         │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│              ┌───────────────┴───────────────┐                      │
│              ▼                               ▼                      │
│  ┌──────────────────────┐      ┌──────────────────────────┐        │
│  │ BaseSearchStrategy   │      │   Future Strategies      │        │
│  │   (Abstract Base)    │      │                          │        │
│  │                      │      │ • EmbeddingSearch        │        │
│  │ • filterByScore()    │      │ • HybridSearch           │        │
│  │ • sortByScore()      │      │ • FuzzySearch            │        │
│  │ • limitResults()     │      └──────────────────────────┘        │
│  │ • postProcess()      │                                           │
│  └──────────┬───────────┘                                           │
│             │                                                        │
│             ▼                                                        │
│  ┌──────────────────────────────────────────────────────┐           │
│  │    KeywordSearchStrategy (Concrete)                  │           │
│  │                                                       │           │
│  │  • search(question, chunks) → SearchResult[]        │           │
│  │  • tokenize(question) → string[]                    │           │
│  │  • scoreChunk(chunk, tokens) → SearchResult        │           │
│  │  • calculateTermScore() → number                    │           │
│  │  • calculateBonuses() → number                      │           │
│  │  • hasExactMatch() → boolean                        │           │
│  │  • hasCategoryMatch() → boolean                     │           │
│  │  • hasTechnologyMatch() → boolean                   │           │
│  └──────────────────────────────────────────────────────┘           │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      UTILITY LAYER                                   │
│                                                                      │
│  ┌─────────────────────────┐    ┌──────────────────────────┐       │
│  │   textProcessor.js      │    │   rankingUtils.js        │       │
│  │                         │    │                          │       │
│  │ • extractKeywords()     │    │ • jaccardSimilarity()    │       │
│  │ • removeStopWords()     │    │ • cosineSimilarity()     │       │
│  │ • extractTechnicalTerms()│   │ • calculateBM25()        │       │
│  │ • highlightMatches()    │    │                          │       │
│  └─────────────────────────┘    └──────────────────────────┘       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Search Flow Diagram

```
USER QUESTION: "What is your React experience?"
        │
        ├─────────────────────────────────────┐
        │                                     │
        ▼                                     │
┌───────────────────┐                        │
│ KnowledgeSearch   │                        │
│    Service        │                        │
└────────┬──────────┘                        │
         │                                   │
         │ 1. Validate question              │
         │ 2. Get knowledge chunks           │
         │ 3. Delegate to strategy           │
         │                                   │
         ▼                                   │
┌─────────────────────────────────────┐     │
│   KeywordSearchStrategy             │     │
│                                     │     │
│   ┌─────────────────────────────┐   │     │
│   │ Step 1: Tokenize            │   │     │
│   │ "What is your React         │   │     │
│   │  experience?"               │   │     │
│   │          ↓                  │   │     │
│   │ Keywords: [                 │   │     │
│   │   "react",                  │   │     │
│   │   "experience"              │   │     │
│   │ ]                           │   │     │
│   └─────────────────────────────┘   │     │
│                                     │     │
│   ┌─────────────────────────────┐   │     │
│   │ Step 2: Score Chunks        │   │     │
│   │                             │   │     │
│   │ For each chunk:             │   │     │
│   │   • Check exact match       │   │     │
│   │   • Count term matches      │   │     │
│   │   • Calculate base score    │   │     │
│   │   • Apply bonuses           │   │     │
│   │                             │   │     │
│   │ Example:                    │   │     │
│   │ Chunk: "Frontend: React..." │   │     │
│   │   Terms matched: 1/2        │   │     │
│   │   Base score: 0.50          │   │     │
│   │   Category bonus: +0.10     │   │     │
│   │   Tech bonus: +0.10         │   │     │
│   │   Final: 0.70               │   │     │
│   └─────────────────────────────┘   │     │
│                                     │     │
│   ┌─────────────────────────────┐   │     │
│   │ Step 3: Post-Process        │   │     │
│   │                             │   │     │
│   │ • Filter: score >= 0.1      │   │     │
│   │ • Sort: by score desc       │   │     │
│   │ • Limit: top 10 results     │   │     │
│   └─────────────────────────────┘   │     │
│                                     │     │
│   Results: [                        │     │
│     { chunk, score: 0.85, ... },    │     │
│     { chunk, score: 0.70, ... },    │     │
│     { chunk, score: 0.55, ... }     │     │
│   ]                                 │     │
└──────────────┬──────────────────────┘     │
               │                            │
               ▼                            │
┌────────────────────────────────────┐      │
│ KnowledgeSearchService             │      │
│                                    │      │
│ Step 4: Add Highlights             │      │
│                                    │      │
│ For each result:                   │      │
│   result.matches.highlight =       │      │
│     highlightMatches(              │      │
│       result.chunk.content,        │      │
│       result.matches.terms         │      │
│     )                              │      │
│                                    │      │
│ Example:                           │      │
│ "...with **React**, **TypeScript** │      │
│  and cutting-edge web..."          │      │
└──────────────┬─────────────────────┘      │
               │                            │
               ▼                            │
          RETURN RESULTS ◄──────────────────┘
```

---

## 📊 Scoring System Breakdown

```
┌────────────────────────────────────────────────────────────┐
│                   KEYWORD SEARCH SCORING                    │
└────────────────────────────────────────────────────────────┘

Question: "What are your React and TypeScript projects?"
Tokens: ["react", "typescript", "projects"]

┌─────────────────────────────────────────────────────────────┐
│ Chunk 1: "Frontend Engineering: React, TypeScript, Next.js" │
│                                                              │
│ BASE SCORE CALCULATION:                                      │
│ ┌──────────────────────────────────────────────────────┐    │
│ │ Exact phrase match?   NO                             │    │
│ │ Terms matched:        2/3 ["react", "typescript"]    │    │
│ │ Match percentage:     67%                            │    │
│ │ Base formula:         0.3 + (0.67 × 0.4) = 0.57     │    │
│ └──────────────────────────────────────────────────────┘    │
│                                                              │
│ BONUSES:                                                     │
│ ┌──────────────────────────────────────────────────────┐    │
│ │ Category match?       YES (expertise) → +0.10        │    │
│ │ Technology match?     YES (React, TypeScript) → +0.10│    │
│ │ Domain match?         YES (frontend) → +0.05         │    │
│ │ Total bonuses:        +0.25                          │    │
│ └──────────────────────────────────────────────────────┘    │
│                                                              │
│ FINAL SCORE: 0.57 + 0.25 = 0.82                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Chunk 2: "DEAL ADVISOR: AI-powered shopping assistant..."   │
│                                                              │
│ BASE SCORE CALCULATION:                                      │
│ ┌──────────────────────────────────────────────────────┐    │
│ │ Exact phrase match?   NO                             │    │
│ │ Terms matched:        0/3                            │    │
│ │ Base formula:         0                              │    │
│ └──────────────────────────────────────────────────────┘    │
│                                                              │
│ BONUSES:                                                     │
│ ┌──────────────────────────────────────────────────────┐    │
│ │ Category match?       NO                             │    │
│ │ Technology match?     NO                             │    │
│ │ Domain match?         NO                             │    │
│ │ Total bonuses:        0                              │    │
│ └──────────────────────────────────────────────────────┘    │
│                                                              │
│ FINAL SCORE: 0.00 (filtered out)                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Chunk 3: "Built React Native mobile app for education..."   │
│                                                              │
│ BASE SCORE CALCULATION:                                      │
│ ┌──────────────────────────────────────────────────────┐    │
│ │ Exact phrase match?   NO                             │    │
│ │ Terms matched:        1/3 ["react"]                  │    │
│ │ Match percentage:     33%                            │    │
│ │ Base formula:         0.3 + (0.33 × 0.4) = 0.43     │    │
│ └──────────────────────────────────────────────────────┘    │
│                                                              │
│ BONUSES:                                                     │
│ ┌──────────────────────────────────────────────────────┐    │
│ │ Category match?       YES (ventures) → +0.10         │    │
│ │ Technology match?     YES (React) → +0.10            │    │
│ │ Domain match?         YES (product) → +0.05          │    │
│ │ Total bonuses:        +0.25                          │    │
│ └──────────────────────────────────────────────────────┘    │
│                                                              │
│ FINAL SCORE: 0.43 + 0.25 = 0.68                            │
└─────────────────────────────────────────────────────────────┘

RANKED RESULTS:
1. Chunk 1 → 0.82 ⭐⭐⭐⭐⭐
2. Chunk 3 → 0.68 ⭐⭐⭐⭐
3. Chunk 2 → 0.00 (excluded)
```

---

## 🎯 Strategy Pattern Visual

```
┌─────────────────────────────────────────────────────────────┐
│                    STRATEGY PATTERN                          │
│              (Runtime Algorithm Selection)                   │
└─────────────────────────────────────────────────────────────┘

CLIENT CODE (Unchanged)
───────────────────────
const service = new KnowledgeSearchService(strategy, knowledge);
const results = await service.search(question);
                          │
                          │ Same API,
                          │ different algorithms!
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Keyword    │  │  Embedding   │  │    Hybrid    │
│   Strategy   │  │   Strategy   │  │   Strategy   │
│              │  │  (FUTURE)    │  │  (FUTURE)    │
├──────────────┤  ├──────────────┤  ├──────────────┤
│ • Tokenize   │  │ • Generate   │  │ • Keyword +  │
│ • Match      │  │   embedding  │  │   Embedding  │
│   terms      │  │ • Cosine     │  │ • Rerank     │
│ • Count      │  │   similarity │  │ • Combine    │
│   matches    │  │ • Rank by    │  │   scores     │
│ • Apply      │  │   similarity │  │              │
│   bonuses    │  │              │  │              │
└──────────────┘  └──────────────┘  └──────────────┘

BENEFITS:
✅ Add new strategies without changing service
✅ Switch strategies at runtime
✅ Test strategies independently
✅ Open/closed principle
```

---

## 🔍 Text Processing Pipeline

```
USER QUESTION
"What are your React and TypeScript skills?"
        │
        ▼
┌───────────────────────────────────────┐
│ Step 1: Normalize                     │
│ • Trim whitespace                     │
│ • Collapse multiple spaces            │
│ • Normalize quotes                    │
│                                       │
│ Output: "What are your React and      │
│          TypeScript skills?"          │
└────────────┬──────────────────────────┘
             │
             ▼
┌───────────────────────────────────────┐
│ Step 2: Tokenize                      │
│ • Split by whitespace                 │
│ • Convert to lowercase                │
│                                       │
│ Output: ["what", "are", "your",       │
│          "react", "and", "typescript",│
│          "skills"]                    │
└────────────┬──────────────────────────┘
             │
             ▼
┌───────────────────────────────────────┐
│ Step 3: Remove Stop Words             │
│ • Filter common words                 │
│ • Keep words > 2 chars                │
│                                       │
│ Removed: ["what", "are", "your",      │
│           "and"]                      │
│                                       │
│ Output: ["react", "typescript",       │
│          "skills"]                    │
└────────────┬──────────────────────────┘
             │
             ▼
┌───────────────────────────────────────┐
│ Step 4: Extract Technical Terms       │
│ • Preserve case for tech names        │
│ • Add recognized technologies         │
│                                       │
│ Technical: ["React", "TypeScript"]    │
│                                       │
│ Final Output: ["react", "typescript", │
│                "skills"]              │
└───────────────────────────────────────┘
```

---

## 📈 Performance Comparison

```
KEYWORD SEARCH
──────────────
┌────────────────────────────────────┐
│ Speed:    ████████████ Fast        │
│ Accuracy: ███████░░░░░ Good        │
│ Memory:   ██░░░░░░░░░░ Low         │
│ Setup:    █░░░░░░░░░░░ Minimal    │
└────────────────────────────────────┘
• ~10-50ms for 50 chunks
• ~70-80% accuracy
• No dependencies
• Simple to implement

EMBEDDING SEARCH (Future)
─────────────────────────
┌────────────────────────────────────┐
│ Speed:    ████░░░░░░░░ Moderate    │
│ Accuracy: ███████████░ Excellent   │
│ Memory:   ████████░░░░ High        │
│ Setup:    ████████░░░░ Complex     │
└────────────────────────────────────┘
• ~50-200ms for 50 chunks
• ~85-95% accuracy
• WebLLM/Transformers.js
• Semantic understanding

HYBRID SEARCH (Future)
──────────────────────
┌────────────────────────────────────┐
│ Speed:    ██████░░░░░░ Good        │
│ Accuracy: ██████████░░ Great       │
│ Memory:   ██████░░░░░░ Moderate    │
│ Setup:    ██████░░░░░░ Moderate    │
└────────────────────────────────────┘
• ~60-150ms for 50 chunks
• ~80-90% accuracy
• Best of both worlds
• Balanced approach
```

---

## 🔮 Future Architecture Evolution

```
PHASE 1: KEYWORD SEARCH (NOW)
─────────────────────────────
┌─────────────────────────────────────┐
│  KnowledgeSearchService             │
│           │                         │
│           ▼                         │
│  KeywordSearchStrategy              │
│  • Simple term matching             │
│  • Fast & lightweight               │
│  • No dependencies                  │
└─────────────────────────────────────┘

PHASE 2: ADD EMBEDDINGS (LATER)
────────────────────────────────
┌─────────────────────────────────────┐
│  KnowledgeSearchService             │
│           │                         │
│      ┌────┴────┐                    │
│      ▼         ▼                    │
│  Keyword  Embedding                 │
│  Strategy  Strategy                 │
│                                     │
│  Runtime switching:                 │
│  service.setStrategy(new Embedding) │
└─────────────────────────────────────┘

PHASE 3: HYBRID APPROACH (FUTURE)
──────────────────────────────────
┌─────────────────────────────────────┐
│  KnowledgeSearchService             │
│           │                         │
│      ┌────┴────┬──────────┐         │
│      ▼         ▼          ▼         │
│  Keyword  Embedding   Hybrid        │
│  Strategy  Strategy   Strategy      │
│                       (combines     │
│                        both)        │
│                                     │
│  HybridStrategy:                    │
│  1. Fast keyword pre-filter         │
│  2. Embedding rerank top N          │
│  3. Combine scores                  │
└─────────────────────────────────────┘
```

---

## 🧪 Testing Pyramid

```
           ┌─────────────────────┐
          /         E2E          /
         /   Integration Tests  /    ← Full search flow
        /      Unit Tests      /     ← Individual functions
       /─────────────────────/
      
┌──────────────────────────────────────────────────────────┐
│ UNIT TESTS (~60%)                                        │
├──────────────────────────────────────────────────────────┤
│ • extractKeywords()                                      │
│ • removeStopWords()                                      │
│ • highlightMatches()                                     │
│ • calculateTermScore()                                   │
│ • calculateBonuses()                                     │
│ • filterByScore()                                        │
│ • sortByScore()                                          │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ INTEGRATION TESTS (~30%)                                 │
├──────────────────────────────────────────────────────────┤
│ • KeywordSearchStrategy.search()                         │
│ • KnowledgeSearchService.search()                        │
│ • Strategy switching                                     │
│ • End-to-end scoring                                     │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ E2E TESTS (~10%)                                         │
├──────────────────────────────────────────────────────────┤
│ • Real questions + knowledge base                        │
│ • "What is your React experience?"                       │
│ • "Tell me about AI projects"                            │
│ • "What technologies do you use?"                        │
└──────────────────────────────────────────────────────────┘
```

---

## 📋 Implementation Timeline

```
WEEK 1: Foundation
═══════════════════
Day 1-2: Interfaces & Types
  ├─ ISearchStrategy
  ├─ IKnowledgeSearchService
  └─ SearchResult types

Day 3-4: Utilities
  ├─ textProcessor.js
  └─ rankingUtils.js

Day 5: Base Strategy
  └─ BaseSearchStrategy


WEEK 2: Implementation
═══════════════════════
Day 1-2: Keyword Strategy
  ├─ tokenize()
  ├─ scoreChunk()
  └─ calculateBonuses()

Day 3: Service
  └─ KnowledgeSearchService

Day 4-5: Testing & Polish
  ├─ Unit tests
  ├─ Integration tests
  ├─ Demo
  └─ Documentation


TOTAL: ~10 days (~4 hours/day = 40 hours)
```

---

**Visual Guide Complete** 🎨✨

All diagrams and visual representations ready for implementation!
