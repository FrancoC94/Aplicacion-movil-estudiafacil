from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_active_user
from app.core.exceptions import ForbiddenException
from app.database import get_db
from app.models.user import User
from app.models.recordatorio import Recordatorio
from app.repositories.tarea import TareaRepository
from app.schemas.recordatorio import RecordatorioCreate, RecordatorioOut

router = APIRouter(prefix="/recordatorios", tags=["Recordatorios"])


@router.post("", response_model=RecordatorioOut, status_code=201)
def create_recordatorio(
    data: RecordatorioCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    tarea_repo = TareaRepository(db)
    tarea = tarea_repo.get(data.tarea_id)
    if not tarea or tarea.materia.usuario_id != current_user.id:
        raise ForbiddenException("No tienes acceso a esta tarea")

    recordatorio = Recordatorio(**data.model_dump())
    db.add(recordatorio)
    db.commit()
    db.refresh(recordatorio)
    return recordatorio
