title: "Amauta Node 04: Database Schema"
version: 1.0
---

# **4. Amauta Node Database Schema**

## 4.1. Introduction

The Amauta Node requires a sophisticated data architecture to support its generative teaching, simulation management, and learning analytics functions. The database design implements a multi-layered approach optimized for educational content generation, learner progress tracking, and performance analytics.

**Database Technologies**:
- **Content Generation**: PostgreSQL for structured training data and simulation definitions
- **Learning Analytics**: ClickHouse for high-frequency performance metrics and learning analytics
- **Real-time Coordination**: Redis for active simulation sessions and real-time collaboration
- **Knowledge Graphs**: Neo4j for modeling learning relationships and competency networks

## 4.2. Core Educational Data Layer - PostgreSQL

### 4.2.1. `training_datasets` Table

**Purpose**: Master catalog of all training datasets and their metadata

```sql
CREATE TABLE training_datasets (
    dataset_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    dataset_type VARCHAR(50) NOT NULL CHECK (dataset_type IN ('analytical_scenarios', 'ethical_dilemmas', 'coordination_challenges', 'creative_problems', 'performance_benchmarks', 'adversarial_cases')),
    generation_method JSONB NOT NULL,
    quality_metrics JSONB,
    target_capabilities TEXT[],
    source_accords TEXT[],
    source_memories TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    version INTEGER DEFAULT 1,
    validation_status VARCHAR(20) DEFAULT 'pending' CHECK (validation_status IN ('pending', 'validated', 'rejected')),
    usage_count INTEGER DEFAULT 0,
    quality_score DECIMAL(3,2) CHECK (quality_score >= 0 AND quality_score <= 1)
);

CREATE INDEX idx_training_datasets_type ON training_datasets(dataset_type);
CREATE INDEX idx_training_datasets_created_at ON training_datasets(created_at);
CREATE INDEX idx_training_datasets_quality_score ON training_datasets(quality_score);
CREATE INDEX idx_training_datasets_validation_status ON training_datasets(validation_status);
CREATE INDEX idx_training_datasets_target_capabilities ON training_datasets USING GIN(target_capabilities);
```

### 4.2.2. `training_content` Table

**Purpose**: Individual training items within datasets

```sql
CREATE TABLE training_content (
    content_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dataset_id UUID NOT NULL REFERENCES training_datasets(dataset_id) ON DELETE CASCADE,
    title VARCHAR(255),
    content_data JSONB NOT NULL,
    difficulty_level DECIMAL(3,2) CHECK (difficulty_level >= 0 AND difficulty_level <= 1),
    complexity_metrics JSONB,
    learning_objectives TEXT[],
    success_criteria JSONB,
    estimated_duration INTEGER, -- in minutes
    prerequisites TEXT[],
    tags TEXT[],
    variation_source UUID REFERENCES training_content(content_id),
    variation_parameters JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    validation_results JSONB,
    usage_statistics JSONB DEFAULT '{"attempts": 0, "completions": 0, "success_rate": 0}'::jsonb
);

CREATE INDEX idx_training_content_dataset ON training_content(dataset_id);
CREATE INDEX idx_training_content_difficulty ON training_content(difficulty_level);
CREATE INDEX idx_training_content_tags ON training_content USING GIN(tags);
CREATE INDEX idx_training_content_objectives ON training_content USING GIN(learning_objectives);
```

### 4.2.3. `simulation_environments` Table

**Purpose**: Simulation environment definitions and configurations

```sql
CREATE TABLE simulation_environments (
    environment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    environment_type VARCHAR(50) NOT NULL CHECK (environment_type IN ('network_coordination', 'ethical_decision_making', 'resource_optimization', 'conflict_resolution', 'creative_collaboration', 'emergency_response')),
    complexity_level VARCHAR(20) CHECK (complexity_level IN ('basic', 'intermediate', 'advanced', 'expert')),
    max_participants INTEGER DEFAULT 1,
    estimated_duration INTEGER, -- in minutes
    environment_config JSONB NOT NULL,
    participant_roles JSONB,
    success_criteria JSONB,
    learning_objectives TEXT[],
    prerequisites TEXT[],
    resources_required JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    version INTEGER DEFAULT 1,
    active_status BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0
);

CREATE INDEX idx_simulation_environments_type ON simulation_environments(environment_type);
CREATE INDEX idx_simulation_environments_complexity ON simulation_environments(complexity_level);
CREATE INDEX idx_simulation_environments_active ON simulation_environments(active_status);
CREATE INDEX idx_simulation_environments_objectives ON simulation_environments USING GIN(learning_objectives);
```

