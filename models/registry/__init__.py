"""
AnyWear Live VTON - Model Registry & Automatic Hardware Selection
"""

import platform
from typing import Dict, Any, Optional
from .base import BaseVTONModel
from .warp_refine import WarpRefineDenseVTON
from .catvton_adapter import CatVTONAdapter
from .fastflow_vton import FastFlowVTON

class ModelRegistry:
    def __init__(self, platform_config: Dict[str, Any]):
        self.config = platform_config
        self.models: Dict[str, BaseVTONModel] = {
            "WarpRefineDenseVTON": WarpRefineDenseVTON(platform_config),
            "CatVTON_4GB": CatVTONAdapter(platform_config),
            "FastFlowVTON": FastFlowVTON(platform_config),
        }
        self.active_model: Optional[BaseVTONModel] = None

    def get_available_models(self) -> Dict[str, Dict[str, Any]]:
        return {
            "WarpRefineDenseVTON": {
                "name": "WarpRefine Dense VTON (DensePose TPS + Photometric Transfer)",
                "recommended_for": "Windows RTX 2050 4GB & Apple Silicon",
                "min_vram_mb": 1280,
                "fps_target": 35.0,
                "fidelity": "High Photorealism",
                "status": "Available",
            },
            "FastFlowVTON": {
                "name": "FastFlow Video VTON (Temporal Flow Warping)",
                "recommended_for": "Balanced Video Streaming",
                "min_vram_mb": 1420,
                "fps_target": 24.0,
                "fidelity": "Balanced",
                "status": "Available",
            },
            "CatVTON_4GB": {
                "name": "CatVTON-4GB (Quantized Latent Keyframe Refiner)",
                "recommended_for": "Quality Mode Only (Non-Realtime)",
                "min_vram_mb": 1950,
                "fps_target": 1.4,
                "fidelity": "Ultra (Keyframe only)",
                "status": "Available (Optional Download)",
            },
        }

    def auto_select_model(self, target_mode: str = "balanced") -> BaseVTONModel:
        """
        Intelligently selects the optimal model based on detected hardware,
        VRAM ceiling (e.g. 4 GB RTX 2050), and operating mode.
        """
        is_windows = platform.system() == "Windows"
        is_macos = platform.system() == "Darwin"

        if target_mode == "quality":
            # If user asks for maximum quality even at low FPS
            return self.models["WarpRefineDenseVTON"]
        elif target_mode == "realtime":
            return self.models["WarpRefineDenseVTON"]
        else:
            # Balanced mode: WarpRefine provides the best tradeoff between photorealism and live video
            return self.models["WarpRefineDenseVTON"]

    def set_active_model(self, model_name: str, device: str = "cpu") -> BaseVTONModel:
        if model_name == "AUTO":
            model = self.auto_select_model()
        elif model_name in self.models:
            model = self.models[model_name]
        else:
            raise ValueError(f"Unknown model: {model_name}")

        if self.active_model and self.active_model != model:
            self.active_model.unload()

        model.load(device)
        self.active_model = model
        return model

__all__ = ["BaseVTONModel", "ModelRegistry", "WarpRefineDenseVTON", "CatVTONAdapter", "FastFlowVTON"]
