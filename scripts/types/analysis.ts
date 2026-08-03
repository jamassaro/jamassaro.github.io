/**
 * AI-generated analysis of news articles
 */
export interface NewsAnalysis {
  generatedAt: string;
  executiveSummary: string;
  takeaways: {
    title: string;
    description: string;
  }[];
  trends: string[];
  worthWatching: string[];
  engineeringPerspective: string[];
  statistics: {
    totalArticles: number;
    totalSources: number;
    mostMentionedTopics: string[];
  };
}

/**
 * Ollama API response format
 */
export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
  eval_duration?: number;
}

/**
 * Ollama health check response
 */
export interface OllamaHealth {
  models?: Array<{
    name: string;
    size: number;
    digest: string;
  }>;
}
