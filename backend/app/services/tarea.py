from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundException, ForbiddenException
from app.models.tarea import Tarea
from app.repositories.tarea import TareaRepository
from app.services.materia import MateriaService
from app.schemas.tarea import TareaCreate, TareaUpdate


class TareaService:
    def __init__(self, db: Session):
        self.repo = TareaRepository(db)
        self.materia_service = MateriaService(db)

    def list_for_user(self, usuario_id: int) -> list[Tarea]:
        return self.repo.get_by_usuario(usuario_id)

    def get_owned(self, tarea_id: int, usuario_id: int) -> Tarea:
        tarea = self.repo.get(tarea_id)
        if not tarea:
            raise NotFoundException("Tarea no encontrada")
        if tarea.materia.usuario_id != usuario_id:
            raise ForbiddenException("No tienes acceso a esta tarea")
        return tarea

    def create(self, data: TareaCreate, usuario_id: int) -> Tarea:
        # Verifica que la materia pertenezca al usuario antes de crear la tarea
        self.materia_service.get_owned(data.materia_id, usuario_id)
        return self.repo.create(data.model_dump())

    def update(self, tarea: Tarea, data: TareaUpdate) -> Tarea:
        return self.repo.update(tarea, data.model_dump(exclude_unset=True))

    def delete(self, tarea: Tarea) -> None:
        self.repo.delete(tarea)
