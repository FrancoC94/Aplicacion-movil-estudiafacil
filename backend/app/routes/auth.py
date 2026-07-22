from fastapi import APIRouter, Depends, Request
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.rate_limit import limiter
from app.database import get_db
from app.schemas.user import UserCreate, UserOut
from app.services.auth import AuthService

router = APIRouter(prefix="/auth", tags=["Autenticación"])


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


@router.post("/register", response_model=UserOut, status_code=201)
@limiter.limit("10/minute")
def register(request: Request, data: UserCreate, db: Session = Depends(get_db)):
    service = AuthService(db)
    return service.register(data)


@router.post("/login", response_model=TokenResponse)
@limiter.limit("10/minute")
def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    service = AuthService(db)
    user = service.authenticate(form_data.username, form_data.password)
    return service.create_tokens(user)
