/**
 * AnyWear Local VTON - Curated Fashion Garment Library
 * Covers all required categories with rich textures, logos, seams, and anchor points.
 */

import { Garment } from '../types/vton';

export const BUILTIN_GARMENTS: Garment[] = [
  {
    id: 'g_tshirt_cyber',
    name: 'Neo Minimalist Crewneck Tee',
    category: 't-shirt',
    imageUrl: createGarmentSvgDataUrl('t-shirt', '#18181b', '#38bdf8', 'NEO-STUDIO'),
    confidence: 0.99,
    width: 600,
    height: 650,
    anchors: {
      neckCenter: { x: 300, y: 70 },
      leftShoulder: { x: 140, y: 100 },
      rightShoulder: { x: 460, y: 100 },
      leftArmpit: { x: 130, y: 260 },
      rightArmpit: { x: 470, y: 260 },
      leftHem: { x: 160, y: 610 },
      rightHem: { x: 440, y: 610 },
      waistCenter: { x: 300, y: 440 },
    },
    colorScheme: 'Obsidian & Cyan',
    patternDetails: 'Technical typography across chest',
    source: 'builtin',
  },
  {
    id: 'g_hoodie_heavy',
    name: 'Heavyweight Drop-Shoulder Hoodie',
    category: 'hoodie',
    imageUrl: createGarmentSvgDataUrl('hoodie', '#27272a', '#e4e4e7', 'OVERSIZED VTON'),
    confidence: 0.98,
    width: 640,
    height: 720,
    anchors: {
      neckCenter: { x: 320, y: 90 },
      leftShoulder: { x: 110, y: 130 },
      rightShoulder: { x: 530, y: 130 },
      leftArmpit: { x: 100, y: 310 },
      rightArmpit: { x: 540, y: 310 },
      leftHem: { x: 150, y: 680 },
      rightHem: { x: 490, y: 680 },
      waistCenter: { x: 320, y: 490 },
    },
    colorScheme: 'Graphite & Heather Gray',
    patternDetails: 'Kangaroo pocket with tonal drawstrings',
    source: 'builtin',
  },
  {
    id: 'g_jacket_leather',
    name: 'Biker Asymmetric Leather Moto Jacket',
    category: 'jacket',
    imageUrl: createGarmentSvgDataUrl('jacket', '#09090b', '#d4d4d8', 'MOTOR-4GB'),
    confidence: 0.97,
    width: 620,
    height: 700,
    anchors: {
      neckCenter: { x: 310, y: 80 },
      leftShoulder: { x: 130, y: 120 },
      rightShoulder: { x: 490, y: 120 },
      leftArmpit: { x: 120, y: 290 },
      rightArmpit: { x: 500, y: 290 },
      leftHem: { x: 160, y: 660 },
      rightHem: { x: 460, y: 660 },
      waistCenter: { x: 310, y: 480 },
    },
    colorScheme: 'Pitch Black & Chrome Hardware',
    patternDetails: 'Embossed lapels with metal zip closures',
    source: 'builtin',
  },
  {
    id: 'g_shirt_oxford',
    name: 'Structured Oxford Button-Down Shirt',
    category: 'shirt',
    imageUrl: createGarmentSvgDataUrl('shirt', '#0284c7', '#f0f9ff', 'CLASSIC FIT'),
    confidence: 0.98,
    width: 600,
    height: 680,
    anchors: {
      neckCenter: { x: 300, y: 75 },
      leftShoulder: { x: 145, y: 105 },
      rightShoulder: { x: 455, y: 105 },
      leftArmpit: { x: 140, y: 270 },
      rightArmpit: { x: 460, y: 270 },
      leftHem: { x: 165, y: 640 },
      rightHem: { x: 435, y: 640 },
      waistCenter: { x: 300, y: 460 },
    },
    colorScheme: 'Cerulean Blue & White Placket',
    patternDetails: 'Pointed collar with mother-of-pearl buttons',
    source: 'builtin',
  },
  {
    id: 'g_sweater_knit',
    name: 'Ribbed Cable Knit Fisherman Sweater',
    category: 'sweater',
    imageUrl: createGarmentSvgDataUrl('sweater', '#78350f', '#fef3c7', 'CABLE WOOL'),
    confidence: 0.98,
    width: 610,
    height: 690,
    anchors: {
      neckCenter: { x: 305, y: 80 },
      leftShoulder: { x: 135, y: 115 },
      rightShoulder: { x: 475, y: 115 },
      leftArmpit: { x: 125, y: 280 },
      rightArmpit: { x: 485, y: 280 },
      leftHem: { x: 160, y: 650 },
      rightHem: { x: 450, y: 650 },
      waistCenter: { x: 305, y: 470 },
    },
    colorScheme: 'Warm Ochre Amber',
    patternDetails: 'Chunky waffle rib and raglan sleeves',
    source: 'builtin',
  },
  {
    id: 'g_coat_trench',
    name: 'Double-Breasted Heritage Trench Coat',
    category: 'coat',
    imageUrl: createGarmentSvgDataUrl('coat', '#451a03', '#fef2f2', 'HERITAGE'),
    confidence: 0.97,
    width: 640,
    height: 840,
    anchors: {
      neckCenter: { x: 320, y: 70 },
      leftShoulder: { x: 125, y: 110 },
      rightShoulder: { x: 515, y: 110 },
      leftArmpit: { x: 120, y: 270 },
      rightArmpit: { x: 520, y: 270 },
      leftHem: { x: 90, y: 810 },
      rightHem: { x: 550, y: 810 },
      waistCenter: { x: 320, y: 460 },
    },
    colorScheme: 'Camel Khaki & Horn Buckles',
    patternDetails: 'Storm flap with belted waist silhouette',
    source: 'builtin',
  },
  {
    id: 'g_dress_slip',
    name: 'Liquid Silk Emerald Evening Slip Dress',
    category: 'dress',
    imageUrl: createGarmentSvgDataUrl('dress', '#064e3b', '#6ee7b7', 'SILK ATELIER'),
    confidence: 0.98,
    width: 580,
    height: 860,
    anchors: {
      neckCenter: { x: 290, y: 90 },
      leftShoulder: { x: 155, y: 110 },
      rightShoulder: { x: 425, y: 110 },
      leftArmpit: { x: 165, y: 240 },
      rightArmpit: { x: 415, y: 240 },
      leftHem: { x: 110, y: 830 },
      rightHem: { x: 470, y: 830 },
      waistCenter: { x: 290, y: 440 },
    },
    colorScheme: 'Emerald Green Satin',
    patternDetails: 'Draped cowl neckline with bias cut hem',
    source: 'builtin',
  },
  {
    id: 'g_pants_pleated',
    name: 'Tailored Wide-Leg Pleated Trousers',
    category: 'pants',
    imageUrl: createGarmentSvgDataUrl('pants', '#1e293b', '#94a3b8', 'TAILORED'),
    confidence: 0.96,
    width: 540,
    height: 740,
    anchors: {
      neckCenter: { x: 270, y: 40 },
      leftShoulder: { x: 170, y: 40 },
      rightShoulder: { x: 370, y: 40 },
      leftArmpit: { x: 160, y: 120 },
      rightArmpit: { x: 380, y: 120 },
      leftHem: { x: 110, y: 710 },
      rightHem: { x: 430, y: 710 },
      waistCenter: { x: 270, y: 80 },
    },
    colorScheme: 'Slate Charcoal Navy',
    patternDetails: 'Double front pleats with blind hem',
    source: 'builtin',
  },
  {
    id: 'g_skirt_pleated',
    name: 'Structured Asymmetric Pleated Midi Skirt',
    category: 'skirt',
    imageUrl: createGarmentSvgDataUrl('skirt', '#3b0764', '#e9d5ff', 'PLEATED MIDI'),
    confidence: 0.97,
    width: 560,
    height: 640,
    anchors: {
      neckCenter: { x: 280, y: 40 },
      leftShoulder: { x: 180, y: 40 },
      rightShoulder: { x: 380, y: 40 },
      leftArmpit: { x: 170, y: 100 },
      rightArmpit: { x: 390, y: 100 },
      leftHem: { x: 80, y: 610 },
      rightHem: { x: 480, y: 610 },
      waistCenter: { x: 280, y: 70 },
    },
    colorScheme: 'Deep Imperial Violet',
    patternDetails: 'Knife pleats with high-rise waistband',
    source: 'builtin',
  },
];

