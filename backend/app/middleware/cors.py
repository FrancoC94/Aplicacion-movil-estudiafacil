"""
Configuración de CORS centralizada.

La configuración real se aplica en app/main.py mediante CORSMiddleware,
usando la lista de orígenes definida en app/config.py (ALLOWED_ORIGINS).
Este módulo se deja disponible para futuras reglas de CORS específicas
(por ejemplo, distintos orígenes por entorno).
"""

from app.config import settings


def get_cors_origins() -> list[str]:
    return settings.allowed_origins_list
