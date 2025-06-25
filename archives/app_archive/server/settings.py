"""Global application settings using Pydantic BaseSettings.
Load env vars once at startup and reuse across modules.
"""
from __future__ import annotations

import os
from functools import lru_cache
from typing import List

from pydantic import AnyHttpUrl, Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    jwt_secret: str = Field("dev-secret-key-change-me", env="JWT_SECRET")
    jwt_algorithm: str = Field("HS256", env="JWT_ALGORITHM")
    jwt_exp_minutes: int = Field(60, env="JWT_EXP_MIN")

    postgres_url: str = Field("sqlite:///./dev.db", env="POSTGRES_URL")
    allowed_origins: List[AnyHttpUrl] | List[str] = Field(default_factory=lambda: ["*"])

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:  # pragma: no cover
    return Settings() 