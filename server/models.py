from __future__ import annotations

from datetime import datetime
from typing import List, Literal, Optional, Any

from pydantic import BaseModel, Field

__all__ = [
    "ApiError",
    "NodeIdentity",
    "Service",
    "JobStatusLiteral",
    "Job",
]


class ApiError(BaseModel):
    error: dict[str, str]


class NodeIdentity(BaseModel):
    class_: str = Field("Griot", alias="class")
    version: str
    nodeId: str


class Service(BaseModel):
    id: Optional[str] = None
    name: str
    type: Literal["ollama", "openai", "comfyui", "custom"]
    url: str
    capabilities: List[Literal["llm_chat", "llm_embedding", "image_generation"]]
    apiKey: Optional[str] = Field(default=None, exclude=True)
    metadata: Optional[dict[str, Optional[str]]] = None


JobStatusLiteral = Literal["pending", "running", "completed", "failed"]


class Job(BaseModel):
    jobId: str
    status: JobStatusLiteral
    result: Optional[dict] = None
    error: Optional[ApiError] = None
    metadata: dict[str, Any] = Field(default_factory=dict) 