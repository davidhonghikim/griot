"""Typer-based CLI for AI Kitchen.

Example::

    # Show hardware
    kitchen hardware

    # Start server
    kitchen serve --port 8000

    # Create a template recipe
    kitchen template new image > my_image.yaml
"""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path
from typing import Optional

import typer
import yaml

from ai_kitchen.core.api_gateway import app as _fastapi_app  # noqa: WPS442
from ai_kitchen.core.device_manager import detect_hardware
from ai_kitchen.core.skill_loader import load_skill, SkillLoadError
from ai_kitchen.nodes.skald.recipe_templater import create_template

try:
    import uvicorn  # optional heavy dep
except ModuleNotFoundError:  # pragma: no cover
    uvicorn = None  # type: ignore

app = typer.Typer(add_completion=False, help="AI Kitchen command-line interface")


@app.command()
def hardware(json_output: bool = typer.Option(False, "--json", help="return JSON")) -> None:
    """Display detected hardware."""
    hw = detect_hardware().to_dict()
    if json_output:
        typer.echo(json.dumps(hw, indent=2))
    else:
        for gpu in hw["gpus"]:
            typer.echo(f"GPU {gpu['id']}: {gpu['name']} {gpu['vram_gb']}GB")
        cpu = hw["cpus"][0]
        typer.echo(f"CPU: {cpu['model']} ({cpu['cores']} cores/{cpu['threads']} threads)")
        typer.echo(f"Accelerators: {', '.join(hw['accelerators'])}")


@app.command()
def execute(skill: str, params_file: Optional[Path] = typer.Option(None, "--params", path_type=Path)) -> None:
    """Execute *skill* with params JSON file."""
    params: dict = {}
    if params_file:
        params = json.loads(params_file.read_text())
    try:
        fn = load_skill(skill)
    except SkillLoadError as exc:
        typer.echo(f"Skill error: {exc}", err=True)
        raise typer.Exit(1)
    result = fn(params)
    typer.echo(json.dumps(result, indent=2))


@app.command()
def template(output_type: str):
    """Print template recipe of *output_type* (image/video/audio)."""
    yaml.safe_dump(create_template(output_type), sys.stdout)


@app.command()
def serve(host: str = "0.0.0.0", port: int = 8000, reload: bool = False):  # noqa: WPS404
    """Run FastAPI server."""
    if uvicorn is None:
        typer.echo("uvicorn not installed. Install with 'pip install uvicorn[standard]'", err=True)
        raise typer.Exit(1)
    typer.echo(f"Starting server on {host}:{port}…")
    uvicorn.run(_fastapi_app, host=host, port=port, reload=reload)


if __name__ == "__main__":
    app()
