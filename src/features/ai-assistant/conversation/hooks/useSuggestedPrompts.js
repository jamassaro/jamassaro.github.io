/**
 * useSuggestedPrompts Hook
 * 
 * SRP: Manages suggested prompts (static + dynamic)
 * DRY: Centralized prompt generation and selection
 */

import { useState, useEffect, useCallback } from 'react';
import { STATIC_PROMPTS, getPromptById } from '../config/suggestedPrompts.js';
import { CONVERSATION_CONFIG } from '../config/conversationConfig.js';

/**
 * Hook for managing suggested prompts
 * @param {import('../types/conversation.types').ConversationState} conversationState - Current conversation state
 * @param {Object} [options] - Hook options
 * @param {number} [options.maxSuggestions] - Maximum prompts to show
 * @returns {Object} Prompt operations
 */
export function useSuggestedPrompts(conversationState, options = {}) {
  const {
    maxSuggestions = CONVERSATION_CONFIG.MAX_SUGGESTIONS,
  } = options;

  const [prompts, setPrompts] = useState(
    STATIC_PROMPTS.slice(0, maxSuggestions)
  );

  /**
   * Generate contextual prompts based on conversation
   * @returns {import('../types/conversation.types').SuggestedPrompt[]} Dynamic prompts
   */
  const generateContextualPrompts = useCallback(() => {
    const contextual = [];
    const messageCount = conversationState.messages.length;
    
    // If no messages, return empty (use static prompts)
    if (messageCount === 0) {
      return contextual;
    }

    // Get last user message
    const lastUserMsg = conversationState.messages
      .filter(msg => msg.role === 'user')
      .pop();

    if (!lastUserMsg) return contextual;

    const content = lastUserMsg.content.toLowerCase();

    // Generate follow-up questions based on keywords
    if (content.includes('react') || content.includes('frontend')) {
      contextual.push({
        id: 'context-react-projects',
        text: 'What React projects have you built?',
        category: 'projects',
        icon: '⚛️',
        relevanceScore: 0.9,
      });
    }

    if (content.includes('backend') || content.includes('api')) {
      contextual.push({
        id: 'context-backend-experience',
        text: 'Tell me about your API development experience',
        category: 'expertise',
        icon: '⚙️',
        relevanceScore: 0.9,
      });
    }

    if (content.includes('brave up') || content.includes('braveup')) {
      contextual.push({
        id: 'context-braveup-tech',
        text: 'What technologies did Brave Up! use?',
        category: 'ventures',
        icon: '🔧',
        relevanceScore: 0.95,
      });
    }

    if (content.includes('project') || content.includes('work')) {
      contextual.push({
        id: 'context-project-challenges',
        text: 'What were the biggest challenges?',
        category: 'projects',
        icon: '💪',
        relevanceScore: 0.85,
      });
    }

    if (content.includes('ai') || content.includes('ml') || content.includes('machine learning')) {
      contextual.push({
        id: 'context-ai-projects',
        text: 'What AI/ML projects have you worked on?',
        category: 'expertise',
        icon: '🤖',
        relevanceScore: 0.9,
      });
    }

    return contextual;
  }, [conversationState.messages]);

  /**
   * Rank prompts by relevance
   * @param {import('../types/conversation.types').SuggestedPrompt[]} allPrompts - All available prompts
   * @returns {import('../types/conversation.types').SuggestedPrompt[]} Ranked prompts
   */
  const rankPrompts = useCallback((allPrompts) => {
    return [...allPrompts].sort((a, b) => {
      const scoreA = a.relevanceScore || 0.5;
      const scoreB = b.relevanceScore || 0.5;
      return scoreB - scoreA;
    });
  }, []);

  /**
   * Filter already used prompts
   * @param {import('../types/conversation.types').SuggestedPrompt[]} allPrompts - All prompts
   * @returns {import('../types/conversation.types').SuggestedPrompt[]} Filtered prompts
   */
  const filterUsedPrompts = useCallback((allPrompts) => {
    const userMessages = conversationState.messages
      .filter(msg => msg.role === 'user')
      .map(msg => msg.content.toLowerCase());

    return allPrompts.filter(prompt => {
      const promptText = prompt.text.toLowerCase();
      return !userMessages.some(msg => msg.includes(promptText.slice(0, 20)));
    });
  }, [conversationState.messages]);

  /**
   * Update prompts based on conversation context
   */
  const updatePrompts = useCallback(() => {
    const contextual = generateContextualPrompts();
    
    // Combine static and contextual prompts
    const combined = [...contextual, ...STATIC_PROMPTS];
    
    // Filter out used prompts
    const unused = filterUsedPrompts(combined);
    
    // Rank by relevance
    const ranked = rankPrompts(unused);
    
    // Take top N
    const topPrompts = ranked.slice(0, maxSuggestions);
    
    setPrompts(topPrompts);
  }, [
    generateContextualPrompts,
    filterUsedPrompts,
    rankPrompts,
    maxSuggestions,
  ]);

  /**
   * Select a prompt by ID
   * @param {string} promptId - Prompt ID to select
   * @returns {string|null} Prompt text or null if not found
   */
  const selectPrompt = useCallback((promptId) => {
    const prompt = prompts.find(p => p.id === promptId) || getPromptById(promptId);
    return prompt?.text || null;
  }, [prompts]);

  /**
   * Get prompts by category
   * @param {import('../types/conversation.types').PromptCategory} category - Category to filter
   * @returns {import('../types/conversation.types').SuggestedPrompt[]} Filtered prompts
   */
  const getPromptsByCategory = useCallback((category) => {
    return prompts.filter(p => p.category === category);
  }, [prompts]);

  /**
   * Refresh prompts manually
   */
  const refreshPrompts = useCallback(() => {
    updatePrompts();
  }, [updatePrompts]);

  // Update prompts when conversation changes
  useEffect(() => {
    if (CONVERSATION_CONFIG.UPDATE_SUGGESTIONS_ON_MESSAGE) {
      updatePrompts();
    }
  }, [conversationState.messages.length, updatePrompts]);

  // Initialize prompts on mount
  useEffect(() => {
    updatePrompts();
  }, [updatePrompts]);

  return {
    // State
    prompts,
    
    // Actions
    selectPrompt,
    refreshPrompts,
    
    // Queries
    getPromptsByCategory,
  };
}
