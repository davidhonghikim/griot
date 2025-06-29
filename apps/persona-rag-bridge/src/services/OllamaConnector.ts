/**
 * Ollama Service Connector
 * 
 * Connects to Ollama API for local model inference.
 */

import { ServiceConnector } from './ServiceConnector';

export interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details: {
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
}

export interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    repeat_penalty?: number;
    seed?: number;
    num_predict?: number;
    stop?: string[];
  };
}

export interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export class OllamaConnector extends ServiceConnector {
  constructor(baseUrl: string = 'http://localhost:11434') {
    super('ollama', 'ollama', baseUrl);
  }

  /**
   * Check Ollama health
   */
  protected async checkHealth(): Promise<void> {
    await this.makeRequest('/api/tags');
  }

  /**
   * Cleanup resources
   */
  protected async cleanup(): Promise<void> {
    // No specific cleanup needed for Ollama
  }

  /**
   * Get available models
   */
  async getModels(): Promise<OllamaModel[]> {
    const response = await this.makeRequest<{ models: OllamaModel[] }>('/api/tags');
    return response.models;
  }

  /**
   * Generate text using a model
   */
  async generate(request: OllamaGenerateRequest): Promise<OllamaGenerateResponse> {
    return this.makeRequest<OllamaGenerateResponse>('/api/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Stream text generation
   */
  async *generateStream(request: OllamaGenerateRequest): AsyncGenerator<OllamaGenerateResponse> {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...request, stream: true }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line);
              yield data;
            } catch (error) {
              console.warn('Failed to parse Ollama response:', line);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Pull a model
   */
  async pullModel(modelName: string): Promise<void> {
    await this.makeRequest('/api/pull', {
      method: 'POST',
      body: JSON.stringify({ name: modelName }),
    });
  }

  /**
   * Delete a model
   */
  async deleteModel(modelName: string): Promise<void> {
    await this.makeRequest('/api/delete', {
      method: 'DELETE',
      body: JSON.stringify({ name: modelName }),
    });
  }

  /**
   * Get model information
   */
  async getModelInfo(modelName: string): Promise<any> {
    return this.makeRequest(`/api/show`, {
      method: 'POST',
      body: JSON.stringify({ name: modelName }),
    });
  }
} 