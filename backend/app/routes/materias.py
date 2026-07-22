from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_active_user
from app.database import get_db
from app.models.user import User
from app.schemas.materia import MateriaCreate, MateriaOut, MateriaUpdate
from app.services.materia import MateriaService

router = APIRouter(prefix="/materias", tags=["Materias"])


@router.get("", response_model=list[MateriaOut])
def list_materias(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return MateriaService(db).list_for_user(current_user.id)


@router.post("", response_model=MateriaOut, status_code=201)
def create_materia(
    data: MateriaCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return MateriaService(db).create(data, current_user.id)


@router.get("/{materia_id}", response_model=MateriaOut)
def get_materia(
    materia_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return MateriaService(db).get_owned(materia_id, current_user.id)


@router.put("/{materia_id}", response_model=MateriaOut)
def update_materia(
    materia_id: int,
    data: MateriaUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    service = MateriaService(db)
    materia = service.get_owned(materia_id, current_user.id)
    return service.update(materia, data)


@router.delete("/{materia_id}", status_code=204)
def delete_materia(
    materia_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    service = MateriaService(db)
    materia = service.get_owned(materia_id, current_user.id)
    service.delete(materia)