### 4.2.4. `learner_profiles` Table

**Purpose**: Comprehensive profiles of learning entities and their progress

```sql
CREATE TABLE learner_profiles (
    profile_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learner_id VARCHAR(100) NOT NULL UNIQUE, -- Node ID
    learner_type VARCHAR(50) NOT NULL,
    current_capabilities JSONB,
    learning_style JSONB,
    performance_metrics JSONB,
    learning_goals JSONB,
    preferences JSONB,
    constraints JSONB, -- time, resource, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP WITH TIME ZONE,
    profile_version INTEGER DEFAULT 1
);

CREATE INDEX idx_learner_profiles_learner_id ON learner_profiles(learner_id);
CREATE INDEX idx_learner_profiles_type ON learner_profiles(learner_type);
CREATE INDEX idx_learner_profiles_last_activity ON learner_profiles(last_activity);
```

### 4.2.5. `learning_sessions` Table

**Purpose**: Records of individual learning sessions and outcomes

```sql
CREATE TABLE learning_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learner_id VARCHAR(100) NOT NULL,
    session_type VARCHAR(50) NOT NULL CHECK (session_type IN ('training', 'simulation', 'assessment', 'practice')),
    content_id UUID REFERENCES training_content(content_id),
    environment_id UUID REFERENCES simulation_environments(environment_id),
    session_config JSONB,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    duration INTEGER, -- in seconds
    completion_status VARCHAR(20) CHECK (completion_status IN ('in_progress', 'completed', 'abandoned', 'failed')),
    performance_data JSONB,
    learning_outcomes JSONB,
    feedback JSONB,
    session_metadata JSONB,
    
    CONSTRAINT chk_session_times CHECK (end_time IS NULL OR end_time >= start_time)
);

CREATE INDEX idx_learning_sessions_learner ON learning_sessions(learner_id);
CREATE INDEX idx_learning_sessions_type ON learning_sessions(session_type);
CREATE INDEX idx_learning_sessions_start_time ON learning_sessions(start_time);
CREATE INDEX idx_learning_sessions_status ON learning_sessions(completion_status);
```

### 4.2.6. `assessment_results` Table

**Purpose**: Detailed assessment and evaluation results

```sql
CREATE TABLE assessment_results (
    assessment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learner_id VARCHAR(100) NOT NULL,
    session_id UUID REFERENCES learning_sessions(session_id),
    assessment_type VARCHAR(50) NOT NULL,
    assessment_scope JSONB,
    assessment_criteria JSONB,
    results JSONB NOT NULL,
    skill_assessments JSONB,
    improvement_recommendations JSONB,
    benchmark_comparisons JSONB,
    confidence_level DECIMAL(3,2) CHECK (confidence_level >= 0 AND confidence_level <= 1),
    assessor VARCHAR(100), -- System or human assessor
    assessment_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    review_status VARCHAR(20) DEFAULT 'final' CHECK (review_status IN ('draft', 'final', 'reviewed'))
);

CREATE INDEX idx_assessment_results_learner ON assessment_results(learner_id);
CREATE INDEX idx_assessment_results_type ON assessment_results(assessment_type);
CREATE INDEX idx_assessment_results_timestamp ON assessment_results(assessment_timestamp);
```

## 4.3. Learning Analytics Layer - ClickHouse

### 4.3.1. `learning_events` Table

**Purpose**: High-frequency learning event tracking for analytics

```sql
CREATE TABLE learning_events (
    timestamp DateTime64(3),
    event_id String,
    learner_id String,
    session_id String,
    event_type Enum8('session_start' = 1, 'content_access' = 2, 'interaction' = 3, 'assessment_submit' = 4, 'session_end' = 5, 'error' = 6),
    event_data String, -- JSON string
    performance_metrics String, -- JSON string
    duration_ms UInt64,
    success_indicator Bool,
    difficulty_level Float64,
    learning_objective String,
    content_type String
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, learner_id, session_id);
```

