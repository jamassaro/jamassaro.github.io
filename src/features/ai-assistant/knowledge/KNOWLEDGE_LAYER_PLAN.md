# Knowledge Layer Architecture Plan

## 🎯 Objective

Create a **reusable, language-agnostic Knowledge Layer** that transforms existing portfolio content into normalized, searchable knowledge chunks suitable for future semantic search and RAG (Retrieval-Augmented Generation).

---

## 📊 Current Data Sources

### 1. **Translation Files (i18n)**
- **Location**: `src/translations/{en,es}/translation.json`
- **Structure**: Nested JSON with sections
- **Content Types**:
  - Personal Information (contact, bio)
  - Expertise Descriptions (5 categories)
  - Projects (2 projects with descriptions)
  - Venture Details (Brave Up! story)
  - Navigation & UI labels

### 2. **Data Files (JavaScript)**
- **Location**: `src/data/`
- **Files**:
  - `expertise.js` - 5 expertise categories with technologies
  - `projects.js` - 2 projects with tech stacks
  - `ventures.js` - 3 Brave Up! projects with details
- **Structure**: JavaScript objects/arrays

### 3. **Combined Content**
The Knowledge Layer will merge:
- **i18n translations** (descriptive content)
- **Data objects** (structured metadata)
- Into unified knowledge chunks

---

## 🏗️ Architecture Design

### Folder Structure
```
src/features/ai-assistant/knowledge/
├── types/
│   ├── KnowledgeTypes.js          # Type definitions
│   └── index.js
├── mappers/
│   ├── translationMapper.js       # i18n → Knowledge
│   ├── dataMapper.js              # data files → Knowledge
│   ├── expertiseMapper.js         # Expertise-specific logic
│   ├── projectMapper.js           # Project-specific logic
│   ├── ventureMapper.js           # Venture-specific logic
│   └── index.js
├── builders/
│   ├── knowledgeBuilder.js        # Main orchestrator
│   └── index.js
├── utils/
│   ├── normalize.js               # Text normalization
│   ├── chunkSplitter.js           # Split large text
│   └── index.js
├── constants.js                   # Categories, metadata
├── index.js                       # Public API
└── KNOWLEDGE_LAYER_PLAN.md        # This file
```

---

## 📐 Type Definitions

### `KnowledgeSource`
Origin of the knowledge chunk.

```javascript
/**
 * @typedef {Object} KnowledgeSource
 * @property {'translation' | 'data' | 'hybrid'} type - Source type
 * @property {string} file - Original file name
 * @property {string} path - JSON path or data key
 * @property {string} language - Language code (en, es)
 */
```

**Example**:
```javascript
{
  type: 'translation',
  file: 'translations/en/translation.json',
  path: 'expertise.frontend.description',
  language: 'en'
}
```

---

### `KnowledgeCategory`
Semantic categorization for retrieval.

```javascript
/**
 * @typedef {Object} KnowledgeCategory
 * @property {string} primary - Main category
 * @property {string[]} secondary - Sub-categories/tags
 * @property {string} domain - Knowledge domain
 */
```

**Categories**:
- **Primary**: `personal_info`, `expertise`, `projects`, `ventures`, `technologies`, `experience`
- **Domains**: `frontend`, `backend`, `ai`, `cloud`, `testing`, `data`, `leadership`, `product`

**Example**:
```javascript
{
  primary: 'expertise',
  secondary: ['frontend', 'react', 'typescript'],
  domain: 'frontend'
}
```

---

### `KnowledgeDocument`
A logical grouping of related knowledge (e.g., one project, one expertise area).

```javascript
/**
 * @typedef {Object} KnowledgeDocument
 * @property {string} id - Unique identifier
 * @property {string} title - Document title
 * @property {string} type - Document type
 * @property {KnowledgeCategory} category - Categorization
 * @property {Object} metadata - Additional structured data
 * @property {string[]} chunkIds - IDs of associated chunks
 * @property {string} language - Language code
 */
```

**Example**:
```javascript
{
  id: 'expertise-frontend-en',
  title: 'Frontend Engineering',
  type: 'expertise',
  category: {
    primary: 'expertise',
    secondary: ['frontend', 'react', 'typescript', 'nextjs'],
    domain: 'frontend'
  },
  metadata: {
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
    color: 'blue',
    icon: 'frontend'
  },
  chunkIds: ['chunk-001', 'chunk-002'],
  language: 'en'
}
```

---

### `KnowledgeChunk`
The smallest unit of searchable knowledge.

