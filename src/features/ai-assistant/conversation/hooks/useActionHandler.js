/**
 * useActionHandler Hook
 * 
 * SRP: Handle execution of AI actions in the UI
 * DRY: Centralized action execution logic
 * 
 * This hook provides methods to execute actions returned by the AI.
 * It handles navigation, scrolling, modals, downloads, and highlighting.
 */

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACTION_TYPES } from '../types/action.types.js';

/**
 * Hook for handling AI actions
 * 
 * @returns {{
 *   executeAction: (action: import('../types/action.types.js').AIAction) => Promise<import('../types/action.types.js').ActionResult>,
 *   executeActions: (actions: import('../types/action.types.js').AIAction[]) => Promise<import('../types/action.types.js').ActionResult[]>
 * }} Action handler methods
 */
export function useActionHandler() {
  const navigate = useNavigate();

  /**
   * Execute a navigate action
   * 
   * @param {import('../types/action.types.js').NavigateAction} action - Navigate action
   * @returns {Promise<import('../types/action.types.js').ActionResult>} Result
   */
  const executeNavigate = useCallback(async (action) => {
    try {
      console.log('[ActionHandler] Navigating to:', action.target);
      
      // Map targets to routes
      const routeMap = {
        home: '/',
        projects: '/#projects',
        ventures: '/#ventures',
        contact: '/#contact',
        expertise: '/#expertise',
        'deal-advisor': '/projects/deal-advisor',
        braveup: '/projects/braveup',
        'braveup-web': '/projects/braveup-web',
        'braveup-app': '/projects/braveup-app',
        'braveup-admin': '/projects/braveup-admin',
      };

      const route = routeMap[action.target] || `/${action.target}`;
      
      // Check if it's a hash navigation (same page)
      if (route.startsWith('/#')) {
        const sectionId = route.substring(2);
        const element = document.getElementById(sectionId);
        
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        // Navigate to different page
        navigate(route);
      }

      return { success: true };
    } catch (error) {
      console.error('[ActionHandler] Navigate failed:', error);
      return { success: false, error: error.message };
    }
  }, [navigate]);

  /**
   * Execute a scroll to section action
   * 
   * @param {import('../types/action.types.js').ScrollToSectionAction} action - Scroll action
   * @returns {Promise<import('../types/action.types.js').ActionResult>} Result
   */
  const executeScrollToSection = useCallback(async (action) => {
    try {
      console.log('[ActionHandler] Scrolling to section:', action.section);
      
      const element = document.getElementById(action.section);
      
      if (!element) {
        return { 
          success: false, 
          error: `Section not found: ${action.section}` 
        };
      }

      element.scrollIntoView({ 
        behavior: action.smooth !== false ? 'smooth' : 'auto',
        block: 'start'
      });

      return { success: true };
    } catch (error) {
      console.error('[ActionHandler] ScrollToSection failed:', error);
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Execute a highlight action
   * 
   * @param {import('../types/action.types.js').HighlightAction} action - Highlight action
   * @returns {Promise<import('../types/action.types.js').ActionResult>} Result
   */
  const executeHighlight = useCallback(async (action) => {
    try {
      console.log('[ActionHandler] Highlighting:', action.target);
      
      // Find element by ID or selector
      let element = document.getElementById(action.target);
      
      if (!element) {
        element = document.querySelector(action.target);
      }

      if (!element) {
        return { 
          success: false, 
          error: `Element not found: ${action.target}` 
        };
      }

      // Add highlight class
      element.classList.add('ai-highlight');
      
      // Scroll into view
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Remove highlight after duration
      const duration = action.duration || 3000;
      setTimeout(() => {
        element.classList.remove('ai-highlight');
      }, duration);

      return { success: true };
    } catch (error) {
      console.error('[ActionHandler] Highlight failed:', error);
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Execute an open modal action
   * 
   * @param {import('../types/action.types.js').OpenModalAction} action - Modal action
   * @returns {Promise<import('../types/action.types.js').ActionResult>} Result
   */
  const executeOpenModal = useCallback(async (action) => {
    try {
      console.log('[ActionHandler] Opening modal:', action.modalType);
      
      // Dispatch custom event for modal management
      const event = new CustomEvent('ai-open-modal', {
        detail: {
          modalType: action.modalType,
          data: action.data,
        }
      });
      
      window.dispatchEvent(event);

      return { success: true };
    } catch (error) {
      console.error('[ActionHandler] OpenModal failed:', error);
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Execute a download resume action
   * 
   * @param {import('../types/action.types.js').DownloadResumeAction} action - Download action
   * @returns {Promise<import('../types/action.types.js').ActionResult>} Result
   */
  const executeDownloadResume = useCallback(async (action) => {
    try {
      console.log('[ActionHandler] Downloading resume:', action.language);
      
      const language = action.language || 'en';
      const resumePath = language === 'es' 
        ? '/PDF/Resume_ES.pdf' 
        : '/PDF/Resume_EN.pdf';

      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = resumePath;
      link.download = `Resume_${language.toUpperCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return { success: true };
    } catch (error) {
      console.error('[ActionHandler] DownloadResume failed:', error);
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Execute a single action
   * 
   * @param {import('../types/action.types.js').AIAction} action - Action to execute
   * @returns {Promise<import('../types/action.types.js').ActionResult>} Execution result
   */
  const executeAction = useCallback(async (action) => {
    if (!action || !action.type) {
      return { success: false, error: 'Invalid action' };
    }

    console.log('[ActionHandler] Executing action:', action.type);

    try {
      switch (action.type) {
        case ACTION_TYPES.NAVIGATE:
          return await executeNavigate(action);
        
        case ACTION_TYPES.SCROLL_TO_SECTION:
          return await executeScrollToSection(action);
        
        case ACTION_TYPES.HIGHLIGHT:
          return await executeHighlight(action);
        
        case ACTION_TYPES.OPEN_MODAL:
          return await executeOpenModal(action);
        
        case ACTION_TYPES.DOWNLOAD_RESUME:
          return await executeDownloadResume(action);
        
        default:
          console.warn('[ActionHandler] Unknown action type:', action.type);
          return { success: false, error: `Unknown action type: ${action.type}` };
      }
    } catch (error) {
      console.error('[ActionHandler] Action execution failed:', error);
      return { success: false, error: error.message };
    }
  }, [
    executeNavigate,
    executeScrollToSection,
    executeHighlight,
    executeOpenModal,
    executeDownloadResume,
  ]);

  /**
   * Execute multiple actions in sequence
   * 
   * @param {import('../types/action.types.js').AIAction[]} actions - Actions to execute
   * @returns {Promise<import('../types/action.types.js').ActionResult[]>} Results array
   */
  const executeActions = useCallback(async (actions) => {
    if (!Array.isArray(actions) || actions.length === 0) {
      return [];
    }

    console.log('[ActionHandler] Executing', actions.length, 'actions');

    const results = [];
    
    for (const action of actions) {
      // Add small delay between actions for better UX
      if (results.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      const result = await executeAction(action);
      results.push(result);
      
      // Stop on first failure
      if (!result.success) {
        console.error('[ActionHandler] Action failed, stopping execution');
        break;
      }
    }

    return results;
  }, [executeAction]);

  return {
    executeAction,
    executeActions,
  };
}
