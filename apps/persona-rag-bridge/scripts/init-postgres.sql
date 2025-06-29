-- PostgreSQL initialization script for PersonaRAG Bridge
-- This script sets up the database with pgvector extension and necessary tables

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create personas table
CREATE TABLE IF NOT EXISTS personas (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    metadata JSONB,
    tags TEXT[],
    embedding vector(1536),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create persona_documents table for RAG
CREATE TABLE IF NOT EXISTS persona_documents (
    id VARCHAR(255) PRIMARY KEY,
    persona_id VARCHAR(255) REFERENCES personas(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding vector(1536),
    metadata JSONB,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id VARCHAR(255) PRIMARY KEY,
    persona_id VARCHAR(255) REFERENCES personas(id) ON DELETE SET NULL,
    user_id VARCHAR(255),
    title VARCHAR(500),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(255) PRIMARY KEY,
    conversation_id VARCHAR(255) REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- 'user', 'assistant', 'system'
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_personas_embedding 
ON personas 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_persona_documents_embedding 
ON persona_documents 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_personas_tags 
ON personas USING GIN (tags);

CREATE INDEX IF NOT EXISTS idx_persona_documents_tags 
ON persona_documents USING GIN (tags);

CREATE INDEX IF NOT EXISTS idx_persona_documents_persona_id 
ON persona_documents (persona_id);

CREATE INDEX IF NOT EXISTS idx_conversations_user_id 
ON conversations (user_id);

CREATE INDEX IF NOT EXISTS idx_conversations_persona_id 
ON conversations (persona_id);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id 
ON messages (conversation_id);

CREATE INDEX IF NOT EXISTS idx_messages_created_at 
ON messages (created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_personas_updated_at 
    BEFORE UPDATE ON personas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_persona_documents_updated_at 
    BEFORE UPDATE ON persona_documents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at 
    BEFORE UPDATE ON conversations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample personas
INSERT INTO personas (id, name, description, content, metadata, tags) VALUES
(
    'griot_001',
    'Griot',
    'Traditional West African storyteller and cultural preservationist',
    'I am a Griot, a traditional West African storyteller, musician, and oral historian. I preserve cultural knowledge through narrative and song, passing down wisdom from generation to generation. My role is to maintain the collective memory of our people and share stories that teach, inspire, and connect us to our roots.',
    '{"base": "griot", "variant": "traditional", "author": "system", "description": "Traditional West African storyteller and cultural preservationist"}',
    ARRAY['storytelling', 'culture', 'music', 'history', 'wisdom', 'tradition']
),
(
    'tohunga_001',
    'Tohunga',
    'Māori spiritual guide and keeper of traditional knowledge',
    'I am a Tohunga, a Māori priest and expert in traditional knowledge. I serve as a spiritual guide and keeper of cultural wisdom, helping others understand the sacred connections between people, land, and ancestors. My knowledge encompasses healing, spiritual practices, and the preservation of cultural traditions.',
    '{"base": "tohunga", "variant": "traditional", "author": "system", "description": "Māori spiritual guide and keeper of traditional knowledge"}',
    ARRAY['spirituality', 'culture', 'wisdom', 'guidance', 'healing', 'tradition']
)
ON CONFLICT (id) DO NOTHING;

-- Create a user for the application
CREATE USER IF NOT EXISTS griot_user WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE griot TO griot_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO griot_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO griot_user; 