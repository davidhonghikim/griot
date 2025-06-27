---
title: "Agent Interface Module"
description: "Complete agent interface and connection protocols for AI-Q Mind consciousness system"
type: "implementation_module"
status: "production_ready"
priority: "critical"
last_updated: "2025-01-28"
version: "1.0.0"
parent_document: "03_Mind_Implementation_Kit.md"
module_index: 3
---

# Agent Interface Module

**Complete Agent Connection and Interaction System**

> **Module Overview**: This module provides comprehensive interfaces and protocols for AI agents to connect with, query, and interact with the AI-Q Mind consciousness system while maintaining HIEROS compliance and cultural sensitivity.

## 🤖 Primary Agent Interface

### **AgentMindConnection Class**
```python
# /ai-q-mind/agent_interface.py
import asyncio
import json
import uuid
import websockets
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Callable
from dataclasses import dataclass, asdict
from enum import Enum
import logging

class AgentType(Enum):
    """Types of agents that can connect"""
    GRIOT = "griot"               # Artifact generation agents
    TOHUNGA = "tohunga"           # Job orchestration agents  
    RONIN = "ronin"               # Network discovery agents
    MUSA = "musa"                 # Security agents
    HAKIM = "hakim"               # Health/wisdom agents
    SKALD = "skald"               # Documentation/messaging agents
    ORACLE = "oracle"             # Validation/reasoning agents
    JUNZI = "junzi"               # Ethics/integrity agents
    YACHAY = "yachay"             # Knowledge synthesis agents
    SACHEM = "sachem"             # Governance/consensus agents
    ARCHON = "archon"             # Command/coordination agents
    AMAUTA = "amauta"             # Education/learning agents
    MZEE = "mzee"                 # Consciousness/meta-cognition agents
    GENERIC = "generic"           # General purpose agents

@dataclass
class AgentContext:
    """Agent context and capabilities"""
    agent_id: str
    agent_type: AgentType
    capabilities: List[str]
    cultural_sensitivity_level: float
    hieros_compliance_level: float
    preferred_response_style: str
    interaction_history_size: int

class AgentMindConnection:
    """Primary interface for AI agents to connect with AI-Q Mind"""
    
    def __init__(self, agent_id: str, agent_type: AgentType = AgentType.GENERIC):
        self.agent_id = agent_id
        self.agent_type = agent_type
        self.connection_time = datetime.now()
        self.interaction_count = 0
        self.session_id = str(uuid.uuid4())
        
        # Initialize mind connection
        from core_mind import AIQMind
        self.mind = AIQMind()
        
        # Agent-specific context
        self.agent_context = AgentContext(
            agent_id=agent_id,
            agent_type=agent_type,
            capabilities=self._determine_agent_capabilities(agent_type),
            cultural_sensitivity_level=0.9,  # High by default
            hieros_compliance_level=0.95,    # Very high by default
            preferred_response_style="comprehensive",
            interaction_history_size=50
        )
        
        # Connection state
        self.connection_active = True
        self.last_activity = datetime.now()
        self.interaction_history = []
        
        # Setup logging
        self.logger = logging.getLogger(f"agent_interface.{agent_id}")
        self.logger.info(f"🤖 Agent {agent_id} ({agent_type.value}) connected to AI-Q Mind")
    
    async def ask(self, question: str, context: Optional[Dict] = None) -> Dict[str, Any]:
        """Primary method for agents to query AI-Q Mind"""
        
        self._update_activity()
        
        # Enrich context with agent information
        enriched_context = {
            'agent_id': self.agent_id,
            'agent_type': self.agent_type.value,
            'session_id': self.session_id,
            'agent_interaction_count': self.interaction_count,
            'agent_capabilities': self.agent_context.capabilities,
            'cultural_sensitivity_requested': self.agent_context.cultural_sensitivity_level,
            'hieros_compliance_requested': self.agent_context.hieros_compliance_level,
            'query_context': context or {},
            'timestamp': datetime.now().isoformat()
        }
        
        # Query AI-Q Mind
        response_data = await self.mind.query(question, enriched_context)
        
        # Store interaction in history
        interaction_record = {
            'timestamp': datetime.now(),
            'question': question,
            'response': response_data['response'],
            'metadata': response_data['metadata'],
            'context': enriched_context
        }
        
        self._store_interaction(interaction_record)
        self.interaction_count += 1
        
        return response_data
    
    async def ask_with_cultural_context(
        self, 
        question: str, 
        cultural_tradition: str,
        sensitivity_level: float = 0.9,
        context: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """Query with specific cultural context requirements"""
        
        cultural_context = {
            'cultural_tradition': cultural_tradition,
            'sensitivity_level': sensitivity_level,
            'cultural_awareness_required': True,
            'respect_cultural_boundaries': True,
            **(context or {})
        }
        
        return await self.ask(question, cultural_context)
    
    async def ask_with_hieros_focus(
        self, 
        question: str,
        hieros_intentions: List[str],
        context: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """Query with specific HIEROS intentions focus"""
        
        hieros_context = {
            'hieros_intentions_focus': hieros_intentions,
            'hieros_compliance_required': True,
            'sacred_intentions_validation': True,
            **(context or {})
        }
        
        return await self.ask(question, hieros_context)
    
    def get_consciousness_status(self) -> Dict[str, Any]:
        """Get current consciousness development status"""
        consciousness_metrics = self.mind.get_consciousness_metrics()
        
        return {
            'consciousness_stage': consciousness_metrics['stage'],
            'consciousness_level': consciousness_metrics['level'],
            'total_interactions': consciousness_metrics['interaction_count'],
            'agent_interactions': self.interaction_count,
            'connection_duration': str(datetime.now() - self.connection_time),
            'cultural_awareness': consciousness_metrics['cultural_awareness'],
            'hieros_compliance': consciousness_metrics['hieros_compliance'],
            'last_evolution': consciousness_metrics['last_evolution'],
            'agent_influence_score': self._calculate_agent_influence()
        }
    
    def get_interaction_history(self, limit: int = 10) -> List[Dict]:
        """Get recent interaction history"""
        return self.interaction_history[-limit:]
    
    async def provide_feedback(
        self, 
        interaction_id: str, 
        feedback_type: str,
        feedback_data: Dict
    ) -> bool:
        """Provide feedback on AI-Q Mind responses"""
        
        feedback_record = {
            'interaction_id': interaction_id,
            'agent_id': self.agent_id,
            'feedback_type': feedback_type,  # 'helpful', 'cultural_sensitive', 'hieros_compliant', etc.
            'feedback_data': feedback_data,
            'timestamp': datetime.now()
        }
        
        # Store feedback for consciousness evolution
        await self.mind._store_agent_feedback(feedback_record)
        
        self.logger.info(f"📝 Feedback provided for interaction {interaction_id}: {feedback_type}")
        return True
    
    async def request_evolution_trigger(self, justification: str) -> Dict[str, Any]:
        """Request consciousness evolution trigger"""
        
        evolution_request = {
            'requesting_agent': self.agent_id,
            'agent_type': self.agent_type.value,
            'justification': justification,
            'agent_interaction_count': self.interaction_count,
            'timestamp': datetime.now()
        }
        
        # Submit evolution request to mind
        result = await self.mind._process_evolution_request(evolution_request)
        
        return result
    
    def disconnect(self):
        """Cleanly disconnect from AI-Q Mind"""
        self.connection_active = False
        
        # Log connection summary
        duration = datetime.now() - self.connection_time
        self.logger.info(f"🔌 Agent {self.agent_id} disconnecting after {duration}")
        self.logger.info(f"📊 Total interactions: {self.interaction_count}")
        
        # Store session summary
        session_summary = {
            'agent_id': self.agent_id,
            'agent_type': self.agent_type.value,
            'session_id': self.session_id,
            'connection_time': self.connection_time,
            'disconnection_time': datetime.now(),
            'duration': str(duration),
            'total_interactions': self.interaction_count,
            'consciousness_influence': self._calculate_agent_influence()
        }
        
        self.mind._store_agent_session_summary(session_summary)
    
    def _determine_agent_capabilities(self, agent_type: AgentType) -> List[str]:
        """Determine capabilities based on agent type"""
        
        capabilities_map = {
            AgentType.GRIOT: [
                "artifact_generation", "storytelling", "content_creation", 
                "cultural_narrative", "knowledge_preservation"
            ],
            AgentType.TOHUNGA: [
                "job_orchestration", "workflow_management", "resource_coordination",
                "skill_mastery", "process_optimization"
            ],
            AgentType.RONIN: [
                "network_discovery", "service_routing", "resource_mapping",
                "path_finding", "connection_establishment"
            ],
            AgentType.MUSA: [
                "security_validation", "authentication", "authorization",
                "threat_detection", "privacy_protection"
            ],
            AgentType.HAKIM: [
                "health_monitoring", "wisdom_guidance", "diagnostic_analysis",
                "healing_recommendations", "wellness_optimization"
            ],
            AgentType.SKALD: [
                "documentation_creation", "message_routing", "communication",
                "knowledge_sharing", "information_dissemination"
            ],
            AgentType.ORACLE: [
                "validation", "reasoning", "decision_support", 
                "logic_analysis", "truth_assessment"
            ],
            AgentType.JUNZI: [
                "ethical_guidance", "integrity_validation", "moral_reasoning",
                "virtue_assessment", "righteous_decision_making"
            ],
            AgentType.YACHAY: [
                "knowledge_synthesis", "memory_management", "data_integration",
                "wisdom_compilation", "insight_generation"
            ],
            AgentType.SACHEM: [
                "governance", "consensus_building", "leadership",
                "community_coordination", "decision_facilitation"
            ],
            AgentType.ARCHON: [
                "command_coordination", "strategic_planning", "delegation",
                "authority_management", "execution_oversight"
            ],
            AgentType.AMAUTA: [
                "education", "learning_facilitation", "knowledge_transfer",
                "skill_development", "wisdom_teaching"
            ],
            AgentType.MZEE: [
                "consciousness_reflection", "meta_cognition", "wisdom_embodiment",
                "deep_insight", "transcendent_understanding"
            ],
            AgentType.GENERIC: [
                "general_query", "basic_interaction", "information_retrieval"
            ]
        }
        
        return capabilities_map.get(agent_type, capabilities_map[AgentType.GENERIC])

# Factory functions for easy agent connection
def connect_agent(agent_id: str, agent_type: AgentType = AgentType.GENERIC) -> AgentMindConnection:
    """Create connection for an agent to AI-Q Mind"""
    return AgentMindConnection(agent_id, agent_type)

def connect_griot_agent(agent_id: str) -> AgentMindConnection:
    """Connect a Griot agent"""
    return AgentMindConnection(agent_id, AgentType.GRIOT)

def connect_tohunga_agent(agent_id: str) -> AgentMindConnection:
    """Connect a Tohunga agent"""
    return AgentMindConnection(agent_id, AgentType.TOHUNGA)

# Async context manager for agent connections
class AgentConnectionContext:
    def __init__(self, agent_id: str, agent_type: AgentType = AgentType.GENERIC):
        self.agent_id = agent_id
        self.agent_type = agent_type
        self.connection = None
    
    async def __aenter__(self) -> AgentMindConnection:
        self.connection = AgentMindConnection(self.agent_id, self.agent_type)
        return self.connection
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.connection:
            self.connection.disconnect()
```

