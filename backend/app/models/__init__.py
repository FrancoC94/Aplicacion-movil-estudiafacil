"""Importa todos los modelos para que SQLAlchemy resuelva sus relaciones."""

from app.models.user import User
from app.models.materia import Materia
from app.models.tarea import Tarea, EstadoTarea, PrioridadTarea
from app.models.recordatorio import Recordatorio
from app.models.notificacion import Notificacion
from app.models.horario import Horario
from app.models.evaluacion import Evaluacion
from app.models.password_reset import PasswordReset

__all__ = [
    "User",
    "Materia",
    "Tarea",
    "EstadoTarea",
    "PrioridadTarea",
    "Recordatorio",
    "Notificacion",
    "Horario",
    "Evaluacion",
    "PasswordReset",
]
