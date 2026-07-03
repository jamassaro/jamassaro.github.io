/**
 * AI Action Types
 * 
 * Defines structured actions that the AI can return to control the portfolio UI.
 * The AI can now do more than just answer questions - it can navigate, highlight, open modals, etc.
 */

/**
 * @typedef {'navigate' | 'highlight' | 'openModal' | 'downloadResume' | 'scrollToSection'} ActionType
 * Types of actions the AI can perform
 */

/**
 * @typedef {Object} BaseAction
 * Base action structure
 * @property {ActionType} type - Action type
 * @property {Object} [metadata] - Optional metadata about the action
 */

/**
 * @typedef {Object} NavigateAction
 * Navigate to a different section or project
 * @property {'navigate'} type
 * @property {string} target - Target location (e.g., 'deal-advisor', 'braveup', 'projects', 'contact')
 * @property {Object} [metadata] - Optional metadata
 */

/**
 * @typedef {Object} HighlightAction
 * Highlight specific content on the page
 * @property {'highlight'} type
 * @property {string} target - Element selector or section ID to highlight
 * @property {number} [duration] - Duration in ms (default: 3000)
 * @property {Object} [metadata] - Optional metadata
 */

/**
 * @typedef {Object} OpenModalAction
 * Open a modal with specific content
 * @property {'openModal'} type
 * @property {string} modalType - Type of modal ('project', 'contact', 'resume', 'image')
 * @property {Object} [data] - Data to pass to the modal
 * @property {Object} [metadata] - Optional metadata
 */

/**
 * @typedef {Object} DownloadResumeAction
 * Trigger resume download
 * @property {'downloadResume'} type
 * @property {string} [language] - Resume language ('en' or 'es')
 * @property {Object} [metadata] - Optional metadata
 */

/**
 * @typedef {Object} ScrollToSectionAction
 * Scroll to a specific section
 * @property {'scrollToSection'} type
 * @property {string} section - Section ID (e.g., 'expertise', 'projects', 'ventures', 'contact')
 * @property {boolean} [smooth] - Use smooth scrolling (default: true)
 * @property {Object} [metadata] - Optional metadata
 */

/**
 * @typedef {NavigateAction | HighlightAction | OpenModalAction | DownloadResumeAction | ScrollToSectionAction} AIAction
 * Union of all possible AI actions
 */

/**
 * @typedef {Object} ActionResult
 * Result of executing an action
 * @property {boolean} success - Whether action executed successfully
 * @property {string} [error] - Error message if failed
 * @property {*} [data] - Result data if any
 */

/**
 * Action type constants for easy reference
 */
export const ACTION_TYPES = {
  NAVIGATE: 'navigate',
  HIGHLIGHT: 'highlight',
  OPEN_MODAL: 'openModal',
  DOWNLOAD_RESUME: 'downloadResume',
  SCROLL_TO_SECTION: 'scrollToSection',
};

/**
 * Valid navigation targets
 */
export const NAVIGATION_TARGETS = {
  HOME: 'home',
  PROJECTS: 'projects',
  VENTURES: 'ventures',
  CONTACT: 'contact',
  EXPERTISE: 'expertise',
  // Project-specific targets
  DEAL_ADVISOR: 'deal-advisor',
  BRAVEUP: 'braveup',
  BRAVEUP_WEB: 'braveup-web',
  BRAVEUP_APP: 'braveup-app',
  BRAVEUP_ADMIN: 'braveup-admin',
};

/**
 * Valid section IDs for scrolling
 */
export const SECTION_IDS = {
  HERO: 'hero',
  EXPERTISE: 'expertise',
  PROJECTS: 'projects',
  VENTURES: 'ventures',
  CONTACT: 'contact',
};

/**
 * Valid modal types
 */
export const MODAL_TYPES = {
  PROJECT: 'project',
  CONTACT: 'contact',
  RESUME: 'resume',
  IMAGE: 'image',
};

/**
 * Action schema documentation for LLM
 * This describes the action format for the AI to follow
 */
export const ACTION_SCHEMA_DOCS = `
Available Actions:

1. Navigate - Navigate to a section or project
   Format: {"type": "navigate", "target": "<target>"}
   Targets: home, projects, ventures, contact, expertise, deal-advisor, braveup, etc.
   Example: {"type": "navigate", "target": "deal-advisor"}

2. Highlight - Highlight specific content
   Format: {"type": "highlight", "target": "<selector>", "duration": <ms>}
   Example: {"type": "highlight", "target": "expertise", "duration": 3000}

3. Open Modal - Open a modal dialog
   Format: {"type": "openModal", "modalType": "<type>", "data": {...}}
   Modal Types: project, contact, resume, image
   Example: {"type": "openModal", "modalType": "project", "data": {"id": "braveup"}}

4. Download Resume - Trigger resume download
   Format: {"type": "downloadResume", "language": "<lang>"}
   Languages: en, es
   Example: {"type": "downloadResume", "language": "en"}

5. Scroll to Section - Scroll to a page section
   Format: {"type": "scrollToSection", "section": "<id>", "smooth": true}
   Sections: hero, expertise, projects, ventures, contact
   Example: {"type": "scrollToSection", "section": "projects", "smooth": true}

Response Format:
You can return text with optional actions in JSON format at the end.
Actions should be on a new line starting with "ACTION:".

Example:
"Here's information about Brave Up! Let me show you the project.
ACTION: {"type": "navigate", "target": "braveup"}"

Example with multiple actions:
"I'll show you the expertise section and my resume.
ACTION: {"type": "scrollToSection", "section": "expertise"}
ACTION: {"type": "downloadResume", "language": "en"}"
`;

// Export empty object to make this a module
export {};
