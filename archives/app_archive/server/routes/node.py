from fastapi import APIRouter

from server.models import NodeIdentity

router = APIRouter(prefix="", tags=["Node"])


@router.get("/identity", response_model=NodeIdentity, summary="Get node identity")
async def get_identity() -> NodeIdentity:
    """Return node class, version, and nodeId."""
    return NodeIdentity(version="1.0.0", nodeId="seed-dev-node")


@router.get("/health", include_in_schema=False)
async def health_check() -> dict[str, str]:
    return {"status": "healthy"} 