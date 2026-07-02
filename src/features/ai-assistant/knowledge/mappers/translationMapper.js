/**
 * Translation Mapper
 * 
 * SRP: Responsible only for loading and extracting content from i18n translation files.
 * DRY: Uses shared utility functions for normalization.
 */

import { SOURCE_TYPES } from '../constants.js';
import { normalizeText } from '../utils/normalize.js';

/**
 * Load translation file for given language
 * 
 * @param {string} language - Language code (en, es)
 * @returns {Promise<Object>} Translation object
 */
export async function loadTranslations(language) {
  try {
    const translations = await import(`../../../../translations/${language}/translation.json`);
    return translations.default || translations;
  } catch (error) {
    console.error(`Failed to load translations for language: ${language}`, error);
    return null;
  }
}

/**
 * Extract text from nested JSON path
 * 
 * @param {Object} obj - Translation object
 * @param {string} path - Dot-separated path (e.g., 'expertise.frontend.description')
 * @returns {string|null} Extracted text or null
 */
export function extractByPath(obj, path) {
  if (!obj || !path) return null;

  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return null;
    }
  }

  return typeof current === 'string' ? normalizeText(current) : null;
}

/**
 * Extract all expertise descriptions
 * 
 * @param {Object} translations - Translation object
 * @param {string} language - Language code
 * @returns {Array<{id: string, title: string, description: string, source: Object}>}
 */
export function extractExpertiseTranslations(translations, language) {
  if (!translations?.expertise) return [];

  const expertiseIds = ['frontend', 'backend', 'testing-reliability', 'data-intelligence', 'cloud-devops'];
  
  return expertiseIds
    .map(id => {
      const expertise = translations.expertise[id];
      if (!expertise) return null;

      return {
        id,
        title: normalizeText(expertise.title || ''),
        description: normalizeText(expertise.description || ''),
        source: {
          type: SOURCE_TYPES.TRANSLATION,
          file: `translations/${language}/translation.json`,
          path: `expertise.${id}.description`,
          language,
        },
      };
    })
    .filter(Boolean);
}

/**
 * Extract all project descriptions
 * 
 * @param {Object} translations - Translation object
 * @param {string} language - Language code
 * @returns {Array<{id: string, title: string, description: string, summary: string, source: Object}>}
 */
export function extractProjectTranslations(translations, language) {
  if (!translations?.projects) return [];

  const projects = [];
  let index = 1;

  while (translations.projects[`project-${index}`]) {
    const project = translations.projects[`project-${index}`];
    
    projects.push({
      id: `project-${index}`,
      title: normalizeText(project.title || ''),
      description: normalizeText(project.description || ''),
      summary: normalizeText(project.summary || ''),
      source: {
        type: SOURCE_TYPES.TRANSLATION,
        file: `translations/${language}/translation.json`,
        path: `projects.project-${index}.description`,
        language,
      },
    });

    index++;
  }

  return projects;
}

/**
 * Extract venture story and cards
 * 
 * @param {Object} translations - Translation object
 * @param {string} language - Language code
 * @returns {Object} Venture data with story and cards
 */
export function extractVentureTranslations(translations, language) {
  if (!translations?.venture) return null;

  const venture = translations.venture;

  return {
    title: normalizeText(venture.title || ''),
    description: normalizeText(venture.description || ''),
    cards: (venture.cards || []).map((card, index) => ({
      title: normalizeText(card.title || ''),
      description: normalizeText(card.description || ''),
      source: {
        type: SOURCE_TYPES.TRANSLATION,
        file: `translations/${language}/translation.json`,
        path: `venture.cards[${index}]`,
        language,
      },
    })),
    source: {
      type: SOURCE_TYPES.TRANSLATION,
      file: `translations/${language}/translation.json`,
      path: 'venture.description',
      language,
    },
  };
}

/**
 * Extract personal information
 * 
 * @param {Object} translations - Translation object
 * @param {string} language - Language code
 * @returns {Object} Personal info data
 */
export function extractPersonalTranslations(translations, language) {
  if (!translations) return null;

  return {
    bio: normalizeText(translations['main-section']?.description || ''),
    email: translations.footer?.email || '',
    phone: translations.footer?.phone || '',
    source: {
      type: SOURCE_TYPES.TRANSLATION,
      file: `translations/${language}/translation.json`,
      path: 'main-section.description',
      language,
    },
  };
}
