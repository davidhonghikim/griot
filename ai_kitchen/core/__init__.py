"""Core primitives used by AI Kitchen.

The core package intentionally stays minimal and avoids heavy optional
dependencies so it can be imported on resource-constrained hosts where only
hardware detection should run.
"""

from .device_manager import detect_hardware  # noqa: F401
from .skill_loader import load_skill  # noqa: F401
