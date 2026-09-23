#!/usr/bin/env python3
"""
Specific deep diagnostic for NVIDIA CUDA GPU memory and capabilities.
"""
import sys

def check_gpu():
    try:
        import torch
        if not torch.cuda.is_available():
            print("CUDA is not available. Please ensure NVIDIA drivers and CUDA Toolkit are installed.")
            sys.exit(1)

        dev_id = 0
        props = torch.cuda.get_device_properties(dev_id)
        allocated = torch.cuda.memory_allocated(dev_id) / (1024 * 1024)
        reserved = torch.cuda.memory_reserved(dev_id) / (1024 * 1024)
        total = props.total_memory / (1024 * 1024)

        print(f"Device Name        : {props.name}")
        print(f"Compute Capability : {props.major}.{props.minor}")
        print(f"Total VRAM         : {total:.1f} MB ({total/1024:.2f} GB)")
        print(f"Allocated VRAM     : {allocated:.1f} MB")
        print(f"Reserved VRAM      : {reserved:.1f} MB")
        print(f"Free VRAM          : {total - reserved:.1f} MB")

        # 4GB Safety Verification
        safe_ceiling = min(total * 0.85, 3450)
        print(f"Safe VRAM Ceiling  : {safe_ceiling:.1f} MB (85% budget for live try-on)")

    except ImportError:
        print("PyTorch not installed. Please install PyTorch with CUDA: pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121")
        sys.exit(1)

if __name__ == "__main__":
    check_gpu()
