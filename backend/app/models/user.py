from datetime import datetime, timezone

from sqlalchemy import String, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(150), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    carrera: Mapped[str | None] = mapped_column(String(100), nullable=True)
    universidad: Mapped[str | None] = mapped_column(String(150), nullable=True)
    semestre_ciclo: Mapped[str | None] = mapped_column(String(50), nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    telefono: Mapped[str | None] = mapped_column(String(30), nullable=True)
    # Solo una referencia aproximada elegida explícitamente por el usuario; nunca ubicación en segundo plano.
    ubicacion_estudio: Mapped[str | None] = mapped_column(String(255), nullable=True)
    rol: Mapped[str] = mapped_column(String(20), default="estudiante", server_default="estudiante")
    last_login: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc)
    )

    materias = relationship("Materia", back_populates="propietario", cascade="all, delete-orphan")
    notificaciones = relationship("Notificacion", back_populates="usuario", cascade="all, delete-orphan")
    password_resets = relationship("PasswordReset", back_populates="usuario", cascade="all, delete-orphan")
