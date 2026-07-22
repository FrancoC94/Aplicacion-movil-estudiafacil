from datetime import datetime

from pydantic import BaseModel, EmailStr, ConfigDict, Field


class UserBase(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100)
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=72)


class UserUpdate(BaseModel):
    nombre: str | None = Field(None, min_length=2, max_length=100)
    password: str | None = Field(None, min_length=8, max_length=72)


class UserOut(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    is_active: bool
    is_verified: bool
    created_at: datetime
