"""Authentication routes.
This is a minimal stub that accepts any username/password and returns a dummy JWT.
"""
from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any, Dict
import os

from fastapi import APIRouter, HTTPException, status
from jose import jwt
from pydantic import BaseModel

from server.settings import get_settings

settings = get_settings()
SECRET_KEY = settings.jwt_secret
ALGORITHM = settings.jwt_algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = settings.jwt_exp_minutes

router = APIRouter(prefix="/auth", tags=["Auth"])


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    accessToken: str
    tokenType: str = "bearer"


@router.post("/login", response_model=TokenResponse, summary="Login and obtain JWT")
async def login(data: LoginRequest) -> TokenResponse:
    # In production, validate credentials here.
    if not data.username or not data.password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username and password required")

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode: Dict[str, Any] = {"sub": data.username, "exp": expire}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return TokenResponse(accessToken=encoded_jwt) 