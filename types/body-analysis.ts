import { z } from 'zod';

// Body feature keys
export const BODY_FEATURE_KEYS = [
  'leanness',
  'v_taper',
  'posture',
  'upper_body_balance',
  'lower_body_balance',
  'core_presentation',
] as const;
export type BodyFeatureKey = (typeof BODY_FEATURE_KEYS)[number];

// Shared types with face analysis
export const ConfidenceSchema = z.enum(['low', 'medium', 'high']);
export type Confidence = z.infer<typeof ConfidenceSchema>;

export const DepthSchema = z.enum(['free', 'premium']);
export type Depth = z.infer<typeof DepthSchema>;

export const DifficultySchema = z.enum(['easy', 'moderate', 'difficult']);
export type Difficulty = z.infer<typeof DifficultySchema>;

export const ImpactSchema = z.enum(['low', 'medium', 'high']);
export type Impact = z.infer<typeof ImpactSchema>;

// Photo quality issues specific to body
export const BodyPhotoQualityIssueSchema = z.enum([
  'too_dark',
  'too_bright',
  'not_full_body',
  'baggy_clothes',
  'pose_inconsistent',
  'side_missing',
  'blurry',
  'angle_distortion',
  'inconsistent_lighting',
  'background_cluttered',
]);
export type BodyPhotoQualityIssue = z.infer<typeof BodyPhotoQualityIssueSchema>;

// Photo quality schema
export const BodyPhotoQualitySchema = z.object({
  score: z.number().min(0).max(100),
  issues: z.array(BodyPhotoQualityIssueSchema),
});
export type BodyPhotoQuality = z.infer<typeof BodyPhotoQualitySchema>;

// Improvement lever (same pattern as face)
export const BodyImprovementLeverSchema = z.object({
  title: z.string(),
  why: z.string(),
  impact: ImpactSchema,
  timeline: z.string(),
});
export type BodyImprovementLever = z.infer<typeof BodyImprovementLeverSchema>;

// Fix schema for body
export const BodyFixSchema = z.object({
  title: z.string(),
  type: z.enum(['workout', 'nutrition', 'mobility', 'routine', 'posture']),
  difficulty: DifficultySchema,
  timeToSeeChange: z.string(),
  steps: z.array(z.string()),
});
export type BodyFix = z.infer<typeof BodyFixSchema>;

// Body feature schema
export const BodyFeatureSchema = z.object({
  key: z.string(),
  label: z.string().optional(),
  rating10: z.number().min(0).max(10),
  confidence: ConfidenceSchema,
  strengths: z.array(z.string()),
  limitations: z.array(z.string()),
  why: z.array(z.string()).optional(),
  evidence: z.string().optional(),
  fixes: z.array(BodyFixSchema).optional(),
});
export type BodyFeature = z.infer<typeof BodyFeatureSchema>;

// Overall body rating
export const BodyOverallSchema = z.object({
  currentScore10: z.number().min(0).max(10),
  potentialScore10: z.number().min(0).max(10),
  confidence: ConfidenceSchema,
  summary: z.string(),
  calibrationNote: z.string().optional(),
});
export type BodyOverall = z.infer<typeof BodyOverallSchema>;

// Top levers for body
export const BodyTopLeverSchema = z.object({
  lever: z.string(),
  title: z.string().optional(),
  delta: z.number(),
  timeline: z.string(),
  priority: z.number().optional(),
  why: z.string().optional(),
  impact: ImpactSchema.optional(),
});
export type BodyTopLever = z.infer<typeof BodyTopLeverSchema>;

// Measurements from pose estimation
export const PostureAngleSchema = z.object({
  value: z.number(),
  confidence: ConfidenceSchema,
  note: z.string(),
});
export type PostureAngle = z.infer<typeof PostureAngleSchema>;

export const BodyMeasurementsSchema = z.object({
  shoulderToWaistRatio: z.object({
    value: z.number(),
    confidence: ConfidenceSchema,
    note: z.string(),
  }).optional(),
  posture: z.object({
    forwardHead: PostureAngleSchema.optional(),
    roundedShoulders: PostureAngleSchema.optional(),
    anteriorPelvicTilt: PostureAngleSchema.optional(),
  }).optional(),
  symmetry: z.object({
    shoulderHeight: z.string().optional(),
    hipAlignment: z.string().optional(),
  }).optional(),
});
export type BodyMeasurements = z.infer<typeof BodyMeasurementsSchema>;

// Pose overlay for visualization
export const KeypointSchema = z.object({
  name: z.string(),
  x: z.number(),
  y: z.number(),
});
export type Keypoint = z.infer<typeof KeypointSchema>;

export const KeyLineSchema = z.object({
  name: z.string(),
  a: z.object({ x: z.number(), y: z.number() }),
  b: z.object({ x: z.number(), y: z.number() }),
});
export type KeyLine = z.infer<typeof KeyLineSchema>;

