"""REST + gRPC API gateway for AI Kitchen.

For simplicity the initial version only exposes REST endpoints via FastAPI.  A
gRPC proto can be added later and served via grpcio or grpc-gateway.
"""
from __future__ import annotations

import asyncio
import importlib
from pathlib import Path
from typing import Any, Dict

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from .device_manager import detect_hardware
from .skill_loader import load_skill, SkillLoadError

app = FastAPI(title="AI Kitchen", version="0.1.0", docs_url="/docs", redoc_url="/redoc")


class SkillRequest(BaseModel):
    params: Dict[str, Any] = {}


@app.get("/v1/hardware")
async def hardware():
    """Return snapshot of detected hardware."""
    return JSONResponse(detect_hardware().to_dict())


@app.post("/v1/skills/{skill_name}/execute")
async def execute_skill(skill_name: str, req: SkillRequest):
    try:
        fn = load_skill(skill_name)
    except SkillLoadError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(None, fn, req.params)
    return {"result": result}


@app.post("/v1/recipes/run")
async def run_recipe(recipe_file: str):
    """Execute a YAML recipe and stream results (stub)."""
    if not Path(recipe_file).exists():
        raise HTTPException(status_code=404, detail="recipe_file not found")
    # TODO: Parse YAML and orchestrate skills.
    return {"status": "not_implemented"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("ai_kitchen.core.api_gateway:app", host="0.0.0.0", port=8000, reload=False)
