/**
 * Architecture panel data
 * Following SRP: Centralized technical documentation data
 */

export const pipelineSteps = [
  {
    number: 1,
    label: 'User question parsed by local LLM',
  },
  {
    number: 2,
    label: 'Portfolio content converted to embeddings',
  },
  {
    number: 3,
    label: 'Vector similarity search (FAISS)',
  },
  {
    number: 4,
    label: 'Context injected into prompt',
  },
  {
    number: 5,
    label: 'AI generates answer from context',
  },
];

export const techBadges = [
  {
    id: 'badge-1',
    label: 'Vite + React',
    variant: 'tech',
  },
  {
    id: 'badge-2',
    label: 'TypeScript',
    variant: 'tech',
  },
  {
    id: 'badge-3',
    label: 'WebLLM (Llama 3.2)',
    variant: 'tech',
  },
  {
    id: 'badge-4',
    label: 'Transformers.js',
    variant: 'tech',
  },
  {
    id: 'badge-5',
    label: 'FAISS',
    variant: 'tech',
  },
];

export const featureBadges = [
  {
    id: 'feature-1',
    label: '100% Local',
    variant: 'feature',
  },
  {
    id: 'feature-2',
    label: 'No API Keys',
    variant: 'feature',
  },
  {
    id: 'feature-3',
    label: 'Privacy First',
    variant: 'feature',
  },
];

export const architectureContent = {
  title: 'LOCAL_RAG_PIPELINE',
  subtitle: 'Retrieval-Augmented Generation',
  howItWorksTitle: 'HOW_IT_WORKS',
  howItWorksContent:
    'This demo uses a local Large Language Model running entirely in your browser via WebGPU. Portfolio content is embedded and stored locally. When you ask a question, the system retrieves relevant context and generates accurate answers - all without sending data to external servers.',
  disclaimer:
    'Note: This is a UI demonstration. Actual AI implementation would require WebLLM, Transformers.js, and FAISS integration.',
};