```javascript
/**
 * @typedef {Object} KnowledgeChunk
 * @property {string} id - Unique chunk identifier
 * @property {string} documentId - Parent document ID
 * @property {string} content - The actual knowledge text
 * @property {KnowledgeCategory} category - Categorization
 * @property {KnowledgeSource} source - Origin information
 * @property {Object} metadata - Structured metadata
 * @property {number} tokenCount - Approximate token count
 * @property {string} language - Language code
 * @property {Date} createdAt - Timestamp
 */
```

**Example**:
```javascript
{
  id: 'chunk-expertise-frontend-001',
  documentId: 'expertise-frontend-en',
  content: 'Building modern and responsive user interfaces with React, TypeScript, and cutting-edge web technologies. Focused on performance, accessibility, and exceptional user experiences.',
  category: {
    primary: 'expertise',
    secondary: ['frontend', 'react', 'ui'],
    domain: 'frontend'
  },
  source: {
    type: 'translation',
    file: 'translations/en/translation.json',
    path: 'expertise.frontend.description',
    language: 'en'
  },
  metadata: {
    title: 'Frontend Engineering',
    technologies: ['React', 'TypeScript', 'Tailwind'],
    relatedExpertise: ['testing', 'cloud']
  },
  tokenCount: 28,
  language: 'en',
  createdAt: '2026-07-02T...'
}
```

---

## 🔄 Mapping Strategy

### 1. **Translation Mapper** (`translationMapper.js`)

**Responsibilities**:
- Load translation JSON for given language
- Extract text content from nested structure
- Identify categories from JSON paths
- Create chunks from descriptions

**Mapping Rules**:

| JSON Path | Category | Type | Chunk Strategy |
|-----------|----------|------|----------------|
| `main-section.description` | personal_info | bio | Single chunk |
| `expertise.{id}.description` | expertise | skill | One chunk per expertise |
| `projects.project-{n}.*` | projects | project | One chunk per project |
| `venture.*` | ventures | venture | Multiple chunks (split by cards) |
| `footer.{email,phone}` | personal_info | contact | Metadata only |

**Example Logic**:
```javascript
// Input: expertise.frontend.description (from translation.json)
// Output: KnowledgeChunk
{
  content: "Building modern and responsive user interfaces...",
  category: { primary: 'expertise', secondary: ['frontend'], domain: 'frontend' },
  source: { path: 'expertise.frontend.description', language: 'en' }
}
```

---

### 2. **Data Mapper** (`dataMapper.js`)

**Responsibilities**:
- Parse JavaScript data objects (expertise.js, projects.js, ventures.js)
- Extract structured metadata (technologies, links, years)
- Create metadata-rich chunks

**Mapping Rules**:

| Data File | Primary Category | Extraction Strategy |
|-----------|------------------|---------------------|
| `expertise.js` | expertise | Extract technologies array |
| `projects.js` | projects | Extract tech stack, links, status |
| `ventures.js` | ventures | Extract images, URLs, tech stack |

**Example Logic**:
```javascript
// Input: expertiseCategories[0] from expertise.js
// Output: Metadata for KnowledgeDocument
{
  technologies: ['React', 'Next.js', 'TypeScript', ...],
  color: 'blue',
  techCount: 6
}
```

---

### 3. **Hybrid Mapper** (Specific Mappers)

**`expertiseMapper.js`**:
- Combines translation text + data technologies
- Creates enriched expertise chunks

**`projectMapper.js`**:
- Combines project description + tech stack + URL
- Creates project knowledge chunks

**`ventureMapper.js`**:
- Combines venture story + multiple sub-projects
- Creates hierarchical venture knowledge

**Example - Expertise Hybrid**:
```javascript
// Input: 
//   - Translation: "Building modern and responsive..."
//   - Data: { technologies: ['React', 'Next.js'], color: 'blue' }
// Output: Enriched chunk
{
  content: "Frontend Engineering: Building modern and responsive user interfaces with React, TypeScript, and Next.js...",
  metadata: {
    technologies: ['React', 'Next.js', 'TypeScript'],
    color: 'blue',
    explicitTech: true
  }
}
```

---

## 🔨 Builder Logic (`knowledgeBuilder.js`)

### Main Function: `buildKnowledge(language = 'en')`

**Algorithm**:

