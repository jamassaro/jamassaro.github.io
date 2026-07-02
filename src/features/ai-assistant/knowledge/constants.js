/**
 * Knowledge Layer Constants
 * 
 * Centralized configuration for categories, domains, and constraints.
 * Follows SRP: Single source of truth for all knowledge classifications.
 */

/**
 * Primary knowledge categories
 */
export const PRIMARY_CATEGORIES = {
  PERSONAL_INFO: 'personal_info',
  EXPERTISE: 'expertise',
  PROJECTS: 'projects',
  VENTURES: 'ventures',
  TECHNOLOGIES: 'technologies',
  EXPERIENCE: 'experience',
};

/**
 * Knowledge domains (cross-cutting concerns)
 */
export const DOMAINS = {
  FRONTEND: 'frontend',
  BACKEND: 'backend',
  AI: 'ai',
  CLOUD: 'cloud',
  TESTING: 'testing',
  DATA: 'data',
  LEADERSHIP: 'leadership',
  PRODUCT: 'product',
};

/**
 * Document types
 */
export const DOCUMENT_TYPES = {
  EXPERTISE: 'expertise',
  PROJECT: 'project',
  VENTURE: 'venture',
  VENTURE_PROJECT: 'venture_project',
  PERSONAL: 'personal',
  TECHNOLOGY: 'technology',
};

/**
 * Source types
 */
export const SOURCE_TYPES = {
  TRANSLATION: 'translation',
  DATA: 'data',
  HYBRID: 'hybrid',
};

/**
 * Supported languages
 */
export const SUPPORTED_LANGUAGES = ['en', 'es'];

/**
 * Chunk size constraints
 */
export const CHUNK_CONSTRAINTS = {
  MAX_CHARS: 2000,
  MAX_TOKENS: 500,
  OVERLAP_CHARS: 200,
  CHARS_PER_TOKEN: 4, // Rough approximation
};

/**
 * Expertise category mapping (i18n key → domain)
 */
export const EXPERTISE_DOMAIN_MAP = {
  frontend: DOMAINS.FRONTEND,
  backend: DOMAINS.BACKEND,
  'testing-reliability': DOMAINS.TESTING,
  'data-intelligence': DOMAINS.DATA,
  'cloud-devops': DOMAINS.CLOUD,
};

/**
 * Technology to domain mapping
 */
export const TECH_DOMAIN_MAP = {
  React: DOMAINS.FRONTEND,
  'Next.js': DOMAINS.FRONTEND,
  TypeScript: DOMAINS.FRONTEND,
  Tailwind: DOMAINS.FRONTEND,
  'Node.js': DOMAINS.BACKEND,
  Python: DOMAINS.BACKEND,
  FastAPI: DOMAINS.BACKEND,
  Claude: DOMAINS.AI,
  OpenAI: DOMAINS.AI,
  'Vertex AI': DOMAINS.AI,
  AWS: DOMAINS.CLOUD,
  GCP: DOMAINS.CLOUD,
  Docker: DOMAINS.CLOUD,
  PostgreSQL: DOMAINS.DATA,
  BigQuery: DOMAINS.DATA,
  Vitest: DOMAINS.TESTING,
  Cypress: DOMAINS.TESTING,
};
