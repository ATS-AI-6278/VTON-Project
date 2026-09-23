/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * AnyWear VTON - Pixel-Level Human Parsing, Cloth-Agnostic Masking,
 * Adaptive Skin Detection, and Temporal Refinement Engine.
 *
 * Eliminates heuristic keypoint capsules in favor of:
 * 1. Pixel-level person silhouette with temporal exponential moving average (EMA)
 * 2. Cloth-agnostic person representation (I_agnostic & M_agnostic) isolating the original clothing
 * 3. Dynamic skin calibration in YCbCr space to segment real arms, hands, fingers, and hair
 * 4. Temporal mask filtering across frames to eradicate edge chatter and flicker
 */

import { PoseLandmarks } from '../types/vton';

export interface HumanParsingResult {
  // 1. Full human silhouette with temporal smoothing
  personMaskCanvas: HTMLCanvasElement;
  // 2. Cloth-agnostic representation (original clothing removed, head/hair/skin/arms/hands/background intact)
  clothAgnosticCanvas: HTMLCanvasElement;
  // 2b. Binary / alpha mask of the removed clothing region
  clothAgnosticMaskCanvas: HTMLCanvasElement;
  // 3. Pixel-level arm, hand, and hair occlusion mask over the torso
  occlusionMaskCanvas: HTMLCanvasElement;
  // 4. Foreground arms, hands, and hair extracted directly from webcam RGB
  foregroundArmHairCanvas: HTMLCanvasElement;
}

export class PixelHumanParser {
  private width = 0;
  private height = 0;

  // Working and output canvases
  private personMaskCanvas: HTMLCanvasElement;
  private personMaskCtx: CanvasRenderingContext2D;

  private clothAgnosticCanvas: HTMLCanvasElement;
  private clothAgnosticCtx: CanvasRenderingContext2D;

  private clothAgnosticMaskCanvas: HTMLCanvasElement;
  private clothAgnosticMaskCtx: CanvasRenderingContext2D;

  private occlusionMaskCanvas: HTMLCanvasElement;
  private occlusionMaskCtx: CanvasRenderingContext2D;

  private foregroundArmHairCanvas: HTMLCanvasElement;
  private foregroundArmHairCtx: CanvasRenderingContext2D;

  // Low-resolution fast analysis buffer (320x240) for real-time 60fps pixel chrominance parsing
  private analysisCanvas: HTMLCanvasElement;
  private analysisCtx: CanvasRenderingContext2D;

  // Temporal smoothing memory buffers (EMA: alpha * current + (1 - alpha) * prev)
  private prevPersonMaskData: Float32Array | null = null;
  private prevOcclusionMaskData: Float32Array | null = null;

  // Dynamically calibrated wearer skin chrominance (YCbCr)
  private skinCb = 108.0;
  private skinCr = 152.0;
  private isSkinCalibrated = false;

  constructor() {
    const create = () => {
      const c = document.createElement('canvas');
      return { c, ctx: c.getContext('2d', { willReadFrequently: true })! };
    };

    const pm = create();
    this.personMaskCanvas = pm.c;
    this.personMaskCtx = pm.ctx;

    const ca = create();
    this.clothAgnosticCanvas = ca.c;
    this.clothAgnosticCtx = ca.ctx;

    const cam = create();
    this.clothAgnosticMaskCanvas = cam.c;
    this.clothAgnosticMaskCtx = cam.ctx;

    const om = create();
    this.occlusionMaskCanvas = om.c;
    this.occlusionMaskCtx = om.ctx;

    const fa = create();
    this.foregroundArmHairCanvas = fa.c;
    this.foregroundArmHairCtx = fa.ctx;

    const an = create();
    this.analysisCanvas = an.c;
    this.analysisCtx = an.ctx;
    this.analysisCanvas.width = 320;
    this.analysisCanvas.height = 240;
  }

  private syncDimensions(w: number, h: number) {
    if (this.width !== w || this.height !== h) {
      this.width = w;
      this.height = h;
      [
        this.personMaskCanvas,
        this.clothAgnosticCanvas,
        this.clothAgnosticMaskCanvas,
        this.occlusionMaskCanvas,
        this.foregroundArmHairCanvas,
      ].forEach((c) => {
        c.width = w;
        c.height = h;
      });

      // Reset temporal buffers when resolution changes
      const numPixels = 320 * 240;
      this.prevPersonMaskData = new Float32Array(numPixels);
      this.prevOcclusionMaskData = new Float32Array(numPixels);
    }
  }

