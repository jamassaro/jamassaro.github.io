/**
 * Static suggested prompts configuration
 * 
 * SRP: Manages only prompt definitions
 * DRY: Centralized prompt library
 */

/**
 * Static prompt library
 * These prompts are always available regardless of conversation context
 * @type {import('../types/conversation.types').SuggestedPrompt[]}
 */
export const STATIC_PROMPTS = [
  // Expertise prompts
  {
    id: 'expertise-react',
    text: 'What is your React experience?',
    category: 'expertise',
    icon: '⚛️',
  },
  {
    id: 'expertise-backend',
    text: 'Tell me about your backend skills',
    category: 'expertise',
    icon: '⚙️',
  },
  {
    id: 'expertise-ai',
    text: 'What AI/ML experience do you have?',
    category: 'expertise',
    icon: '🤖',
  },
  
  // Project prompts
  {
    id: 'projects-recent',
    text: 'Tell me about your recent projects',
    category: 'projects',
    icon: '💼',
  },
  {
    id: 'projects-tech',
    text: 'What technologies have you worked with?',
    category: 'projects',
    icon: '🔧',
  },
  
  // Venture prompts
  {
    id: 'ventures-braveup',
    text: 'What is Brave Up!?',
    category: 'ventures',
    icon: '🚀',
  },
  {
    id: 'ventures-role',
    text: 'What was your role at Brave Up!?',
    category: 'ventures',
    icon: '👨‍💻',
  },
  
  // General prompts
  {
    id: 'general-contact',
    text: 'How can I contact you?',
    category: 'general',
    icon: '📧',
  },
  {
    id: 'general-availability',
    text: 'Are you available for work?',
    category: 'general',
    icon: '💼',
  },
  {
    id: 'general-skills',
    text: 'What are your top skills?',
    category: 'general',
    icon: '⭐',
  },
];

/**
 * Prompt categories with metadata
 */
export const PROMPT_CATEGORIES = {
  expertise: {
    name: 'Expertise',
    icon: '🎯',
    description: 'Questions about technical skills and experience',
  },
  projects: {
    name: 'Projects',
    icon: '💼',
    description: 'Questions about specific projects and work',
  },
  ventures: {
    name: 'Ventures',
    icon: '🚀',
    description: 'Questions about entrepreneurial ventures',
  },
  general: {
    name: 'General',
    icon: '💬',
    description: 'General questions and contact information',
  },
};

/**
 * Get prompts by category
 * @param {import('../types/conversation.types').PromptCategory} category - Category to filter by
 * @returns {import('../types/conversation.types').SuggestedPrompt[]} Filtered prompts
 */
export function getPromptsByCategory(category) {
  return STATIC_PROMPTS.filter(prompt => prompt.category === category);
}

/**
 * Get prompt by ID
 * @param {string} id - Prompt ID
 * @returns {import('../types/conversation.types').SuggestedPrompt|undefined} Prompt or undefined
 */
export function getPromptById(id) {
  return STATIC_PROMPTS.find(prompt => prompt.id === id);
}

/**
 * Get random prompts
 * @param {number} count - Number of prompts to return
 * @returns {import('../types/conversation.types').SuggestedPrompt[]} Random prompts
 */
export function getRandomPrompts(count) {
  const shuffled = [...STATIC_PROMPTS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