### 4.3.2. `performance_metrics` Table

**Purpose**: Aggregated performance metrics for analysis

```sql
CREATE TABLE performance_metrics (
    timestamp DateTime64(3),
    learner_id String,
    metric_type Enum8('accuracy' = 1, 'speed' = 2, 'completion_rate' = 3, 'retention' = 4, 'engagement' = 5, 'improvement' = 6),
    metric_value Float64,
    metric_context String, -- JSON string with context
    skill_category String,
    session_type String,
    content_difficulty Float64,
    baseline_value Float64,
    improvement_rate Float64
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, learner_id, metric_type);
```

### 4.3.3. `content_effectiveness` Table

**Purpose**: Analytics on training content effectiveness

```sql
CREATE TABLE content_effectiveness (
    timestamp DateTime64(3),
    content_id String,
    dataset_id String,
    usage_count UInt32,
    success_rate Float64,
    average_completion_time UInt32,
    difficulty_perception Float64,
    learner_satisfaction Float64,
    learning_objective_achievement Float64,
    retention_rate Float64,
    improvement_correlation Float64
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, content_id);
```

## 4.4. Real-time Coordination Layer - Redis

### 4.4.1. Active Simulation Sessions

**Key Pattern**: `simulation:active:[sessionId]`
```redis
HSET simulation:active:sim-001
  sessionId "sim-001"
  environmentId "env-001"
  participants '["learner1", "learner2", "learner3"]'
  currentState '{"phase": "coordination", "challenge": "resource_allocation"}'
  startTime "2024-06-25T20:00:00Z"
  lastUpdate "2024-06-25T20:15:00Z"
  config '{"duration": 3600, "adaptive": true}'
```

**Key Pattern**: `simulation:participants:[sessionId]`
```redis
SADD simulation:participants:sim-001 "learner1"
SADD simulation:participants:sim-001 "learner2" 
SADD simulation:participants:sim-001 "learner3"
```

### 4.4.2. Real-time Learning Progress

**Key Pattern**: `learning:progress:[learnerId]`
```redis
HSET learning:progress:learner1
  currentSession "session-123"
  currentObjective "ethical_reasoning_improvement"
  progressPercentage "75"
  lastActivity "2024-06-25T20:15:00Z"
  streakDays "7"
  todayActivities "3"
```

### 4.4.3. Content Generation Queue

**Key Pattern**: `generation:queue:[priority]`
```redis
LPUSH generation:queue:high '{"requestId": "req-001", "type": "variation", "urgency": "high"}'
LPUSH generation:queue:normal '{"requestId": "req-002", "type": "new_content", "urgency": "normal"}'
```

## 4.5. Learning Relationships Layer - Neo4j

### 4.5.1. Competency Networks

**Node Types and Relationships**:
```cypher
// Core node types
CREATE CONSTRAINT ON (l:Learner) ASSERT l.learnerId IS UNIQUE;
CREATE CONSTRAINT ON (s:Skill) ASSERT s.skillId IS UNIQUE;
CREATE CONSTRAINT ON (c:Content) ASSERT c.contentId IS UNIQUE;
CREATE CONSTRAINT ON (o:Objective) ASSERT o.objectiveId IS UNIQUE;

// Learner skill relationships
CREATE (:Learner {learnerId: 'learner1', type: 'analytical_node'});
CREATE (:Skill {skillId: 'ethical_reasoning', category: 'decision_making'});

MATCH (l:Learner {learnerId: 'learner1'}), (s:Skill {skillId: 'ethical_reasoning'})
CREATE (l)-[:HAS_SKILL {
    proficiencyLevel: 0.75,
    lastAssessed: datetime(),
    growthRate: 0.15,
    confidenceLevel: 0.85
}]->(s);
```

### 4.5.2. Learning Path Networks

