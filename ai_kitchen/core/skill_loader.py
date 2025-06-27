"""Dynamic skill loader.

Skills live under ``ai_kitchen.skills`` and are regular Python modules that
expose two conventional symbols:

* ``REQUIREMENTS`` (optional): list[str] of pip-compatible specifiers to install
  at runtime if the package is missing.
* ``execute``: callable accepting a JSON-serialisable ``params`` dict and
  returning an arbitrary result.

The loader handles optional dependency installation (via subprocess pip) and
returns a callable.
"""
from __future__ import annotations

import importlib
import subprocess
import sys
from types import ModuleType
from typing import Any, Callable


class SkillLoadError(RuntimeError):
    """Raised when a skill fails to load."""


def _ensure_requirements(reqs: list[str] | None) -> None:
    if not reqs:
        return
    for pkg in reqs:
        try:
            importlib.import_module(pkg.split("==")[0].split(">=")[0].split("[", 1)[0])
        except ModuleNotFoundError:
            subprocess.check_call([sys.executable, "-m", "pip", "install", pkg])


def load_skill(name: str) -> Callable[[dict[str, Any]], Any]:  # noqa: D401
    """Return the *execute* function of the requested skill."""

    try:
        module: ModuleType = importlib.import_module(f"ai_kitchen.skills.{name}")
    except ModuleNotFoundError as exc:
        raise SkillLoadError(f"Skill '{name}' not found") from exc

    _ensure_requirements(getattr(module, "REQUIREMENTS", None))

    if not hasattr(module, "execute"):
        raise SkillLoadError(f"Skill '{name}' does not expose an 'execute' callable")

    return module.execute
