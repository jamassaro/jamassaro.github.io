/**
 * Conversation state reducer
 * 
 * SRP: Handles state transitions for conversation
 * DRY: Centralized state logic prevents duplication
 */

import { ActionTypes } from './conversationActions.js';
import {
  createUserMessage,
  createAssistantMessage,
  createSystemMessage,
  generateConversationId,
  calculateMetadata,
} from './conversationUtils.js';

/**
 * Initial conversation state
 * @type {import('../types/conversation.types').ConversationState}
 */
export const initialConversationState = {
  messages: [],
  status: 'idle',
  currentTypingMessage: null,
  conversationId: generateConversationId(),
  language: 'en',
  suggestedPrompts: [],
  error: null,
  metadata: {
    startedAt: new Date(),
    messageCount: 0,
    lastInteraction: new Date(),
    totalTokens: 0,
  },
};

/**
 * Conversation state reducer
 * @param {import('../types/conversation.types').ConversationState} state - Current state
 * @param {import('../types/conversation.types').ConversationAction} action - Action to apply
 * @returns {import('../types/conversation.types').ConversationState} New state
 */
export function conversationReducer(state, action) {
  switch (action.type) {
    // Message actions
    case ActionTypes.ADD_USER_MESSAGE: {
      const message = createUserMessage(action.payload);
      const newMessages = [...state.messages, message];
      return {
        ...state,
        messages: newMessages,
        error: null,
        metadata: calculateMetadata(newMessages, state.conversationId),
      };
    }

    case ActionTypes.ADD_ASSISTANT_MESSAGE: {
      const { content, metadata } = action.payload;
      const message = createAssistantMessage(content, metadata);
      const newMessages = [...state.messages, message];
      return {
        ...state,
        messages: newMessages,
        metadata: calculateMetadata(newMessages, state.conversationId),
      };
    }

    case ActionTypes.ADD_SYSTEM_MESSAGE: {
      const message = createSystemMessage(action.payload);
      const newMessages = [...state.messages, message];
      return {
        ...state,
        messages: newMessages,
        metadata: calculateMetadata(newMessages, state.conversationId),
      };
    }

    case ActionTypes.UPDATE_MESSAGE: {
      const { id, updates } = action.payload;
      const newMessages = state.messages.map(msg =>
        msg.id === id ? { ...msg, ...updates } : msg
      );
      return {
        ...state,
        messages: newMessages,
        metadata: calculateMetadata(newMessages, state.conversationId),
      };
    }

    case ActionTypes.DELETE_MESSAGE: {
      const newMessages = state.messages.filter(msg => msg.id !== action.payload);
      return {
        ...state,
        messages: newMessages,
        metadata: calculateMetadata(newMessages, state.conversationId),
      };
    }

    // Typing actions
    case ActionTypes.START_TYPING: {
      return {
        ...state,
        status: 'typing',
        currentTypingMessage: action.payload,
      };
    }

    case ActionTypes.UPDATE_TYPING: {
      return {
        ...state,
        currentTypingMessage: action.payload,
      };
    }

    case ActionTypes.FINISH_TYPING: {
      return {
        ...state,
        status: 'idle',
        currentTypingMessage: null,
      };
    }

    // Status actions
    case ActionTypes.SET_LOADING: {
      return {
        ...state,
        status: 'loading',
      };
    }

    case ActionTypes.SET_IDLE: {
      return {
        ...state,
        status: 'idle',
      };
    }

    // Error actions
    case ActionTypes.SET_ERROR: {
      return {
        ...state,
        status: 'error',
        error: action.payload,
      };
    }

    case ActionTypes.CLEAR_ERROR: {
      return {
        ...state,
        status: 'idle',
        error: null,
      };
    }

    // Suggestion actions
    case ActionTypes.UPDATE_SUGGESTIONS: {
      return {
        ...state,
        suggestedPrompts: action.payload,
      };
    }

    // Conversation actions
    case ActionTypes.RESET_CONVERSATION: {
      return {
        ...initialConversationState,
        conversationId: generateConversationId(),
        language: state.language, // Preserve language
      };
    }

    case ActionTypes.LOAD_CONVERSATION: {
      return {
        ...action.payload,
        status: 'idle',
        currentTypingMessage: null,
        error: null,
      };
    }

    case ActionTypes.SET_LANGUAGE: {
      return {
        ...state,
        language: action.payload,
      };
    }

    default:
      console.warn(`Unknown action type: ${action.type}`);
      return state;
  }
}
