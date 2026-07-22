from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class MateriaBase(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=100)
    profesor: str | None = None
    color: str = "#4A90D9"
    creditos: int | None = None


class MateriaCreate(MateriaBase):
    pass


class MateriaUpdate(BaseModel):
    nombre: str | None = None
    profesor: str | None = None
    color: str | None = None
    creditos: int | None = None


class MateriaOut(MateriaBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    usuario_id: int
    created_at: datetime