```javascript
export function buildKnowledge(language) {
  const documents = [];
  const chunks = [];

  // Step 1: Load data sources
  const translations = loadTranslations(language);
  const expertise = loadExpertise();
  const projects = loadProjects();
  const ventures = loadVentures();

  // Step 2: Build expertise knowledge
  const expertiseDocs = buildExpertiseDocuments(translations, expertise, language);
  documents.push(...expertiseDocs.documents);
  chunks.push(...expertiseDocs.chunks);

  // Step 3: Build project knowledge
  const projectDocs = buildProjectDocuments(translations, projects, language);
  documents.push(...projectDocs.documents);
  chunks.push(...projectDocs.chunks);

  // Step 4: Build venture knowledge
  const ventureDocs = buildVentureDocuments(translations, ventures, language);
  documents.push(...ventureDocs.documents);
  chunks.push(...ventureDocs.chunks);

  // Step 5: Build personal info knowledge
  const personalDoc = buildPersonalDocument(translations, language);
  documents.push(personalDoc.document);
  chunks.push(...personalDoc.chunks);

  // Step 6: Validate and normalize
  const validated = validateKnowledge(documents, chunks);

  return {
    documents: validated.documents,
    chunks: validated.chunks,
    metadata: {
      language,
      totalDocuments: validated.documents.length,
      totalChunks: validated.chunks.length,
      categories: extractCategories(validated.chunks),
      generatedAt: new Date().toISOString()
    }
  };
}
```

---

### Helper Functions

**`buildExpertiseDocuments(translations, dataExpertise, language)`**
```javascript
// For each expertise category:
// 1. Get translation text (expertise.{id}.description)
// 2. Get data technologies (expertiseCategories[i].technologies)
// 3. Create Document + Chunk
// 4. Link them together

// Example output:
{
  documents: [
    { id: 'expertise-frontend-en', title: 'Frontend Engineering', ... },
    { id: 'expertise-backend-en', title: 'Backend & AI Systems', ... }
  ],
  chunks: [
    { id: 'chunk-001', documentId: 'expertise-frontend-en', content: '...', ... },
    { id: 'chunk-002', documentId: 'expertise-backend-en', content: '...', ... }
  ]
}
```

**`buildProjectDocuments(translations, dataProjects, language)`**
```javascript
// For each project:
// 1. Get translation text (projects.project-{n}.description)
// 2. Get data metadata (technologies, links, status)
// 3. Create Document + Chunk
// 4. Include project URL and tech stack in metadata

// Example output:
{
  documents: [{ id: 'project-deal-advisor-en', ... }],
  chunks: [{ id: 'chunk-project-001', content: '...', metadata: { url: '...', technologies: [...] } }]
}
```

**`buildVentureDocuments(translations, dataVentures, language)`**
```javascript
// Special handling for Brave Up!:
// 1. Create parent venture document
// 2. Create sub-documents for each venture project (app, website, admin)
// 3. Extract venture.cards array for multiple chunks
// 4. Link all together hierarchically

// Example output:
{
  documents: [
    { id: 'venture-braveup-en', type: 'venture', ... },
    { id: 'venture-braveup-platform-en', type: 'venture_project', parentId: 'venture-braveup-en', ... }
  ],
  chunks: [
    { id: 'chunk-venture-001', content: 'Co-founded and led...', ... },
    { id: 'chunk-venture-card-001', content: 'Product Platform: Built the web...', ... }
  ]
}
```

**`buildPersonalDocument(translations, language)`**
```javascript
// Extract personal information:
// 1. main-section.description (bio)
// 2. footer.email, footer.phone (contact)
// 3. Create single personal_info document with multiple chunks

// Example output:
{
  document: { id: 'personal-info-en', type: 'personal', ... },
  chunks: [
    { id: 'chunk-bio-001', content: 'Building AI-powered products...', category: { primary: 'personal_info' } },
    { id: 'chunk-contact-001', content: 'Contact: jamassaro@gmail.com', metadata: { email: '...', phone: '...' } }
  ]
}
```

---

## 🛠️ Utilities

### `normalize.js`
```javascript
/**
 * Normalize text for consistent processing
 */
export function normalizeText(text) {
  return text
    .trim()
    .replace(/\s+/g, ' ')      // Collapse whitespace
    .replace(/\n+/g, ' ')      // Remove newlines
    .replace(/[""]/g, '"')     // Normalize quotes
    .replace(/['']/g, "'");    // Normalize apostrophes
}

/**
 * Estimate token count (rough approximation)
 */
export function estimateTokens(text) {
  // Simple heuristic: ~4 chars per token
  return Math.ceil(text.length / 4);
}

/**
 * Generate stable ID from content
 */
export function generateChunkId(content, category, index) {
  // Example: 'chunk-expertise-frontend-001'
  return `chunk-${category.primary}-${category.domain || 'general'}-${String(index).padStart(3, '0')}`;
}
```

