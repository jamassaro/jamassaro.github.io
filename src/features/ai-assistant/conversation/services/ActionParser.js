/**
 * Action Parser Service
 * 
 * SRP: Parse AI responses to extract structured actions
 * DRY: Centralized action parsing and validation logic
 * 
 * Parses AI responses that contain action commands and validates them.
 */

import { ACTION_TYPES, NAVIGATION_TARGETS, SECTION_IDS, MODAL_TYPES } from '../types/action.types.js';

/**
 * Service for parsing actions from AI responses
 */
export class ActionParser {
  /**
   * Parse response text to extract actions
   * Actions are expected in format: ACTION: {"type": "navigate", "target": "projects"}
   * 
   * @param {string} responseText - AI response text
   * @returns {{text: string, actions: import('../types/action.types.js').AIAction[]}} Parsed result
   */
  static parseResponse(responseText) {
    if (!responseText || typeof responseText !== 'string') {
      return { text: '', actions: [] };
    }

    const lines = responseText.split('\n');
    const textLines = [];
    const actions = [];

    for (const line of lines) {
      const trimmed = line.trim();
      
      // Check if line contains an action
      if (trimmed.startsWith('ACTION:')) {
        const actionJson = trimmed.substring('ACTION:'.length).trim();
        const parsedAction = this.parseAction(actionJson);
        
        if (parsedAction) {
          actions.push(parsedAction);
        } else {
          console.warn('[ActionParser] Invalid action format:', actionJson);
        }
      } else {
        // Regular text line
        textLines.push(line);
      }
    }

    return {
      text: textLines.join('\n').trim(),
      actions,
    };
  }

  /**
   * Parse a single action JSON string
   * 
   * @param {string} actionJson - JSON string of action
   * @returns {import('../types/action.types.js').AIAction|null} Parsed action or null if invalid
   */
  static parseAction(actionJson) {
    try {
      const action = JSON.parse(actionJson);
      
      // Validate action has type
      if (!action || !action.type) {
        return null;
      }

      // Validate and sanitize based on type
      return this.validateAction(action);
    } catch (err) {
      console.error('[ActionParser] Failed to parse action JSON:', err);
      return null;
    }
  }

  /**
   * Validate and sanitize an action object
   * 
   * @param {Object} action - Action to validate
   * @returns {import('../types/action.types.js').AIAction|null} Validated action or null if invalid
   */
  static validateAction(action) {
    switch (action.type) {
      case ACTION_TYPES.NAVIGATE:
        return this.validateNavigateAction(action);
      
      case ACTION_TYPES.HIGHLIGHT:
        return this.validateHighlightAction(action);
      
      case ACTION_TYPES.OPEN_MODAL:
        return this.validateOpenModalAction(action);
      
      case ACTION_TYPES.DOWNLOAD_RESUME:
        return this.validateDownloadResumeAction(action);
      
      case ACTION_TYPES.SCROLL_TO_SECTION:
        return this.validateScrollToSectionAction(action);
      
      default:
        console.warn('[ActionParser] Unknown action type:', action.type);
        return null;
    }
  }

  /**
   * Validate navigate action
   * 
   * @param {Object} action - Action to validate
   * @returns {import('../types/action.types.js').NavigateAction|null} Validated action
   */
  static validateNavigateAction(action) {
    if (!action.target || typeof action.target !== 'string') {
      console.warn('[ActionParser] Navigate action missing target');
      return null;
    }

    // Validate target is allowed
    const validTargets = Object.values(NAVIGATION_TARGETS);
    const normalizedTarget = action.target.toLowerCase();
    
    if (!validTargets.includes(normalizedTarget)) {
      console.warn('[ActionParser] Invalid navigation target:', action.target);
      return null;
    }

    return {
      type: ACTION_TYPES.NAVIGATE,
      target: normalizedTarget,
      metadata: action.metadata,
    };
  }

  /**
   * Validate highlight action
   * 
   * @param {Object} action - Action to validate
   * @returns {import('../types/action.types.js').HighlightAction|null} Validated action
   */
  static validateHighlightAction(action) {
    if (!action.target || typeof action.target !== 'string') {
      console.warn('[ActionParser] Highlight action missing target');
      return null;
    }

    return {
      type: ACTION_TYPES.HIGHLIGHT,
      target: action.target,
      duration: typeof action.duration === 'number' ? action.duration : 3000,
      metadata: action.metadata,
    };
  }

  /**
   * Validate open modal action
   * 
   * @param {Object} action - Action to validate
   * @returns {import('../types/action.types.js').OpenModalAction|null} Validated action
   */
  static validateOpenModalAction(action) {
    if (!action.modalType || typeof action.modalType !== 'string') {
      console.warn('[ActionParser] OpenModal action missing modalType');
      return null;
    }

    // Validate modal type
    const validTypes = Object.values(MODAL_TYPES);
    if (!validTypes.includes(action.modalType)) {
      console.warn('[ActionParser] Invalid modal type:', action.modalType);
      return null;
    }

    return {
      type: ACTION_TYPES.OPEN_MODAL,
      modalType: action.modalType,
      data: action.data || {},
      metadata: action.metadata,
    };
  }

  /**
   * Validate download resume action
   * 
   * @param {Object} action - Action to validate
   * @returns {import('../types/action.types.js').DownloadResumeAction|null} Validated action
   */
  static validateDownloadResumeAction(action) {
    const language = action.language || 'en';
    
    if (!['en', 'es'].includes(language)) {
      console.warn('[ActionParser] Invalid resume language:', action.language);
      return null;
    }

    return {
      type: ACTION_TYPES.DOWNLOAD_RESUME,
      language,
      metadata: action.metadata,
    };
  }

  /**
   * Validate scroll to section action
   * 
   * @param {Object} action - Action to validate
   * @returns {import('../types/action.types.js').ScrollToSectionAction|null} Validated action
   */
  static validateScrollToSectionAction(action) {
    if (!action.section || typeof action.section !== 'string') {
      console.warn('[ActionParser] ScrollToSection action missing section');
      return null;
    }

    // Validate section ID
    const validSections = Object.values(SECTION_IDS);
    const normalizedSection = action.section.toLowerCase();
    
    if (!validSections.includes(normalizedSection)) {
      console.warn('[ActionParser] Invalid section ID:', action.section);
      return null;
    }

    return {
      type: ACTION_TYPES.SCROLL_TO_SECTION,
      section: normalizedSection,
      smooth: action.smooth !== false, // Default to true
      metadata: action.metadata,
    };
  }

  /**
   * Check if response contains actions
   * 
   * @param {string} responseText - Response text to check
   * @returns {boolean} True if response contains actions
   */
  static hasActions(responseText) {
    return typeof responseText === 'string' && responseText.includes('ACTION:');
  }

  /**
   * Extract only actions from response (without text)
   * 
   * @param {string} responseText - Response text
   * @returns {import('../types/action.types.js').AIAction[]} Extracted actions
   */
  static extractActions(responseText) {
    const { actions } = this.parseResponse(responseText);
    return actions;
  }

  /**
   * Extract only text from response (without actions)
   * 
   * @param {string} responseText - Response text
   * @returns {string} Text without action commands
   */
  static extractText(responseText) {
    const { text } = this.parseResponse(responseText);
    return text;
  }
}
