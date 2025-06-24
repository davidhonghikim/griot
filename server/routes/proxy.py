"""Proxy endpoints for forwarding requests to backend services."""
from __future__ import annotations

import httpx
from fastapi import APIRouter, HTTPException, Request, Depends
from fastapi.responses import StreamingResponse
from typing import Any

from server.deps import get_current_user
from server.routes.services import _service_store

router = APIRouter(prefix="/proxy", tags=["Proxy"], dependencies=[Depends(get_current_user)])


@router.api_route("/{service_id}/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_request(service_id: str, path: str, request: Request) -> Any:
    """
    Proxy requests to a backend service.
    
    This endpoint forwards requests to the specified service, acting as a secure gateway.
    The service must be configured in the services store.
    """
    # Get service configuration
    if service_id not in _service_store:
        raise HTTPException(status_code=404, detail=f"Service '{service_id}' not found")
    
    service = _service_store[service_id]
    
    # Build target URL
    target_url = f"{service.url.rstrip('/')}/{path.lstrip('/')}"
    
    # Get query parameters
    query_params = str(request.url.query)
    if query_params:
        target_url += f"?{query_params}"
    
    # Prepare headers (remove host to avoid conflicts)
    headers = dict(request.headers)
    headers.pop("host", None)
    headers.pop("authorization", None)  # Remove our auth header
    
    # Add service API key if available
    if service.apiKey:
        headers["Authorization"] = f"Bearer {service.apiKey}"
    
    # Get request body
    body = await request.body()
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.request(
                method=request.method,
                url=target_url,
                headers=headers,
                content=body,
                timeout=30.0
            )
            
            # Stream the response back
            def generate():
                for chunk in response.iter_bytes():
                    yield chunk
            
            return StreamingResponse(
                generate(),
                status_code=response.status_code,
                headers=dict(response.headers),
                media_type=response.headers.get("content-type")
            )
            
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"Failed to connect to service: {str(e)}")
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Service request timed out") 