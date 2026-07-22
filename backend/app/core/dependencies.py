from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.exceptions import UnauthorizedException
from app.core.security import decode_token
from app.database import get_db
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    try:
        payload = decode_token(token)
        if payload.get("type") != "access":
            raise UnauthorizedException("Tipo de token inválido")
        user_id = payload.get("sub")
    except ValueError as exc:
        raise UnauthorizedException(str(exc)) from exc

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise UnauthorizedException("Usuario no encontrado")
    if not user.is_active:
        raise UnauthorizedException("Usuario inactivo")
    return user


def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    return current_user
