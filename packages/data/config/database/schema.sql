-- AI Pricing System Database Schema
-- PostgreSQL schema for dynamic pricing data management

-- Enable JSONB for better performance
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Provider metadata table
CREATE TABLE provider_metadata (
    id SERIAL PRIMARY KEY,
    provider_key VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    logo_url VARCHAR(255),
    website VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'deprecated', 'testing', 'inactive')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Provider configurations table
CREATE TABLE provider_configs (
    id SERIAL PRIMARY KEY,
    provider_key VARCHAR(50) REFERENCES provider_metadata(provider_key) ON DELETE CASCADE,
    config_type VARCHAR(50) NOT NULL CHECK (config_type IN ('scraping', 'api', 'manual')),
    config_data JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(provider_key, config_type)
);

-- Model pricing table
CREATE TABLE model_pricing (
    id SERIAL PRIMARY KEY,
    model_key VARCHAR(100) UNIQUE NOT NULL,
    provider_key VARCHAR(50) REFERENCES provider_metadata(provider_key) ON DELETE CASCADE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    input_price_per_1m_tokens DECIMAL(10,6) NOT NULL,
    output_price_per_1m_tokens DECIMAL(10,6) NOT NULL,
    context_window INTEGER, -- in tokens
    max_tokens INTEGER, -- maximum output tokens
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Media pricing table
CREATE TABLE media_pricing (
    id SERIAL PRIMARY KEY,
    media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('image', 'video', 'audio')),
    pricing_model VARCHAR(20) NOT NULL CHECK (pricing_model IN ('per_unit', 'per_minute', 'per_second')),
    base_cost DECIMAL(10,6) NOT NULL,
    resolution_multipliers JSONB,
    quality_multipliers JSONB,
    provider_key VARCHAR(50) REFERENCES provider_metadata(provider_key) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(media_type, provider_key)
);

-- Pricing history table for auditing
CREATE TABLE pricing_history (
    id SERIAL PRIMARY KEY,
    model_key VARCHAR(100),
    provider_key VARCHAR(50),
    input_price_per_1m_tokens DECIMAL(10,6),
    output_price_per_1m_tokens DECIMAL(10,6),
    change_reason VARCHAR(100) NOT NULL CHECK (change_reason IN ('automated_update', 'manual_correction', 'provider_change', 'initial_setup')),
    source VARCHAR(50) NOT NULL CHECK (source IN ('web_scraping', 'api', 'manual', 'default_file')),
    recorded_at TIMESTAMP DEFAULT NOW(),
    metadata JSONB -- Additional context about the change
);

-- Budget tracking table
CREATE TABLE budget_records (
    id SERIAL PRIMARY KEY,
    budget_id VARCHAR(100) NOT NULL,
    operation_type VARCHAR(50) NOT NULL,
    model_key VARCHAR(100),
    provider_key VARCHAR(50),
    media_type VARCHAR(20),
    input_tokens INTEGER,
    output_tokens INTEGER,
    cost DECIMAL(10,6) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_model_pricing_provider ON model_pricing(provider_key);
CREATE INDEX idx_model_pricing_active ON model_pricing(is_active);
CREATE INDEX idx_pricing_history_model ON pricing_history(model_key);
CREATE INDEX idx_pricing_history_provider ON pricing_history(provider_key);
CREATE INDEX idx_pricing_history_recorded ON pricing_history(recorded_at);
CREATE INDEX idx_budget_records_budget_id ON budget_records(budget_id);
CREATE INDEX idx_budget_records_created_at ON budget_records(created_at);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_provider_metadata_updated_at 
    BEFORE UPDATE ON provider_metadata 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_provider_configs_updated_at 
    BEFORE UPDATE ON provider_configs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_model_pricing_updated_at 
    BEFORE UPDATE ON model_pricing 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_pricing_updated_at 
    BEFORE UPDATE ON media_pricing 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Views for common queries
CREATE VIEW active_models AS
SELECT 
    mp.model_key,
    mp.display_name,
    mp.description,
    mp.input_price_per_1m_tokens,
    mp.output_price_per_1m_tokens,
    mp.context_window,
    mp.max_tokens,
    pm.provider_key,
    pm.display_name as provider_name,
    pm.website as provider_website
FROM model_pricing mp
JOIN provider_metadata pm ON mp.provider_key = pm.provider_key
WHERE mp.is_active = true AND pm.status = 'active';

CREATE VIEW pricing_summary AS
SELECT 
    pm.provider_key,
    pm.display_name as provider_name,
    COUNT(mp.id) as active_models,
    AVG(mp.input_price_per_1m_tokens) as avg_input_price,
    AVG(mp.output_price_per_1m_tokens) as avg_output_price,
    MIN(mp.input_price_per_1m_tokens) as min_input_price,
    MAX(mp.input_price_per_1m_tokens) as max_input_price
FROM provider_metadata pm
LEFT JOIN model_pricing mp ON pm.provider_key = mp.provider_key AND mp.is_active = true
WHERE pm.status = 'active'
GROUP BY pm.provider_key, pm.display_name; 