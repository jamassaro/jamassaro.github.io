/**
 * useConversationState Hook
 * 
 * SRP: Manages conversation state using reducer pattern
 * DRY: Wraps reducer in a reusable hook
 */

import { useReducer } from 'react';
import { conversationReducer, initialConversationState } from '../core/conversationReducer.js';

/**
 * Hook for managing conversation state
 * @param {Partial<import('../types/conversation.types').ConversationState>} [initialState={}] - Initial state overrides
 * @returns {{state: import('../types/conversation.types').ConversationState, dispatch: Function}} State and dispatch
 */
export function useConversationState(initialState = {}) {
  const mergedInitialState = {
    ...initialConversationState,
    ...initialState,
  };
  
  const [state, dispatch] = useReducer(conversationReducer, mergedInitialState);
  
  return { state, dispatch };
}
