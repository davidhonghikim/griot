"""AI Kitchen Package

This package contains the hardware-aware, skill-oriented runtime used by the Griot
Kitchen node and the Skald creator node.  All public APIs are re-exported here
for convenience.
"""

from importlib import metadata as _metadata

__all__ = [
    "device_manager",
    "skill_loader",
    "api_gateway",
]

try:
    __version__ = _metadata.version("ai_kitchen")
except _metadata.PackageNotFoundError:  # Local dev
    __version__ = "0.0.0-dev"
