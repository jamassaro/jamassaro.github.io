# Knowledge Layer Architecture - Visual Guide

## 🎨 System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         KNOWLEDGE LAYER                              │
│                    (Reusable, Language-Agnostic)                     │
└─────────────────────────────────────────────────────────────────────┘

INPUT SOURCES                  MAPPERS                    OUTPUT
═══════════════                ═══════                    ══════

┌──────────────┐              ┌──────────────┐          ┌──────────────┐
│ translation  │              │ Translation  │          │              │
│   .json      │─────────────▶│   Mapper     │          │              │
│  (i18n)      │              └──────────────┘          │              │
└──────────────┘                      │                  │  Knowledge   │
                                      │                  │  Documents   │
┌──────────────┐              ┌──────▼──────┐          │      +       │
│ expertise.js │              │  Expertise  │          │  Knowledge   │
│ projects.js  │─────────────▶│   Mapper    │─────────▶│   Chunks     │
│ ventures.js  │              └──────────────┘          │              │
└──────────────┘                      │                  │  (Normalized,│
        │                             │                  │  Searchable) │
        │                      ┌──────▼──────┐          │              │
        └─────────────────────▶│    Data     │          │              │
                               │   Mapper    │          │              │
                               └──────────────┘          └──────────────┘
```

---

## 🔄 Data Transformation Pipeline

### Step 1: Load Sources
```
translations/en/translation.json
{
  "expertise": {
    "frontend": {
      "description": "Building modern UIs..."
    }
  }
}

data/expertise.js
{
  id: 'frontend',
  technologies: ['React', 'TypeScript', 'Next.js']
}
```

### Step 2: Map to Documents
```
Document {
  id: 'expertise-frontend-en',
  title: 'Frontend Engineering',
  type: 'expertise',
  category: {
    primary: 'expertise',
    secondary: ['frontend', 'react', 'typescript'],
    domain: 'frontend'
  },
  metadata: {
    technologies: ['React', 'TypeScript', 'Next.js'],
    color: 'blue'
  },
  chunkIds: ['chunk-expertise-frontend-001']
}
```

### Step 3: Create Chunks
```
Chunk {
  id: 'chunk-expertise-frontend-001',
  documentId: 'expertise-frontend-en',
  content: 'Frontend Engineering: Building modern and responsive user interfaces with React, TypeScript, and Next.js...',
  category: { primary: 'expertise', secondary: ['frontend'], domain: 'frontend' },
  source: {
    type: 'hybrid',
    file: 'translations/en/translation.json + data/expertise.js',
    path: 'expertise.frontend.description',
    language: 'en'
  },
  metadata: {
    technologies: ['React', 'TypeScript', 'Next.js'],
    explicitTech: true
  },
  tokenCount: 32,
  language: 'en'
}
```

---

## 📂 Folder Structure

```
src/features/ai-assistant/knowledge/
│
├── 📄 KNOWLEDGE_LAYER_PLAN.md          (Full architecture doc)
├── 📄 KNOWLEDGE_LAYER_SUMMARY.md       (Quick overview)
├── 📄 KNOWLEDGE_LAYER_VISUAL.md        (This file)
│
├── 📁 types/
│   ├── KnowledgeTypes.js               (JSDoc type definitions)
│   └── index.js
│
├── 📁 mappers/
│   ├── translationMapper.js            (i18n → chunks)
│   ├── dataMapper.js                   (data → metadata)
│   ├── expertiseMapper.js              (expertise hybrid)
│   ├── projectMapper.js                (project hybrid)
│   ├── ventureMapper.js                (venture hybrid)
│   └── index.js
│
├── 📁 builders/
│   ├── knowledgeBuilder.js             (Main orchestrator)
│   └── index.js
│
├── 📁 utils/
│   ├── normalize.js                    (Text normalization)
│   ├── chunkSplitter.js                (Split large text)
│   └── index.js
│
├── 📄 constants.js                     (Categories, domains)
└── 📄 index.js                         (Public API)
```

---

## 🎯 Type Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                      KnowledgeDocument                       │
│  (Logical grouping - e.g., "Frontend Engineering")          │
├──────────────────────────────────────────────────────────────┤
│  id: 'expertise-frontend-en'                                 │
│  title: 'Frontend Engineering'                               │
│  type: 'expertise'                                           │
│  category: { primary, secondary, domain }                    │
│  metadata: { technologies, color, ... }                      │
│  chunkIds: ['chunk-001', 'chunk-002']  ←─────┐              │
│  language: 'en'                                │              │
└────────────────────────────────────────────────┼──────────────┘
                                                 │
                                                 │ Links to
                                                 │
              ┌──────────────────────────────────┼──────────────┐
              ├──────────────────────────────────▼──────────────┤
              │           KnowledgeChunk                         │
              │  (Smallest searchable unit)                      │
              ├──────────────────────────────────────────────────┤
              │  id: 'chunk-001'                                 │
              │  documentId: 'expertise-frontend-en' ──────┐     │
              │  content: "Building modern UIs..."          │     │
              │  category: { ... }                          │     │
              │  source: { type, file, path, language }     │     │
              │  metadata: { technologies, ... }            │     │
              │  tokenCount: 28                             │     │
              │  language: 'en'                             │     │
              └─────────────────────────────────────────────┼─────┘
                                                            │
                                      References parent ────┘
```