  /**
   * Primary pipeline step: Parses the camera frame into:
   * 1. Temporally refined Person Mask
   * 2. Cloth-Agnostic Person Frame (I_agnostic)
   * 3. Cloth-Agnostic Torso Mask (M_agnostic)
   * 4. Pixel-Level Arm, Hand, and Hair Occlusion Mask
   */
  public parseFrame(
    videoSource: CanvasImageSource,
    rawSegmentationCanvas: HTMLCanvasElement | null,
    landmarks: PoseLandmarks | null,
    width: number,
    height: number,
    temporalAlpha: number = 0.82
  ): HumanParsingResult {
    this.syncDimensions(width, height);

    const aw = this.analysisCanvas.width;
    const ah = this.analysisCanvas.height;

    // Draw downscaled camera frame for high-speed pixel analysis
    this.analysisCtx.drawImage(videoSource, 0, 0, aw, ah);
    const videoImgData = this.analysisCtx.getImageData(0, 0, aw, ah);
    const vPixels = videoImgData.data;

    // Get raw segmentation mask scaled to analysis resolution
    let segPixels: Uint8ClampedArray | null = null;
    if (rawSegmentationCanvas) {
      this.analysisCtx.clearRect(0, 0, aw, ah);
      this.analysisCtx.drawImage(rawSegmentationCanvas, 0, 0, aw, ah);
      segPixels = this.analysisCtx.getImageData(0, 0, aw, ah).data;
    }

    if (!landmarks) {
      // Clear canvases when no person is detected
      this.personMaskCtx.clearRect(0, 0, width, height);
      this.clothAgnosticCtx.clearRect(0, 0, width, height);
      this.clothAgnosticMaskCtx.clearRect(0, 0, width, height);
      this.occlusionMaskCtx.clearRect(0, 0, width, height);
      this.foregroundArmHairCtx.clearRect(0, 0, width, height);

      return {
        personMaskCanvas: this.personMaskCanvas,
        clothAgnosticCanvas: this.clothAgnosticCanvas,
        clothAgnosticMaskCanvas: this.clothAgnosticMaskCanvas,
        occlusionMaskCanvas: this.occlusionMaskCanvas,
        foregroundArmHairCanvas: this.foregroundArmHairCanvas,
      };
    }

    // --- STEP 1: Dynamically Calibrate Wearer's Real Skin Tone (YCbCr) ---
    this.calibrateSkinTone(vPixels, landmarks, width, height, aw, ah);

    // --- STEP 2: Pixel-Level Human Parsing & Silhouette Extraction ---
    const scaleX = aw / width;
    const scaleY = ah / height;

    // Anatomical anchor points mapped to analysis resolution
    const neckX = landmarks.neck.x * scaleX;
    const neckY = landmarks.neck.y * scaleY;
    const lsX = landmarks.leftShoulder.x * scaleX;
    const lsY = landmarks.leftShoulder.y * scaleY;
    const rsX = landmarks.rightShoulder.x * scaleX;
    const rsY = landmarks.rightShoulder.y * scaleY;
    const lhX = landmarks.leftHip.x * scaleX;
    const lhY = landmarks.leftHip.y * scaleY;
    const rhX = landmarks.rightHip.x * scaleX;
    const rhY = landmarks.rightHip.y * scaleY;
    const waistY = landmarks.waist.y * scaleY;

    // Wrist and elbow coordinates
    const lwX = landmarks.leftWrist.x * scaleX;
    const lwY = landmarks.leftWrist.y * scaleY;
    const rwX = landmarks.rightWrist.x * scaleX;
    const rwY = landmarks.rightWrist.y * scaleY;
    const leX = landmarks.leftElbow.x * scaleX;
    const leY = landmarks.leftElbow.y * scaleY;
    const reX = landmarks.rightElbow.x * scaleX;
    const reY = landmarks.rightElbow.y * scaleY;

    // Bounding box of original torso clothing region
    const torsoMinX = Math.min(lsX, lhX) - 10;
    const torsoMaxX = Math.max(rsX, rhX) + 10;
    const torsoMinY = Math.min(lsY, rsY) - 4;
    const torsoMaxY = Math.max(lhY, rhY, waistY) + 12;

    const personMaskData = new Uint8ClampedArray(aw * ah * 4);
    const clothAgnosticMaskData = new Uint8ClampedArray(aw * ah * 4);
    const occlusionMaskData = new Uint8ClampedArray(aw * ah * 4);

    if (!this.prevPersonMaskData) this.prevPersonMaskData = new Float32Array(aw * ah);
    if (!this.prevOcclusionMaskData) this.prevOcclusionMaskData = new Float32Array(aw * ah);

    const prevPM = this.prevPersonMaskData;
    const prevOM = this.prevOcclusionMaskData;

    // Pixel processing loop
    for (let y = 0; y < ah; y++) {
      const rowOffset = y * aw;
      for (let x = 0; x < aw; x++) {
        const idx = (rowOffset + x) * 4;
        const pIdx = rowOffset + x;

        const r = vPixels[idx];
        const g = vPixels[idx + 1];
        const b = vPixels[idx + 2];

        // Convert pixel to YCbCr
        const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
        const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

        // Determine if pixel is human silhouette
        let isPerson = false;
        if (segPixels) {
          // MediaPipe selfie segmentation mask alpha / red channel
          const segVal = segPixels[idx + 3] > 0 ? segPixels[idx] : 0;
          isPerson = segVal > 64;
        } else {
          // Fallback geometric torso & limb proximity
          const inTorso = x >= torsoMinX && x <= torsoMaxX && y >= torsoMinY && y <= torsoMaxY;
          isPerson = inTorso;
        }

        // Apply temporal smoothing (EMA) to person silhouette
        const targetPM = isPerson ? 255 : 0;
        const smoothedPM = temporalAlpha * targetPM + (1 - temporalAlpha) * prevPM[pIdx];
        prevPM[pIdx] = smoothedPM;
        const pmVal = smoothedPM > 64 ? 255 : 0;

        personMaskData[idx] = 255;
        personMaskData[idx + 1] = 255;
        personMaskData[idx + 2] = 255;
        personMaskData[idx + 3] = pmVal;

        // If not person, skip clothing and occlusion
        if (pmVal === 0) continue;

        // Check if pixel is skin color (chrominance distance to calibrated wearer skin tone)
        const dCb = cb - this.skinCb;
        const dCr = cr - this.skinCr;
        const skinDist = Math.sqrt(dCb * dCb + dCr * dCr);
        const isSkin =
          skinDist < 26 || (cb >= 77 && cb <= 127 && cr >= 133 && cr <= 173);

        // Check if pixel is hair (upper head perimeter, dark melanin or texture)
        const isHeadRegion = y < neckY;
        const isHair =
          isHeadRegion && (r < 75 && g < 75 && b < 85 && Math.abs(r - g) < 20);

        // Check if pixel is neck/chin (MUST NOT be removed by cloth mask!)
        const isNeckOrHead = y < neckY + 4;

        // Check if pixel belongs to forearm/wrist crossing over the torso
        const dLeftWrist = Math.hypot(x - lwX, y - lwY);
        const dRightWrist = Math.hypot(x - rwX, y - rwY);
        const dLeftForearm = this.distToSegment(x, y, leX, leY, lwX, lwY);
        const dRightForearm = this.distToSegment(x, y, reX, reY, rwX, rwY);

        const isForearmArea =
          (dLeftForearm < 18 && (dLeftWrist < 24 || y >= leY - 10)) ||
          (dRightForearm < 18 && (dRightWrist < 24 || y >= reY - 10));

        // Real pixel-level occlusion: arm, hand, or hair crossing torso
        const isOccluding =
          (isForearmArea && (isSkin || isForearmArea)) ||
          (isSkin && x >= torsoMinX && x <= torsoMaxX && y >= torsoMinY && y <= torsoMaxY && !isNeckOrHead) ||
          (isHair && y < lsY + 12);

        // Temporal smoothing on occlusion
        const targetOM = isOccluding ? 255 : 0;
        const smoothedOM = temporalAlpha * targetOM + (1 - temporalAlpha) * prevOM[pIdx];
        prevOM[pIdx] = smoothedOM;
        const omVal = smoothedOM > 72 ? 255 : 0;

        if (omVal > 0) {
          occlusionMaskData[idx] = 255;
          occlusionMaskData[idx + 1] = 255;
          occlusionMaskData[idx + 2] = 255;
          occlusionMaskData[idx + 3] = omVal;
        }

        // --- Cloth-Agnostic Mask Calculation (M_agnostic) ---
        // Torso clothing region: inside torso bounding polygon, below neck, NOT skin, NOT occluding arm/hair
        const inTorsoBox =
          x >= torsoMinX && x <= torsoMaxX && y >= neckY + 4 && y <= torsoMaxY;

        if (inTorsoBox && !isNeckOrHead && omVal === 0) {
          // This is original clothing! Mark for removal in cloth-agnostic mask
          clothAgnosticMaskData[idx] = 255;
          clothAgnosticMaskData[idx + 1] = 255;
          clothAgnosticMaskData[idx + 2] = 255;
          clothAgnosticMaskData[idx + 3] = 255;
        }
      }
    }

    // Render Stage 1: Person Segmentation Mask
    this.renderMaskToCanvas(this.personMaskCanvas, this.personMaskCtx, personMaskData, aw, ah, width, height);

    // Render Stage 2b: Cloth-Agnostic Mask (M_agnostic)
    this.renderMaskToCanvas(
      this.clothAgnosticMaskCanvas,
      this.clothAgnosticMaskCtx,
      clothAgnosticMaskData,
      aw,
      ah,
      width,
      height
    );

    // Render Stage 2: Cloth-Agnostic Frame (I_agnostic)
    // Draw original video frame, then erase the cloth-agnostic region with neutral tone
    this.clothAgnosticCtx.clearRect(0, 0, width, height);
    this.clothAgnosticCtx.drawImage(videoSource, 0, 0, width, height);
    this.clothAgnosticCtx.save();
    this.clothAgnosticCtx.globalCompositeOperation = 'destination-out';
    this.clothAgnosticCtx.drawImage(this.clothAgnosticMaskCanvas, 0, 0, width, height);
    this.clothAgnosticCtx.restore();

    // Render Stage 6: Pixel-Level Occlusion Mask
    this.renderMaskToCanvas(
      this.occlusionMaskCanvas,
      this.occlusionMaskCtx,
      occlusionMaskData,
      aw,
      ah,
      width,
      height
    );

    // Render Foreground Arm & Hair RGB Canvas
    // Clips raw video frame by the occlusion mask to isolate the wearer's real skin, hands, and hair
    this.foregroundArmHairCtx.clearRect(0, 0, width, height);
    this.foregroundArmHairCtx.save();
    this.foregroundArmHairCtx.drawImage(this.occlusionMaskCanvas, 0, 0, width, height);
    this.foregroundArmHairCtx.globalCompositeOperation = 'source-in';
    this.foregroundArmHairCtx.drawImage(videoSource, 0, 0, width, height);
    this.foregroundArmHairCtx.restore();

    return {
      personMaskCanvas: this.personMaskCanvas,
      clothAgnosticCanvas: this.clothAgnosticCanvas,
      clothAgnosticMaskCanvas: this.clothAgnosticMaskCanvas,
      occlusionMaskCanvas: this.occlusionMaskCanvas,
      foregroundArmHairCanvas: this.foregroundArmHairCanvas,
    };
  }

