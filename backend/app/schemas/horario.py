from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class HorarioBase(BaseModel):
    materia_id: int
    dia_semana: str = Field(..., description="Día de la semana: lunes, martes, etc.")
    hora_inicio: str = Field(..., description="Hora de inicio en formato HH:MM (ej. 08:00)")
    hora_fin: str = Field(..., description="Hora de fin en formato HH:MM (ej. 10:00)")
    aula: str | None = None


class HorarioCreate(HorarioBase):
    pass


class HorarioUpdate(BaseModel):
    dia_semana: str | None = None
    hora_inicio: str | None = None
    hora_fin: str | None = None
    aula: str | None = None


class HorarioOut(HorarioBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
