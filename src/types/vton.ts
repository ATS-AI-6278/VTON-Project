/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * AnyWear Local VTON - Core Type Definitions
 */

export type ClothingCategory =
  | 't-shirt'
  | 'shirt'
  | 'hoodie'
  | 'sweater'
  | 'jacket'
  | 'coat'
  | 'dress'
  | 'pants'
  | 'skirt';

export type PipelineMode = 'realtime' | 'balanced' | 'quality';

export interface GarmentAnchors {
  neckCenter: { x: number; y: number };
  leftShoulder: { x: number; y: number };
  rightShoulder: { x: number; y: number };
  leftArmpit: { x: number; y: number };
  rightArmpit: { x: number; y: number };
  leftHem: { x: number; y: number };
  rightHem: { x: number; y: number };
  waistCenter: { x: number; y: number };
}

export interface Garment {
  id: string;
  name: string;
  category: ClothingCategory;
  imageUrl: string;
  rgbaDataUrl?: string;
  maskDataUrl?: string;
  confidence: number;
  width: number;
  height: number;
  anchors: GarmentAnchors;
  colorScheme: string;
  patternDetails: string;
  source: 'builtin' | 'extracted' | 'dropped' | 'extension';
}

export interface PoseLandmarks {
  nose: { x: number; y: number; score: number };
  leftEye: { x: number; y: number; score: number };
  rightEye: { x: number; y: number; score: number };
  neck: { x: number; y: number; score: number };
  leftShoulder: { x: number; y: number; score: number };
  rightShoulder: { x: number; y: number; score: number };
  chest: { x: number; y: number; score: number };
  leftElbow: { x: number; y: number; score: number };
  rightElbow: { x: number; y: number; score: number };
  leftWrist: { x: number; y: number; score: number };
  rightWrist: { x: number; y: number; score: number };
  leftHip: { x: number; y: number; score: number };
  rightHip: { x: number; y: number; score: number };
  waist: { x: number; y: number; score: number };
}

export interface OcclusionState {
  isLeftArmOverTorso: boolean;
  isRightArmOverTorso: boolean;
  occlusionConfidence: number;
  depthEstimate: number; // relative distance in meters
}

export type DesktopPlatform = 'windows' | 'macos' | 'auto';

export type VTONModelId =
  | 'AUTO'
  | 'WarpRefineDenseVTON'
  | 'CatVTON_4GB'
  | 'FastFlowVTON'
  | 'IDM_VTON'
  | 'OOTDiffusion';

export type GarmentSwitchStatus = 'idle' | 'preparing' | 'switching' | 'ready';

export interface VTONAccuracyMetrics {
  colorPreservationDeltaE: number; // CIEDE2000 color delta (lower is closer, <2.0 is imperceptible)
  logoEdgeClarityScore: number;    // High-frequency gradient preservation (0.0 to 1.0)
  boundaryBleedIndex: number;      // Silhouette spillover percentage (<1.0% target)
  poseAlignmentErrorPx: number;    // Torso/shoulder Euclidean residual in px (<3.5px)
  identityDistortionScore: number; // Face/hair/neck preservation score (0.0 to 1.0, 1.0 = untouched)
  temporalWarpIndex: number;       // Inter-frame mesh deformation derivative (<0.05)
  photometricLightingMatch: number;// Dynamic range & illuminant coherence (0.0 to 1.0)
  forearmOcclusionPrecision: number;// Arm mask accuracy over torso fabric
}

export interface LiveTelemetry {
  fps: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  endToEndLatencyMs: number;
  queueDepth: number;
  vramUsedMb: number;
  vramTotalMb: number;
  vramBudgetMb: number;
  droppedFrames: number;
  frameCount: number;
  temporalJitterIndex: number;
  garmentSwitchLatencyMs: number;
  startupLatencyMs: number;
  mode: PipelineMode;
  gpuUtilization: number;
  activeResolution: string;
  selectedModel: string;
  detectedHardware: string;
  accuracyMetrics?: VTONAccuracyMetrics;
}

export type MultiPoseType =
  | 'standing'
  | 'walking'
  | 'turning'
  | 'arms-raised'
  | 'arms-crossed'
  | 'side-profile'
  | 'fast-motion'
  | 'partial-occlusion';

export type VTONDebugStage =
  | 'final'
  | 'person-mask'
  | 'cloth-agnostic'
  | 'pose'
  | 'garment-mask'
  | 'warped-garment'
  | 'occlusion'
  | 'all-stages-grid';

export interface VTONTrackerState {
  modelStatus: 'uninitialized' | 'loading' | 'ready' | 'error' | 'no-person';
  errorMessage: string | null;
  hasPerson: boolean;
  landmarks: PoseLandmarks | null;
  segmentationMaskCanvas: HTMLCanvasElement | null;
  rawLandmarksCount: number;
}

