from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundException, ForbiddenException
from app.models.materia import Materia
from app.repositories.materia import MateriaRepository
from app.schemas.materia import MateriaCreate, MateriaUpdate


class MateriaService:
    def __init__(self, db: Session):
        self.repo = MateriaRepository(db)

    def list_for_user(self, usuario_id: int) -> list[Materia]:
        return self.repo.get_by_usuario(usuario_id)

    def get_owned(self, materia_id: int, usuario_id: int) -> Materia:
        materia = self.repo.get(materia_id)
        if not materia:
            raise NotFoundException("Materia no encontrada")
        if materia.usuario_id != usuario_id:
            raise ForbiddenException("No tienes acceso a esta materia")
        return materia

    def create(self, data: MateriaCreate, usuario_id: int) -> Materia:
        payload = data.model_dump()
        payload["usuario_id"] = usuario_id
        return self.repo.create(payload)

    def update(self, materia: Materia, data: MateriaUpdate) -> Materia:
        return self.repo.update(materia, data.model_dump(exclude_unset=True))

    def delete(self, materia: Materia) -> None:
        self.repo.delete(materia)
