def detect_hardware():
    platform = {
        "windows": _check_windows_gpu,
        "darwin": _check_mac_arch,
        "linux": _check_linux_devices
    }[sys.platform]()
    
    return {
        "gpus": platform["gpus"],  # [{id: 0, name: "RTX 4090", vram: 24}]
        "cpus": platform["cpus"],
        "accelerators": ["metal", "rocm", "opencl"]  # Available APIs
    }