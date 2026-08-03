import type { NewsArticle } from '../types/news.js';

/**
 * Build analysis prompt from news articles
 */
export function buildAnalysisPrompt(articles: NewsArticle[]): string {
  // Format articles for the prompt with more context
  const articlesText = articles
    .slice(0, 30) // Limit to avoid token limits
    .map((article, index) => {
      // Keep more description text for better context
      const description = article.description.length > 400 
        ? article.description.substring(0, 400) + '...' 
        : article.description;
      
      return `${index + 1}. [${article.source}] ${article.title}
   ${description}`;
    })
    .join('\n\n');
  
  const sources = [...new Set(articles.map(a => a.source))].join(', ');
  
  return `You are a senior technology analyst. Analyze these ${articles.length} recent technology news articles from ${sources} and identify the most important trends and insights for software engineers and tech professionals.

READ THESE ARTICLES CAREFULLY:
${articlesText}

ANALYSIS INSTRUCTIONS:
1. Read ALL article descriptions thoroughly - they contain the key details
2. Identify 3-5 MAJOR TRENDS by finding common themes across multiple articles
3. Focus on: AI/ML developments, hardware releases, industry shifts, supply chain issues, pricing changes, new products
4. Ignore one-off entertainment/music stories unless they relate to technology trends
5. Base your analysis ONLY on the articles provided - don't invent trends
6. Be specific and cite actual article topics (e.g., "MacBook Air supply shortages", "AirPods with cameras", "Xbox pricing")

OUTPUT FORMAT:
Return ONLY valid JSON matching this exact structure (no markdown, no code blocks, no extra text):

{
  "executiveSummary": "2-3 sentences summarizing the most important developments based on the articles above",
  "takeaways": [
    {
      "title": "Specific trend from articles (3-6 words)",
      "description": "Why this matters to engineers, citing specific articles (1-2 sentences)"
    }
  ],
  "trends": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "worthWatching": [
    "Emerging development mentioned in articles (1 sentence)",
    "Another insight from the articles (1 sentence)"
  ],
  "engineeringPerspective": [
    "Technical insight based on articles (cite specific topics)",
    "Another practical takeaway from the news",
    "A third actionable insight"
  ],
  "statistics": {
    "totalArticles": ${articles.length},
    "totalSources": ${new Set(articles.map(a => a.source)).size},
    "mostMentionedTopics": ["topic1", "topic2", "topic3"]
  }
}

IMPORTANT: Base your analysis on the actual articles provided. Mention specific topics like product names, companies, and technologies that appear in the articles.

IMPORTANT: Return ONLY the JSON object. No explanations, no markdown, no code blocks.`;
}
