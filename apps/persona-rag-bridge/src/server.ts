#!/usr/bin/env tsx

/**
 * PersonaRAG Bridge Server
 * 
 * Connects PersonaRAG engine to OpenWebUI for persona-aware AI interactions
 * Provides REST API and WebSocket endpoints for real-time persona selection
 */

import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Mock PersonaRAG Service (in production, import real service)
class PersonaRAGService {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    console.log('🔄 Initializing PersonaRAG Service...');
    this.initialized = true;
    console.log('✅ PersonaRAG Service initialized');
  }

  async query(request: any) {
    const startTime = Date.now();
    
    // Mock persona selection based on query content
    const personas = [
      {
        personaId: 'griot_001',
        name: 'Griot',
        relevanceScore: 0.95,
        content: 'Griot is a traditional West African storyteller, musician, and oral historian who preserves cultural knowledge through narrative and song.',
        contextSnippet: 'Traditional storyteller specializing in cultural preservation through narrative.',
        metadata: {
          base: 'griot',
          variant: 'traditional',
          author: 'system',
          tags: ['storytelling', 'culture', 'music', 'history'],
          description: 'Traditional West African storyteller and cultural preservationist'
        }
      },
      {
        personaId: 'tohunga_001',
        name: 'Tohunga',
        relevanceScore: 0.87,
        content: 'Tohunga is a Māori priest and expert in traditional knowledge, serving as a spiritual guide and keeper of cultural wisdom.',
        contextSnippet: 'Māori spiritual guide focusing on traditional wisdom and cultural guidance.',
        metadata: {
          base: 'tohunga',
          variant: 'traditional',
          author: 'system',
          tags: ['spirituality', 'culture', 'wisdom', 'guidance'],
          description: 'Māori spiritual guide and keeper of traditional knowledge'
        }
      }
    ];

    const relevantPersonas = personas.filter(p => 
      request.query.toLowerCase().includes('story') || 
      request.query.toLowerCase().includes('culture') ||
      request.query.toLowerCase().includes('wisdom')
    );

    const processingTime = Date.now() - startTime;
    
    return {
      query: request.query,
      results: relevantPersonas,
      totalResults: relevantPersonas.length,
      processingTime,
      selectedPersona: relevantPersonas[0] || null,
      averageRelevance: relevantPersonas.length > 0 
        ? relevantPersonas.reduce((sum, p) => sum + p.relevanceScore, 0) / relevantPersonas.length 
        : 0,
      success: true
    };
  }

  async selectBestPersona(query: string, options: any = {}) {
    const response = await this.query({ query, ...options });
    return response.selectedPersona;
  }
}

const app = express();
const PORT = process.env.PERSONA_RAG_PORT || 3000;
const OPENWEBUI_URL = process.env.OPENWEBUI_URL || 'http://192.168.1.180:3000';

// Initialize services
const ragService = new PersonaRAGService();

// Middleware
app.use(cors({
  origin: [OPENWEBUI_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'PersonaRAG Bridge',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    ragService: ragService.initialized ? 'ready' : 'initializing'
  });
});

// Persona query endpoint
app.post('/api/persona/query', async (req, res) => {
  try {
    const { query, filters = {}, options = {} } = req.body;
    
    if (!query) {
      return res.status(400).json({
        error: 'Query is required',
        code: 'MISSING_QUERY'
      });
    }

    const response = await ragService.query({
      query,
      personaFilter: filters,
      limit: options.limit || 5,
      similarityThreshold: options.threshold || 0.5,
      includeContent: options.includeContent || false
    });

    res.json({
      success: true,
      data: response,
      meta: {
        processingTime: response.processingTime,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Persona query error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      code: 'QUERY_FAILED'
    });
  }
});

// Best persona selection endpoint
app.post('/api/persona/select', async (req, res) => {
  try {
    const { query, options = {} } = req.body;
    
    if (!query) {
      return res.status(400).json({
        error: 'Query is required',
        code: 'MISSING_QUERY'
      });
    }

    const persona = await ragService.selectBestPersona(query, options);

    res.json({
      success: true,
      data: {
        query,
        selectedPersona: persona,
        hasSelection: !!persona
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Persona selection error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      code: 'SELECTION_FAILED'
    });
  }
});

// Enhanced chat endpoint that adds persona context to OpenWebUI responses
app.post('/api/chat/enhanced', async (req, res) => {
  try {
    const { message, conversation_id, model = 'llama3.1' } = req.body;
    
    // Step 1: Get best persona for the query
    const persona = await ragService.selectBestPersona(message, {
      minRelevanceScore: 0.6
    });

    // Step 2: Create enhanced prompt with persona context
    let enhancedMessage = message;
    let personaContext = '';
    
    if (persona) {
      personaContext = `[PERSONA CONTEXT - ${persona.name}]: ${persona.contextSnippet}\n\n`;
      enhancedMessage = `${personaContext}User Query: ${message}

Please respond with the wisdom and perspective of a ${persona.name}, incorporating the cultural context and expertise described above.`;
    }

    // Step 3: Forward to OpenWebUI
    const openWebUIResponse = await axios.post(`${OPENWEBUI_URL}/api/chat`, {
      message: enhancedMessage,
      conversation_id,
      model
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    // Step 4: Return enhanced response with persona metadata
    res.json({
      success: true,
      data: {
        response: openWebUIResponse.data,
        persona: persona ? {
          name: persona.name,
          relevanceScore: persona.relevanceScore,
          description: persona.metadata.description,
          tags: persona.metadata.tags
        } : null,
        enhancement: {
          personaApplied: !!persona,
          contextAdded: personaContext.length > 0,
          originalQuery: message,
          enhancedQuery: enhancedMessage
        }
      },
      meta: {
        timestamp: new Date().toISOString(),
        processingTime: persona ? Date.now() - Date.now() : 0
      }
    });

  } catch (error) {
    console.error('❌ Enhanced chat error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      code: 'ENHANCED_CHAT_FAILED'
    });
  }
});

// WebSocket for real-time persona suggestions
const server = app.listen(PORT, async () => {
  console.log(`🚀 PersonaRAG Bridge Server running on port ${PORT}`);
  console.log(`🔗 OpenWebUI target: ${OPENWEBUI_URL}`);
  console.log(`📋 API Endpoints:`);
  console.log(`   GET  /health - Service health check`);
  console.log(`   POST /api/persona/query - Query personas`);
  console.log(`   POST /api/persona/select - Select best persona`);
  console.log(`   POST /api/chat/enhanced - Enhanced chat with persona context`);
  
  await ragService.initialize();
  console.log(`✅ PersonaRAG Bridge ready for connections`);
});

// WebSocket server for real-time persona suggestions
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('📡 New WebSocket connection established');
  
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      if (data.type === 'persona_query') {
        const response = await ragService.query({
          query: data.query,
          limit: 3,
          similarityThreshold: 0.7
        });
        
        ws.send(JSON.stringify({
          type: 'persona_suggestions',
          data: response,
          requestId: data.requestId
        }));
      }
    } catch (error) {
      console.error('❌ WebSocket error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        error: error.message
      }));
    }
  });
  
  ws.on('close', () => {
    console.log('📡 WebSocket connection closed');
  });
});

export default app; 