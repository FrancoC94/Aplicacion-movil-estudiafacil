from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class EvaluacionBase(BaseModel):
    materia_id: int
    nombre: str = Field(..., min_length=1, max_length=100)
    porcentaje: float | None = Field(None, ge=0, le=100, description="Ponderación en porcentaje (ej. 30.0)")
    nota_obtenida: float | None = Field(None, ge=0, description="Nota obtenida")
    nota_maxima: float = Field(20.0, gt=0, description="Escala de calificación máxima")
    fecha: datetime | None = None


class EvaluacionCreate(EvaluacionBase):
    pass


class EvaluacionUpdate(BaseModel):
    nombre: str | None = None
    porcentaje: float | None = None
    nota_obtenida: float | None = None
    nota_maxima: float | None = None
    fecha: datetime | None = None


class EvaluacionOut(EvaluacionBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
