from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundException
from app.core.security import hash_password
from app.models.user import User
from app.repositories.user import UserRepository
from app.schemas.user import UserUpdate


class UserService:
    def __init__(self, db: Session):
        self.repo = UserRepository(db)

    def get(self, user_id: int) -> User:
        user = self.repo.get(user_id)
        if not user:
            raise NotFoundException("Usuario no encontrado")
        return user

    def update(self, user: User, data: UserUpdate) -> User:
        update_data = data.model_dump(exclude_unset=True)
        if "password" in update_data and update_data["password"]:
            update_data["hashed_password"] = hash_password(update_data.pop("password"))
        return self.repo.update(user, update_data)

    def delete(self, user: User) -> None:
        self.repo.delete(user)
