from datetime import datetime

from pydantic import BaseModel, ConfigDict


class NotificacionBase(BaseModel):
    titulo: str
    mensaje: str


class NotificacionCreate(NotificacionBase):
    usuario_id: int


class NotificacionOut(NotificacionBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    usuario_id: int
    leida: bool
    created_at: datetime
