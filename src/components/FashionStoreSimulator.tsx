/**
 * AnyWear Local VTON - E-Commerce Fashion Store Simulator
 * Simulates a real e-commerce website (Zara / SSENSE / ASOS) to test dragging
 * and extracting apparel directly into the live try-on pipeline.
 */

import React from 'react';
import { Garment } from '../types/vton';
import { BUILTIN_GARMENTS } from '../services/mockGarments';
import { ShoppingBag, ArrowUpRight, Sparkles, ExternalLink, Move } from 'lucide-react';

interface FashionStoreSimulatorProps {
  onSelectGarment: (garment: Garment) => void;
  currentGarmentId: string;
}

const STORE_PRODUCTS = [
  {
    garment: BUILTIN_GARMENTS[0], // T-shirt
    brand: 'STUDIO NOIR',
    title: 'Cyberpunk Heavyweight Graphic Tee',
    price: '$85.00',
    tags: 'Organic Cotton · Ribbed Collar',
    inStock: true,
  },
  {
    garment: BUILTIN_GARMENTS[1], // Hoodie
    brand: 'ATELIER ESSENTIALS',
    title: '500 GSM Oversized French Terry Hoodie',
    price: '$160.00',
    tags: 'Drop Shoulder · Tonal Seams',
    inStock: true,
  },
  {
    garment: BUILTIN_GARMENTS[2], // Leather Jacket
    brand: 'VON RIDER',
    title: 'Asymmetrical Lambskin Biker Moto Jacket',
    price: '$620.00',
    tags: 'Chrome Hardware · Quilted Lining',
    inStock: true,
  },
  {
    garment: BUILTIN_GARMENTS[3], // Oxford Shirt
    brand: 'NORDIC TAILOR',
    title: 'Classic Pinpoint Oxford Button-Down',
    price: '$110.00',
    tags: '100% Egyptian Cotton · Curved Hem',
    inStock: true,
  },
  {
    garment: BUILTIN_GARMENTS[4], // Sweater
    brand: 'ARAN CO.',
    title: 'Heavy Gauge Cable Knit Fisherman Sweater',
    price: '$240.00',
    tags: 'Pure Merino Wool · Chunky Rib',
    inStock: true,
  },
  {
    garment: BUILTIN_GARMENTS[5], // Trench Coat
    brand: 'LONDON BESPOKE',
    title: 'Double-Breasted Storm Flap Trench Coat',
    price: '$890.00',
    tags: 'Water-Repellent Gabardine · Horn Buttons',
    inStock: true,
  },
  {
    garment: BUILTIN_GARMENTS[6], // Silk Dress
    brand: 'SOIE NOCTURNE',
    title: 'Liquid Satin Bias-Cut Evening Slip Dress',
    price: '$380.00',
    tags: '100% Mulberry Silk · Cowl Drape',
    inStock: true,
  },
  {
    garment: BUILTIN_GARMENTS[7], // Tailored Trousers
    brand: 'SAVILE CUT',
    title: 'Double-Pleated Wide-Leg Wool Trousers',
    price: '$260.00',
    tags: 'Italian Wool Flannel · Blind Hem',
    inStock: true,
  },
];

export const FashionStoreSimulator: React.FC<FashionStoreSimulatorProps> = ({
  onSelectGarment,
  currentGarmentId,
}) => {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto py-4">
      {/* Store Banner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <ShoppingBag className="w-4 h-4" />
            <span>Simulated Fashion Store · Drag & Drop Testbed</span>
          </div>
          <h1 className="text-xl font-bold text-neutral-100">
            Atelier Runway & Streetwear Collection
          </h1>
          <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
            Test dragging any product card or garment image directly onto the live camera stream.
            The pipeline will automatically isolate the garment, extract anchor points, and hot-swap
            clothing without stopping or reloading the video session.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 px-3.5 py-2 rounded-lg text-xs font-mono text-neutral-300">
          <Move className="w-3.5 h-3.5 text-cyan-400" />
          <span>Native Drag/Drop Active</span>
        </div>
      </div>

      {/* Product Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STORE_PRODUCTS.map((item) => {
          const isCurrent = currentGarmentId === item.garment.id;

          return (
            <div
              key={item.garment.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData(
                  'application/x-anywear-garment',
                  JSON.stringify({
                    src: item.garment.rgbaDataUrl || item.garment.imageUrl,
                    alt: item.title,
                  })
                );
                e.dataTransfer.setData(
                  'text/plain',
                  item.garment.rgbaDataUrl || item.garment.imageUrl
                );
              }}
              className={`group bg-neutral-900 border rounded-xl p-4 flex flex-col justify-between gap-3 cursor-grab active:cursor-grabbing transition-all hover:shadow-xl ${
                isCurrent
                  ? 'border-cyan-500 ring-1 ring-cyan-500/50 bg-cyan-950/10'
                  : 'border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {/* Image Frame with Draggable Affordance */}
              <div className="relative w-full aspect-[4/5] bg-neutral-950 rounded-lg p-4 flex items-center justify-center overflow-hidden">
                <img
                  src={item.garment.rgbaDataUrl || item.garment.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
                />

                {/* Drag pill affordance */}
                <div className="absolute top-2.5 right-2.5 bg-neutral-900/90 backdrop-blur-md border border-neutral-700 text-[10px] font-mono text-neutral-300 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <Move className="w-2.5 h-2.5 text-cyan-400" />
                  <span>Drag Me</span>
                </div>

                {isCurrent && (
                  <div className="absolute bottom-2.5 left-2.5 bg-cyan-950/90 border border-cyan-500 text-[11px] font-semibold text-cyan-200 px-2.5 py-0.5 rounded shadow-sm">
                    Currently Wearing Live
                  </div>
                )}
              </div>

              {/* Product Metadata */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-neutral-500 tracking-wider">
                    {item.brand}
                  </span>
                  <span className="text-xs font-mono font-semibold text-neutral-200">
                    {item.price}
                  </span>
                </div>

                <h3 className="text-xs font-semibold text-neutral-100 line-clamp-1" title={item.title}>
                  {item.title}
                </h3>

                <p className="text-[11px] text-neutral-400">{item.tags}</p>
              </div>

              {/* Quick Try-On Button */}
              <button
                onClick={() => onSelectGarment(item.garment)}
                className={`w-full py-2 px-3 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                  isCurrent
                    ? 'bg-neutral-800 text-cyan-400 cursor-default'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                }`}
              >
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>{isCurrent ? 'Active on Stream' : 'Instant Try On'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
