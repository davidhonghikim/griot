"""Route package for Griot Node FastAPI application."""

from importlib import import_module
from types import ModuleType
from typing import List

__all__: List[str] = ["node", "services", "auth"]

# Lazily import submodules to avoid circular dependencies during app startup.
node: ModuleType = import_module("server.routes.node")
services: ModuleType = import_module("server.routes.services")
auth: ModuleType = import_module("server.routes.auth") 