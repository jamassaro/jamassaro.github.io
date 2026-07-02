# Knowledge Layer

A reusable, language-agnostic system that transforms portfolio content into normalized, searchable knowledge chunks.

## 🎯 Purpose

The Knowledge Layer normalizes existing content (i18n translations + data files) into structured knowledge chunks suitable for:
- Semantic search
- RAG (Retrieval-Augmented Generation)
- AI assistant context
- Content analytics

## 🏗️ Architecture

Built following **SRP** (Single Responsibility Principle) and **DRY** (Don't Repeat Yourself):

```
knowledge/
├── types/           → Type definitions (JSDoc)
├── mappers/         → Content extraction & transformation
├── builders/        → Orchestration & validation
├── utils/           → Shared utilities
├── constants.js     → Centralized configuration
├── index.js         → Public API
└── test.js          → Test suite
```

## 📊 Data Flow

```
translations/en/translation.json (text descriptions)
             +
data/expertise.js (structured metadata)
             ↓
    Knowledge Builder
             ↓
    {
      documents: [...],  // Logical groupings
      chunks: [...],     // Searchable units
      metadata: {...}    // Build stats
    }
```

## 🚀 Quick Start

### Basic Usage

```javascript
import { buildKnowledge } from '@/features/ai-assistant/knowledge';

// Build knowledge for English
const knowledge = await buildKnowledge('en');

console.log(`Generated ${knowledge.chunks.length} chunks`);
console.log(`Categories: ${knowledge.metadata.categories.join(', ')}`);
```

### Build All Languages

```javascript
import { buildAllKnowledge } from '@/features/ai-assistant/knowledge';

const allKnowledge = await buildAllKnowledge();

// Access by language
const enChunks = allKnowledge.en.chunks;
const esChunks = allKnowledge.es.chunks;
```

### Query Knowledge

```javascript
// Filter by category
const expertiseChunks = knowledge.chunks.filter(
  c => c.category.primary === 'expertise'
);

// Filter by domain
const frontendChunks = knowledge.chunks.filter(
  c => c.category.domain === 'frontend'
);

// Find by technology
const reactChunks = knowledge.chunks.filter(
  c => c.metadata.technologies?.includes('React')
);

// Search content
const aiChunks = knowledge.chunks.filter(
  c => c.content.toLowerCase().includes('ai')
);
```

## 📐 Data Structures

### KnowledgeChunk

The smallest searchable unit:

```javascript
{
  id: 'chunk-expertise-frontend-001',
  documentId: 'expertise-frontend-en',
  content: 'Frontend Engineering: Building modern UIs...',
  category: {
    primary: 'expertise',
    secondary: ['frontend', 'react', 'typescript'],
    domain: 'frontend'
  },
  source: {
    type: 'hybrid',
    file: 'translations/en/translation.json + data/expertise.js',
    path: 'expertise.frontend.description',
    language: 'en'
  },
  metadata: {
    technologies: ['React', 'TypeScript', 'Next.js'],
    ...
  },
  tokenCount: 28,
  language: 'en',
  createdAt: Date
}
```

### KnowledgeDocument

Logical grouping of chunks:

```javascript
{
  id: 'expertise-frontend-en',
  title: 'Frontend Engineering',
  type: 'expertise',
  category: { primary, secondary, domain },
  metadata: { technologies, color, icon },
  chunkIds: ['chunk-001', 'chunk-002'],
  language: 'en',
  createdAt: Date
}
```

## 🏷️ Categories & Domains

### Primary Categories
- `personal_info` - Bio, contact information
- `expertise` - Skills and expertise areas
- `projects` - Individual projects
- `ventures` - Business ventures (hierarchical)

### Domains (Cross-cutting)
- `frontend` - React, TypeScript, UI
- `backend` - Node.js, Python, APIs
- `ai` - LLMs, AI systems
- `cloud` - AWS, GCP, DevOps
- `testing` - Test frameworks, QA
- `data` - Databases, analytics
- `leadership` - Team, strategy
- `product` - Product management, UX

## 📊 Expected Output

Per language (English or Spanish):
- **~13 documents**: 5 expertise + 2 projects + 4 ventures + 1 personal + 1 contact
- **~23 chunks**: Searchable knowledge units
- **0 duplicates**: Single source of truth (i18n files)

## 🧪 Testing

```javascript
import { runAllTests } from '@/features/ai-assistant/knowledge/test.js';

// Run comprehensive test suite
await runAllTests();
```

Or in browser console:
```javascript
import('@/features/ai-assistant/knowledge/test.js').then(m => m.runAllTests());
```

## 🔧 Utilities

### Normalization

```javascript
import { normalizeText, estimateTokens } from '@/features/ai-assistant/knowledge';

const normalized = normalizeText('  Some   text  ');
const tokens = estimateTokens(normalized);
```

### ID Generation

```javascript
import { generateChunkId, generateDocumentId } from '@/features/ai-assistant/knowledge';

const chunkId = generateChunkId('expertise', 'frontend', 1);
// → 'chunk-expertise-frontend-001'

const docId = generateDocumentId('project', 'deal-advisor', 'en');
// → 'project-deal-advisor-en'
```

## 📈 Scalability

Easily extensible:

1. **Add new content**: Create mapper for new data source
2. **Add new language**: Just add translation file
3. **Add new category**: Update constants.js
4. **Add new domain**: Update DOMAINS in constants.js

Future additions (not implemented):
- Embeddings generation
- Vector search
- Cache layer
- Resume/PDF content
- Blog posts
- GitHub projects

## 🎯 Design Principles

### Single Responsibility Principle (SRP)
- Each file/function has one clear purpose
- `translationMapper` → Load translations only
- `dataMapper` → Load data files only
- `expertiseMapper` → Combine expertise data
- `knowledgeBuilder` → Orchestrate the process

### Don't Repeat Yourself (DRY)
- Shared utilities in `utils/`
- Constants in single file
- Reusable mappers
- No code duplication

### Separation of Concerns
- Types → Definitions only
- Mappers → Transformation only
- Builders → Orchestration only
- Utils → Shared logic only

## 📚 Related Documentation

- [Full Architecture Plan](./KNOWLEDGE_LAYER_PLAN.md)
- [Quick Summary](./KNOWLEDGE_LAYER_SUMMARY.md)
- [Visual Guide](./KNOWLEDGE_LAYER_VISUAL.md)
- [AI Assistant README](../README.md)

## 🎓 Examples

### Example 1: Get all frontend knowledge

```javascript
const knowledge = await buildKnowledge('en');
const frontendKnowledge = knowledge.chunks.filter(
  c => c.category.domain === 'frontend'
);

frontendKnowledge.forEach(chunk => {
  console.log(`${chunk.metadata.title}: ${chunk.content.slice(0, 100)}...`);
});
```

### Example 2: Build search index

```javascript
const knowledge = await buildKnowledge('en');

// Create simple search index
const searchIndex = knowledge.chunks.map(chunk => ({
  id: chunk.id,
  content: chunk.content,
  categories: [chunk.category.primary, ...chunk.category.secondary],
  domain: chunk.category.domain,
}));

// Search function
function search(query) {
  const lowerQuery = query.toLowerCase();
  return searchIndex.filter(item =>
    item.content.toLowerCase().includes(lowerQuery)
  );
}

const results = search('React');
console.log(`Found ${results.length} results for "React"`);
```

### Example 3: Get document hierarchy

```javascript
const knowledge = await buildKnowledge('en');

// Find parent venture
const ventureDoc = knowledge.documents.find(
  d => d.type === 'venture'
);

// Find child projects
const childDocs = knowledge.documents.filter(
  d => d.parentId === ventureDoc.id
);

console.log(`${ventureDoc.title} has ${childDocs.length} sub-projects`);
```

## ✅ Validation

Built-in validation ensures:
- ✓ All chunks reference valid documents
- ✓ All documents have at least one chunk
- ✓ No duplicate chunk IDs
- ✓ No duplicate document IDs
- ✓ All required fields present

## 🔮 Future Enhancements (Out of Scope)

- [ ] Generate embeddings for semantic search
- [ ] Implement vector similarity search
- [ ] Add caching layer (localStorage/IndexedDB)
- [ ] Extract PDF/resume content
- [ ] Pull dynamic content from APIs
- [ ] Add blog posts/articles
- [ ] GitHub project integration

---

**Knowledge Layer** - Transform portfolio content into searchable knowledge 🧠✨
