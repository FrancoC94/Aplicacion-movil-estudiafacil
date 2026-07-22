from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundException, ForbiddenException
from app.models.notificacion import Notificacion
from app.repositories.notificacion import NotificacionRepository


class NotificacionService:
    def __init__(self, db: Session):
        self.repo = NotificacionRepository(db)

    def list_for_user(self, usuario_id: int) -> list[Notificacion]:
        return self.repo.get_by_usuario(usuario_id)

    def marcar_leida(self, notificacion_id: int, usuario_id: int) -> Notificacion:
        notificacion = self.repo.get(notificacion_id)
        if not notificacion:
            raise NotFoundException("Notificación no encontrada")
        if notificacion.usuario_id != usuario_id:
            raise ForbiddenException("No tienes acceso a esta notificación")
        return self.repo.update(notificacion, {"leida": True})

    def crear(self, usuario_id: int, titulo: str, mensaje: str) -> Notificacion:
        return self.repo.create({"usuario_id": usuario_id, "titulo": titulo, "mensaje": mensaje})
