from datetime import datetime, timezone

from sqlalchemy import String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Materia(Base):
    __tablename__ = "materias"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    profesor: Mapped[str | None] = mapped_column(String(100), nullable=True)
    color: Mapped[str] = mapped_column(String(20), default="#4A90D9")
    creditos: Mapped[int | None] = mapped_column(Integer, nullable=True)
    usuario_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    propietario = relationship("User", back_populates="materias")
    tareas = relationship("Tarea", back_populates="materia", cascade="all, delete-orphan")
