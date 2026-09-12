from datetime import datetime

from pydantic import BaseModel, EmailStr, ConfigDict, Field


class UserBase(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    carrera: str | None = None
    universidad: str | None = None
    semestre_ciclo: str | None = None
    avatar_url: str | None = None
    telefono: str | None = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=72)


class UserUpdate(BaseModel):
    nombre: str | None = Field(None, min_length=2, max_length=100)
    password: str | None = Field(None, min_length=8, max_length=72)
    carrera: str | None = None
    universidad: str | None = None
    semestre_ciclo: str | None = None
    avatar_url: str | None = None
    telefono: str | None = None


class UserOut(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    rol: str = "estudiante"
    is_active: bool
    is_verified: bool
    last_login: datetime | None = None
    created_at: datetime
    updated_at: datetime | None = None
