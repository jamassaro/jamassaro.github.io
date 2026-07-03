/**
 * ContextBuilder Service
 * 
 * SRP: Assembles context from knowledge + history
 * DRY: Centralized context assembly logic
 */

import { getLastMessages, formatMessagesForLLM } from '../core/conversationUtils.js';
import { CONVERSATION_CONFIG } from '../config/conversationConfig.js';

/**
 * Service for building conversation context
 */
export class ContextBuilder {
  /**
   * Build complete context for response generation
   * @param {import('../types/conversation.types').ConversationState} conversationState - Current state
   * @param {import('../types/conversation.types').SearchResult[]} searchResults - Knowledge results
   * @returns {import('../types/conversation.types').ConversationContext} Context object
   */
  buildContext(conversationState, searchResults) {
    return {
      history: this.buildHistory(conversationState.messages),
      knowledge: this.filterSearchResults(searchResults),
      language: conversationState.language,
      systemPrompt: this.buildSystemPrompt(conversationState.language),
    };
  }

  /**
   * Build conversation history (recent messages only)
   * @param {import('../types/conversation.types').Message[]} messages - All messages
   * @returns {import('../types/conversation.types').Message[]} Recent history
   */
  buildHistory(messages) {
    // Get last 5 messages for context (exclude current user message)
    const history = getLastMessages(messages, 5);
    
    // Format for LLM (filter out incomplete messages)
    return formatMessagesForLLM(history);
  }

  /**
   * Filter and rank search results
   * @param {import('../types/conversation.types').SearchResult[]} results - All results
   * @returns {import('../types/conversation.types').SearchResult[]} Filtered results
   */
  filterSearchResults(results) {
    // Filter by minimum score
    const filtered = results.filter(
      r => r.score >= CONVERSATION_CONFIG.MIN_SEARCH_SCORE
    );
    
    // Sort by score (highest first)
    const sorted = [...filtered].sort((a, b) => b.score - a.score);
    
    // Take top N
    return sorted.slice(0, CONVERSATION_CONFIG.MAX_SEARCH_RESULTS);
  }

  /**
   * Build system prompt based on language
   * @param {string} language - Current language
   * @returns {string} System prompt
   */
  buildSystemPrompt(language) {
    if (language === 'es') {
      return `Eres un asistente de IA para el portafolio de un desarrollador de software.
Responde de forma clara, profesional y concisa basándote en el contexto proporcionado.`;
    }
    
    return `You are an AI assistant for a software developer's portfolio.
Answer clearly, professionally, and concisely based on the provided context.`;
  }

  /**
   * Extract relevant metadata from context
   * @param {import('../types/conversation.types').ConversationContext} context - Context
   * @returns {Object} Metadata summary
   */
  extractMetadata(context) {
    const technologies = new Set();
    const categories = new Set();
    
    context.knowledge.forEach(result => {
      if (result.chunk.category) {
        categories.add(result.chunk.category);
      }
      
      if (result.chunk.metadata?.technologies) {
        result.chunk.metadata.technologies.forEach(tech => technologies.add(tech));
      }
    });
    
    return {
      technologies: Array.from(technologies),
      categories: Array.from(categories),
      knowledgeChunks: context.knowledge.length,
      historyLength: context.history.length,
    };
  }

  /**
   * Check if context is sufficient for a good response
   * @param {import('../types/conversation.types').ConversationContext} context - Context
   * @returns {{sufficient: boolean, reason?: string}} Sufficiency check
   */
  validateContext(context) {
    if (context.knowledge.length === 0) {
      return {
        sufficient: false,
        reason: 'No knowledge results found',
      };
    }
    
    // Check if top result has decent score
    const topScore = context.knowledge[0]?.score || 0;
    if (topScore < 0.5) {
      return {
        sufficient: false,
        reason: 'Low confidence in search results',
      };
    }
    
    return { sufficient: true };
  }
}
