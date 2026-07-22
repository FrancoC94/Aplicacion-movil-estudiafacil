from datetime import datetime

from pydantic import BaseModel, ConfigDict


class RecordatorioBase(BaseModel):
    tarea_id: int
    fecha_recordatorio: datetime


class RecordatorioCreate(RecordatorioBase):
    pass


class RecordatorioOut(RecordatorioBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    enviado: bool
    created_at: datetime
