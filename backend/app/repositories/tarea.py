from sqlalchemy.orm import Session

from app.models.tarea import Tarea
from app.models.materia import Materia
from app.repositories.base import BaseRepository


class TareaRepository(BaseRepository[Tarea]):
    def __init__(self, db: Session):
        super().__init__(Tarea, db)

    def get_by_materia(self, materia_id: int, skip: int = 0, limit: int = 100) -> list[Tarea]:
        return (
            self.db.query(Tarea)
            .filter(Tarea.materia_id == materia_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_usuario(self, usuario_id: int, skip: int = 0, limit: int = 100) -> list[Tarea]:
        return (
            self.db.query(Tarea)
            .join(Materia, Tarea.materia_id == Materia.id)
            .filter(Materia.usuario_id == usuario_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