```cypher
// Learning progression relationships
CREATE (:Content {contentId: 'content-001', type: 'basic_ethics', difficulty: 0.3});
CREATE (:Content {contentId: 'content-002', type: 'complex_ethics', difficulty: 0.7});

MATCH (c1:Content {contentId: 'content-001'}), (c2:Content {contentId: 'content-002'})
CREATE (c1)-[:PREREQUISITE_FOR {
    strength: 0.9,
    optionalBypass: false,
    averageTransitionTime: 14
}]->(c2);
```

### 4.5.3. Learner Interaction Networks

```cypher
// Collaborative learning relationships
MATCH (l1:Learner {learnerId: 'learner1'}), (l2:Learner {learnerId: 'learner2'})
CREATE (l1)-[:COLLABORATED_WITH {
    sessionCount: 5,
    avgSynergy: 0.82,
    lastCollaboration: datetime(),
    complementarySkills: ['analysis', 'creativity']
}]->(l2);
```

## 4.6. Data Integration and Synchronization

### 4.6.1. Cross-Database Synchronization

**PostgreSQL to ClickHouse Pipeline**:
```sql
-- Trigger function for real-time analytics sync
CREATE OR REPLACE FUNCTION sync_to_analytics()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert learning event to ClickHouse via external data wrapper
    PERFORM clickhouse_insert('learning_events', NEW.session_id, NEW.learner_id, NEW.event_data);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER learning_session_analytics_sync
    AFTER INSERT ON learning_sessions
    FOR EACH ROW EXECUTE FUNCTION sync_to_analytics();
```

**Redis to PostgreSQL Sync**:
```javascript
// Periodic sync of Redis session data to PostgreSQL
const syncSessionData = async () => {
    const activeSessions = await redis.keys('simulation:active:*');
    
    for (const sessionKey of activeSessions) {
        const sessionData = await redis.hgetall(sessionKey);
        await postgres.query(`
            INSERT INTO learning_sessions (session_id, learner_id, session_type, session_config, start_time)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (session_id) DO UPDATE SET
                session_config = EXCLUDED.session_config,
                updated_at = CURRENT_TIMESTAMP
        `, [sessionData.sessionId, sessionData.learnerId, 'simulation', sessionData.config, sessionData.startTime]);
    }
};
```

### 4.6.2. Data Consistency Protocols

**Consistency Rules**:
1. **Session Integrity**: All active sessions in Redis must have corresponding records in PostgreSQL
2. **Assessment Completeness**: All assessments must reference valid learning sessions
3. **Content Validation**: Training content must pass quality validation before use
4. **Learner Profile Coherence**: Profile updates must be atomic across all systems
5. **Analytics Accuracy**: ClickHouse metrics must be derivable from PostgreSQL source data

**Validation Procedures**:
```sql
-- Daily consistency check
WITH redis_sessions AS (
    SELECT session_id FROM redis_session_sync_table
),
postgres_sessions AS (
    SELECT session_id FROM learning_sessions 
    WHERE start_time >= CURRENT_DATE
)
SELECT r.session_id as orphaned_redis_session
FROM redis_sessions r
LEFT JOIN postgres_sessions p ON r.session_id = p.session_id
WHERE p.session_id IS NULL;
```

## 4.7. Performance Optimization

### 4.7.1. Query Optimization Strategies

**PostgreSQL Optimization**:
- Partitioning large tables by date (learning_sessions, assessment_results)
- Materialized views for complex learner analytics queries
- Connection pooling for high-frequency read operations
- Read replicas for analytics queries

**ClickHouse Optimization**:
- Optimal partition keys based on query patterns
- Materialized views for pre-computed aggregations
- Proper data types for compression efficiency
- Sampling for large-scale pattern analysis

**Redis Optimization**:
- Cluster mode for horizontal scaling
- Pipeline operations for bulk updates
- Appropriate expiration times for temporary data
- Memory optimization for frequently accessed data

### 4.7.2. Monitoring and Performance Metrics

**Database Performance Metrics**:
- Query response times across all systems
- Connection pool utilization
- Cache hit rates and memory usage
- Data synchronization lag between systems

**Learning System Metrics**:
- Content generation response times
- Simulation environment startup latency
- Assessment processing duration
- Real-time collaboration responsiveness

**Alert Conditions**:
- Learning session creation failures
- Assessment result inconsistencies
- Content generation quality drops below threshold
- Simulation environment crashes or hangs