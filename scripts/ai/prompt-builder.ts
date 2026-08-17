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
  
  return `You are a senior technology analyst. Analyze these ${articles.length} recent technology news articles.

⚠️ CRITICAL RULES - FOLLOW EXACTLY:
1. ONLY mention companies/products that appear in the articles below
2. ONLY call something a "trend" if it appears in 3+ articles
3. NEVER invent technical recommendations - only cite what articles explicitly state
4. NEVER misattribute features (e.g., WhatsApp features ≠ Apple features)
5. If an article asks a question (e.g., "how does this work?"), DO NOT present it as answered
6. If an article says "questions remain" or "asks how", acknowledge the uncertainty
7. Distinguish between:
   - Confirmed facts: "SpaceX acquired Cursor"
   - Ongoing talks: "PayPal in negotiations to sell to Stripe"
   - Open questions: "Article asks how watermarking will affect code"
8. NEVER add importance judgments like "highlighting the importance of", "shows the need for"
9. State facts plainly without interpretation

READ THESE ARTICLES CAREFULLY:
${articlesText}

ANALYSIS INSTRUCTIONS:
1. Read ALL article descriptions thoroughly - they contain the key details
2. Identify the 3-5 most important developments (both multi-article trends AND high-impact single stories)
3. PRIORITY HIERARCHY (most important first):
   - Major acquisitions and business deals (e.g., company buyouts, partnerships)
   - Product launches with broad market impact
   - Platform policy changes affecting users/developers
   - Supply chain or regulatory developments
   - Recurring themes across 3+ articles
   - Ignore: routine sales, minor updates, entertainment news
4. Focus on:
   - AI/ML: new models, safety developments, capabilities, acquisitions
   - Business: major acquisitions, partnerships, company sales
   - Hardware: significant product launches (not routine updates)
   - Policy: platform ToS changes, regulatory actions, legal developments
   - Supply chain: actual shortages or sourcing restrictions (not routine restocking)
5. Base your analysis ONLY on the articles provided - don't invent trends
6. Be specific and cite actual article topics (e.g., "MacBook Air supply shortages", "AirPods with cameras", "Xbox pricing")

OUTPUT FORMAT:
Return ONLY valid JSON matching this exact structure (no markdown, no code blocks, no extra text):

{
  "executiveSummary": "2-3 sentences summarizing the most important developments based on the articles above",
  "takeaways": [
    {
      "title": "Specific development or trend (3-6 words)",
      "description": "Concrete impact for engineers with specific examples. Include company names, product names, and dollar amounts when relevant. (2-3 sentences)"
    }
  ],
  "trends": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "worthWatching": [
    "Emerging development mentioned in articles (1 sentence)",
    "Another insight from the articles (1 sentence)"
  ],
  "engineeringPerspective": [
    "Specific technical insight or tool mentioned in articles with actionable advice",
    "Technology, API, or platform change that affects development workflows",
    "Concrete recommendation based on an actual product/service mentioned"
  ],
  "statistics": {
    "totalArticles": ${articles.length},
    "totalSources": ${new Set(articles.map(a => a.source)).size},
    "mostMentionedTopics": ["topic1", "topic2", "topic3"]
  }
}

ENGINEERING PERSPECTIVE GUIDELINES:
- ONLY state facts from the articles - NO speculation, NO recommendations
- NEVER use phrases like:
  ❌ "highlighting the need for..."
  ❌ "developers should consider..."
  ❌ "this shows the potential for..."
  ❌ "expected to enhance..."
  ❌ "signals that developers need to..."
- GOOD EXAMPLES (pure facts):
  ✅ "Claude introduces watermarking for AI-generated content"
  ✅ "ChatGPT's Computer History feature tracks clicks and keystrokes for training data"
  ✅ "Amazon's new terms require arbitration for disputes, blocking class-action suits"
  ✅ "Anthropic's article asks how watermarking will affect code generation"
- BAD EXAMPLES (speculation/recommendations):
  ❌ "Developers should integrate watermarking detection" (invented action)
  ❌ "Highlighting the need to consider watermarking" (invented need)
  ❌ "Expected to enhance AI capabilities" (speculation about future)

VALIDATION CHECKLIST:
Before finalizing, verify:
- Did you mention any acquisitions or major business deals by name?
- Are takeaways specific with company/product names, not just themes?
- Did you distinguish between actual supply chain issues vs. routine sales?
- Are engineering perspectives citing specific tools/technologies from articles?
- Did you avoid inflating minor patterns into "major trends"?

CRITICAL REQUIREMENTS:
1. HIGH-IMPACT SINGLE STORIES: A major acquisition (e.g., "SpaceX acquires Cursor") is MORE important than a weak trend across multiple articles
2. SPECIFIC NAMES: Always include company names, product names, dollar amounts, and version numbers from articles
3. NO INFLATION: Don't call something a "major trend" if it's only 1-2 articles
4. NO GENERIC ADVICE: Every engineering insight must cite a specific tool, product, or technology mentioned in the articles
5. Base your analysis on the actual articles provided - mention specific topics like product names, companies, and technologies that appear in the articles

IMPORTANT: Return ONLY the JSON object. No explanations, no markdown, no code blocks.`;
}
