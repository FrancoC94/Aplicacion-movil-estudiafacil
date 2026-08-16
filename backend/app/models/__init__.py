"""Importa todos los modelos para que SQLAlchemy resuelva sus relaciones."""

from app.models.user import User
from app.models.materia import Materia
from app.models.tarea import Tarea, EstadoTarea, PrioridadTarea
from app.models.recordatorio import Recordatorio
from app.models.notificacion import Notificacion

__all__ = [
    "User",
    "Materia",
    "Tarea",
    "EstadoTarea",
    "PrioridadTarea",
    "Recordatorio",
    "Notificacion",
]
