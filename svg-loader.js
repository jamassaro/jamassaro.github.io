/**
 * Simple SVG and JSON loader for Node.js ESM
 * Returns empty string for SVG imports and handles JSON during testing
 */

import { readFile } from 'fs/promises';

export async function load(url, context, defaultLoad) {
  // Handle image files (SVG, PNG, JPG)
  if (url.endsWith('.svg') || url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg')) {
    return {
      format: 'module',
      source: 'export default "";',
      shortCircuit: true,
    };
  }
  
  // Handle JSON files
  if (url.endsWith('.json')) {
    const content = await readFile(new URL(url), 'utf-8');
    return {
      format: 'json',
      source: content,
      shortCircuit: true,
    };
  }
  
  return defaultLoad(url, context, defaultLoad);
}