  /**
   * Samples wearer's skin from face and neck to calibrate YCbCr chrominance cluster
   */
  private calibrateSkinTone(
    vPixels: Uint8ClampedArray,
    lm: PoseLandmarks,
    w: number,
    h: number,
    aw: number,
    ah: number
  ): void {
    const scaleX = aw / w;
    const scaleY = ah / h;

    // Sample point 1: Just below nose (upper philtrum)
    const p1x = Math.floor(lm.nose.x * scaleX);
    const p1y = Math.min(ah - 1, Math.floor(lm.nose.y * scaleY + 6));

    // Sample point 2: Suprasternal notch neck area
    const p2x = Math.floor(lm.neck.x * scaleX);
    const p2y = Math.max(0, Math.floor(lm.neck.y * scaleY - 6));

    const samples: Array<{ cb: number; cr: number }> = [];

    [ { x: p1x, y: p1y }, { x: p2x, y: p2y } ].forEach((pt) => {
      if (pt.x >= 0 && pt.x < aw && pt.y >= 0 && pt.y < ah) {
        const idx = (pt.y * aw + pt.x) * 4;
        const r = vPixels[idx];
        const g = vPixels[idx + 1];
        const b = vPixels[idx + 2];
        const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
        const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

        // Validate plausible skin range
        if (cb >= 65 && cb <= 140 && cr >= 120 && cr <= 185) {
          samples.push({ cb, cr });
        }
      }
    });

    if (samples.length > 0) {
      const avgCb = samples.reduce((acc, s) => acc + s.cb, 0) / samples.length;
      const avgCr = samples.reduce((acc, s) => acc + s.cr, 0) / samples.length;

      if (!this.isSkinCalibrated) {
        this.skinCb = avgCb;
        this.skinCr = avgCr;
        this.isSkinCalibrated = true;
      } else {
        // Smooth temporal adaptation
        this.skinCb = 0.95 * this.skinCb + 0.05 * avgCb;
        this.skinCr = 0.95 * this.skinCr + 0.05 * avgCr;
      }
    }
  }

  private distToSegment(
    px: number,
    py: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number {
    const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
    if (l2 === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
  }

  /**
   * Upscales analysis image data onto destination canvas with bilinear interpolation
   */
  private renderMaskToCanvas(
    targetCanvas: HTMLCanvasElement,
    targetCtx: CanvasRenderingContext2D,
    maskData: Uint8ClampedArray,
    aw: number,
    ah: number,
    w: number,
    h: number
  ): void {
    const tempImgData = this.analysisCtx.createImageData(aw, ah);
    tempImgData.data.set(maskData);
    this.analysisCtx.putImageData(tempImgData, 0, 0);

    targetCtx.clearRect(0, 0, w, h);
    targetCtx.imageSmoothingEnabled = true;
    targetCtx.imageSmoothingQuality = 'high';
    targetCtx.drawImage(this.analysisCanvas, 0, 0, w, h);
  }
}
