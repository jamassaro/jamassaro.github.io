/**
 * Data Mapper
 * 
 * SRP: Responsible only for loading and extracting metadata from data files.
 * DRY: Reusable data loading logic.
 */

import { expertiseCategories } from '../../../../data/expertise.js';
import { projectsData } from '../../../../data/projects.js';
import { venturesData } from '../../../../data/ventures.js';

/**
 * Load all expertise data
 * 
 * @returns {Array} Expertise categories
 */
export function loadExpertiseData() {
  return expertiseCategories || [];
}

/**
 * Load all projects data
 * 
 * @returns {Array} Projects
 */
export function loadProjectsData() {
  return projectsData || [];
}

/**
 * Load all ventures data
 * 
 * @returns {Array} Ventures
 */
export function loadVenturesData() {
  return venturesData || [];
}

/**
 * Find expertise data by ID
 * 
 * @param {string} id - Expertise ID (frontend, backend, etc.)
 * @returns {Object|null} Expertise data
 */
export function findExpertiseById(id) {
  const data = loadExpertiseData();
  return data.find(item => item.id === id) || null;
}

/**
 * Find project data by index (1-based)
 * 
 * @param {number} index - Project index (1, 2, etc.)
 * @returns {Object|null} Project data
 */
export function findProjectByIndex(index) {
  const data = loadProjectsData();
  return data[index - 1] || null;
}

/**
 * Find venture data by ID
 * 
 * @param {string} id - Venture ID
 * @returns {Object|null} Venture data
 */
export function findVentureById(id) {
  const data = loadVenturesData();
  return data.find(item => item.id === id) || null;
}

/**
 * Extract technology names from expertise
 * 
 * @param {Object} expertise - Expertise data object
 * @returns {string[]} Technology names
 */
export function extractTechnologies(expertise) {
  if (!expertise?.technologies || !Array.isArray(expertise.technologies)) {
    return [];
  }

  return expertise.technologies
    .map(tech => tech.name)
    .filter(Boolean);
}

/**
 * Extract metadata from project
 * 
 * @param {Object} project - Project data object
 * @returns {Object} Metadata
 */
export function extractProjectMetadata(project) {
  if (!project) return {};

  // Extract technology names (handle both string array and object array)
  const technologies = project.technologies 
    ? project.technologies.map(tech => 
        typeof tech === 'string' ? tech : tech.name
      ).filter(Boolean)
    : [];

  return {
    technologies,
    link: project.link || null,
    github: project.github || null,
    status: project.status || null,
    year: project.year || null,
  };
}

/**
 * Extract metadata from venture
 * 
 * @param {Object} venture - Venture data object
 * @returns {Object} Metadata
 */
export function extractVentureMetadata(venture) {
  if (!venture) return {};

  // Extract technology names (handle both string array and object array)
  const technologies = venture.technologies 
    ? venture.technologies.map(tech => 
        typeof tech === 'string' ? tech : tech.name
      ).filter(Boolean)
    : [];

  return {
    technologies,
    url: venture.url || null,
    images: venture.images || [],
    logo: venture.logo || null,
  };
}
