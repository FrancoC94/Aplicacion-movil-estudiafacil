from sqlalchemy.orm import Session

from app.core.exceptions import ConflictException, UnauthorizedException
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token
from app.models.user import User
from app.repositories.user import UserRepository
from app.schemas.user import UserCreate


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = UserRepository(db)

    def register(self, data: UserCreate) -> User:
        if self.repo.get_by_email(data.email):
            raise ConflictException("Ya existe una cuenta con este email")
        user = self.repo.create(
            {
                "nombre": data.nombre,
                "email": data.email,
                "hashed_password": hash_password(data.password),
            }
        )
        return user

    def authenticate(self, email: str, password: str) -> User:
        user = self.repo.get_by_email(email)
        if not user or not verify_password(password, user.hashed_password):
            raise UnauthorizedException("Email o contraseña incorrectos")
        if not user.is_active:
            raise UnauthorizedException("Usuario inactivo")
        return user

    def create_tokens(self, user: User) -> dict:
        return {
            "access_token": create_access_token(str(user.id)),
            "refresh_token": create_refresh_token(str(user.id)),
            "token_type": "bearer",
        }
