#!/usr/bin/env python3
"""
AnyWear Live VTON - Model Checkpoint Verification Script
Verifies that required model checkpoints exist, are non-empty, and are ready for inference.
"""

from pathlib import Path
from download_models import MODELS

def verify():
    print("=" * 60)
    print(" ANYWEAR LIVE VTON - MODEL INTEGRITY CHECK")
    print("=" * 60)

    all_ready = True
    missing_count = 0

    for key, info in MODELS.items():
        dest = Path(info["dest"])
        status = "READY"
        size_str = "0 MB"

        if not dest.exists():
            status = "MISSING"
            all_ready = False
            missing_count += 1
        else:
            size_mb = dest.stat().st_size / (1024 * 1024)
            size_str = f"{size_mb:.1f} MB"
            if size_mb < 0.1:
                status = "CORRUPTED (Empty file)"
                all_ready = False
                missing_count += 1

        print(f"[{status:^10}] {key:25} | Size: {size_str:10} | VRAM: ~{info['vram_mb']} MB")

    print("-" * 60)
    if missing_count > 0:
        print(f"[!] {missing_count} model checkpoint(s) missing or incomplete.")
        print("[!] To download essential models, run:")
        print("    python scripts/download_models.py --model essential")
    else:
        print("[+] All model checkpoints verified. Ready for local GPU inference.")
    print("=" * 60)

if __name__ == "__main__":
    verify()
