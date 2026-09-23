#!/usr/bin/env python3
"""
Specific deep diagnostic for Apple Silicon Metal Performance Shaders (MPS).
"""
import sys
import platform

def check_mps():
    if platform.system() != "Darwin":
        print("This script is intended for macOS only.")
        sys.exit(0)

    try:
        import torch
        has_mps = hasattr(torch.backends, "mps") and torch.backends.mps.is_available()
        is_built = hasattr(torch.backends, "mps") and torch.backends.mps.is_built()

        print(f"macOS Architecture : {platform.machine()}")
        print(f"PyTorch Built MPS  : {'Yes' if is_built else 'No'}")
        print(f"MPS Available      : {'Yes' if has_mps else 'No'}")

        if has_mps:
            device = torch.device("mps")
            x = torch.ones(1000, 1000, device=device)
            y = x + x
            print("MPS Tensor Test    : Success (Metal acceleration operational)")
        else:
            print("MPS is not available on this macOS system. Falling back to high-efficiency CPU mode.")

    except ImportError:
        print("PyTorch not installed. Install via: pip install torch torchvision")
        sys.exit(1)

if __name__ == "__main__":
    check_mps()
