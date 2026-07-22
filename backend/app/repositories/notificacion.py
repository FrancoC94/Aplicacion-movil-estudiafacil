from sqlalchemy.orm import Session

from app.models.notificacion import Notificacion
from app.repositories.base import BaseRepository


class NotificacionRepository(BaseRepository[Notificacion]):
    def __init__(self, db: Session):
        super().__init__(Notificacion, db)

    def get_by_usuario(self, usuario_id: int, skip: int = 0, limit: int = 100) -> list[Notificacion]:
        return (
            self.db.query(Notificacion)
            .filter(Notificacion.usuario_id == usuario_id)
            .order_by(Notificacion.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
