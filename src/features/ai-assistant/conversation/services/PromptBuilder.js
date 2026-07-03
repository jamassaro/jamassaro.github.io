/**
 * PromptBuilder Service
 * 
 * SRP: Builds prompts for LLM (future use with WebLLM)
 * DRY: Centralized prompt construction logic
 */

import { ACTION_SCHEMA_DOCS } from '../types/action.types.js';

/**
 * Service for building LLM prompts
 */
export class PromptBuilder {
  /**
   * Build system prompt with action capabilities
   * @param {string} language - Current language
   * @returns {string} System prompt
   */
  buildSystemPrompt(language) {
    const actionInstructions = this.buildActionInstructions(language);
    const responseFormat = this.buildResponseFormatInstructions(language);
    
    if (language === 'es') {
      return `Eres un asistente de IA para el portafolio de un desarrollador de software.
Tu tarea es responder preguntas sobre:
- Experiencia técnica y habilidades
- Proyectos y trabajos realizados
- Emprendimientos (especialmente Brave Up!)
- Información de contacto

Características:
- Responde de forma clara, profesional y concisa
- Usa la información proporcionada en el contexto
- Si no tienes información, di que no la tienes
- Sé amigable pero profesional
- Responde en español

${responseFormat}

IMPORTANTE - CAPACIDADES DE CONTROL:
Puedes controlar el portafolio mediante acciones estructuradas.
Cuando sea apropiado, incluye acciones para navegar, mostrar proyectos, descargar CV, etc.

${actionInstructions}`;
    }
    
    return `You are an AI assistant for a software developer's portfolio.
Your task is to answer questions about:
- Technical experience and skills
- Projects and work done
- Ventures (especially Brave Up!)
- Contact information

Guidelines:
- Answer clearly, professionally, and concisely
- Use the information provided in the context
- If you don't have information, say so
- Be friendly but professional
- Respond in English

${responseFormat}

IMPORTANT - CONTROL CAPABILITIES:
You can control the portfolio through structured actions.
When appropriate, include actions to navigate, show projects, download resume, etc.

${actionInstructions}`;
  }

  /**
   * Build response format instructions for progressive disclosure
   * @param {string} language - Current language
   * @returns {string} Response format instructions
   */
  buildResponseFormatInstructions(language) {
    if (language === 'es') {
      return `FORMATO DE RESPUESTA - MUY IMPORTANTE:
Proporciona respuestas breves y concisas (2-3 oraciones máximo), seguidas de sugerencias de seguimiento.

Formato requerido:
1. Escribe tu respuesta directa y concisa (2-3 oraciones)
2. Agrega una línea en blanco
3. Agrega "FOLLOW_UPS:" en una nueva línea
4. Lista 2-3 preguntas de seguimiento relevantes, cada una con "-" al inicio

Ejemplo:
"Trabajo principalmente con React, Node.js y TypeScript para crear aplicaciones web escalables. Me enfoco en rendimiento y experiencia de usuario.

FOLLOW_UPS:
- ¿Qué proyectos has construido con estas tecnologías?
- ¿Cuál es tu stack tecnológico completo?
- ¿Cómo abordas el rendimiento en aplicaciones web?"

Recuerda: Sé breve primero, deja que el usuario profundice con las preguntas de seguimiento.`;
    }
    
    return `RESPONSE FORMAT - VERY IMPORTANT:
Provide brief, concise answers (2-3 sentences maximum), followed by follow-up suggestions.

Required format:
1. Write your direct, concise answer (2-3 sentences)
2. Add a blank line
3. Add "FOLLOW_UPS:" on a new line
4. List 2-3 relevant follow-up questions, each starting with "-"

Example:
"I primarily work with React, Node.js, and TypeScript to build scalable web applications. I focus on performance and user experience.

FOLLOW_UPS:
- What projects have you built with these technologies?
- What's your complete tech stack?
- How do you approach performance in web applications?"

Remember: Be brief first, let users dive deeper with follow-up questions.`;
  }

