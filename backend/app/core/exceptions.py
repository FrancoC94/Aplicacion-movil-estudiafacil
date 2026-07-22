from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


class AppException(Exception):
    """Excepción base de la aplicación."""

    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class NotFoundException(AppException):
    def __init__(self, message: str = "Recurso no encontrado"):
        super().__init__(message, status_code=404)


class UnauthorizedException(AppException):
    def __init__(self, message: str = "No autorizado"):
        super().__init__(message, status_code=401)


class ForbiddenException(AppException):
    def __init__(self, message: str = "Acceso prohibido"):
        super().__init__(message, status_code=403)


class ConflictException(AppException):
    def __init__(self, message: str = "El recurso ya existe"):
        super().__init__(message, status_code=409)


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})
