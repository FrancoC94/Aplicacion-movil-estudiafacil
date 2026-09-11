# from slowapi import Limiter
# from slowapi.util import get_remote_address
# from slowapi.errors import RateLimitExceeded
from fastapi import Request
from fastapi.responses import JSONResponse

from app.config import settings

class MockLimiter:
    def __init__(self, *args, **kwargs):
        pass
    def limit(self, *args, **kwargs):
        def decorator(func):
            return func
        return decorator

limiter = MockLimiter()

async def rate_limit_exceeded_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=429,
        content={"detail": "Demasiadas solicitudes. Intenta de nuevo en un momento."},
    )
