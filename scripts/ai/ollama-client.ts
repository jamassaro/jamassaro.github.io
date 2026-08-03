import type { OllamaResponse } from '../types/analysis.js';

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
const MODEL = 'llama3.2:1b'; // Fast and efficient for news analysis

/**
 * Wait for Ollama server to be ready
 */
export async function waitForOllama(maxRetries = 30, delayMs = 1000): Promise<boolean> {
  console.log(`⏳ Waiting for Ollama at ${OLLAMA_HOST}...`);
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(`${OLLAMA_HOST}/api/tags`, {
        signal: AbortSignal.timeout(5000),
      });
      
      if (response.ok) {
        console.log('✅ Ollama server is ready');
        return true;
      }
    } catch (error) {
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  
  throw new Error(`Ollama server not available after ${maxRetries} attempts`);
}

/**
 * Generate completion using Ollama
 */
export async function generateCompletion(prompt: string): Promise<OllamaResponse> {
  console.log('🧠 Sending prompt to Ollama...');
  
  const startTime = Date.now();
  
  const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        num_predict: 2000, // Max tokens to generate
        stop: ['</analysis>'], // Stop token
      },
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama API error (${response.status}): ${errorText}`);
  }
  
  const result: OllamaResponse = await response.json();
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ Analysis complete in ${duration}s`);
  
  return result;
}

/**
 * Check if model is available
 */
export async function ensureModel(): Promise<void> {
  console.log(`📦 Checking if model '${MODEL}' is available...`);
  
  try {
    const response = await fetch(`${OLLAMA_HOST}/api/tags`);
    const data = await response.json();
    
    const modelExists = data.models?.some((m: any) => m.name === MODEL);
    
    if (!modelExists) {
      console.warn(`⚠️  Model '${MODEL}' not found. Please run: ollama pull ${MODEL}`);
      throw new Error(`Model '${MODEL}' not available. Run: ollama pull ${MODEL}`);
    }
    
    console.log(`✅ Model '${MODEL}' is available`);
  } catch (error) {
    throw new Error(`Failed to check model availability: ${error}`);
  }
}
