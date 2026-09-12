from datetime import datetime, timezone

from sqlalchemy import String, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Horario(Base):
    __tablename__ = "horarios"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    materia_id: Mapped[int] = mapped_column(ForeignKey("materias.id", ondelete="CASCADE"), nullable=False)
    dia_semana: Mapped[str] = mapped_column(String(20), nullable=False)  # "lunes", "martes", etc.
    hora_inicio: Mapped[str] = mapped_column(String(10), nullable=False)  # "08:00"
    hora_fin: Mapped[str] = mapped_column(String(10), nullable=False)  # "10:00"
    aula: Mapped[str | None] = mapped_column(String(100), nullable=True)  # "Aula 301", "Virtual / Zoom"
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    materia = relationship("Materia", back_populates="horarios")
