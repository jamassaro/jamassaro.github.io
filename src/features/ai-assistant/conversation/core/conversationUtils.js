/**
 * Utility functions for conversation management
 * 
 * SRP: Each function has a single, well-defined purpose
 * DRY: Centralized logic prevents duplication across the system
 */

/**
 * Generate a unique message ID
 * @returns {string} Unique message identifier (format: msg_timestamp_random)
 */
export function generateMessageId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `msg_${timestamp}_${random}`;
}

/**
 * Generate a unique conversation ID
 * @returns {string} Unique conversation identifier (format: conv_timestamp)
 */
export function generateConversationId() {
  return `conv_${Date.now()}`;
}

/**
 * Get current timestamp as Date object
 * @param {Date} [date=new Date()] - Date to use
 * @returns {Date} Date object
 */
export function formatTimestamp(date = new Date()) {
  return date;
}

/**
 * Create a user message object
 * @param {string} content - Message content
 * @returns {import('../types/conversation.types').Message} Message object
 */
export function createUserMessage(content) {
  return {
    id: generateMessageId(),
    role: 'user',
    content,
    timestamp: formatTimestamp(),
    status: 'complete',
  };
}

/**
 * Create an assistant message object
 * @param {string} content - Message content
 * @param {import('../types/conversation.types').MessageMetadata} [metadata] - Optional metadata
 * @returns {import('../types/conversation.types').Message} Message object
 */
export function createAssistantMessage(content, metadata = {}) {
  return {
    id: generateMessageId(),
    role: 'assistant',
    content,
    timestamp: formatTimestamp(),
    status: 'streaming',
    metadata,
  };
}

/**
 * Create a system message object
 * @param {string} content - Message content
 * @returns {import('../types/conversation.types').Message} Message object
 */
export function createSystemMessage(content) {
  return {
    id: generateMessageId(),
    role: 'system',
    content,
    timestamp: formatTimestamp(),
    status: 'complete',
  };
}

/**
 * Create an error object
 * @param {string} message - Error message
 * @param {string} code - Error code
 * @param {boolean} [recoverable=true] - Whether error is recoverable
 * @param {*} [details] - Additional error details
 * @returns {import('../types/conversation.types').ConversationError} Error object
 */
export function createError(message, code, recoverable = true, details = null) {
  return {
    message,
    code,
    timestamp: formatTimestamp(),
    recoverable,
    details,
  };
}

/**
 * Validate message content
 * @param {string} content - Content to validate
 * @returns {{valid: boolean, error?: string}} Validation result
 */
export function validateMessageContent(content) {
  if (!content || typeof content !== 'string') {
    return { valid: false, error: 'Message content must be a non-empty string' };
  }
  
  const trimmed = content.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'Message content cannot be empty' };
  }
  
  if (trimmed.length > 2000) {
    return { valid: false, error: 'Message content is too long (max 2000 characters)' };
  }
  
  return { valid: true };
}

/**
 * Truncate message history to a maximum length
 * @param {import('../types/conversation.types').Message[]} messages - Messages to truncate
 * @param {number} maxLength - Maximum number of messages to keep
 * @returns {import('../types/conversation.types').Message[]} Truncated messages
 */
export function truncateHistory(messages, maxLength) {
  if (messages.length <= maxLength) {
    return messages;
  }
  
  // Keep the most recent messages
  return messages.slice(-maxLength);
}

/**
 * Calculate conversation metadata
 * @param {import('../types/conversation.types').Message[]} messages - Conversation messages
 * @param {string} conversationId - Conversation ID
 * @returns {import('../types/conversation.types').ConversationMetadata} Metadata object
 */
export function calculateMetadata(messages, conversationId) {
  const sortedMessages = [...messages].sort((a, b) => 
    a.timestamp.getTime() - b.timestamp.getTime()
  );
  
  const startedAt = sortedMessages.length > 0 
    ? sortedMessages[0].timestamp 
    : formatTimestamp();
  
  const lastInteraction = sortedMessages.length > 0
    ? sortedMessages[sortedMessages.length - 1].timestamp
    : formatTimestamp();
  
  const totalTokens = messages.reduce((sum, msg) => 
    sum + (msg.metadata?.tokens || 0), 0
  );
  
  return {
    startedAt,
    messageCount: messages.length,
    lastInteraction,
    totalTokens,
  };
}

/**
 * Filter messages by role
 * @param {import('../types/conversation.types').Message[]} messages - Messages to filter
 * @param {import('../types/conversation.types').MessageRole} role - Role to filter by
 * @returns {import('../types/conversation.types').Message[]} Filtered messages
 */
export function filterMessagesByRole(messages, role) {
  return messages.filter(msg => msg.role === role);
}

/**
 * Get the last N messages
 * @param {import('../types/conversation.types').Message[]} messages - All messages
 * @param {number} count - Number of messages to retrieve
 * @returns {import('../types/conversation.types').Message[]} Last N messages
 */
export function getLastMessages(messages, count) {
  return messages.slice(-count);
}

/**
 * Check if a message is complete
 * @param {import('../types/conversation.types').Message} message - Message to check
 * @returns {boolean} True if message is complete
 */
export function isMessageComplete(message) {
  return message.status === 'complete';
}

/**
 * Check if a message is in error state
 * @param {import('../types/conversation.types').Message} message - Message to check
 * @returns {boolean} True if message has error
 */
export function isMessageError(message) {
  return message.status === 'error';
}

/**
 * Format messages for LLM context (future use)
 * @param {import('../types/conversation.types').Message[]} messages - Messages to format
 * @returns {Array<{role: string, content: string}>} Formatted messages
 */
export function formatMessagesForLLM(messages) {
  return messages
    .filter(msg => msg.status === 'complete')
    .map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));
}
