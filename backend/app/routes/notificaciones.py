from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_active_user
from app.database import get_db
from app.models.user import User
from app.schemas.notificacion import NotificacionOut
from app.services.notificacion import NotificacionService

router = APIRouter(prefix="/notificaciones", tags=["Notificaciones"])


@router.get("", response_model=list[NotificacionOut])
def list_notificaciones(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return NotificacionService(db).list_for_user(current_user.id)


@router.patch("/{notificacion_id}/leida", response_model=NotificacionOut)
def marcar_leida(
    notificacion_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return NotificacionService(db).marcar_leida(notificacion_id, current_user.id)
