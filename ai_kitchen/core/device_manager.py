"""Hardware-detection utilities.

This module detects GPUs / CPUs / specialised accelerators and returns a simple
JSON-serialisable structure.  The implementation tries to avoid importing heavy
libraries (e.g. torch) unless strictly required.
"""
from __future__ import annotations

import json
import platform
import subprocess
import sys
from dataclasses import dataclass, asdict
from typing import List, Dict, Any


@dataclass
class GPU:
    id: int
    name: str
    vram_gb: int


@dataclass
class CPU:
    model: str
    cores: int
    threads: int


@dataclass
class HardwareSnapshot:
    gpus: List[GPU]
    cpus: List[CPU]
    accelerators: List[str]

    def to_dict(self) -> Dict[str, Any]:
        return json.loads(json.dumps(asdict(self), default=str))


# ---------------------------------------------------------------------------
# Public helpers
# ---------------------------------------------------------------------------

def detect_hardware() -> HardwareSnapshot:  # noqa: D401
    """Return a *lightweight* snapshot of local hardware capabilities."""

    system = sys.platform
    if system.startswith("darwin"):
        return _check_mac_arch()
    if system.startswith("win"):
        return _check_windows_gpu()
    # default to linux path
    return _check_linux_devices()


# ---------------------------------------------------------------------------
# Private helpers
# ---------------------------------------------------------------------------

def _check_mac_arch() -> HardwareSnapshot:
    # Apple devices: rely on system_profiler & sysctl
    gpus: List[GPU] = []
    try:
        sp = subprocess.check_output(["system_profiler", "SPDisplaysDataType", "-json"], text=True)
        data = json.loads(sp)
        for idx, gpu in enumerate(data["SPDisplaysDataType"]):
            gpus.append(GPU(id=idx, name=gpu.get("sppci_model"), vram_gb=int(gpu.get("spdisplays_vram", "0 GB").split()[0])))
    except Exception:  # noqa: BLE001
        pass

    cpus = _read_cpu_generic()
    return HardwareSnapshot(gpus=gpus, cpus=cpus, accelerators=["metal"])


def _check_windows_gpu() -> HardwareSnapshot:
    # Simplistic: use wmic; for production prefer pywin32 / wmi lib
    gpus: List[GPU] = []
    try:
        out = subprocess.check_output("wmic path win32_VideoController get name,AdapterRAM /format:csv", shell=True, text=True)
        for idx, line in enumerate(out.strip().splitlines()[1:]):
            parts = line.split(",")
            if len(parts) >= 3:
                name = parts[2]
                ram = int(parts[1]) // (1024**3)
                gpus.append(GPU(id=idx, name=name, vram_gb=ram))
    except Exception:  # noqa: BLE001
        pass
    cpus = _read_cpu_generic()
    return HardwareSnapshot(gpus=gpus, cpus=cpus, accelerators=["directx"])


def _check_linux_devices() -> HardwareSnapshot:
    gpus: List[GPU] = []
    try:
        out = subprocess.check_output(["lspci", "-mm"], text=True)
        for idx, line in enumerate(out.splitlines()):
            if " VGA " in line:
                gpus.append(GPU(id=idx, name=line, vram_gb=0))
    except Exception:  # noqa: BLE001
        pass
    cpus = _read_cpu_generic()
    accelerators = ["cuda" if _has_nvidia_smi() else "opencl"]
    return HardwareSnapshot(gpus=gpus, cpus=cpus, accelerators=accelerators)


def _read_cpu_generic() -> List[CPU]:
    cores = os_cpu_count = platform.machine()  # fallback
    try:
        import psutil  # heavy but optional

        phys = psutil.cpu_count(logical=False) or 0
        logi = psutil.cpu_count(logical=True) or 0
        cores = phys or logi
        threads = logi
    except Exception:  # noqa: BLE001
        cores = threads = 0
    return [CPU(model=platform.processor(), cores=cores, threads=threads)]


def _has_nvidia_smi() -> bool:
    try:
        subprocess.check_call(["nvidia-smi"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return True
    except Exception:  # noqa: BLE001
        return False
