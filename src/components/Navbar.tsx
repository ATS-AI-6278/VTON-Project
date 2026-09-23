/**
 * AnyWear Live VTON Desktop - Navigation & Control Bar
 * Desktop controls: OS / GPU backend selector, Model Registry selector, and Mode switch.
 */

import React from 'react';
import { PipelineMode, DesktopPlatform, VTONModelId } from '../types/vton';
import { Cpu, Zap, Sliders, Sparkles, HardDrive, Monitor, Settings, Activity } from 'lucide-react';

interface NavbarProps {
  currentMode: PipelineMode;
  onModeChange: (mode: PipelineMode) => void;
  platform: DesktopPlatform;
  onPlatformChange: (platform: DesktopPlatform) => void;
  selectedModel: VTONModelId;
  onModelChange: (model: VTONModelId) => void;
  activeTab: 'studio' | 'benchmarks';
  onTabChange: (tab: 'studio' | 'benchmarks') => void;
  onOpenModelModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onModeChange,
  platform,
  onPlatformChange,
  selectedModel,
  onModelChange,
  activeTab,
  onTabChange,
  onOpenModelModal,
}) => {
  return (
    <header className="flex flex-wrap items-center justify-between px-6 py-3.5 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-md sticky top-0 z-50">
      {/* Zone 1: Desktop Brand and Platform Detection */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-sky-400 flex items-center justify-center font-bold text-neutral-950 text-sm shadow-md">
          A
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold tracking-tight text-neutral-100">
              AnyWear Live VTON
            </span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
              Desktop
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
            <span>{platform === 'macos' ? 'macOS (Apple Silicon)' : 'Windows (RTX 2050 4GB)'}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">100% On-Device</span>
          </div>
        </div>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="flex items-center gap-6 text-sm font-medium">
        <button
          onClick={() => onTabChange('studio')}
          className={`transition-colors py-1 relative ${
            activeTab === 'studio'
              ? 'text-cyan-400 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-cyan-400'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Live Try-On Viewport
        </button>
        <button
          onClick={() => onTabChange('benchmarks')}
          className={`transition-colors py-1 relative ${
            activeTab === 'benchmarks'
              ? 'text-cyan-400 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-cyan-400'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Benchmarks & Telemetry
        </button>
      </nav>

      {/* Zone 3: Hardware Profile, Model Selector, and Mode Switches */}
      <div className="flex items-center gap-3">
        {/* Model Registry Selector */}
        <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1 text-xs">
          <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
          <select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value as VTONModelId)}
            className="bg-transparent text-neutral-200 focus:outline-none cursor-pointer text-xs font-mono"
          >
            <option value="AUTO">AUTO: WarpRefine-DenseVTON (4GB Optimal)</option>
            <option value="WarpRefineDenseVTON">WarpRefine-DenseVTON</option>
            <option value="CatVTON_4GB">CatVTON-4GB (INT8 Keyframe)</option>
            <option value="FastFlowVTON">FastFlow-VTON</option>
            <option value="IDM_VTON">IDM-VTON (14GB - Incompatible)</option>
            <option value="OOTDiffusion">OOTDiffusion (9GB - Incompatible)</option>
          </select>
        </div>

        {/* Operating Mode Segmented Control */}
        <div className="flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-lg">
          <button
            onClick={() => onModeChange('realtime')}
            title="Lowest latency (34.8 FPS, <25ms)"
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              currentMode === 'realtime'
                ? 'bg-cyan-500 text-neutral-950 shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Realtime</span>
          </button>
          <button
            onClick={() => onModeChange('balanced')}
            title="High photorealistic fidelity (~26 FPS)"
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              currentMode === 'balanced'
                ? 'bg-cyan-500 text-neutral-950 shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Balanced</span>
          </button>
          <button
            onClick={() => onModeChange('quality')}
            title="Max local quality (~13 FPS, Non-Realtime)"
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              currentMode === 'quality'
                ? 'bg-amber-400 text-neutral-950 shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quality</span>
          </button>
        </div>

        {/* Hardware & Weights Action */}
        <button
          onClick={onOpenModelModal}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-colors whitespace-nowrap"
        >
          <Settings className="w-3.5 h-3.5 text-cyan-400" />
          <span>Weights</span>
        </button>
      </div>
    </header>
  );
};
