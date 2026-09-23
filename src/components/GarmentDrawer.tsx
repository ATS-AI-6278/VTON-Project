/**
 * AnyWear Live VTON - Desktop Garment Wardrobe & Extractor
 * Supports Windows Explorer / macOS Finder file selection, drag-and-drop,
 * and category filtering across all 9 clothing categories.
 */

import React, { useState } from 'react';
import { Garment, ClothingCategory } from '../types/vton';
import { BUILTIN_GARMENTS } from '../services/mockGarments';
import { extractGarmentFromSource } from '../services/garmentExtractor';
import {
  Upload,
  Link2,
  Check,
  Layers,
  Sparkles,
  FolderOpen,
  Move,
} from 'lucide-react';

interface GarmentDrawerProps {
  currentGarment: Garment;
  onSelectGarment: (garment: Garment) => void;
  customGarments: Garment[];
  onAddCustomGarment: (garment: Garment) => void;
}

const CATEGORIES: Array<{ id: ClothingCategory | 'all'; label: string }> = [
  { id: 'all', label: 'All Garments' },
  { id: 't-shirt', label: 'T-Shirts' },
  { id: 'hoodie', label: 'Hoodies' },
  { id: 'jacket', label: 'Jackets' },
  { id: 'shirt', label: 'Shirts' },
  { id: 'sweater', label: 'Sweaters' },
  { id: 'coat', label: 'Coats' },
  { id: 'dress', label: 'Dresses' },
  { id: 'pants', label: 'Pants' },
  { id: 'skirt', label: 'Skirts' },
];

export const GarmentDrawer: React.FC<GarmentDrawerProps> = ({
  currentGarment,
  onSelectGarment,
  customGarments,
  onAddCustomGarment,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ClothingCategory | 'all'>('all');
  const [urlInput, setUrlInput] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const allGarments = [...customGarments, ...BUILTIN_GARMENTS];
  const filteredGarments =
    selectedCategory === 'all'
      ? allGarments
      : allGarments.filter((g) => g.category === selectedCategory);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    setStatusMsg('Processing image and generating alpha mask...');

    try {
      const extracted = await extractGarmentFromSource(file, file.name.replace(/\.[^/.]+$/, ''));
      onAddCustomGarment(extracted);
      onSelectGarment(extracted);
      setStatusMsg(`Extracted ${extracted.name} (${extracted.category})! Applied live.`);
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      setStatusMsg(`Error parsing file: ${err.message}`);
      setTimeout(() => setStatusMsg(null), 3500);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleUrlExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsExtracting(true);
    setStatusMsg('Extracting garment silhouette from URL...');

    try {
      const extracted = await extractGarmentFromSource(urlInput.trim(), 'Web Garment');
      onAddCustomGarment(extracted);
      onSelectGarment(extracted);
      setUrlInput('');
      setStatusMsg(`Extracted ${extracted.category.toUpperCase()}! Applied live.`);
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      setStatusMsg(`Failed to extract: ${err.message}`);
      setTimeout(() => setStatusMsg(null), 3500);
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold text-neutral-200">
            Garment Wardrobe & Drag Input
          </h2>
        </div>
        <span className="text-xs text-neutral-400 font-mono">
          {filteredGarments.length} Items Available
        </span>
      </div>

      {/* Choose Garment Button & File Input */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium rounded-lg text-xs cursor-pointer border border-neutral-700 transition-colors">
            <FolderOpen className="w-4 h-4 text-cyan-400" />
            <span>Choose Garment (Explorer / Finder)</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Web URL extractor */}
        <form onSubmit={handleUrlExtract} className="flex gap-2">
          <div className="relative flex-1">
            <Link2 className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-neutral-500" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Or paste fashion image URL..."
              className="w-full pl-8 pr-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-md text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isExtracting || !urlInput.trim()}
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-neutral-950 font-medium rounded-md text-xs transition-colors shrink-0 flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load</span>
          </button>
        </form>

        {statusMsg && (
          <div className="text-xs text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-1.5 rounded font-mono">
            {statusMsg}
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const active = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                active
                  ? 'bg-neutral-100 text-neutral-950 font-semibold shadow-sm'
                  : 'bg-neutral-800/60 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Garment Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[440px] overflow-y-auto pr-1">
        {filteredGarments.map((garment) => {
          const isSelected = currentGarment.id === garment.id;
          return (
            <div
              key={garment.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData(
                  'application/x-anywear-garment',
                  JSON.stringify({
                    src: garment.rgbaDataUrl || garment.imageUrl,
                    alt: garment.name,
                  })
                );
                e.dataTransfer.setData('text/plain', garment.rgbaDataUrl || garment.imageUrl);
              }}
              onClick={() => onSelectGarment(garment)}
              className={`group relative bg-neutral-950 border rounded-lg p-2.5 flex flex-col items-center gap-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-cyan-500 ring-1 ring-cyan-500/50 bg-cyan-950/20'
                  : 'border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/60'
              }`}
            >
              <div className="w-full aspect-[4/5] rounded bg-neutral-900/80 flex items-center justify-center p-2 overflow-hidden relative">
                <img
                  src={garment.rgbaDataUrl || garment.imageUrl}
                  alt={garment.name}
                  className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-1.5 right-1.5 bg-neutral-900/90 border border-neutral-700 text-[9px] font-mono text-neutral-400 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                  <Move className="w-2.5 h-2.5 text-cyan-400" />
                  <span>Drag</span>
                </div>
              </div>

              <div className="w-full flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-200 truncate" title={garment.name}>
                    {garment.name}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-mono">
                  <span className="uppercase">{garment.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>Click to Swap</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