export const PoseOverlaySchema = z.object({
  normalized: z.boolean(),
  keypoints: z.array(KeypointSchema).optional(),
  keyLines: z.array(KeyLineSchema).optional(),
  renderHint: z.enum(['free_keylines_only', 'full_overlay', 'minimal']).optional(),
});
export type PoseOverlay = z.infer<typeof PoseOverlaySchema>;

// Plan hooks for workout/nutrition integration
export const PlanHooksSchema = z.object({
  workoutFocus: z.array(z.string()),
  nutritionFocus: z.array(z.string()),
});
export type PlanHooks = z.infer<typeof PlanHooksSchema>;

// Safety/disclaimer
export const BodySafetySchema = z.object({
  disclaimer: z.string(),
  tone: z.enum(['neutral', 'constructive']),
});
export type BodySafety = z.infer<typeof BodySafetySchema>;

// Tier schema
export const BodyTierSchema = z.object({
  isPremium: z.boolean(),
  depth: DepthSchema,
});
export type BodyTier = z.infer<typeof BodyTierSchema>;

// Potential schema (same pattern as face)
export const BodyPotentialSchema = z.object({
  totalPossibleGain: z.number(),
  deltas: z.array(z.object({
    lever: z.string(),
    currentIssue: z.string(),
    delta: z.number(),
    potentialGain: z.string(),
    timeline: z.string(),
    difficulty: DifficultySchema,
    steps: z.array(z.string()),
  })).optional(),
  top3Levers: z.array(BodyTopLeverSchema).optional(),
  timelineToFullPotential: z.string().optional(),
});
export type BodyPotential = z.infer<typeof BodyPotentialSchema>;

// Full body analysis response
export const BodyAnalysisResponseSchema = z.object({
  tier: BodyTierSchema,
  inputs: z.object({
    gender: z.enum(['male', 'female']),
    sideProvided: z.boolean(),
    height: z.string().optional(),
    weight: z.string().optional(),
    gymAccess: z.string().optional(),
    goal: z.string().optional(),
  }),
  photoQuality: BodyPhotoQualitySchema,
  overall: BodyOverallSchema,
  potential: BodyPotentialSchema.optional(),
  topLevers: z.array(BodyTopLeverSchema).optional(),
  features: z.array(BodyFeatureSchema),
  measurements: BodyMeasurementsSchema.optional(),
  poseOverlay: PoseOverlaySchema.optional(),
  planHooks: PlanHooksSchema.optional(),
  safety: BodySafetySchema,
});
export type BodyAnalysisResponse = z.infer<typeof BodyAnalysisResponseSchema>;

// Request type for body analysis
export interface BodyAnalysisRequest {
  frontImage: string;
  sideImage?: string;
  gender: 'male' | 'female';
  height?: string;
  weight?: string;
  gymAccess?: string;
  goal?: string;
  premiumEnabled: boolean;
}

// Feature metadata for UI
export interface BodyFeatureMetadata {
  key: string;
  label: string;
  icon: string;
  description: string;
  maxDelta?: number;
}

export const BODY_FEATURE_METADATA: Record<string, BodyFeatureMetadata> = {
  leanness: {
    key: 'leanness',
    label: 'Leanness / Body Fat',
    icon: '🔥',
    description: 'Overall body fat presentation and definition',
    maxDelta: 1.5,
  },
  v_taper: {
    key: 'v_taper',
    label: 'V-Taper (Shoulder:Waist)',
    icon: '📐',
    description: 'Shoulder-to-waist ratio and upper body width',
    maxDelta: 1.0,
  },
  posture: {
    key: 'posture',
    label: 'Posture',
    icon: '🧘',
    description: 'Spine alignment, shoulder position, head carriage',
    maxDelta: 0.8,
  },
  upper_body_balance: {
    key: 'upper_body_balance',
    label: 'Upper Body Balance',
    icon: '💪',
    description: 'Chest, back, and shoulder development balance',
    maxDelta: 0.8,
  },
  lower_body_balance: {
    key: 'lower_body_balance',
    label: 'Lower Body Balance',
    icon: '🦵',
    description: 'Quad, hamstring, and glute development',
    maxDelta: 0.8,
  },
  core_presentation: {
    key: 'core_presentation',
    label: 'Core Presentation',
    icon: '🎯',
    description: 'Midsection appearance and waist definition',
    maxDelta: 0.6,
  },
};

// Score context for body (same scale as face for consistency)
export const BODY_SCORE_CONTEXT = {
  1: 'Significantly below average',
  2: 'Well below average',
  3: 'Below average',
  4: 'Slightly below average',
  5: 'Average',
  6: 'Slightly above average',
  7: 'Above average (top 30%)',
  8: 'Well above average (top 15%)',
  9: 'Exceptional (top 5%)',
  10: 'Elite level (top 1%)',
};