### `chunkSplitter.js`
```javascript
/**
 * Split large text into smaller chunks (for future use)
 * Max chunk size: ~500 tokens (~2000 chars)
 */
export function splitIntoChunks(text, maxChars = 2000, overlap = 200) {
  // For now, most content fits in single chunks
  // This will be useful when adding resume/long content
  
  if (text.length <= maxChars) {
    return [text];
  }

  const chunks = [];
  let start = 0;
  
  while (start < text.length) {
    const end = Math.min(start + maxChars, text.length);
    const chunk = text.slice(start, end);
    chunks.push(chunk);
    start = end - overlap; // Overlap for context
  }
  
  return chunks;
}
```

---

## 📝 Constants (`constants.js`)

```javascript
/**
 * Knowledge Categories
 */
export const PRIMARY_CATEGORIES = {
  PERSONAL_INFO: 'personal_info',
  EXPERTISE: 'expertise',
  PROJECTS: 'projects',
  VENTURES: 'ventures',
  TECHNOLOGIES: 'technologies',
  EXPERIENCE: 'experience'
};

export const DOMAINS = {
  FRONTEND: 'frontend',
  BACKEND: 'backend',
  AI: 'ai',
  CLOUD: 'cloud',
  TESTING: 'testing',
  DATA: 'data',
  LEADERSHIP: 'leadership',
  PRODUCT: 'product'
};

export const DOCUMENT_TYPES = {
  EXPERTISE: 'expertise',
  PROJECT: 'project',
  VENTURE: 'venture',
  VENTURE_PROJECT: 'venture_project',
  PERSONAL: 'personal',
  TECHNOLOGY: 'technology'
};

/**
 * Language support
 */
export const SUPPORTED_LANGUAGES = ['en', 'es'];

/**
 * Chunk constraints
 */
export const CHUNK_CONSTRAINTS = {
  MAX_CHARS: 2000,
  MAX_TOKENS: 500,
  OVERLAP_CHARS: 200
};
```

---

## 🎯 Public API (`index.js`)

```javascript
/**
 * Main entry point for Knowledge Layer
 */

import { buildKnowledge } from './builders/knowledgeBuilder.js';
import * as types from './types';
import * as constants from './constants';

/**
 * Build normalized knowledge base for given language
 * @param {string} language - Language code ('en' or 'es')
 * @returns {Object} { documents, chunks, metadata }
 */
export { buildKnowledge };

/**
 * Export types for TypeScript/JSDoc consumers
 */
export { types };

/**
 * Export constants
 */
export { constants };

/**
 * Convenience exports
 */
export { PRIMARY_CATEGORIES, DOMAINS, DOCUMENT_TYPES } from './constants';
```

---

## 🧪 Example Usage

```javascript
import { buildKnowledge } from '@/features/ai-assistant/knowledge';

// Build English knowledge base
const englishKnowledge = buildKnowledge('en');

console.log(englishKnowledge);
// Output:
// {
//   documents: [
//     { id: 'expertise-frontend-en', title: 'Frontend Engineering', ... },
//     { id: 'project-deal-advisor-en', title: 'DEAL ADVISOR', ... },
//     { id: 'venture-braveup-en', title: 'Brave Up!', ... },
//     ...
//   ],
//   chunks: [
//     { id: 'chunk-001', content: '...', category: { primary: 'expertise', ... } },
//     { id: 'chunk-002', content: '...', category: { primary: 'projects', ... } },
//     ...
//   ],
//   metadata: {
//     language: 'en',
//     totalDocuments: 12,
//     totalChunks: 25,
//     categories: ['expertise', 'projects', 'ventures', 'personal_info'],
//     generatedAt: '2026-07-02T...'
//   }
// }

// Access specific chunks
const expertiseChunks = englishKnowledge.chunks.filter(
  chunk => chunk.category.primary === 'expertise'
);

// Access specific document
const frontendDoc = englishKnowledge.documents.find(
  doc => doc.id === 'expertise-frontend-en'
);
```

---

## 📊 Expected Output Structure

### Sample Output: `buildKnowledge('en')`

