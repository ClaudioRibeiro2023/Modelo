"""
TechDados BFF - FastAPI Application
Backend for Frontend serving the TechDados dashboard
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .core.settings import get_settings
from .core.logging import setup_logging, get_logger
from .core.audit import AuditMiddleware
from .api.v1.router import router as v1_router
from .providers import get_client

# Setup logging first
setup_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    settings = get_settings()
    logger.info(
        "api_starting",
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION,
        env=settings.APP_ENV,
        demo_mode=settings.DEMO_MODE,
    )
    yield
    # Cleanup on shutdown
    client = get_client()
    await client.close()
    logger.info("api_shutdown")


# Create FastAPI app
settings = get_settings()

app = FastAPI(
    title="TechDados BFF",
    description="Backend for Frontend - TechDados Dashboard (Techdengue Analytics)",
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# ============================================================================
# Middleware (order matters - last added = first executed)
# ============================================================================

# Audit logging
app.add_middleware(AuditMiddleware)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID"],
)

# ============================================================================
# Routes
# ============================================================================

# Include v1 API router
app.include_router(v1_router, prefix=settings.API_PREFIX)


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint - redirects to docs"""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "health": "/health",
        "api": f"{settings.API_PREFIX}/v1/status",
    }
