from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_active_user
from app.database import get_db
from app.models.user import User
from app.schemas.tarea import TareaCreate, TareaOut, TareaUpdate
from app.services.tarea import TareaService

router = APIRouter(prefix="/tareas", tags=["Tareas"])


@router.get("", response_model=list[TareaOut])
def list_tareas(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return TareaService(db).list_for_user(current_user.id)


@router.post("", response_model=TareaOut, status_code=201)
def create_tarea(
    data: TareaCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return TareaService(db).create(data, current_user.id)


@router.get("/{tarea_id}", response_model=TareaOut)
def get_tarea(
    tarea_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return TareaService(db).get_owned(tarea_id, current_user.id)


@router.put("/{tarea_id}", response_model=TareaOut)
def update_tarea(
    tarea_id: int,
    data: TareaUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    service = TareaService(db)
    tarea = service.get_owned(tarea_id, current_user.id)
    return service.update(tarea, data)


@router.delete("/{tarea_id}", status_code=204)
def delete_tarea(
    tarea_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    service = TareaService(db)
    tarea = service.get_owned(tarea_id, current_user.id)
    service.delete(tarea)