```javascript
{
  documents: [
    // 5 Expertise documents
    { id: 'expertise-frontend-en', type: 'expertise', ... },
    { id: 'expertise-backend-en', type: 'expertise', ... },
    { id: 'expertise-testing-en', type: 'expertise', ... },
    { id: 'expertise-data-en', type: 'expertise', ... },
    { id: 'expertise-cloud-en', type: 'expertise', ... },
    
    // 2 Project documents
    { id: 'project-deal-advisor-en', type: 'project', ... },
    { id: 'project-data-brew-en', type: 'project', ... },
    
    // 4 Venture documents (1 parent + 3 sub-projects)
    { id: 'venture-braveup-en', type: 'venture', ... },
    { id: 'venture-braveup-platform-en', type: 'venture_project', ... },
    { id: 'venture-braveup-website-en', type: 'venture_project', ... },
    { id: 'venture-braveup-admin-en', type: 'venture_project', ... },
    
    // 1 Personal info document
    { id: 'personal-info-en', type: 'personal', ... }
  ],
  
  chunks: [
    // ~5-7 expertise chunks (1 per expertise category)
    // ~2-3 project chunks (1 per project)
    // ~8-10 venture chunks (venture story + cards + sub-projects)
    // ~2-3 personal chunks (bio + contact)
    // Total: ~20-25 chunks
  ],
  
  metadata: {
    language: 'en',
    totalDocuments: 13,
    totalChunks: 23,
    categories: ['expertise', 'projects', 'ventures', 'personal_info'],
    domains: ['frontend', 'backend', 'ai', 'cloud', 'testing', 'data', 'leadership'],
    generatedAt: '2026-07-02T12:34:56.789Z'
  }
}
```

---

## 🔮 Future Considerations (Out of Scope)

These are **NOT implemented** but the architecture supports them:

1. **Embeddings Generation**
   - Add `embedding: Float32Array` field to `KnowledgeChunk`
   - Create `embeddingBuilder.js` that calls WebLLM/Transformers.js

2. **Semantic Search**
   - Create `search/vectorSearch.js`
   - Implement cosine similarity search over embeddings

3. **Cache Layer**
   - Cache built knowledge in localStorage/IndexedDB
   - Invalidate on data changes

4. **Resume/PDF Content**
   - Add `resumeMapper.js` to extract text from PDF
   - Split into chunks with `chunkSplitter.js`

5. **Dynamic Content**
   - Add blog posts, articles
   - Pull from external APIs (Medium, Dev.to)

---

## ✅ Implementation Checklist

### Phase 1: Foundation
- [ ] Create folder structure
- [ ] Define types in `types/KnowledgeTypes.js`
- [ ] Create constants in `constants.js`
- [ ] Set up public API in `index.js`

### Phase 2: Utilities
- [ ] Implement `normalize.js`
- [ ] Implement `chunkSplitter.js`
- [ ] Add test helpers

### Phase 3: Mappers
- [ ] Create `translationMapper.js`
- [ ] Create `dataMapper.js`
- [ ] Create `expertiseMapper.js`
- [ ] Create `projectMapper.js`
- [ ] Create `ventureMapper.js`

### Phase 4: Builder
- [ ] Implement `knowledgeBuilder.js`
- [ ] Implement `buildExpertiseDocuments`
- [ ] Implement `buildProjectDocuments`
- [ ] Implement `buildVentureDocuments`
- [ ] Implement `buildPersonalDocument`
- [ ] Add validation logic

### Phase 5: Testing
- [ ] Console test with `buildKnowledge('en')`
- [ ] Console test with `buildKnowledge('es')`
- [ ] Verify chunk count (~20-25 per language)
- [ ] Verify all categories present
- [ ] Verify metadata accuracy

---

## 🎯 Success Criteria

✅ **Complete** when:
1. `buildKnowledge('en')` returns ~20-25 normalized chunks
2. `buildKnowledge('es')` returns ~20-25 normalized chunks
3. All chunks have proper category, source, and metadata
4. No duplication of content from translations
5. All data merged correctly (translation text + data technologies)
6. Each chunk has estimated token count
7. Documents properly linked to their chunks
8. Console logs show structured, searchable knowledge

✅ **Out of Scope** (intentionally not implemented):
- Embeddings generation
- Semantic search
- AI integration
- Vector databases

---

## 📚 Related Documentation

- Main feature: `/src/features/ai-assistant/README.md`
- Integration: `/src/features/ai-assistant/INTEGRATION.md`
- Mobile: `/src/features/ai-assistant/MOBILE_TABLET.md`

---

**Knowledge Layer Architecture Plan Complete** 🧠✨

Ready to implement when approved!
