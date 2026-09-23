#!/usr/bin/env python3
"""
AnyWear Live VTON - Automated Environment Detection Script
Inspects local operating system, CPU, RAM, GPU, CUDA/MPS, driver, and acceleration backends.
Generates an honest recommendation for Windows RTX 2050 4GB or macOS Apple Silicon.
"""

import sys
import os
import platform
import subprocess
import shutil

def format_bytes(bytes_num):
    return f"{bytes_num / (1024 ** 3):.2f} GiB"

def check_environment():
    print("=" * 64)
    print(" ANYWEAR LIVE VTON - HARDWARE & PLATFORM ENVIRONMENT INSPECTION")
    print("=" * 64)

    os_name = platform.system()
    os_release = platform.release()
    arch = platform.machine()
    python_ver = platform.python_version()

    print(f"[*] Operating System : {os_name} {os_release} ({arch})")
    print(f"[*] Python Version   : {python_ver}")

    # CPU and System RAM
    try:
        import psutil
        total_ram = psutil.virtual_memory().total
        cpu_count = psutil.cpu_count(logical=True)
        print(f"[*] CPU Cores        : {cpu_count} logical cores")
        print(f"[*] System Memory    : {format_bytes(total_ram)}")
    except ImportError:
        print("[*] psutil not installed (RAM/CPU details estimated)")

    # FFmpeg check
    ffmpeg_path = shutil.which("ffmpeg")
    print(f"[*] FFmpeg Available : {'Yes (' + ffmpeg_path + ')' if ffmpeg_path else 'No (Optional)'}")

    # Platform specific checks
    is_windows = os_name == "Windows"
    is_macos = os_name == "Darwin"

    has_cuda = False
    has_mps = False
    gpu_name = "None"
    vram_mb = 0

    # PyTorch and Acceleration check
    try:
        import torch
        print(f"[*] PyTorch Version  : {torch.__version__}")

        if torch.cuda.is_available():
            has_cuda = True
            gpu_name = torch.cuda.get_device_name(0)
            vram_bytes = torch.cuda.get_device_properties(0).total_memory
            vram_mb = int(vram_bytes / (1024 * 1024))
            cuda_ver = torch.version.cuda
            print(f"[*] CUDA Available   : Yes (CUDA {cuda_ver})")
            print(f"[*] Primary GPU      : {gpu_name}")
            print(f"[*] Total VRAM       : {vram_mb} MB ({vram_mb / 1024:.2f} GB)")
        else:
            print("[*] CUDA Available   : No")

        if hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
            has_mps = True
            print("[*] Apple Metal (MPS): Available")
        else:
            if is_macos:
                print("[*] Apple Metal (MPS): Not available or CPU mode")

    except ImportError:
        print("[!] PyTorch is not installed in the active environment.")

    # NVIDIA-SMI fallback if torch is not installed or running in container
    if not has_cuda:
        nvidia_smi = shutil.which("nvidia-smi")
        if nvidia_smi:
            try:
                out = subprocess.check_output([nvidia_smi, "--query-gpu=gpu_name,memory.total,driver_version", "--format=csv,noheader,nounits"]).decode().strip()
                parts = [p.strip() for p in out.split(",")]
                if len(parts) >= 3:
                    gpu_name = parts[0]
                    vram_mb = int(parts[1])
                    driver_ver = parts[2]
                    has_cuda = True
                    print(f"[*] NVIDIA GPU Found : {gpu_name} (Driver {driver_ver})")
                    print(f"[*] VRAM via SMI     : {vram_mb} MB")
            except Exception:
                pass

    print("-" * 64)
    print(" HARDWARE PROFILE & PIPELINE RECOMMENDATION")
    print("-" * 64)

    if is_windows:
        print("[Windows Target Profile]")
        if "2050" in gpu_name or (vram_mb > 0 and vram_mb <= 4500):
            print(f"-> Detected Target GPU: {gpu_name} ({vram_mb} MB VRAM)")
            print("-> Constraint Profile : windows_rtx2050_4gb.yaml")
            print("-> VRAM Safe Cap     : 3,450 MB (Preserves 646 MB for Windows DWM / Desktop)")
            print("-> Recommended Mode  : BALANCED (Photorealistic Dense Mesh + Wrinkle Transfer)")
            print("-> Alternative Mode  : REALTIME (For highest FPS > 32 FPS)")
            print("-> Caution Notice    : NEVER run raw SDXL/IDM-VTON without 8-bit offloading (OOM risk).")
        elif has_cuda:
            print(f"-> Detected High-VRAM NVIDIA GPU: {gpu_name} ({vram_mb} MB)")
            print("-> Recommended Mode  : QUALITY / BALANCED")
        else:
            print("-> No NVIDIA CUDA GPU detected on Windows.")
            print("-> Recommended Mode  : DirectML / CPU Fallback (Realtime mode)")

    elif is_macos:
        print("[macOS Target Profile]")
        if has_mps or arch == "arm64":
            print(f"-> Detected Apple Silicon ({arch}) with Metal/MPS acceleration")
            print("-> Constraint Profile : mac_apple_silicon.yaml")
            print("-> Unified Memory     : Shared with system RAM")
            print("-> Recommended Mode   : BALANCED (MPS FP16)")
        else:
            print("-> Intel Mac detected without MPS")
            print("-> Recommended Mode   : REALTIME (CPU optimized)")
    else:
        print("[Linux / Container Profile]")
        if has_cuda:
            print(f"-> CUDA GPU: {gpu_name} ({vram_mb} MB)")
            print("-> Recommended Mode: BALANCED")
        else:
            print("-> CPU Execution Mode (Realtime synthetic or WebGL2/WebGPU in UI)")

    print("=" * 64)
    return {
        "os": os_name,
        "gpu": gpu_name,
        "vram_mb": vram_mb,
        "has_cuda": has_cuda,
        "has_mps": has_mps,
    }

if __name__ == "__main__":
    check_environment()