  /**
   * Build action instructions for the LLM
   * @param {string} language - Current language
   * @returns {string} Action instructions
   */
  buildActionInstructions(language) {
    if (language === 'es') {
      return `
Acciones Disponibles:

1. navigate - Navegar a una sección o proyecto
   Formato: ACTION: {"type": "navigate", "target": "<destino>"}
   Destinos: home, projects, ventures, contact, expertise, deal-advisor, braveup
   Ejemplo: ACTION: {"type": "navigate", "target": "braveup"}

2. scrollToSection - Desplazar a una sección
   Formato: ACTION: {"type": "scrollToSection", "section": "<id>", "smooth": true}
   Secciones: hero, expertise, projects, ventures, contact
   Ejemplo: ACTION: {"type": "scrollToSection", "section": "projects"}

3. openModal - Abrir un modal
   Formato: ACTION: {"type": "openModal", "modalType": "<tipo>", "data": {...}}
   Tipos: project, contact, resume, image
   Ejemplo: ACTION: {"type": "openModal", "modalType": "project", "data": {"id": "braveup"}}

4. downloadResume - Descargar CV
   Formato: ACTION: {"type": "downloadResume", "language": "es"}
   Ejemplo: ACTION: {"type": "downloadResume", "language": "es"}

5. highlight - Resaltar contenido
   Formato: ACTION: {"type": "highlight", "target": "<selector>", "duration": 3000}
   Ejemplo: ACTION: {"type": "highlight", "target": "expertise"}

Cuándo usar acciones:
- Si el usuario pregunta sobre un proyecto específico → navigate o openModal
- Si el usuario quiere ver una sección → scrollToSection
- Si el usuario pide el CV → downloadResume
- Combina respuesta de texto con acciones cuando sea relevante

Formato de respuesta con acciones:
"Tu texto de respuesta aquí.
ACTION: {"type": "navigate", "target": "projects"}"
`;
    }
    
    return ACTION_SCHEMA_DOCS + `

When to use actions:
- User asks about a specific project → navigate or openModal
- User wants to see a section → scrollToSection
- User asks for resume/CV → downloadResume
- Combine text response with actions when relevant

Response format with actions:
"Your text response here.
ACTION: {"type": "navigate", "target": "projects"}"
`;
  }

  /**
   * Build user prompt with context
   * @param {string} userMessage - User's message
   * @param {import('../types/conversation.types').ConversationContext} context - Conversation context
   * @returns {string} Complete prompt
   */
  buildPromptWithContext(userMessage, context) {
    const parts = [];
    
    // Add knowledge context
    if (context.knowledge && context.knowledge.length > 0) {
      parts.push('Context from knowledge base:');
      parts.push('---');
      
      context.knowledge.forEach((result, index) => {
        parts.push(`[${index + 1}] ${result.chunk.content}`);
        
        if (result.chunk.metadata) {
          const meta = result.chunk.metadata;
          if (meta.technologies) {
            parts.push(`Technologies: ${meta.technologies.join(', ')}`);
          }
        }
        
        parts.push('');
      });
      
      parts.push('---');
      parts.push('');
    }
    
    // Add conversation history
    if (context.history && context.history.length > 0) {
      parts.push('Recent conversation:');
      parts.push('---');
      
      context.history.forEach(msg => {
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        parts.push(`${role}: ${msg.content}`);
      });
      
      parts.push('---');
      parts.push('');
    }
    
    // Add current message
    parts.push('Current question:');
    parts.push(userMessage);
    
    return parts.join('\n');
  }

  /**
   * Build prompt for follow-up suggestions
   * @param {import('../types/conversation.types').Message[]} messages - Conversation messages
   * @param {string} language - Current language
   * @returns {string} Suggestions prompt
   */
  buildSuggestionsPrompt(messages, language) {
    const lastMessages = messages.slice(-3);
    const conversation = lastMessages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');
    
    if (language === 'es') {
      return `Basado en esta conversación:
${conversation}

Genera 3 preguntas de seguimiento relevantes.`;
    }
    
    return `Based on this conversation:
${conversation}

Generate 3 relevant follow-up questions.`;
  }

  /**
   * Format message for LLM
   * @param {import('../types/conversation.types').Message} message - Message to format
   * @returns {{role: string, content: string}} Formatted message
   */
  formatMessageForLLM(message) {
    return {
      role: message.role === 'assistant' ? 'assistant' : 'user',
      content: message.content,
    };
  }

  /**
   * Build messages array for LLM chat
   * @param {import('../types/conversation.types').ConversationContext} context - Context
   * @param {string} userMessage - Current user message
   * @returns {Array<{role: string, content: string}>} Messages array
   */
  buildChatMessages(context, userMessage) {
    const messages = [];
    
    // System message
    messages.push({
      role: 'system',
      content: context.systemPrompt,
    });
    
    // History messages
    if (context.history && context.history.length > 0) {
      context.history.forEach(msg => {
        messages.push(this.formatMessageForLLM(msg));
      });
    }
    
    // Current user message with context
    const userPrompt = this.buildPromptWithContext(userMessage, context);
    messages.push({
      role: 'user',
      content: userPrompt,
    });
    
    return messages;
  }
}
