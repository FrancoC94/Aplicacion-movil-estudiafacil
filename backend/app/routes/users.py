from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_active_user
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserOut, UserUpdate
from app.services.user import UserService

router = APIRouter(prefix="/users", tags=["Usuarios"])


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_active_user)):
    return current_user


@router.put("/me", response_model=UserOut)
def update_me(
    data: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    service = UserService(db)
    return service.update(current_user, data)


@router.delete("/me", status_code=204)
def delete_me(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    service = UserService(db)
    service.delete(current_user)
