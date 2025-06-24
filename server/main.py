from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Griot Node – Seed Protocol Server",
    description="Reference implementation of the Griot Seed Protocol V1",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Allow all origins by default; adjust via env var in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

from server.routes import node as node_router, services as services_router, auth as auth_router, proxy as proxy_router, jobs as jobs_router  # noqa: E402

app.include_router(node_router.router, prefix="/api/v1")
app.include_router(services_router.router, prefix="/api/v1")
app.include_router(auth_router.router, prefix="/api/v1")
app.include_router(proxy_router.router, prefix="/api/v1")
app.include_router(jobs_router.router, prefix="/api/v1")

# Health endpoint for container orchestrators
@app.get("/health", include_in_schema=False)
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("server.main:app", host="0.0.0.0", port=30437, reload=True, log_level="info") 