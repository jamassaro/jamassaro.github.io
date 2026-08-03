import type { NewsArticle } from '../types/news.js';

/**
 * Build analysis prompt from news articles
 */
export function buildAnalysisPrompt(articles: NewsArticle[]): string {
  // Format articles for the prompt
  const articlesText = articles
    .slice(0, 30) // Limit to avoid token limits
    .map((article, index) => {
      return `${index + 1}. [${article.source}] ${article.title}
   Category: ${article.category}
   Summary: ${article.description.substring(0, 200)}${article.description.length > 200 ? '...' : ''}
   Date: ${new Date(article.publishedAt).toLocaleDateString()}`;
    })
    .join('\n\n');
  
  const sources = [...new Set(articles.map(a => a.source))].join(', ');
  
  return `You are a senior software engineering analyst. Analyze these ${articles.length} technology news articles from ${sources} and provide strategic insights for software engineers.

ARTICLES (${articles.length} total):
${articlesText}

ANALYSIS INSTRUCTIONS:
1. Identify 3-5 MAJOR TRENDS across all articles (not individual article summaries)
2. Focus on what matters most to software engineers and technical leaders
3. Look for recurring themes, patterns, and connections between stories
4. Ignore one-off stories unless they signal major shifts
5. Be concise, objective, and actionable
6. Consider: technology adoption, industry shifts, developer tools, infrastructure, AI/ML, hardware, policy

OUTPUT FORMAT:
Return ONLY valid JSON matching this exact structure (no markdown, no code blocks, no extra text):

{
  "executiveSummary": "2-3 sentences summarizing the most important developments in today's tech news",
  "takeaways": [
    {
      "title": "Concise trend name (3-5 words)",
      "description": "Why this trend matters to engineers (1-2 sentences, actionable)"
    }
  ],
  "trends": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "worthWatching": [
    "Emerging trend or development to monitor (1 sentence)",
    "Another future-looking insight (1 sentence)"
  ],
  "engineeringPerspective": [
    "Specific technical insight or recommendation for engineers",
    "Another practical takeaway for developers",
    "A third actionable insight"
  ],
  "statistics": {
    "totalArticles": ${articles.length},
    "totalSources": ${new Set(articles.map(a => a.source)).size},
    "mostMentionedTopics": ["topic1", "topic2", "topic3"]
  }
}

IMPORTANT: Return ONLY the JSON object. No explanations, no markdown, no code blocks.`;
}
