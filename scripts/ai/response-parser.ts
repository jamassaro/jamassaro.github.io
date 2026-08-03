import type { NewsAnalysis } from '../types/analysis.js';

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
export function parseAndValidate(response: string): NewsAnalysis {
  try {
    // Extract JSON
    const jsonString = extractJSON(response);
    
    // Parse JSON
    const parsed = JSON.parse(jsonString);
    
    // Validate structure
    validateAnalysis(parsed);
    
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
