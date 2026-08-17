import type { NewsAnalysis } from '../types/analysis.js';
import type { NewsArticle } from '../types/news.js';

/**
 * Validate analysis against source articles for factual accuracy
 */
function validateFactualAccuracy(analysis: any, articles: NewsArticle[]): string[] {
  const warnings: string[] = [];
  const articlesText = articles.map(a => 
    `${a.title.toLowerCase()} ${a.description.toLowerCase()}`
  ).join(' ');
  
  // Check takeaways for unsupported claims
  for (const takeaway of analysis.takeaways) {
    const title = takeaway.title.toLowerCase();
    const desc = takeaway.description.toLowerCase();
    
    // Check for misattribution (WhatsApp feature claimed as Apple)
    if (title.includes('apple') && title.includes('whatsapp')) {
      const whatsappArticle = articles.find(a => 
        a.title.toLowerCase().includes('whatsapp')
      );
      if (whatsappArticle && !whatsappArticle.title.toLowerCase().includes('apple introduces')) {
        warnings.push(`⚠️  Misattribution: "${takeaway.title}" - WhatsApp features are not Apple features`);
      }
    }
    
    // Check for speculative language in descriptions
    if (desc.includes('expected to') || desc.includes('is expected to')) {
      warnings.push(`⚠️  Speculation in takeaway: "${takeaway.title}" contains "expected to"`);
    }
    
    // Check for invented recommendations
    if (desc.includes('should') || desc.includes('consider') || desc.includes('developers need to')) {
      const hasExplicitAdvice = articles.some(a => 
        a.description.toLowerCase().includes('should') ||
        a.description.toLowerCase().includes('recommend')
      );
      if (!hasExplicitAdvice) {
        warnings.push(`⚠️  Invented recommendation in: "${takeaway.title}"`);
      }
    }
  }
  
  // Check engineering perspectives for unsupported claims
  for (const insight of analysis.engineeringPerspective) {
    const lower = insight.toLowerCase();
    
    // Check for importance judgments
    if (lower.includes('highlights the importance') || 
        lower.includes('shows the importance') ||
        lower.includes('emphasizes the need')) {
      warnings.push(`⚠️  Importance judgment added: "${insight.substring(0, 70)}..."`);
    }
    
    // Check for "uses a specific algorithm" or similar invented technical details
    if (lower.includes('uses a') || lower.includes('uses an') || lower.includes('employs')) {
      const hasMethodDescription = articles.some(a => {
        const desc = a.description.toLowerCase();
        return desc.includes('uses a') || desc.includes('algorithm') || desc.includes('method');
      });
      if (!hasMethodDescription) {
        warnings.push(`⚠️  Invented technical detail: "${insight.substring(0, 70)}..."`);
      }
    }
    
    // Check for "need to", "should", "consider" recommendations
    const hasRecommendation = /\b(need to|should|consider|must|require|developers to)\b/.test(lower);
    if (hasRecommendation) {
      const hasExplicitAdvice = articles.some(a => 
        /\b(recommend|should|need to|advise|suggest)\b/.test(a.description.toLowerCase())
      );
      if (!hasExplicitAdvice) {
        warnings.push(`⚠️  Invented recommendation: "${insight.substring(0, 80)}..."`);
      }
    }
    
    // Check for CI/CD claims
    if (lower.includes('ci/cd') || lower.includes('pipeline')) {
      if (!articlesText.includes('ci/cd') && !articlesText.includes('pipeline')) {
        warnings.push(`⚠️  Invented technical detail: CI/CD mentioned but not in articles`);
      }
    }
    
    // Check for "will become" predictions
    if (lower.includes('will become') || lower.includes('signals that')) {
      warnings.push(`⚠️  Overgeneralization: "${insight.substring(0, 60)}..."`);
    }
    
    // Check for "expected to", "showcasing the potential" speculation
    if (lower.includes('expected to') || lower.includes('potential') || lower.includes('highlighting the need')) {
      warnings.push(`⚠️  Speculative language: "${insight.substring(0, 70)}..."`);
    }
    
    // Check for invented integrations
    if (lower.includes('integration') && !articlesText.includes('integrat')) {
      warnings.push(`⚠️  Unsupported integration claim: "${insight.substring(0, 60)}..."`);
    }
  }
  
  // Check trends for weak evidence
  const trendCounts: Record<string, number> = {};
  for (const article of articles) {
    const text = `${article.title} ${article.description}`.toLowerCase();
    for (const trend of analysis.trends) {
      const trendLower = trend.toLowerCase();
      if (text.includes(trendLower)) {
        trendCounts[trend] = (trendCounts[trend] || 0) + 1;
      }
    }
  }
  
  for (const [trend, count] of Object.entries(trendCounts)) {
    if (count < 3) {
      warnings.push(`⚠️  Weak trend: "${trend}" appears in only ${count} article(s), needs 3+`);
    }
  }
  
  return warnings;
}

/**
 * Extract JSON from LLM response (handles markdown code blocks and extra text)
 */
function extractJSON(response: string): string {
  // Remove markdown code blocks
  let cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  
  // Find JSON object
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  
  if (!jsonMatch) {
    throw new Error('No JSON object found in response');
  }
  
  return jsonMatch[0];
}

/**
 * Validate analysis structure
 */
function validateAnalysis(data: any): void {
  const requiredFields = [
    'executiveSummary',
    'takeaways',
    'trends',
    'worthWatching',
    'engineeringPerspective',
    'statistics',
  ];
  
  for (const field of requiredFields) {
    if (!(field in data)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  
  // Validate arrays
  if (!Array.isArray(data.takeaways)) {
    throw new Error('takeaways must be an array');
  }
  
  if (!Array.isArray(data.trends)) {
    throw new Error('trends must be an array');
  }
  
  // Validate takeaways structure
  for (const takeaway of data.takeaways) {
    if (!takeaway.title || !takeaway.description) {
      throw new Error('Each takeaway must have title and description');
    }
  }
  
  // Validate statistics
  if (!data.statistics.totalArticles || !data.statistics.totalSources) {
    throw new Error('statistics must include totalArticles and totalSources');
  }
}

/**
 * Parse and validate AI response
 */
export function parseAndValidate(response: string, articles: NewsArticle[]): NewsAnalysis {
  try {
    // Extract JSON
    const jsonString = extractJSON(response);
    
    // Parse JSON
    const parsed = JSON.parse(jsonString);
    
    // Validate structure
    validateAnalysis(parsed);
    
    // Validate factual accuracy
    const warnings = validateFactualAccuracy(parsed, articles);
    if (warnings.length > 0) {
      console.log('\n⚠️  QUALITY WARNINGS DETECTED:');
      warnings.forEach(w => console.log(`   ${w}`));
      console.log('');
    }
    
    // Add timestamp
    const analysis: NewsAnalysis = {
      ...parsed,
      generatedAt: new Date().toISOString(),
    };
    
    console.log('✅ Response validated successfully');
    return analysis;
    
  } catch (error) {
    console.error('❌ Failed to parse response:', error);
    console.error('Response preview:', response.substring(0, 500));
    throw new Error(`Response parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Create fallback analysis when AI fails
 */
export function createFallbackAnalysis(): NewsAnalysis {
  return {
    generatedAt: new Date().toISOString(),
    executiveSummary: 'AI analysis is temporarily unavailable. Please check back later.',
    takeaways: [],
    trends: [],
    worthWatching: [],
    engineeringPerspective: [],
    statistics: {
      totalArticles: 0,
      totalSources: 0,
      mostMentionedTopics: [],
    },
  };
}
