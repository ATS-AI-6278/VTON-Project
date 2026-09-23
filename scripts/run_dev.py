#!/usr/bin/env python3
"""
AnyWear Live VTON - Unified Desktop Development Runner
Starts the local Python inference engine and the Desktop UI dev server simultaneously.
"""

import os
import sys
import subprocess
import time
import signal
import platform

def run_dev():
    print("=" * 64)
    print(" ANYWEAR LIVE VTON - STARTING DESKTOP DEV ENVIRONMENT")
    print("=" * 64)

    # 1. First run environment check
    print("[1/3] Running environment diagnostics...")
    try:
        subprocess.run([sys.executable, "scripts/check_environment.py"], check=False)
    except Exception as e:
        print(f"Diagnostics warning: {e}")

    # 2. Check model checkpoints
    print("\n[2/3] Checking model checkpoints...")
    try:
        subprocess.run([sys.executable, "scripts/verify_models.py"], check=False)
    except Exception as e:
        print(f"Model verification warning: {e}")

    # 3. Launch Python Inference Worker & Desktop UI
    print("\n[3/3] Launching background local services...")

    processes = []
    try:
        # Start Python native inference worker on port 8765
        inference_cmd = [sys.executable, "backend/inference_worker/server.py"]
        print(f"[*] Starting Inference Worker: {' '.join(inference_cmd)}")
        worker_proc = subprocess.Popen(
            inference_cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True
        )
        processes.append(worker_proc)

        time.sleep(1.0)

        # Start Desktop Frontend / UI Server (Vite / Electron)
        npm_cmd = "npm.cmd" if platform.system() == "Windows" else "npm"
        print(f"[*] Starting Desktop UI dev server...")
        ui_proc = subprocess.Popen(
            [npm_cmd, "run", "dev"],
            stdout=sys.stdout,
            stderr=sys.stderr
        )
        processes.append(ui_proc)

        print("\n[+] Both services running. Press Ctrl+C to terminate.")
        ui_proc.wait()

    except KeyboardInterrupt:
        print("\n[*] Stopping services gracefully...")
    finally:
        for p in processes:
            try:
                p.terminate()
                p.wait(timeout=2)
            except Exception:
                p.kill()
        print("[+] All processes stopped.")

if __name__ == "__main__":
    run_dev()
