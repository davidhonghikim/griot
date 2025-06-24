"""Jobs endpoints for tracking long-running operations."""
from __future__ import annotations

import uuid
from datetime import datetime
from typing import Dict, List, Optional

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from server.models import Job, JobStatusLiteral
from server.deps import get_current_user

router = APIRouter(prefix="/jobs", tags=["Jobs"], dependencies=[Depends(get_current_user)])

# In-memory job store (will be replaced with database in Task 2.1)
_job_store: Dict[str, Job] = {}


class JobCreationRequest(BaseModel):
    """Request to create a new job."""
    type: str
    parameters: dict
    metadata: Optional[dict] = None


class JobListResponse(BaseModel):
    """Response containing list of jobs."""
    data: List[Job]


def _create_job(job_type: str, parameters: dict, metadata: Optional[dict] = None) -> Job:
    """Helper to create a new job."""
    job_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    
    job = Job(
        jobId=job_id,
        status="pending",
        metadata={
            "type": job_type,
            "createdAt": now,
            "parameters": str(parameters),  # Convert to string for metadata compatibility
            **(metadata or {})
        }
    )
    
    _job_store[job_id] = job
    return job


def _update_job_status(job_id: str, status: JobStatusLiteral, result: Optional[dict] = None, error: Optional[dict] = None) -> Job:
    """Helper to update job status."""
    if job_id not in _job_store:
        raise ValueError(f"Job {job_id} not found")
    
    job = _job_store[job_id]
    job.status = status
    job.result = result
    job.error = error
    
    if status in ["completed", "failed"]:
        job.metadata["completedAt"] = datetime.utcnow().isoformat()
    
    return job


@router.get("/", response_model=JobListResponse, summary="List all jobs")
async def list_jobs() -> JobListResponse:
    """List all jobs for the current user."""
    return JobListResponse(data=list(_job_store.values()))


@router.post("/", response_model=Job, summary="Create a new job")
async def create_job(request: JobCreationRequest) -> Job:
    """Create a new job."""
    job = _create_job(request.type, request.parameters, request.metadata)
    
    # TODO: In a real implementation, this would trigger async processing
    # For now, we just create the job in pending state
    
    return job


@router.get("/{job_id}", response_model=Job, summary="Get job status")
async def get_job(job_id: str) -> Job:
    """Get the status and details of a specific job."""
    if job_id not in _job_store:
        raise HTTPException(status_code=404, detail=f"Job '{job_id}' not found")
    
    return _job_store[job_id]


@router.delete("/{job_id}", status_code=204, summary="Cancel/delete a job")
async def delete_job(job_id: str):
    """Cancel or delete a job."""
    if job_id not in _job_store:
        raise HTTPException(status_code=404, detail=f"Job '{job_id}' not found")
    
    job = _job_store[job_id]
    if job.status in ["running"]:
        # In a real implementation, this would cancel the running job
        job.status = "failed"
        job.error = {"code": "CANCELLED", "message": "Job was cancelled by user"}
        job.metadata["completedAt"] = datetime.utcnow().isoformat()
    
    _job_store.pop(job_id)


# Utility functions for other routes to use
def get_job_by_id(job_id: str) -> Optional[Job]:
    """Get a job by ID (for internal use)."""
    return _job_store.get(job_id)


def update_job_status_internal(job_id: str, status: JobStatusLiteral, result: Optional[dict] = None, error: Optional[dict] = None) -> Optional[Job]:
    """Update job status (for internal use)."""
    try:
        return _update_job_status(job_id, status, result, error)
    except ValueError:
        return None 