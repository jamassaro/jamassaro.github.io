/**
 * Response Parser Utility
 * 
 * Parses AI responses to extract follow-up suggestions
 * Enables progressive disclosure UX pattern
 */

/**
 * Extract follow-up questions from response content
 * 
 * @param {string} content - Raw response content
 * @returns {{ answer: string, followUps: string[] }} Parsed response
 */
export function extractFollowUps(content) {
  if (!content || typeof content !== 'string') {
    return { answer: content || '', followUps: [] };
  }

  // Look for FOLLOW_UPS section
  const followUpMatch = content.match(/FOLLOW_UPS?:\s*\n((?:[-•*]\s*.+\n?)+)/i);
  
  if (!followUpMatch) {
    return { answer: content, followUps: [] };
  }

  // Extract the answer (everything before FOLLOW_UPS)
  const answer = content.substring(0, followUpMatch.index).trim();
  
  // Extract follow-up questions (lines starting with -, •, or *)
  const followUpSection = followUpMatch[1];
  const followUps = followUpSection
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => line.replace(/^[-•*]\s*/, '').trim())
    .filter(line => line.length > 0);

  return { answer, followUps };
}

/**
 * Clean answer text by removing follow-up section
 * 
 * @param {string} content - Raw response content
 * @returns {string} Cleaned answer text
 */
export function cleanAnswerText(content) {
  const { answer } = extractFollowUps(content);
  return answer;
}

/**
 * Check if content has follow-ups
 * 
 * @param {string} content - Raw response content
 * @returns {boolean} True if follow-ups present
 */
export function hasFollowUps(content) {
  return /FOLLOW_UPS?:/i.test(content);
}

/**
 * Format follow-up question for display
 * 
 * @param {string} followUp - Raw follow-up text
 * @returns {string} Formatted follow-up
 */
export function formatFollowUp(followUp) {
  // Remove any remaining list markers
  return followUp.replace(/^[-•*]\s*/, '').trim();
}
