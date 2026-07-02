/**
 * Mock chat messages data
 * Following SRP: Centralized mock data for testing UI
 */

export const mockMessages = [
  {
    id: 'msg-1',
    role: 'user',
    content: 'What AI products has Jose built?',
    timestamp: new Date('2026-07-02T10:00:00'),
  },
  {
    id: 'msg-2',
    role: 'assistant',
    content:
      "Jose has built several AI-powered products including:\n\n• **Deal Advisor** - AI-powered investment analysis tool using GPT-4 and semantic search\n• **DataBrew** - Automated data transformation platform with ML-based recommendations\n• **Education Analytics** - Student performance prediction system using embeddings and vector search\n• **BraveUp Platform** - Social-emotional learning tool with AI-driven insights\n\nAll built with React, TypeScript, Node.js, Python, and modern cloud technologies (GCP, AWS).",
    timestamp: new Date('2026-07-02T10:00:05'),
  },
  {
    id: 'msg-3',
    role: 'user',
    content: 'Tell me about his React and TypeScript experience',
    timestamp: new Date('2026-07-02T10:01:00'),
  },
  {
    id: 'msg-4',
    role: 'assistant',
    content:
      "Jose has 10+ years of React experience and deep TypeScript expertise:\n\n**React Skills:**\n• Modern hooks, context, and state management\n• Performance optimization (code splitting, lazy loading, memoization)\n• Complex UI systems with design systems\n• Server-side rendering and Next.js\n\n**TypeScript Expertise:**\n• Type-safe application architecture\n• Generic types and advanced patterns\n• Integration with React and Node.js backends\n• Migration strategies from JavaScript to TypeScript\n\nHe's built production applications serving thousands of users with excellent performance and maintainability.",
    timestamp: new Date('2026-07-02T10:01:08'),
  },
];
