"""
AI-Q MCP Gateway - Core routing and security service
"""

import asyncio
import json
import logging
import os
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
import httpx
from pydantic import BaseModel, ValidationError
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI application
app = FastAPI(
    title="AI-Q MCP Gateway",
    description="Central gateway for Model Context Protocol servers",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Pydantic models
class ServerInfo(BaseModel):
    id: str
    name: str
    description: str
    status: str
    capabilities: List[str]
    security_tier: str
    health_status: str
    last_seen: datetime

class InstallServerRequest(BaseModel):
    server_id: str
    config: Dict[str, Any] = {}
    security_tier: str = "community"

class ServerStatusResponse(BaseModel):
    servers: List[ServerInfo]
    total_count: int
    healthy_count: int
    last_updated: datetime

# Mock server registry for initial implementation
MOCK_SERVERS = [
    {
        "id": "openai",
        "name": "OpenAI",
        "description": "Query OpenAI models directly using MCP protocol",
        "status": "active",
        "capabilities": ["llm_chat", "completion", "embedding"],
        "security_tier": "trusted_external",
        "health_status": "healthy",
        "last_seen": datetime.utcnow()
    },
    {
        "id": "perplexity",
        "name": "Perplexity",
        "description": "Research and search capabilities",
        "status": "active",
        "capabilities": ["search", "research", "web_access"],
        "security_tier": "trusted_external", 
        "health_status": "healthy",
        "last_seen": datetime.utcnow()
    },
    {
        "id": "context7",
        "name": "Context7",
        "description": "Up-to-date documentation assistance",
        "status": "active",
        "capabilities": ["documentation", "search", "context"],
        "security_tier": "self_hosted",
        "health_status": "healthy",
        "last_seen": datetime.utcnow()
    }
]

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for load balancers"""
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# MCP Server management endpoints
@app.get("/api/servers", response_model=ServerStatusResponse)
async def list_servers():
    """List all available MCP servers"""
    try:
        servers = [ServerInfo(**server) for server in MOCK_SERVERS]
        healthy_servers = [s for s in servers if s.health_status == "healthy"]
        
        return ServerStatusResponse(
            servers=servers,
            total_count=len(servers),
            healthy_count=len(healthy_servers),
            last_updated=datetime.utcnow()
        )
    except Exception as e:
        logger.error(f"Error listing servers: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve servers")

@app.get("/api/servers/{server_id}")
async def get_server_info(server_id: str):
    """Get detailed information about a specific MCP server"""
    try:
        server = next((s for s in MOCK_SERVERS if s["id"] == server_id), None)
        if not server:
            raise HTTPException(status_code=404, detail="Server not found")
        
        return ServerInfo(**server)
    except Exception as e:
        logger.error(f"Error getting server {server_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve server information")

@app.post("/api/servers/{server_id}/install")
async def install_server(server_id: str, request: InstallServerRequest):
    """Install and configure a new MCP server"""
    try:
        return {
            "status": "success",
            "server_id": server_id,
            "message": "Server installed successfully",
            "installation_details": {"mock": True}
        }
    except Exception as e:
        logger.error(f"Error installing server {server_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to install server: {str(e)}")

# MCP Marketplace integration
@app.get("/api/marketplace/servers")
async def discover_marketplace_servers(category: Optional[str] = None, search: Optional[str] = None):
    """Discover servers from mcpservers.org marketplace"""
    try:
        # Mock marketplace response for now
        marketplace_servers = [
            {
                "id": "filesystem",
                "name": "Filesystem",
                "description": "Secure file operations with configurable access controls",
                "category": "File System",
                "provider": "Official",
                "security_assessment": {"tier": "self_hosted", "score": 9}
            },
            {
                "id": "git",
                "name": "Git", 
                "description": "Tools to read, search, and manipulate Git repositories",
                "category": "Version Control",
                "provider": "Official",
                "security_assessment": {"tier": "self_hosted", "score": 9}
            }
        ]
        
        return {
            "servers": marketplace_servers,
            "total_count": len(marketplace_servers),
            "source": "mcpservers.org"
        }
    except Exception as e:
        logger.error(f"Error fetching marketplace servers: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch marketplace servers")

# WebSocket endpoint for real-time MCP communication
@app.websocket("/mcp/{server_id}")
async def mcp_websocket(websocket: WebSocket, server_id: str):
    """WebSocket endpoint for real-time MCP server communication"""
    await websocket.accept()
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Mock response for now
            response = {
                "id": message.get("id"),
                "result": f"Mock response from {server_id}",
                "server_id": server_id
            }
            
            await websocket.send_text(json.dumps(response))
            
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for server {server_id}")
    except Exception as e:
        logger.error(f"WebSocket error for {server_id}: {e}")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=30436,
        reload=True,
        log_level="info"
    )