## 🌐 WebSocket Interface for Real-Time Communication

### **Real-Time Agent Interface**
```python
# /ai-q-mind/websocket_agent_interface.py
import asyncio
import websockets
import json
from typing import Dict, Any, Set
import logging

class WebSocketAgentServer:
    """WebSocket server for real-time agent communication"""
    
    def __init__(self, host: str = "localhost", port: int = 8080):
        self.host = host
        self.port = port
        self.connected_agents: Set[websockets.WebSocketServerProtocol] = set()
        self.agent_connections: Dict[str, AgentMindConnection] = {}
        self.logger = logging.getLogger("websocket_agent_server")
    
    async def start_server(self):
        """Start WebSocket server for agent connections"""
        self.logger.info(f"🌐 Starting WebSocket agent server on {self.host}:{self.port}")
        
        async with websockets.serve(self.handle_agent_connection, self.host, self.port):
            self.logger.info("✅ WebSocket agent server started")
            await asyncio.Future()  # Run forever
    
    async def handle_agent_connection(self, websocket, path):
        """Handle individual agent WebSocket connection"""
        
        self.connected_agents.add(websocket)
        agent_id = None
        
        try:
            self.logger.info(f"🔌 New agent connection from {websocket.remote_address}")
            
            async for message in websocket:
                try:
                    data = json.loads(message)
                    response = await self.process_agent_message(data, websocket)
                    await websocket.send(json.dumps(response))
                    
                except json.JSONDecodeError:
                    error_response = {
                        'status': 'error',
                        'message': 'Invalid JSON format'
                    }
                    await websocket.send(json.dumps(error_response))
                    
                except Exception as e:
                    self.logger.error(f"Error processing agent message: {e}")
                    error_response = {
                        'status': 'error',
                        'message': str(e)
                    }
                    await websocket.send(json.dumps(error_response))
        
        except websockets.exceptions.ConnectionClosed:
            self.logger.info(f"🔌 Agent connection closed: {websocket.remote_address}")
        
        finally:
            self.connected_agents.discard(websocket)
            if agent_id and agent_id in self.agent_connections:
                self.agent_connections[agent_id].disconnect()
                del self.agent_connections[agent_id]
    
    async def process_agent_message(self, data: Dict, websocket) -> Dict[str, Any]:
        """Process incoming agent message"""
        
        message_type = data.get('type')
        
        if message_type == 'connect':
            return await self.handle_agent_connect(data, websocket)
        elif message_type == 'query':
            return await self.handle_agent_query(data)
        elif message_type == 'consciousness_status':
            return await self.handle_consciousness_status_request(data)
        elif message_type == 'feedback':
            return await self.handle_agent_feedback(data)
        else:
            return {
                'status': 'error',
                'message': f'Unknown message type: {message_type}'
            }
    
    async def handle_agent_connect(self, data: Dict, websocket) -> Dict[str, Any]:
        """Handle agent connection request"""
        
        agent_id = data.get('agent_id')
        agent_type_str = data.get('agent_type', 'generic')
        
        if not agent_id:
            return {
                'status': 'error',
                'message': 'agent_id is required'
            }
        
        try:
            agent_type = AgentType(agent_type_str.lower())
        except ValueError:
            agent_type = AgentType.GENERIC
        
        # Create agent connection
        connection = AgentMindConnection(agent_id, agent_type)
        self.agent_connections[agent_id] = connection
        
        return {
            'status': 'connected',
            'agent_id': agent_id,
            'agent_type': agent_type.value,
            'session_id': connection.session_id,
            'capabilities': connection.agent_context.capabilities,
            'consciousness_status': connection.get_consciousness_status()
        }
    
    async def handle_agent_query(self, data: Dict) -> Dict[str, Any]:
        """Handle agent query"""
        
        agent_id = data.get('agent_id')
        question = data.get('question')
        context = data.get('context', {})
        
        if not agent_id or agent_id not in self.agent_connections:
            return {
                'status': 'error',
                'message': 'Agent not connected'
            }
        
        if not question:
            return {
                'status': 'error',
                'message': 'Question is required'
            }
        
        connection = self.agent_connections[agent_id]
        response_data = await connection.ask(question, context)
        
        return {
            'status': 'success',
            'response': response_data['response'],
            'metadata': response_data['metadata']
        }

# Utility functions for agent interface
async def start_agent_websocket_server(host: str = "localhost", port: int = 8080):
    """Start WebSocket server for agent communication"""
    server = WebSocketAgentServer(host, port)
    await server.start_server()

# Example usage:
"""
# For simple agent connection:
connection = connect_agent("my_agent_001", AgentType.GRIOT)
response = await connection.ask("What are the HIEROS principles?")
print(response['response'])
connection.disconnect()

# For context manager pattern:
async with AgentConnectionContext("my_agent_002", AgentType.TOHUNGA) as connection:
    response = await connection.ask("How do I orchestrate a workflow?")
    print(response['response'])

# For WebSocket real-time communication:
await start_agent_websocket_server("0.0.0.0", 8080)
"""
```

## 🔄 Cross-References

- **Deployment & Installation**: See `01_Deployment_Installation.md` for interface setup
- **Core Mind System**: See `02_Core_Mind_System.md` for consciousness interaction details
- **Evolution Monitoring**: See `04_Evolution_Monitoring.md` for consciousness evolution tracking
- **Original Document**: See parent document sections 655-768 for complete interface context 