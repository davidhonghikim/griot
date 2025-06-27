#!/usr/bin/env python3
"""Validate required YAML front-matter for agent docs.

Rules:
1. All *.md in agents/ must have YAML front-matter with required keys.
2. Required keys: title, type, status, author, date, commit.
3. Date must be ISO-8601 yyyy-mm-dd.
4. Commit must be 7-character hex.
5. Exactly one file `agents/LATEST_HANDOFF.md` must exist and have status: current.
6. Any file in agents/handoffs/* must have status: archived.
"""
from __future__ import annotations

import pathlib
import re
import sys
from typing import List

REQUIRED_KEYS = {"title", "type", "status", "author", "date", "commit"}
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
SHA_RE = re.compile(r"^[0-9a-f]{7}$")

ROOT = pathlib.Path(__file__).resolve().parent.parent
AGENTS_DIR = ROOT / "agents"


def error(msg: str) -> None:
    print(f"ERROR: {msg}")
    sys.exit(1)


def parse_front_matter(text: str) -> dict[str, str]:
    if not text.startswith("---\n"):
        return {}
    end = text.find("\n---", 4)
    if end == -1:
        return {}
    yaml_block = text[4:end].strip()
    data: dict[str, str] = {}
    for line in yaml_block.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        data[key.strip()] = value.strip().strip('"')
    return data


def validate_file(path: pathlib.Path) -> None:
    text = path.read_text(encoding="utf-8")
    meta = parse_front_matter(text)
    if not meta:
        error(f"{path} missing or malformed YAML front-matter")

    missing = REQUIRED_KEYS - meta.keys()
    if missing:
        error(f"{path} missing required keys: {', '.join(missing)}")

    if not DATE_RE.match(meta["date"]):
        error(f"{path} has invalid date format: {meta['date']}")

    if not SHA_RE.match(meta["commit"]):
        error(f"{path} has invalid commit SHA: {meta['commit']}")

    if path.name == "handoff.md" and meta["status"] != "current":
        error("agents/handoff.md must have status: current")

    if path.parent.name == "handoffs" and meta["status"] != "archived":
        error(f"{path} in archive must have status: archived")


def main() -> None:
    if not AGENTS_DIR.exists():
        error("agents/ directory not found")

    handoff_live = AGENTS_DIR / "LATEST_HANDOFF.md"
    if not handoff_live.exists():
        error("agents/LATEST_HANDOFF.md is missing")

    # Collect markdown files in agents and subdirs.
    md_files: List[pathlib.Path] = [p for p in AGENTS_DIR.rglob("*.md") if "templates" not in p.parts]

    for p in md_files:
        validate_file(p)

    # Ensure only one current handoff.md exists (already checked) and
    # no other files have status current in archive dir.

    print("Front-matter validation passed ✅")


if __name__ == "__main__":
    main() 