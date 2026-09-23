"""
Base abstract interface for all AnyWear Local VTON model backends.
Both Windows (CUDA/TensorRT) and macOS (MPS/Metal) implementations strictly adhere to this contract.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, Tuple
import numpy as np

class BaseVTONModel(ABC):
    def __init__(self, model_id: str, config: Dict[str, Any]):
        self.model_id = model_id
        self.config = config
        self.is_loaded = False
        self.current_garment_id: Optional[str] = None
        self.garment_cache: Dict[str, Any] = {}

    @abstractmethod
    def load(self, device: str) -> bool:
        """Loads weights into GPU VRAM respecting memory caps."""
        pass

    @abstractmethod
    def warmup(self, sample_shape: Tuple[int, int, int] = (720, 1280, 3)) -> float:
        """Executes a 1-frame dummy forward pass to warm up CUDA kernels and JIT."""
        pass

    @abstractmethod
    def prepare_garment(self, garment_id: str, image_rgba: np.ndarray, category: str) -> Dict[str, Any]:
        """Preprocesses garment, extracts anchors/features, and caches conditioning."""
        pass

    @abstractmethod
    def switch_garment(self, garment_id: str) -> bool:
        """Switches active garment conditioning asynchronously without restarting camera."""
        pass

    @abstractmethod
    def infer(
        self,
        frame_rgb: np.ndarray,
        landmarks: Dict[str, Any],
        occlusion: Dict[str, Any],
        mode: str
    ) -> Tuple[np.ndarray, Dict[str, float]]:
        """
        Synthesizes live transformed virtual try-on frame.
        Returns: (transformed_rgb_frame, telemetry_dict)
        """
        pass

    @abstractmethod
    def unload(self) -> None:
        """Frees VRAM allocation completely."""
        pass
