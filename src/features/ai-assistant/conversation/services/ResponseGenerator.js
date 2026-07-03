/**
 * ResponseGenerator Service
 * 
 * SRP: Generates mock responses from knowledge search results
 * DRY: Centralized response formatting logic
 */

import { CONVERSATION_CONFIG } from '../config/conversationConfig.js';

/**
 * Service for generating assistant responses
 */
export class ResponseGenerator {
  /**
   * Generate a mock response from search results
   * @param {string} userMessage - User's message
   * @param {import('../types/conversation.types').SearchResult[]} searchResults - Knowledge search results
   * @param {string} language - Current language
   * @returns {import('../types/conversation.types').ResponseData} Response data
   */
  generateMockResponse(userMessage, searchResults, language) {
    const startTime = Date.now();
    
    let content;
    
    if (searchResults.length === 0) {
      content = this.generateNoResultsResponse(userMessage, language);
    } else {
      content = this.formatResponseFromResults(searchResults, userMessage, language);
    }
    
    const processingTime = Date.now() - startTime;
    
    return {
      content,
      metadata: {
        searchResults: searchResults.map(r => r.chunk.id),
        processingTime,
        model: 'mock-v1',
        tokens: this.estimateTokens(content),
      },
    };
  }

  /**
   * Format response from search results
   * @param {import('../types/conversation.types').SearchResult[]} results - Search results
   * @param {string} userMessage - User's message
   * @param {string} language - Current language
   * @returns {string} Formatted response
   */
  formatResponseFromResults(results, userMessage, language) {
    // Sort by score (highest first)
    const sorted = [...results].sort((a, b) => b.score - a.score);
    const topResults = sorted.slice(0, CONVERSATION_CONFIG.MAX_SEARCH_RESULTS);
    
    // Build response from chunks
    const parts = [];
    
    topResults.forEach((result, index) => {
      const chunk = result.chunk;
      
      // Add chunk content
      if (chunk.content) {
        parts.push(chunk.content);
      }
      
      // Add relevant metadata context
      if (chunk.metadata) {
        const meta = chunk.metadata;
        
        // Add technologies if present
        if (meta.technologies && meta.technologies.length > 0) {
          const techList = meta.technologies.slice(0, 5).join(', ');
          parts.push(`\n${language === 'es' ? 'Tecnologías' : 'Technologies'}: ${techList}`);
        }
        
        // Add links if present
        if (meta.link) {
          parts.push(`\n${language === 'es' ? 'Más información' : 'More info'}: ${meta.link}`);
        }
      }
      
      // Add separator between chunks (except last)
      if (index < topResults.length - 1) {
        parts.push('\n\n');
      }
    });
    
    let response = parts.join('');
    
    // Ensure response has reasonable length
    if (response.length < CONVERSATION_CONFIG.MOCK_RESPONSE_MIN_LENGTH) {
      response = this.expandResponse(response, userMessage, language);
    }
    
    if (response.length > CONVERSATION_CONFIG.MOCK_RESPONSE_MAX_LENGTH) {
      response = this.truncateResponse(response, CONVERSATION_CONFIG.MOCK_RESPONSE_MAX_LENGTH);
    }
    
    return response;
  }

  /**
   * Generate response when no results found
   * @param {string} userMessage - User's message
   * @param {string} language - Current language
   * @returns {string} No results response
   */
  generateNoResultsResponse(userMessage, language) {
    if (language === 'es') {
      return 'Lo siento, no encontré información específica sobre eso en mi base de conocimientos. ¿Puedes reformular tu pregunta o probar con otro tema?';
    }
    
    return "I apologize, but I couldn't find specific information about that in my knowledge base. Could you rephrase your question or try asking about something else?";
  }

  /**
   * Expand a short response
   * @param {string} response - Current response
   * @param {string} userMessage - User's message
   * @param {string} language - Current language
   * @returns {string} Expanded response
   */
  expandResponse(response, userMessage, language) {
    const prefix = language === 'es' 
      ? 'Basado en tu pregunta: '
      : 'Based on your question: ';
    
    return `${prefix}\n\n${response}`;
  }

  /**
   * Truncate a long response
   * @param {string} response - Response to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string} Truncated response
   */
  truncateResponse(response, maxLength) {
    if (response.length <= maxLength) {
      return response;
    }
    
    // Try to truncate at sentence boundary
    const truncated = response.slice(0, maxLength);
    const lastPeriod = truncated.lastIndexOf('.');
    const lastNewline = truncated.lastIndexOf('\n');
    
    const cutPoint = Math.max(lastPeriod, lastNewline);
    
    if (cutPoint > maxLength * 0.8) {
      return truncated.slice(0, cutPoint + 1);
    }
    
    return truncated + '...';
  }

  /**
   * Estimate token count (rough approximation)
   * @param {string} text - Text to estimate
   * @returns {number} Estimated token count
   */
  estimateTokens(text) {
    // Rough estimate: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  /**
   * Format response as markdown
   * @param {string} text - Text to format
   * @returns {string} Markdown formatted text
   */
  formatAsMarkdown(text) {
    // Simple markdown formatting
    let formatted = text;
    
    // Format bullet points
    formatted = formatted.replace(/^- /gm, '• ');
    
    // Format bold
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '**$1**');
    
    return formatted;
  }
}
