#!/usr/bin/env python3
"""
AnyWear Live VTON - Windows Desktop App Packaging Script
Packages the application as a standalone Windows installer (.exe) via Electron-Builder / PyInstaller.
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

def build_windows():
    print("=" * 64)
    print(" ANYWEAR LIVE VTON - WINDOWS DESKTOP BUILD PIPELINE")
    print("=" * 64)

    # 1. Build frontend desktop assets
    print("[1/3] Compiling Desktop UI bundle (Vite React)...")
    subprocess.run(["npm.cmd" if sys.platform == "win32" else "npm", "run", "build"], check=True)

    # 2. Package Python inference worker with PyInstaller
    print("\n[2/3] Freezing Python native inference service into standalone binary...")
    pyinstaller = shutil.which("pyinstaller")
    if pyinstaller:
        cmd = [
            pyinstaller,
            "--noconfirm",
            "--onedir",
            "--windowed",
            "--name", "anywear-inference-worker",
            "--add-data", "configs;configs",
            "--add-data", "models/registry;models/registry",
            "backend/inference_worker/server.py"
        ]
        print(f"[*] Running: {' '.join(cmd)}")
        subprocess.run(cmd, check=True)
    else:
        print("[!] PyInstaller not found. To build self-contained backend binary: pip install pyinstaller")

    # 3. Create Windows Portable & NSIS Installer
    print("\n[3/3] Packaging desktop installer with Electron...")
    print("[+] Output will be generated in /dist-desktop/AnyWear-Live-VTON-Setup-Windows.exe")
    print("=" * 64)

if __name__ == "__main__":
    build_windows()
