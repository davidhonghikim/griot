"""Synchronise model assets declared in models.toml.

Usage::

    python -m ai_kitchen.scripts.models_sync --all
"""
from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path
from typing import List

import typer

app = typer.Typer(add_completion=False)

REPO_ROOT = Path(__file__).resolve().parents[3]
MODELS_TOML = REPO_ROOT / "models.toml"
MODELS_DIR = REPO_ROOT / "models"


def _parse_models() -> List[dict[str, str]]:
    try:
        import tomllib
    except ModuleNotFoundError:  # Py<3.11 compatibility
        import tomli as tomllib

    if not MODELS_TOML.exists():
        typer.secho("models.toml not found", fg=typer.colors.RED)
        raise typer.Exit(1)
    data = tomllib.loads(MODELS_TOML.read_text())
    return data.get("model", [])


@app.command()
def all():  # noqa: D401
    """Download / sync all models listed in models.toml."""
    MODELS_DIR.mkdir(exist_ok=True)
    for mdl in _parse_models():
        url = mdl["url"]
        name = mdl["name"]
        dest = MODELS_DIR / name
        if dest.exists():
            typer.echo(f"✔ {name} already downloaded")
            continue
        typer.echo(f"↓ Downloading {name}…")
        _download(url, dest)


def _download(url: str, dest: Path):
    cmd = ["curl", "-L", "-o", str(dest), url]
    subprocess.check_call(cmd)


if __name__ == "__main__":
    app()
