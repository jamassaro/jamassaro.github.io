/**
 * Search Constants
 * 
 * SRP: Single source of truth for all search configuration.
 */

/**
 * Search configuration
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

/**
 * Search strategy types
 */
export const SEARCH_STRATEGIES = {
  KEYWORD: 'keyword',
  EMBEDDING: 'embedding', // Future
  HYBRID: 'hybrid',       // Future
};

/**
 * Common English stop words
 */
export const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were',
  'i', 'you', 'he', 'she', 'it', 'we', 'they',
  'what', 'which', 'who', 'when', 'where', 'why', 'how',
  'can', 'could', 'would', 'should', 'do', 'does', 'did',
  'have', 'has', 'had', 'be', 'been', 'being',
  'to', 'from', 'in', 'on', 'at', 'by', 'for', 'with',
  'about', 'tell', 'me', 'your', 'my', 'and', 'or', 'but',
]);

/**
 * Technical terms to preserve (case-insensitive matching, but preserve original)
 */
export const TECHNICAL_TERMS_PATTERN = /\b(React|TypeScript|JavaScript|Python|Node\.?js|Next\.?js|AWS|GCP|Azure|Docker|Kubernetes|PostgreSQL|MongoDB|Redis|GraphQL|REST|API|AI|ML|DL|NLP|SQL|NoSQL|CSS|HTML|Tailwind|FastAPI|Django|Flask|Express|Vue|Angular|Svelte|Git|GitHub|GitLab|CI\/CD|DevOps|Agile|Scrum|TDD|BDD|Vitest|Jest|Cypress|Playwright|WebGL|Three\.js|D3\.js|Chart\.js|Webpack|Vite|Babel|ESLint|Prettier|CloudFront|S3|Lambda|EC2|RDS|DynamoDB|BigQuery|Vertex|Claude|OpenAI|GPT|BERT|Transformer)\b/gi;
