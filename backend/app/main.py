from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import configure_logging, get_logger
from app.core.rate_limit import limiter, rate_limit_exceeded_handler
from app.middleware.correlation import CorrelationIdMiddleware
from app.routes import auth, users, materias, tareas, recordatorios, notificaciones
from slowapi.errors import RateLimitExceeded

configure_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Iniciando EstudiaFácil API (%s)", settings.ENVIRONMENT)
    yield
    logger.info("Apagando EstudiaFácil API")


app = FastAPI(
    title="EstudiaFácil API",
    description="API backend para la app de organización académica EstudiaFácil",
    version="1.0.0",
    lifespan=lifespan,
)

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Correlation ID para trazabilidad de requests
app.add_middleware(CorrelationIdMiddleware)

# Excepciones personalizadas
register_exception_handlers(app)

# Rutas
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(materias.router)
app.include_router(tareas.router)
app.include_router(recordatorios.router)
app.include_router(notificaciones.router)


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "app": "EstudiaFácil API", "version": "1.0.0"}


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}
