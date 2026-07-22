from datetime import datetime, timezone

from sqlalchemy import ForeignKey, DateTime, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Recordatorio(Base):
    __tablename__ = "recordatorios"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    tarea_id: Mapped[int] = mapped_column(ForeignKey("tareas.id", ondelete="CASCADE"))
    fecha_recordatorio: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    enviado: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    tarea = relationship("Tarea", back_populates="recordatorios")
