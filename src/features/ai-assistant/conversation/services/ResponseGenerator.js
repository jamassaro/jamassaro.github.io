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
    
    // Extract key information
    const mainChunk = topResults[0].chunk;
    const technologies = new Set();
    const relatedTopics = [];
    
    topResults.forEach(result => {
      if (result.chunk.metadata?.technologies) {
        result.chunk.metadata.technologies.forEach(tech => technologies.add(tech));
      }
      if (result.chunk.metadata?.category) {
        relatedTopics.push(result.chunk.metadata.category);
      }
    });
    
    // Generate concise answer (2-3 sentences max)
    const answer = this.generateConciseAnswer(mainChunk, technologies, language);
    
    // Generate follow-up questions
    const followUps = this.generateFollowUps(topResults, relatedTopics, technologies, language);
    
    // Format with FOLLOW_UPS section
    return `${answer}\n\nFOLLOW_UPS:\n${followUps.map(q => `- ${q}`).join('\n')}`;
  }

  /**
   * Generate a concise answer (2-3 sentences)
   * @param {Object} chunk - Main knowledge chunk
   * @param {Set<string>} technologies - Technologies mentioned
   * @param {string} language - Current language
   * @returns {string} Concise answer
   */
  generateConciseAnswer(chunk, technologies, language) {
    const content = chunk.content || '';
    const techArray = Array.from(technologies).slice(0, 5);
    
    // Simple approach: take first ~150 characters and find sentence boundary
    let answer = content.slice(0, 200);
    
    // Find the last complete sentence within our limit
    const lastPeriod = answer.lastIndexOf('.');
    const lastQuestion = answer.lastIndexOf('?');
    const lastExclaim = answer.lastIndexOf('!');
    const lastSentenceEnd = Math.max(lastPeriod, lastQuestion, lastExclaim);
    
    if (lastSentenceEnd > 50) {
      answer = content.slice(0, lastSentenceEnd + 1).trim();
    } else {
      // No sentence boundary found, just take first sentence from content
      const match = content.match(/^[^.!?]+[.!?]+/);
      answer = match ? match[0].trim() : content.slice(0, 150) + '...';
    }
    
    // Add tech summary if technologies mentioned and answer is short
    if (techArray.length > 0 && answer.length < 150) {
      const techList = techArray.join(', ');
      if (language === 'es') {
        answer += ` Tecnologías clave: ${techList}.`;
      } else {
        answer += ` Key technologies: ${techList}.`;
      }
    }
    
    return answer;
  }

  /**
   * Generate follow-up questions
   * @param {Array} results - Search results
   * @param {Array} relatedTopics - Related topic categories
   * @param {Set} technologies - Technologies mentioned
   * @param {string} language - Current language
   * @returns {string[]} Follow-up questions
   */
  generateFollowUps(results, relatedTopics, technologies, language) {
    const followUps = [];
    const techArray = Array.from(technologies);
    
    if (language === 'es') {
      // Spanish follow-ups
      if (techArray.length > 0) {
        followUps.push('¿Qué proyectos has construido con estas tecnologías?');
      }
      
      if (relatedTopics.includes('expertise') || relatedTopics.includes('skills')) {
        followUps.push('¿Cuál es tu stack tecnológico completo?');
      } else if (relatedTopics.includes('projects')) {
        followUps.push('¿Puedes mostrarme ejemplos de estos proyectos?');
      } else {
        followUps.push('¿Cuáles son tus áreas de especialización?');
      }
      
      followUps.push('¿Cómo abordas el desarrollo de soluciones escalables?');
    } else {
      // English follow-ups
      if (techArray.length > 0) {
        followUps.push('What projects have you built with these technologies?');
      }
      
      if (relatedTopics.includes('expertise') || relatedTopics.includes('skills')) {
        followUps.push('What\'s your complete tech stack?');
      } else if (relatedTopics.includes('projects')) {
        followUps.push('Can you show me examples of these projects?');
      } else {
        followUps.push('What are your areas of expertise?');
      }
      
      followUps.push('How do you approach building scalable solutions?');
    }
    
    return followUps.slice(0, 3);
  }

  /**
   * Generate response when no results found
   * @param {string} userMessage - User's message
   * @param {string} language - Current language
   * @returns {string} No results response
   */
  generateNoResultsResponse(userMessage, language) {
    if (language === 'es') {
      return `Lo siento, no encontré información específica sobre eso en mi base de conocimientos. Puedo ayudarte con otros temas relacionados a mi experiencia.

FOLLOW_UPS:
- ¿Qué proyectos he desarrollado?
- ¿Cuáles son mis áreas de especialización?
- ¿Qué tecnologías domino?`;
    }
    
    return `I apologize, but I couldn't find specific information about that in my knowledge base. I can help you with other topics related to my experience.

FOLLOW_UPS:
- What projects have I developed?
- What are my areas of expertise?
- What technologies do I specialize in?`;
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
