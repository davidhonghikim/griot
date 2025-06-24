"""Shared FastAPI dependencies (auth, DB, etc.)."""
from __future__ import annotations

from datetime import datetime
from typing import Annotated

from fastapi import Depends, HTTPException, status, Header
from jose import JWTError, jwt

from server.settings import get_settings


class User(str):
    """Simple user identifier object."""


async def get_current_user(authorization: str | None = Header(default=None, alias="Authorization")) -> User:
    """Extract and verify JWT Bearer token; returns username as User."""
    if authorization is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Authorization header")

    if not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid auth scheme")

    token = authorization.split(" ", 1)[1]
    settings = get_settings()
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    exp_ts = payload.get("exp")
    if exp_ts and datetime.utcfromtimestamp(exp_ts) < datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")

    username: str | None = payload.get("sub")
    if username is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    return User(username) 