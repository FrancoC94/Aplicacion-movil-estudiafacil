from datetime import datetime, timezone
import enum

from sqlalchemy import String, Text, ForeignKey, DateTime, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class EstadoTarea(str, enum.Enum):
    pendiente = "pendiente"
    en_progreso = "en_progreso"
    completada = "completada"


class PrioridadTarea(str, enum.Enum):
    baja = "baja"
    media = "media"
    alta = "alta"


class Tarea(Base):
    __tablename__ = "tareas"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    titulo: Mapped[str] = mapped_column(String(150), nullable=False)
    descripcion: Mapped[str | None] = mapped_column(Text, nullable=True)
    fecha_entrega: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    estado: Mapped[EstadoTarea] = mapped_column(Enum(EstadoTarea), default=EstadoTarea.pendiente)
    prioridad: Mapped[PrioridadTarea] = mapped_column(Enum(PrioridadTarea), default=PrioridadTarea.media)
    materia_id: Mapped[int] = mapped_column(ForeignKey("materias.id", ondelete="CASCADE"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    materia = relationship("Materia", back_populates="tareas")
    recordatorios = relationship("Recordatorio", back_populates="tarea", cascade="all, delete-orphan")