---

## 📊 Category Hierarchy

```
PRIMARY CATEGORIES
├── personal_info
│   ├── bio
│   └── contact
│
├── expertise
│   ├── frontend
│   ├── backend
│   ├── testing
│   ├── data
│   └── cloud
│
├── projects
│   ├── deal-advisor
│   └── data-brew
│
└── ventures
    └── braveup
        ├── platform
        ├── website
        └── admin

DOMAINS (Cross-cutting)
├── frontend (React, TypeScript, Next.js)
├── backend (Node.js, Python, FastAPI)
├── ai (Claude, Vertex AI, LLMs)
├── cloud (AWS, GCP, Docker)
├── testing (Vitest, Cypress, Jest)
├── data (PostgreSQL, BigQuery)
├── leadership (Team building, Strategy)
└── product (Product strategy, UX)
```

---

## 🔄 Mapping Examples

### Example 1: Expertise Mapping

```
INPUT (Translation)
───────────────────
expertise.frontend.description:
"Building modern and responsive user interfaces with React, 
TypeScript, and cutting-edge web technologies."

INPUT (Data)
────────────
expertiseCategories[0]:
{
  id: 'frontend',
  technologies: [
    { name: 'React', icon: ReactLogo },
    { name: 'TypeScript', icon: TypeScriptIcon },
    { name: 'Next.js', icon: NextIcon }
  ]
}

OUTPUT (Enriched Chunk)
───────────────────────
{
  id: 'chunk-expertise-frontend-001',
  content: 'Frontend Engineering: Building modern and responsive 
            user interfaces with React, TypeScript, Next.js, and 
            cutting-edge web technologies.',
  category: {
    primary: 'expertise',
    secondary: ['frontend', 'react', 'typescript', 'nextjs'],
    domain: 'frontend'
  },
  metadata: {
    technologies: ['React', 'TypeScript', 'Next.js'],
    technologyCount: 3,
    explicitMention: true
  },
  source: {
    type: 'hybrid',
    file: 'translations/en/translation.json + data/expertise.js',
    path: 'expertise.frontend.description',
    language: 'en'
  }
}
```

---

### Example 2: Project Mapping

```
INPUT (Translation)
───────────────────
projects.project-1.description:
"Deal Advisor is an AI-powered shopping assistant that analyzes 
reviews, videos, and community discussions."

INPUT (Data)
────────────
projectsData[0]:
{
  id: 'deal-advisor-app',
  technologies: ['Next.js', 'Tailwind', 'TypeScript', 'OpenAI'],
  link: 'https://www.dealadvisorapp.com',
  status: 'completed',
  year: '2026'
}

OUTPUT (Project Chunk)
──────────────────────
{
  id: 'chunk-project-deal-advisor-001',
  content: 'DEAL ADVISOR: AI-powered shopping assistant that 
            analyzes reviews, videos, and community discussions 
            to help people make smarter buying decisions.',
  category: {
    primary: 'projects',
    secondary: ['ai', 'nextjs', 'shopping', 'assistant'],
    domain: 'ai'
  },
  metadata: {
    projectName: 'Deal Advisor',
    technologies: ['Next.js', 'Tailwind', 'TypeScript', 'OpenAI'],
    url: 'https://www.dealadvisorapp.com',
    status: 'completed',
    year: '2026'
  },
  source: {
    type: 'hybrid',
    file: 'translations/en/translation.json + data/projects.js',
    path: 'projects.project-1.description',
    language: 'en'
  }
}
```

