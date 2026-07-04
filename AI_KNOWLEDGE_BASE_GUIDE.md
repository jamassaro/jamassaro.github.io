# 🧠 AI Knowledge Base Guide

## Where the LLM Gets Its Information

Your AI assistant uses a **Retrieval-Augmented Generation (RAG)** system. The LLM doesn't memorize your portfolio - instead, it **searches relevant information** from a knowledge base when answering questions.

---

## 📂 Knowledge Sources (2 Main Locations)

### 1. **Translation Files** (Main Source)
📍 **Location**: `src/translations/en/translation.json` and `src/translations/es/translation.json`

**What's stored here:**
- Personal bio and contact info
- Expertise descriptions
- Project titles and descriptions
- Venture information (Brave Up!)
- All UI text

**Example from `src/translations/en/translation.json`:**
```json
{
  "main-section": {
    "description": "Building AI-powered products with React, TypeScript, Node.js, Python, and modern cloud technologies. 10+ years of experience taking ideas from 0 → production → scale."
  },
  "expertise": {
    "frontend": {
      "title": "Frontend Engineering",
      "description": "Building modern and responsive user interfaces with React, TypeScript, and cutting-edge web technologies."
    }
  },
  "projects": {
    "project-1": {
      "title": "Brave Up!",
      "description": "Complete ecosystem for mental health support...",
      "summary": "Three platforms working together..."
    }
  }
}
```

**✅ AI reads this!** When you ask "What is Brave Up?", the AI searches this text.

---

### 2. **Data Files** (Metadata & Tech Stack)
📍 **Location**: `src/data/*.js`

**Files:**
- `src/data/projects.js` - Project metadata, tech stack, GitHub links
- `src/data/expertise.js` - Expertise categories and icons  
- `src/data/ventures.js` - Venture details

**Example from `src/data/projects.js`:**
```javascript
{
  id: 1,
  title: 'Brave Up!',
  subtitle: 'Mental Health Ecosystem',
  technologies: ['React', 'TypeScript', 'Node.js', 'Firebase', 'OpenAI', 'Claude AI'],
  github: 'https://github.com/...',
  status: 'active',
  year: 2024,
  // ... more metadata
}
```

**✅ AI reads this too!** When you ask "What technologies did you use in Brave Up?", the AI finds this.

---

## 🔄 How It Works (RAG Pipeline)

```
User Question
    ↓
[1] Semantic Search → Finds relevant chunks from knowledge base
    ↓
[2] Prompt Builder → Combines question + found information
    ↓
[3] LLM → Generates answer based on context
    ↓
Answer to User
```

**Knowledge Base Building Process:**
```
Translation Files + Data Files
    ↓
[Knowledge Mappers] → Break into chunks
    ↓
[Embedding Service] → Convert to vector embeddings
    ↓
[Semantic Search] → Match user questions to chunks
```

---

## ➕ How to Add More Information

### Option 1: Add to Translation Files (Recommended for Text)

**File**: `src/translations/en/translation.json` (and `es/translation.json` for Spanish)

**Example - Add a new skill:**
```json
{
  "expertise": {
    "frontend": {
      "title": "Frontend Engineering",
      "description": "Building modern and responsive user interfaces with React, TypeScript, and cutting-edge web technologies. Focused on performance, accessibility, and exceptional user experiences.",
      // ADD NEW DETAILS HERE:
      "skills": "Expert in React 18, Next.js 14, Vite, Tailwind CSS, and component architecture. Experienced with state management (Redux, Zustand), testing (Vitest, React Testing Library), and build optimization."
    }
  }
}
```

**Example - Add new project:**
```json
{
  "projects": {
    "project-5": {  // New project
      "title": "AI Document Analyzer",
      "description": "Automated document processing system using Claude AI and vector embeddings",
      "summary": "Processes 1000+ documents/hour, extracts key information, generates summaries"
    }
  }
}
```

**📝 Then update Spanish translation:** `src/translations/es/translation.json`

---

### Option 2: Add to Data Files (For Metadata)

**File**: `src/data/projects.js`

**Example - Add project metadata:**
```javascript
export const projects = [
  // ... existing projects
  {
    id: 5,  // Match the project-5 in translations
    title: 'AI Document Analyzer',
    subtitle: 'Document Processing System',
    technologies: ['Python', 'Claude AI', 'FastAPI', 'PostgreSQL', 'Docker'],
    github: 'https://github.com/yourusername/doc-analyzer',
    link: 'https://doc-analyzer.com',
    status: 'active',
    year: 2026,
    category: 'ai',
    featured: true,
  }
];
```

---

### Option 3: Add Personal Information

**File**: `src/translations/en/translation.json`

**Add certifications, education, achievements:**
```json
{
  "main-section": {
    "description": "Building AI-powered products with React, TypeScript, Node.js, Python, and modern cloud technologies. 10+ years of experience taking ideas from 0 → production → scale.",
    // ADD MORE DETAILS:
    "education": "Bachelor's in Computer Science from XYZ University. Certified AWS Solutions Architect and Google Cloud Professional.",
    "achievements": "Built systems processing 1M+ requests/day. Led teams of 5+ engineers. Reduced deployment time by 80%."
  }
}
```

---

## 🔍 Knowledge Mappers (How Data Becomes Searchable)

The system uses **specialized mappers** to convert your data into searchable chunks:

**Files**: `src/features/ai-assistant/knowledge/mappers/`

