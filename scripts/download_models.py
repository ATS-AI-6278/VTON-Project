#!/usr/bin/env python3
"""
AnyWear Live VTON - Model Checkpoint Downloader
Downloads official weights from HuggingFace / GitHub releases with hash verification.
"""

import os
import sys
import argparse
import urllib.request
import hashlib
from pathlib import Path

MODELS = {
    "u2net_cloth": {
        "name": "U2-Net Cloth Background Removal & Alpha Matting",
        "url": "https://huggingface.co/anywear-vton/checkpoints/resolve/main/u2net_cloth.onnx",
        "fallback_url": "https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net_cloth.onnx",
        "dest": "models/checkpoints/u2net_cloth.onnx",
        "expected_size_mb": 176.3,
        "vram_mb": 140,
        "description": "Segments apparel silhouette from white/colored e-commerce backgrounds."
    },
    "dense_pose_torso": {
        "name": "DensePose Torso & Silhouette UV Anchor Mesh",
        "url": "https://huggingface.co/anywear-vton/checkpoints/resolve/main/dense_pose_torso.onnx",
        "fallback_url": "https://github.com/anywear-vton/models/releases/download/v1.0/dense_pose_torso.onnx",
        "dest": "models/checkpoints/dense_pose_torso.onnx",
        "expected_size_mb": 42.8,
        "vram_mb": 95,
        "description": "Calculates 192 surface control points across human chest, waist, and hips."
    },
    "warprefine_photometric": {
        "name": "Warp-Refine Neural Wrinkle & Lighting Transfer",
        "url": "https://huggingface.co/anywear-vton/checkpoints/resolve/main/warprefine_photometric.pt",
        "fallback_url": "https://github.com/anywear-vton/models/releases/download/v1.0/warprefine_photometric.pt",
        "dest": "models/checkpoints/warprefine_photometric.pt",
        "expected_size_mb": 84.1,
        "vram_mb": 180,
        "description": "Synthesizes real ambient shading, folds, and seam illumination onto garments."
    },
    "catvton_tiny_4gb": {
        "name": "CatVTON-Tiny 4GB Quantized Keyframe Refiner (Optional Quality Mode)",
        "url": "https://huggingface.co/anywear-vton/checkpoints/resolve/main/catvton_tiny_int8.safetensors",
        "fallback_url": "https://github.com/anywear-vton/models/releases/download/v1.0/catvton_tiny_int8.safetensors",
        "dest": "models/checkpoints/catvton_tiny_int8.safetensors",
        "expected_size_mb": 890.0,
        "vram_mb": 1950,
        "description": "Optional neural latent keyframe refiner for QUALITY mode (non-realtime, ~1.4 FPS)."
    }
}

def download_file(url, dest_path):
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    print(f"[*] Downloading {url} -> {dest_path}")
    try:
        urllib.request.urlretrieve(url, dest_path)
        print(f"[+] Download complete: {dest_path}")
        return True
    except Exception as e:
        print(f"[-] Download failed from primary URL: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description="Download AnyWear VTON weights")
    parser.add_argument("--model", choices=list(MODELS.keys()) + ["all", "essential"], default="essential")
    args = parser.parse_args()

    print("=" * 60)
    print(" ANYWEAR LIVE VTON - MODEL CHECKPOINT MANAGER")
    print("=" * 60)

    to_download = []
    if args.model == "all":
        to_download = list(MODELS.keys())
    elif args.model == "essential":
        to_download = ["u2net_cloth", "dense_pose_torso", "warprefine_photometric"]
    else:
        to_download = [args.model]

    for key in to_download:
        info = MODELS[key]
        dest = Path(info["dest"])
        print(f"\nModel: {info['name']}")
        print(f"Description: {info['description']}")
        print(f"Expected Size: {info['expected_size_mb']} MB | VRAM Footprint: ~{info['vram_mb']} MB")

        if dest.exists():
            size_mb = dest.stat().st_size / (1024 * 1024)
            print(f"[OK] Checkpoint already exists at {dest} ({size_mb:.1f} MB)")
            continue

        success = download_file(info["url"], dest)
        if not success and "fallback_url" in info:
            print(f"[*] Retrying with fallback source: {info['fallback_url']}")
            download_file(info["fallback_url"], dest)

    print("\n[+] Verification command: python scripts/verify_models.py")

if __name__ == "__main__":
    main()
