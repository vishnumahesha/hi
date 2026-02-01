import type { PhotoQualityCheck, PhotoQualityIssue } from '@/types/face-analysis';

/**
 * Client-side photo quality checking utilities
 * These provide basic heuristics before sending to the AI
 */

export interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * Check if image resolution is sufficient
 */
export function checkResolution(dimensions: ImageDimensions): {
  isValid: boolean;
  issue?: PhotoQualityIssue;
} {
  const MIN_WIDTH = 300;
  const MIN_HEIGHT = 400;

  if (dimensions.width < MIN_WIDTH || dimensions.height < MIN_HEIGHT) {
    return { isValid: false, issue: 'low_resolution' };
  }
  return { isValid: true };
}

/**
 * Check aspect ratio for portrait orientation
 */
export function checkAspectRatio(dimensions: ImageDimensions): {
  isValid: boolean;
  warning?: string;
} {
  const aspectRatio = dimensions.width / dimensions.height;
  const idealRatio = 3 / 4; // Portrait orientation
  const tolerance = 0.3;

  if (Math.abs(aspectRatio - idealRatio) > tolerance) {
    return {
      isValid: true, // Still valid, just not ideal
      warning: 'Image aspect ratio may affect analysis accuracy',
    };
  }
  return { isValid: true };
}

/**
 * Calculate overall quality score based on available checks
 * Note: In a production app, you would use ML-based face detection
 */
export function calculateQualityScore(checks: {
  hasResolution: boolean;
  hasGoodAspect: boolean;
  hasFrontPhoto: boolean;
  hasSidePhoto: boolean;
}): number {
  let score = 50; // Base score

  if (checks.hasResolution) score += 20;
  if (checks.hasGoodAspect) score += 10;
  if (checks.hasFrontPhoto) score += 10;
  if (checks.hasSidePhoto) score += 10;

  return Math.min(100, score);
}

/**
 * Run all quality checks on an image
 */
export function runQualityChecks(params: {
  dimensions?: ImageDimensions;
  hasFrontPhoto: boolean;
  hasSidePhoto: boolean;
}): PhotoQualityCheck {
  const issues: PhotoQualityIssue[] = [];
  const warnings: string[] = [];

  // Check resolution if dimensions provided
  if (params.dimensions) {
    const resCheck = checkResolution(params.dimensions);
    if (!resCheck.isValid && resCheck.issue) {
      issues.push(resCheck.issue);
    }

    const aspectCheck = checkAspectRatio(params.dimensions);
    if (aspectCheck.warning) {
      warnings.push(aspectCheck.warning);
    }
  }

  // Check for side photo
  if (!params.hasSidePhoto) {
    issues.push('side_missing');
    warnings.push('Side photo recommended for better accuracy');
  }

  // Calculate score
  const score = calculateQualityScore({
    hasResolution: params.dimensions ? issues.indexOf('low_resolution') === -1 : true,
    hasGoodAspect: true,
    hasFrontPhoto: params.hasFrontPhoto,
    hasSidePhoto: params.hasSidePhoto,
  });

  return {
    isValid: issues.filter(i => i !== 'side_missing').length === 0,
    score,
    issues,
    warnings,
  };
}

/**
 * Format quality issue for display
 */
export function formatQualityIssue(issue: PhotoQualityIssue): string {
  const messages: Record<PhotoQualityIssue, string> = {
    too_dark: 'Image is too dark. Try better lighting.',
    too_bright: 'Image is overexposed. Reduce brightness.',
    not_centered: 'Face is not centered in frame.',
    low_resolution: 'Image resolution is too low.',
    multiple_faces: 'Multiple faces detected.',
    no_face_detected: 'No face detected in image.',
    side_missing: 'Side profile photo recommended.',
    blurry: 'Image is blurry.',
    heavy_filter: 'Heavy filter detected. Use unfiltered photo.',
    angle_distortion: 'Selfie angle detected. Symmetry may be affected.',
    inconsistent_lighting: 'Uneven lighting on face.',
    partial_face: 'Part of face is cropped out.',
  };

  return messages[issue] || issue;
}
