from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.tarea import EstadoTarea, PrioridadTarea


class TareaBase(BaseModel):
    titulo: str = Field(..., min_length=1, max_length=150)
    descripcion: str | None = None
    fecha_entrega: datetime
    estado: EstadoTarea = EstadoTarea.pendiente
    prioridad: PrioridadTarea = PrioridadTarea.media
    materia_id: int


class TareaCreate(TareaBase):
    pass


class TareaUpdate(BaseModel):
    titulo: str | None = None
    descripcion: str | None = None
    fecha_entrega: datetime | None = None
    estado: EstadoTarea | None = None
    prioridad: PrioridadTarea | None = None
    materia_id: int | None = None


class TareaOut(TareaBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
