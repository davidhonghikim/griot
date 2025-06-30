#!/usr/bin/env tsx

import axios, { AxiosInstance } from 'axios';
import { PersonaRAGService, PersonaRAGRequest } from '@griot/data/rag/persona_rag_service';

export interface OpenWebUIConfig {
  url: string;
  apiKey: string;
}

export interface OpenWebUIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OpenWebUIChatRequest {
  messages: OpenWebUIChatMessage[];
  model: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface OpenWebUIChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: OpenWebUIChatMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface EnhancedChatRequest {
  message: string;
  personaId?: string;
  conversationHistory?: OpenWebUIChatMessage[];
  model?: string;
  temperature?: number;
}

export interface EnhancedChatResponse {
  message: string;
  persona: {
    id: string;
    name: string;
    description: string;
    relevanceScore: number;
  } | null;
  context: string;
  processingTime: number;
  success: boolean;
  error?: string;
}

export class OpenWebUIBridge {
  private client: AxiosInstance;
  private personaRAG: PersonaRAGService;

  constructor(
    config: OpenWebUIConfig,
    personaRAG: PersonaRAGService
  ) {
    this.client = axios.create({
      baseURL: config.url,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    this.personaRAG = personaRAG;
  }

  async sendChatMessage(
    message: string, 
    personaId?: string, 
    model: string = 'llama3.1'
  ): Promise<OpenWebUIChatResponse> {
    try {
      const messages: OpenWebUIChatMessage[] = [];
      if (personaId) {
        const personaContext = await this.getPersonaContext(personaId, message);
        if (personaContext) {
          messages.push({
            role: 'system',
            content: `You are ${personaContext.name}. ${personaContext.description}\n\nContext: ${personaContext.context}\n\nRespond in character as this persona.`
          });
        }
      }
      messages.push({ role: 'user', content: message });
      const request: OpenWebUIChatRequest = {
        messages,
        model,
        temperature: 0.7,
        max_tokens: 1000
      };
      const response = await this.client.post('/v1/chat/completions', request);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async enhancedChat(
    message: string,
    personaId?: string,
    conversationHistory: OpenWebUIChatMessage[] = []
  ): Promise<EnhancedChatResponse> {
    const startTime = Date.now();
    try {
      let selectedPersona = null;
      let context = '';
      if (!personaId) {
        const personaRequest: PersonaRAGRequest = {
          query: message,
          limit: 1,
          similarityThreshold: 0.6
        };
        const personaResponse = await this.personaRAG.query(personaRequest);
        if (personaResponse.success && personaResponse.selectedPersona) {
          selectedPersona = {
            id: personaResponse.selectedPersona.personaId,
            name: personaResponse.selectedPersona.name,
            description: personaResponse.selectedPersona.metadata.description,
            relevanceScore: personaResponse.selectedPersona.relevanceScore
          };
          context = personaResponse.selectedPersona.contextSnippet;
          personaId = selectedPersona.id;
        }
      } else {
        const personaContext = await this.getPersonaContext(personaId, message);
        if (personaContext) {
          selectedPersona = {
            id: personaContext.id,
            name: personaContext.name,
            description: personaContext.description,
            relevanceScore: personaContext.relevanceScore
          };
          context = personaContext.context;
        }
      }
      const messages: OpenWebUIChatMessage[] = [];
      if (selectedPersona) {
        messages.push({
          role: 'system',
          content: `You are ${selectedPersona.name}. ${selectedPersona.description}\n\nContext: ${context}\n\nRespond in character as this persona, drawing from the provided context.`
        });
      }
      messages.push(...conversationHistory);
      messages.push({ role: 'user', content: message });
      const chatRequest: OpenWebUIChatRequest = {
        messages,
        model: 'llama3.1',
        temperature: 0.7,
        max_tokens: 1000
      };
      const response = await this.client.post('/v1/chat/completions', chatRequest);
      const processingTime = Date.now() - startTime;
      return {
        message: response.data.choices[0]?.message?.content || '',
        persona: selectedPersona,
        context,
        processingTime,
        success: true
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      return {
        message: '',
        persona: null,
        context: '',
        processingTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async getPersonaContext(
    personaId: string, 
    query: string
  ): Promise<{
    id: string;
    name: string;
    description: string;
    context: string;
    relevanceScore: number;
  } | null> {
    try {
      const request: PersonaRAGRequest = {
        query,
        personaId,
        limit: 1,
        includeContent: true
      };
      const response = await this.personaRAG.query(request);
      if (response.success && response.selectedPersona) {
        return {
          id: response.selectedPersona.personaId,
          name: response.selectedPersona.name,
          description: response.selectedPersona.metadata.description,
          context: response.selectedPersona.contextSnippet,
          relevanceScore: response.selectedPersona.relevanceScore
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}
