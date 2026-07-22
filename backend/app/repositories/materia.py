from sqlalchemy.orm import Session

from app.models.materia import Materia
from app.repositories.base import BaseRepository


class MateriaRepository(BaseRepository[Materia]):
    def __init__(self, db: Session):
        super().__init__(Materia, db)

    def get_by_usuario(self, usuario_id: int, skip: int = 0, limit: int = 100) -> list[Materia]:
        return (
            self.db.query(Materia)
            .filter(Materia.usuario_id == usuario_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