/**
 * Generates an ultra-crisp transparent vector garment with seams, highlights and typography
 */
function createGarmentSvgDataUrl(
  type: string,
  primaryColor: string,
  accentColor: string,
  label: string
): string {
  let svgBody = '';

  if (type === 't-shirt') {
    svgBody = `
      <g filter="url(#dropShadow)">
        <!-- Main Torso & Sleeves -->
        <path d="M 210,50 Q 300,105 390,50 L 510,130 L 460,240 L 400,200 L 415,580 Q 300,595 185,580 L 200,200 L 140,240 L 90,130 Z"
              fill="${primaryColor}" stroke="#3f3f46" stroke-width="3" stroke-linejoin="round"/>
        <!-- Collar Ribbing -->
        <path d="M 210,50 Q 300,105 390,50 Q 300,75 210,50 Z" fill="#27272a" stroke="#52525b" stroke-width="2"/>
        <!-- Seams -->
        <path d="M 210,50 L 170,210" stroke="#3f3f46" stroke-width="2" stroke-dasharray="4,4"/>
        <path d="M 390,50 L 430,210" stroke="#3f3f46" stroke-width="2" stroke-dasharray="4,4"/>
        <!-- Chest Brand Typography -->
        <rect x="220" y="240" width="160" height="42" rx="6" fill="#09090b" opacity="0.8"/>
        <text x="300" y="267" fill="${accentColor}" font-family="system-ui, sans-serif" font-size="16" font-weight="700" text-anchor="middle" letter-spacing="3">${label}</text>
        <!-- Subtle Fabric Highlights -->
        <path d="M 230,140 Q 300,170 370,140" stroke="rgba(255,255,255,0.08)" stroke-width="4" fill="none"/>
        <path d="M 240,380 Q 300,410 360,380" stroke="rgba(255,255,255,0.06)" stroke-width="3" fill="none"/>
      </g>
    `;
  } else if (type === 'hoodie') {
    svgBody = `
      <g filter="url(#dropShadow)">
        <!-- Hood Back -->
        <path d="M 230,70 Q 320,10 410,70 Q 320,95 230,70 Z" fill="#18181b" stroke="#3f3f46" stroke-width="3"/>
        <!-- Body & Sleeves -->
        <path d="M 200,80 L 520,160 L 465,300 L 420,260 L 440,650 Q 320,665 200,650 L 220,260 L 175,300 L 120,160 Z"
              fill="${primaryColor}" stroke="#3f3f46" stroke-width="3"/>
        <!-- Hood Collar Overlap -->
        <path d="M 220,70 Q 320,130 420,70 Q 320,105 220,70 Z" fill="#27272a" stroke="#52525b" stroke-width="2"/>
        <!-- Kangaroo Pocket -->
        <path d="M 240,430 L 400,430 L 425,540 L 215,540 Z" fill="#18181b" stroke="#3f3f46" stroke-width="2"/>
        <!-- Drawstrings -->
        <path d="M 285,110 L 280,240" stroke="#a1a1aa" stroke-width="4" stroke-linecap="round"/>
        <path d="M 355,110 L 360,240" stroke="#a1a1aa" stroke-width="4" stroke-linecap="round"/>
        <text x="320" y="310" fill="${accentColor}" font-family="system-ui, sans-serif" font-size="18" font-weight="800" text-anchor="middle" letter-spacing="4">${label}</text>
      </g>
    `;
  } else if (type === 'jacket') {
    svgBody = `
      <g filter="url(#dropShadow)">
        <!-- Leather Body -->
        <path d="M 200,70 L 510,140 L 460,270 L 415,240 L 435,630 Q 310,645 185,630 L 205,240 L 160,270 L 110,140 Z"
              fill="${primaryColor}" stroke="#27272a" stroke-width="3"/>
        <!-- Lapels -->
        <path d="M 230,70 L 180,180 L 260,210 Z" fill="#18181b" stroke="#52525b" stroke-width="2"/>
        <path d="M 390,70 L 440,180 L 360,210 Z" fill="#18181b" stroke="#52525b" stroke-width="2"/>
        <!-- Metal Asymmetric Zipper -->
        <line x1="330" y1="90" x2="270" y2="630" stroke="#a1a1aa" stroke-width="5" stroke-dasharray="6,2"/>
        <!-- Zip Pockets -->
        <line x1="350" y1="380" x2="410" y2="410" stroke="#a1a1aa" stroke-width="4"/>
        <line x1="220" y1="440" x2="280" y2="440" stroke="#a1a1aa" stroke-width="4"/>
        <!-- Badge -->
        <rect x="330" y="270" width="80" height="24" rx="3" fill="#27272a" stroke="#52525b"/>
        <text x="370" y="287" fill="${accentColor}" font-family="system-ui, sans-serif" font-size="11" font-weight="700" text-anchor="middle">${label}</text>
      </g>
    `;
  } else if (type === 'coat') {
    svgBody = `
      <g filter="url(#dropShadow)">
        <path d="M 210,60 L 520,130 L 470,250 L 435,230 L 490,780 Q 320,795 150,780 L 205,230 L 170,250 L 120,130 Z"
              fill="${primaryColor}" stroke="#292524" stroke-width="3"/>
        <!-- Trench Lapels -->
        <path d="M 220,60 L 160,190 L 260,240 Z" fill="#292524" stroke="#78716c" stroke-width="2"/>
        <path d="M 420,60 L 480,190 L 380,240 Z" fill="#292524" stroke="#78716c" stroke-width="2"/>
        <!-- Belt -->
        <rect x="195" y="420" width="250" height="36" rx="4" fill="#1c1917" stroke="#78716c"/>
        <rect x="300" y="415" width="40" height="46" rx="4" fill="none" stroke="#eab308" stroke-width="4"/>
        <!-- Horn Buttons -->
        <circle cx="280" cy="280" r="8" fill="#1c1917" stroke="#78716c" stroke-width="2"/>
        <circle cx="280" cy="350" r="8" fill="#1c1917" stroke="#78716c" stroke-width="2"/>
        <circle cx="360" cy="280" r="8" fill="#1c1917" stroke="#78716c" stroke-width="2"/>
        <circle cx="360" cy="350" r="8" fill="#1c1917" stroke="#78716c" stroke-width="2"/>
      </g>
    `;
  } else if (type === 'dress') {
    svgBody = `
      <g filter="url(#dropShadow)">
        <!-- Thin Straps -->
        <line x1="220" y1="50" x2="220" y2="120" stroke="${primaryColor}" stroke-width="4"/>
        <line x1="360" y1="50" x2="360" y2="120" stroke="${primaryColor}" stroke-width="4"/>
        <!-- Dress Silhouette -->
        <path d="M 190,120 Q 290,145 390,120 L 375,270 Q 380,390 440,780 Q 290,800 140,780 Q 200,390 205,270 Z"
              fill="${primaryColor}" stroke="#065f46" stroke-width="2"/>
        <!-- Cowl Neck Drape -->
        <path d="M 190,120 Q 290,165 390,120 Q 290,140 190,120 Z" fill="#047857"/>
        <!-- Satin Sheen Highlights -->
        <path d="M 230,220 Q 270,440 220,740" stroke="rgba(255,255,255,0.18)" stroke-width="12" fill="none"/>
        <path d="M 330,220 Q 310,440 350,740" stroke="rgba(255,255,255,0.12)" stroke-width="8" fill="none"/>
      </g>
    `;
  } else if (type === 'shirt') {
    svgBody = `
      <g filter="url(#dropShadow)">
        <path d="M 210,65 L 490,125 L 445,245 L 395,215 L 415,620 Q 300,635 185,620 L 205,215 L 155,245 L 110,125 Z"
              fill="${primaryColor}" stroke="#0369a1" stroke-width="3"/>
        <!-- Collar -->
        <path d="M 210,65 L 260,115 L 300,75 L 340,115 L 390,65 Z" fill="#f0f9ff" stroke="#0284c7" stroke-width="2"/>
        <!-- Placket & Buttons -->
        <line x1="300" y1="75" x2="300" y2="620" stroke="#f0f9ff" stroke-width="18"/>
        <circle cx="300" cy="140" r="5" fill="#0284c7"/>
        <circle cx="300" cy="220" r="5" fill="#0284c7"/>
        <circle cx="300" cy="300" r="5" fill="#0284c7"/>
        <circle cx="300" cy="380" r="5" fill="#0284c7"/>
        <circle cx="300" cy="460" r="5" fill="#0284c7"/>
        <!-- Pocket -->
        <rect x="220" y="210" width="55" height="65" rx="3" fill="none" stroke="#0369a1" stroke-width="2"/>
      </g>
    `;
  } else if (type === 'sweater') {
    svgBody = `
      <g filter="url(#dropShadow)">
        <path d="M 205,65 Q 305,100 405,65 L 500,145 L 450,265 L 400,230 L 415,625 Q 305,640 195,625 L 210,230 L 160,265 L 110,145 Z"
              fill="${primaryColor}" stroke="#451a03" stroke-width="3"/>
        <!-- Chunky Ribbed Neckline -->
        <path d="M 205,65 Q 305,100 405,65 Q 305,80 205,65 Z" fill="#92400e" stroke="#b45309" stroke-width="3"/>
        <!-- Cable Knit Textures -->
        <line x1="250" y1="120" x2="250" y2="610" stroke="#92400e" stroke-width="4" stroke-dasharray="10,6"/>
        <line x1="305" y1="120" x2="305" y2="610" stroke="#92400e" stroke-width="6" stroke-dasharray="12,6"/>
        <line x1="360" y1="120" x2="360" y2="610" stroke="#92400e" stroke-width="4" stroke-dasharray="10,6"/>
      </g>
    `;
  } else if (type === 'pants') {
    svgBody = `
      <g filter="url(#dropShadow)">
        <!-- Waistband -->
        <rect x="160" y="40" width="220" height="40" rx="4" fill="#0f172a" stroke="#334155" stroke-width="2"/>
        <!-- Legs -->
        <path d="M 160,80 L 110,680 L 220,680 L 270,300 L 320,680 L 430,680 L 380,80 Z"
              fill="${primaryColor}" stroke="#334155" stroke-width="3"/>
        <!-- Front Pleat Creases -->
        <line x1="200" y1="80" x2="165" y2="675" stroke="#475569" stroke-width="2"/>
        <line x1="340" y1="80" x2="375" y2="675" stroke="#475569" stroke-width="2"/>
        <!-- Fly & Button -->
        <line x1="270" y1="40" x2="270" y2="160" stroke="#334155" stroke-width="3"/>
        <circle cx="270" cy="58" r="5" fill="#94a3b8"/>
      </g>
    `;
  } else {
    // Skirt
    svgBody = `
      <g filter="url(#dropShadow)">
        <!-- High Waistband -->
        <rect x="170" y="40" width="220" height="35" rx="3" fill="#1e1b4b" stroke="#4c1d95" stroke-width="2"/>
        <!-- Pleated Flared Body -->
        <path d="M 170,75 L 80,580 Q 280,610 480,580 L 390,75 Z"
              fill="${primaryColor}" stroke="#581c87" stroke-width="3"/>
        <!-- Knife Pleats -->
        <line x1="140" y1="80" x2="130" y2="580" stroke="#6b21a8" stroke-width="2"/>
        <line x1="200" y1="78" x2="200" y2="585" stroke="#6b21a8" stroke-width="2"/>
        <line x1="280" y1="76" x2="280" y2="590" stroke="#6b21a8" stroke-width="2"/>
        <line x1="360" y1="78" x2="360" y2="585" stroke="#6b21a8" stroke-width="2"/>
        <line x1="420" y1="80" x2="430" y2="580" stroke="#6b21a8" stroke-width="2"/>
      </g>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
    <defs>
      <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.45"/>
      </filter>
    </defs>
    ${svgBody}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