1. **`personalMapper.js`** - Processes bio and contact info
2. **`expertiseMapper.js`** - Processes expertise descriptions
3. **`projectMapper.js`** - Combines translation text + data metadata
4. **`ventureMapper.js`** - Processes venture information
5. **`translationMapper.js`** - Loads and extracts translations

**Each mapper:**
- Breaks content into chunks (50-500 tokens)
- Adds metadata (category, technologies, etc.)
- Creates searchable IDs
- Normalizes text for better search

---

## 🧪 Testing Your Changes

### Method 1: Browser Console (Quick Test)
1. Open your portfolio: http://localhost:5175/
2. Open Browser Console (F12)
3. Run:
```javascript
// Import knowledge builder
const { buildKnowledge } = await import('/src/features/ai-assistant/knowledge/index.js');

// Build English knowledge
const knowledge = await buildKnowledge('en');

// See all chunks
console.log('Total chunks:', knowledge.chunks.length);
console.log('Categories:', knowledge.metadata.categories);

// Search for specific content
const braveUpChunks = knowledge.chunks.filter(c => 
  c.content.toLowerCase().includes('brave up')
);
console.log('Brave Up chunks:', braveUpChunks);
```

### Method 2: Ask the AI
1. Make your changes to translation or data files
2. Refresh the page (or restart dev server)
3. Enable AI and ask a question about the new information
4. Check if AI finds and uses the new content

---

## 📊 Knowledge Base Statistics

**Current knowledge (as of last build):**
- **~50-100 chunks** total (English + Spanish)
- **Categories**: personal_info, expertise, projects, ventures
- **Domains**: frontend, backend, ai, cloud, testing, data

**Each chunk contains:**
- **Content**: 50-500 tokens of text
- **Category**: Primary (expertise, projects) + Secondary (react, ai, etc.)
- **Domain**: Technical area (frontend, backend, ai)
- **Metadata**: Technologies, links, dates
- **Source**: Where it came from (translation file, data file)

---

## 🎯 Best Practices for Adding Information

### ✅ DO:
- **Be specific**: "Expert in React 18 with 5+ years experience" > "Good at frontend"
- **Include context**: "Built system processing 1M requests/day" > "Built system"
- **Add technologies**: List specific versions and tools
- **Keep chunks focused**: One topic per section
- **Update both languages**: EN and ES

### ❌ DON'T:
- **Duplicate information**: Knowledge system handles combining data automatically
- **Use very short text**: Minimum 20-30 words per description
- **Forget metadata**: Add technologies, years, links in data files
- **Mix languages**: Keep EN in en/ and ES in es/

---

## 🔧 Advanced: Adding Custom Knowledge Categories

If you want to add entirely new sections (e.g., "Certifications", "Publications"):

### Step 1: Add to translations
```json
// src/translations/en/translation.json
{
  "certifications": {
    "tag": "CERTIFICATIONS",
    "title": "Certifications & Training",
    "items": [
      {
        "title": "AWS Solutions Architect Professional",
        "description": "Advanced AWS infrastructure design and implementation",
        "year": "2024"
      }
    ]
  }
}
```

### Step 2: Create new mapper
```javascript
// src/features/ai-assistant/knowledge/mappers/certificationMapper.js
export function buildCertificationKnowledge(certTranslations, language, startIndex) {
  // Similar structure to projectMapper.js
  // Create document and chunks for each certification
}
```

### Step 3: Update knowledge builder
```javascript
// src/features/ai-assistant/knowledge/builders/knowledgeBuilder.js
// Add new extraction and building steps
const certTranslations = extractCertificationTranslations(translations, language);
const certResult = buildCertificationKnowledge(certTranslations, language);
allDocuments.push(...certResult.documents);
allChunks.push(...certResult.chunks);
```

---

## 🚀 Quick Reference

| What to Add | Where to Edit | File Path |
|-------------|---------------|-----------|
| **Bio/Description** | Translation file | `src/translations/en/translation.json` → `main-section` |
| **Expertise Details** | Translation file | `src/translations/en/translation.json` → `expertise` |
| **New Project** | Translation + Data | `src/translations/en/translation.json` → `projects` + `src/data/projects.js` |
| **Technologies Used** | Data file | `src/data/projects.js` → `technologies` array |
| **Contact Info** | Translation file | `src/translations/en/translation.json` → `footer` |
| **Venture Details** | Translation + Data | `src/translations/en/translation.json` → `ventures` + `src/data/ventures.js` |

---

## 🐛 Troubleshooting

**Q: AI doesn't find my new information?**
- ✅ Check: Did you save the file?
- ✅ Check: Did you refresh the browser? (Knowledge rebuilds on page load)
- ✅ Check: Is the text in both `en` and `es` translations?
- ✅ Check: Browser console for errors (F12)

**Q: AI gives outdated information?**
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear cache and reload

**Q: How do I know what chunks were created?**
```javascript
// Browser console
const { buildKnowledge } = await import('/src/features/ai-assistant/knowledge/index.js');
const knowledge = await buildKnowledge('en');
console.table(knowledge.chunks.map(c => ({
  id: c.id,
  category: c.category.primary,
  preview: c.content.substring(0, 50) + '...'
})));
```

---

## 📚 Related Files

- **Knowledge System**: `src/features/ai-assistant/knowledge/`
- **Translation Files**: `src/translations/en/` and `src/translations/es/`
- **Data Files**: `src/data/`
- **Conversation System**: `src/features/ai-assistant/conversation/`
- **Semantic Search**: `src/features/ai-assistant/knowledge/search/`

---

**Need help?** Check the code comments in mapper files - they explain the structure in detail!
