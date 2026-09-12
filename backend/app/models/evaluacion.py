from datetime import datetime, timezone

from sqlalchemy import String, Float, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Evaluacion(Base):
    __tablename__ = "evaluaciones"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    materia_id: Mapped[int] = mapped_column(ForeignKey("materias.id", ondelete="CASCADE"), nullable=False)
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)  # "Examen Parcial", "Trabajo 1"
    porcentaje: Mapped[float | None] = mapped_column(Float, nullable=True)  # Ej: 30.0 para 30%
    nota_obtenida: Mapped[float | None] = mapped_column(Float, nullable=True)  # Ej: 18.5
    nota_maxima: Mapped[float] = mapped_column(Float, default=20.0)  # Escala (ej. 20 o 100)
    fecha: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    materia = relationship("Materia", back_populates="evaluaciones")
