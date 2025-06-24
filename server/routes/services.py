"""Service CRUD endpoints for Griot Node.
In Phase-2 we keep a simple in-memory store; later we will back with SQLModel & Postgres.
"""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Dict, List, Any

from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel

from server.models import Service
from server.deps import get_current_user, User

router = APIRouter(prefix="/services", tags=["Services"], dependencies=[Depends(get_current_user)])

# In-memory datastore keyed by service ID
_service_store: Dict[str, Service] = {}

# ---------- Helpers ---------------------------------------------------------

def _now_iso() -> str:
    return datetime.utcnow().isoformat()


def _store_default_meta() -> dict:
    return {"createdAt": _now_iso(), "updatedAt": _now_iso()}

# ---------- Routes ----------------------------------------------------------

class ServiceListResponse(BaseModel):
    """Response containing list of services."""
    data: List[Service]

@router.get("/", response_model=ServiceListResponse, summary="List all services")
async def list_services() -> ServiceListResponse:
    return ServiceListResponse(data=list(_service_store.values()))


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=Service, summary="Create a new service")
async def create_service(service: Service) -> Service:
    # If ID not provided generate one
    if not service.id:
        service.id = str(uuid.uuid4())
    if service.id in _service_store:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Service ID already exists")
    service.metadata = _store_default_meta()
    _service_store[service.id] = service
    return service


@router.put("/{service_id}", response_model=Service, summary="Update a service")
async def update_service(service_id: str, updates: Dict[str, Any]) -> Service:
    if service_id not in _service_store:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")
    stored = _service_store[service_id]
    updated_fields = updates
    for k, v in updated_fields.items():
        setattr(stored, k, v)
    # Ensure metadata exists
    if stored.metadata is None:
        stored.metadata = _store_default_meta()
    stored.metadata["updatedAt"] = _now_iso()
    _service_store[service_id] = stored
    return stored


@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a service")
async def delete_service(service_id: str):
    if service_id not in _service_store:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")
    _service_store.pop(service_id)
    return 