export * from './theme';
import { FEATURE_METADATA } from '@/types/face-analysis';

export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

// Re-export feature metadata for convenience
export { FEATURE_METADATA };

// Legacy support - map to new structure
export const FEATURE_LABELS: Record<string, { label: string; icon: string; description: string }> = 
  Object.fromEntries(
    Object.entries(FEATURE_METADATA).map(([key, meta]) => [
      key,
      { label: meta.label, icon: meta.icon, description: meta.description }
    ])
  );

export const FIX_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  no_cost: {
    label: 'Free',
    color: '#10B981',
  },
  low_cost: {
    label: 'Low Cost',
    color: '#F59E0B',
  },
  procedural: {
    label: 'Procedural',
    color: '#8B5CF6',
  },
};

export const DIFFICULTY_LABELS: Record<string, { label: string; color: string }> = {
  easy: {
    label: 'Easy',
    color: '#10B981',
  },
  moderate: {
    label: 'Moderate',
    color: '#F59E0B',
  },
  difficult: {
    label: 'Difficult',
    color: '#EF4444',
  },
};

export const IMPACT_LABELS: Record<string, { label: string; color: string }> = {
  low: {
    label: 'Low Impact',
    color: '#71717A',
  },
  medium: {
    label: 'Medium Impact',
    color: '#F59E0B',
  },
  high: {
    label: 'High Impact',
    color: '#10B981',
  },
};

export const CONFIDENCE_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  high: {
    label: 'High Confidence',
    color: '#10B981',
    icon: '✓',
  },
  medium: {
    label: 'Medium Confidence',
    color: '#F59E0B',
    icon: '~',
  },
  low: {
    label: 'Low Confidence',
    color: '#EF4444',
    icon: '!',
  },
};

export const PHOTO_TIPS = {
  front: [
    'Face the camera directly',
    'Keep a neutral expression',
    'Ensure even lighting on both sides',
    'Remove glasses and keep hair off face',
    'Position camera at eye level',
    'Avoid heavy filters or editing',
  ],
  side: [
    'Turn 90 degrees to show your profile',
    'Keep chin parallel to the ground',
    'Ensure your ear is visible',
    'Good lighting on the visible side',
    'Stay relaxed with neutral expression',
  ],
};

export const QUALITY_ISSUE_MESSAGES: Record<string, string> = {
  too_dark: 'The image is too dark. Please use better lighting.',
  too_bright: 'The image is overexposed. Please reduce lighting.',
  not_centered: 'Please center your face in the frame.',
  low_resolution: 'Image quality is too low. Please use a higher resolution.',
  multiple_faces: 'Multiple faces detected. Please ensure only you are in frame.',
  no_face_detected: 'No face detected. Please ensure your face is clearly visible.',
  side_missing: 'Side photo recommended for more accurate analysis.',
  blurry: 'Image is blurry. Please hold camera steady.',
  heavy_filter: 'Filters detected. Please use an unfiltered photo.',
  angle_distortion: 'Camera angle may distort measurements. Hold phone at eye level.',
  inconsistent_lighting: 'Uneven lighting affects symmetry analysis accuracy.',
  partial_face: 'Part of your face is cut off. Please include your full face.',
};

// Photo limitation explanations for specific features
export const FEATURE_PHOTO_LIMITATIONS: Record<string, string[]> = {
  symmetry: [
    'Selfie angle can distort true symmetry measurements',
    'Camera lens may introduce slight asymmetry artifacts',
    'Head tilt affects perceived symmetry',
  ],
  proportions: [
    'Distance from camera affects proportion measurements',
    'Lens focal length can alter facial ratios',
    'Standardized photos recommended for accurate measurements',
  ],
  cheekbones: [
    'Lighting significantly affects cheekbone visibility',
    'Soft lighting may understate prominence',
    'Side profile helps assess true projection',
  ],
  chin: [
    'Head angle affects chin projection assessment',
    'Side profile essential for accurate chin analysis',
  ],
  jawline: [
    'Submental area assessment requires neutral head position',
    'Lighting affects perceived definition',
  ],
  skin: [
    'Phone cameras may smooth or alter skin texture',
    'Lighting affects visibility of texture and redness',
  ],
};

// Asymmetry severity labels (non-judgmental)
export const ASYMMETRY_LABELS: Record<string, { label: string; note: string }> = {
  minimal: {
    label: 'Minimal',
    note: 'Within normal variation, typically unnoticeable',
  },
  common: {
    label: 'Common',
    note: 'Present in most faces, part of natural variation',
  },
  noticeable: {
    label: 'Noticeable',
    note: 'More visible but still within normal range',
  },
};
