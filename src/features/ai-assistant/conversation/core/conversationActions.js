/**
 * Action creators for conversation state management
 * 
 * SRP: Each action creator handles one specific state change
 * DRY: Centralized action creation prevents duplication
 */

/**
 * Action types (constants)
 */
export const ActionTypes = {
  // Message actions
  ADD_USER_MESSAGE: 'ADD_USER_MESSAGE',
  ADD_ASSISTANT_MESSAGE: 'ADD_ASSISTANT_MESSAGE',
  ADD_SYSTEM_MESSAGE: 'ADD_SYSTEM_MESSAGE',
  UPDATE_MESSAGE: 'UPDATE_MESSAGE',
  DELETE_MESSAGE: 'DELETE_MESSAGE',
  
  // Typing actions
  START_TYPING: 'START_TYPING',
  UPDATE_TYPING: 'UPDATE_TYPING',
  FINISH_TYPING: 'FINISH_TYPING',
  
  // Status actions
  SET_LOADING: 'SET_LOADING',
  SET_IDLE: 'SET_IDLE',
  
  // Error actions
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // Suggestion actions
  UPDATE_SUGGESTIONS: 'UPDATE_SUGGESTIONS',
  
  // Conversation actions
  RESET_CONVERSATION: 'RESET_CONVERSATION',
  LOAD_CONVERSATION: 'LOAD_CONVERSATION',
  SET_LANGUAGE: 'SET_LANGUAGE',
};

/**
 * Action creators
 */
export const conversationActions = {
  /**
   * Add a user message
   * @param {string} content - Message content
   * @returns {import('../types/conversation.types').ConversationAction}
   */
  addUserMessage: (content) => ({
    type: ActionTypes.ADD_USER_MESSAGE,
    payload: content,
  }),

  /**
   * Add an assistant message
   * @param {string} content - Message content
   * @param {import('../types/conversation.types').MessageMetadata} [metadata] - Message metadata
   * @returns {import('../types/conversation.types').ConversationAction}
   */
  addAssistantMessage: (content, metadata) => ({
    type: ActionTypes.ADD_ASSISTANT_MESSAGE,
    payload: { content, metadata },
  }),

  /**
   * Add a system message
   * @param {string} content - Message content
   * @returns {import('../types/conversation.types').ConversationAction}
   */
  addSystemMessage: (content) => ({
    type: ActionTypes.ADD_SYSTEM_MESSAGE,
    payload: content,
  }),

  /**
   * Update an existing message
   * @param {string} id - Message ID
   * @param {Partial<import('../types/conversation.types').Message>} updates - Updates to apply
   * @returns {import('../types/conversation.types').ConversationAction}
   */
  updateMessage: (id, updates) => ({
    type: ActionTypes.UPDATE_MESSAGE,
    payload: { id, updates },
  }),

  /**
   * Delete a message
   * @param {string} id - Message ID
   * @returns {import('../types/conversation.types').ConversationAction}
   */
  deleteMessage: (id) => ({
    type: ActionTypes.DELETE_MESSAGE,
    payload: id,
  }),

  /**
   * Start typing animation
   * @param {string} message - Full message to type
   * @returns {import('../types/conversation.types').ConversationAction}
   */
  startTyping: (message) => ({
    type: ActionTypes.START_TYPING,
    payload: message,
  }),

  /**
   * Update typing text (streaming)
   * @param {string} text - Current typed text
   * @returns {import('../types/conversation.types').ConversationAction}
   */
  updateTyping: (text) => ({
    type: ActionTypes.UPDATE_TYPING,
    payload: text,
  }),

  /**
   * Finish typing animation
   * @returns {import('../types/conversation.types').ConversationAction}
   */
  finishTyping: () => ({
    type: ActionTypes.FINISH_TYPING,
  }),

  /**
   * Set loading state
   * @returns {import('../types/conversation.types').ConversationAction}
   */
  setLoading: () => ({
    type: ActionTypes.SET_LOADING,
  }),

  /**
   * Set idle state
   * @returns {import('../types/conversation.types').ConversationAction}
   */
  setIdle: () => ({
    type: ActionTypes.SET_IDLE,
  }),

  /**
   * Set error state
   * @param {import('../types/conversation.types').ConversationError} error - Error object
   * @returns {import('../types/conversation.types').ConversationAction}
   */
  setError: (error) => ({
    type: ActionTypes.SET_ERROR,
    payload: error,
  }),

  /**
   * Clear error state
   * @returns {import('../types/conversation.types').ConversationAction}
   */
  clearError: () => ({
    type: ActionTypes.CLEAR_ERROR,
  }),

  /**
   * Update suggested prompts
   * @param {import('../types/conversation.types').SuggestedPrompt[]} suggestions - New suggestions
   * @returns {import('../types/conversation.types').ConversationAction}
   */
  updateSuggestions: (suggestions) => ({
    type: ActionTypes.UPDATE_SUGGESTIONS,
    payload: suggestions,
  }),

  /**
   * Reset conversation to initial state
   * @returns {import('../types/conversation.types').ConversationAction}
   */
  resetConversation: () => ({
    type: ActionTypes.RESET_CONVERSATION,
  }),

  /**
   * Load a saved conversation
   * @param {import('../types/conversation.types').ConversationState} state - Saved state
   * @returns {import('../types/conversation.types').ConversationAction}
   */
  loadConversation: (state) => ({
    type: ActionTypes.LOAD_CONVERSATION,
    payload: state,
  }),

  /**
   * Set conversation language
   * @param {string} language - Language code
   * @returns {import('../types/conversation.types').ConversationAction}
   */
  setLanguage: (language) => ({
    type: ActionTypes.SET_LANGUAGE,
    payload: language,
  }),
};