---

### Example 3: Venture Mapping (Hierarchical)

```
INPUT (Translation)
───────────────────
venture.description:
"Co-founded and led the technology vision of Brave Up!, 
an EdTech startup focused on student wellbeing..."

venture.cards[0]:
{
  title: "Product Platform",
  description: "Built the web and mobile experience...",
  technologies: ["React", "React Native", "Node.js"]
}

INPUT (Data)
────────────
venturesData[0]:
{
  id: 'braveup-platform',
  technologies: [...],
  url: 'https://app.braveup.co'
}

OUTPUT (Parent Document + Multiple Chunks)
───────────────────────────────────────────
Document: venture-braveup-en
  Chunk 1: Main story (venture description)
  Chunk 2: Product Platform (card 0)
  Chunk 3: AI & Analytics (card 1)
  Chunk 4: Leadership (card 2)

Document: venture-braveup-platform-en
  Chunk 5: Platform details
  
Document: venture-braveup-website-en
  Chunk 6: Website details
  
Document: venture-braveup-admin-en
  Chunk 7: Admin details
```

---

## 🎯 Query Patterns (Future Use)

Once you have the knowledge chunks, you can:

```javascript
// 1. Filter by category
const aiProjects = chunks.filter(c => 
  c.category.secondary.includes('ai')
);

// 2. Filter by domain
const backendKnowledge = chunks.filter(c => 
  c.category.domain === 'backend'
);

// 3. Find by technology
const reactChunks = chunks.filter(c => 
  c.metadata.technologies?.includes('React')
);

// 4. Get document with chunks
const doc = documents.find(d => d.id === 'expertise-frontend-en');
const docChunks = chunks.filter(c => 
  doc.chunkIds.includes(c.id)
);

// 5. Search by content (simple string match)
const searchTerm = 'TypeScript';
const results = chunks.filter(c => 
  c.content.toLowerCase().includes(searchTerm.toLowerCase())
);

// Future: Semantic search with embeddings
// const results = await semanticSearch(query, chunks);
```

---

## 📈 Scalability

```
Current Portfolio Content
├── 5 Expertise areas → 5-7 chunks
├── 2 Projects → 2-3 chunks
├── 1 Venture (3 sub-projects) → 8-10 chunks
├── 1 Personal info → 2-3 chunks
└── Total: ~20-25 chunks per language

Future Expansion (Easy to Add)
├── Blog posts → +N chunks
├── Resume/CV content → +M chunks
├── GitHub projects → +P chunks
├── Certifications → +C chunks
└── Dynamic API content → +D chunks
```

---

## 🚀 Implementation Flow

```
Phase 1: Foundation (Types + Constants)
  ↓
Phase 2: Utilities (Normalize + ChunkSplitter)
  ↓
Phase 3: Mappers (Translation + Data + Hybrid)
  ↓
Phase 4: Builder (Orchestrate everything)
  ↓
Phase 5: Testing (Console tests)
  ↓
✅ Complete: buildKnowledge('en') works!
```

---

## ✅ Validation Checklist

```
☐ All chunks have unique IDs
☐ All chunks reference valid documentIds
☐ All documents have at least one chunk
☐ No duplicate content from same source
☐ All chunks have category information
☐ All chunks have source information
☐ Token counts are reasonable (< 500 per chunk)
☐ English and Spanish produce same structure
☐ Technologies are preserved in metadata
☐ URLs and links are included in metadata
```

---

**Visual Guide Complete** 📊✨

Ready to implement when you approve the plan!
