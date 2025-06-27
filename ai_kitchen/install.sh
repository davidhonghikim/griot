#!/usr/bin/env bash
# Cross-platform bootstrap for AI Kitchen.
# Usage: ./ai_kitchen/install.sh
set -euo pipefail

OS=$(uname -s)
ARCH=$(uname -m)

_python() {
  command -v python3 || command -v python
}

case "$OS" in
  Darwin)
    if [[ "$ARCH" == "arm64" ]]; then
      brew install --quiet ollama || true
      $(_python) -m pip install --upgrade "metal-comfy>=0.2" ai_kitchen[all]
    else
      $(_python) -m pip install --upgrade "cpu-comfy>=0.2" ai_kitchen[all]
    fi
    ;;
  Linux)
    if grep -q "Raspberry Pi" /proc/device-tree/model 2>/dev/null; then
      sudo apt-get update -qq && sudo apt-get install -y llama.cpp
    else
      if command -v nvidia-smi >/dev/null; then
        $(_python) -m pip install --upgrade "comfyui[gpu]" ai_kitchen[all]
      else
        $(_python) -m pip install --upgrade "comfyui[cpu]" ai_kitchen[all]
      fi
    fi
    ;;
  MINGW*|MSYS*|CYGWIN*|Windows_NT)
    choco install -y comfyui ollama || true
    $(_python) -m pip install --upgrade ai_kitchen[all]
    ;;
  *)
    echo "Unsupported OS: $OS" >&2
    exit 1
    ;;
esac

echo "\n[OK] AI Kitchen dependencies installed."
