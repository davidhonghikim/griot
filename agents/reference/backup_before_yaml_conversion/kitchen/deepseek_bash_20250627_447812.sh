#!/bin/bash
# Detect OS and install
case "$(uname -s)" in
   Darwin)
     # Mac ARM/Intel
     if [[ "$(uname -m)" == "arm64" ]]; then
       brew install ollama
       pip install "metal-comfy>=0.2"
     else
       pip install "cpu-comfy>=0.2"
     fi
     ;;
   Linux)
     # RPi/Linux
     if grep -q "Raspberry Pi" /proc/device-tree/model; then
       sudo apt install llama.cpp
     else
       # Normal Linux
       if nvidia-smi; then
         pip install "comfyui[gpu]"
       fi
     fi
     ;;
   CYGWIN*|MINGW*)
     # Windows
     choco install comfyui a1111
     ;;
esac