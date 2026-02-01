import { z } from 'zod';

// Feature keys - expanded categories
export const FEATURE_KEYS = [
  'skin',
  'eye_area',
  'eyebrows',
  'nose',
  'lips',
  'cheekbones',
  'jawline',
  'chin',
  'symmetry',
  'proportions',
  'neck_posture',
  'teeth_smile',
  'forehead_hairline',
] as const;
export type FeatureKey = (typeof FEATURE_KEYS)[number];

// Core feature keys for free tier
export const FREE_FEATURE_KEYS = [
  'skin',
  'eye_area',
  'nose',
  'lips',
  'jawline',
  'cheekbones',
  'harmony',
  'hair',
] as const;

// Fix types
export const FixTypeSchema = z.enum(['no_cost', 'low_cost', 'procedural']);
export type FixType = z.infer<typeof FixTypeSchema>;

export const DifficultySchema = z.enum(['easy', 'moderate', 'difficult']);
export type Difficulty = z.infer<typeof DifficultySchema>;

export const ImpactSchema = z.enum(['low', 'medium', 'high']);
export type Impact = z.infer<typeof ImpactSchema>;

export const ConfidenceSchema = z.enum(['low', 'medium', 'high']);
export type Confidence = z.infer<typeof ConfidenceSchema>;

export const DepthSchema = z.enum(['free', 'premium']);
export type Depth = z.infer<typeof DepthSchema>;

// Photo quality issues
export const PhotoQualityIssueSchema = z.enum([
  'too_dark',
  'too_bright',
  'not_centered',
  'low_resolution',
  'multiple_faces',
  'no_face_detected',
  'side_missing',
  'blurry',
  'heavy_filter',
  'angle_distortion',
  'inconsistent_lighting',
  'partial_face',
]);
export type PhotoQualityIssue = z.infer<typeof PhotoQualityIssueSchema>;

// Photo limitation reasons (for accurate confidence reporting)
export const PhotoLimitationSchema = z.object({
  feature: z.string(),
  limitation: z.string(),
  impact: z.enum(['minor', 'moderate', 'significant']),
});
export type PhotoLimitation = z.infer<typeof PhotoLimitationSchema>;

// Sub-feature schema (for premium deep-dive)
export const SubFeatureSchema = z.object({
  name: z.string(),
  rating10: z.number().min(0).max(10),
  note: z.string(),
  isStrength: z.boolean(),
});
export type SubFeature = z.infer<typeof SubFeatureSchema>;

// Fix schema
export const FixSchema = z.object({
  title: z.string(),
  type: FixTypeSchema,
  difficulty: DifficultySchema,
  timeToSeeChange: z.string(),
  steps: z.array(z.string()),
});
export type Fix = z.infer<typeof FixSchema>;

// Enhanced Feature schema with confidence and sub-features
export const FeatureSchema = z.object({
  key: z.string(),
  label: z.string(),
  rating10: z.number().min(0).max(10),
  confidence: ConfidenceSchema,
  photoLimitations: z.array(z.string()).optional(),
  strengths: z.array(z.string()),
  imperfections: z.array(z.string()),
  why: z.array(z.string()),
  subFeatures: z.array(SubFeatureSchema).optional(), // Premium only
  fixes: z.array(FixSchema),
});
export type Feature = z.infer<typeof FeatureSchema>;

// Top fix schema
export const TopFixSchema = z.object({
  title: z.string(),
  why: z.string(),
  impact: ImpactSchema,
  steps: z.array(z.string()),
});
export type TopFix = z.infer<typeof TopFixSchema>;

// Photo quality schema
export const PhotoQualitySchema = z.object({
  score: z.number().min(0).max(100),
  issues: z.array(PhotoQualityIssueSchema),
  limitations: z.array(PhotoLimitationSchema).optional(),
});
export type PhotoQuality = z.infer<typeof PhotoQualitySchema>;

// Overall rating schema with enhanced confidence
export const OverallSchema = z.object({
  rating10: z.number().min(0).max(10),
  confidence: ConfidenceSchema,
  confidenceNote: z.string().optional(),
  summary: z.string(),
});
export type Overall = z.infer<typeof OverallSchema>;

// Harmony schema - enhanced
export const HarmonySchema = z.object({
  rating10: z.number().min(0).max(10),
  confidence: ConfidenceSchema,
  notes: z.array(z.string()),
  facialThirds: z.object({
    upper: z.string(),
    middle: z.string(),
    lower: z.string(),
    balance: z.string(),
  }).optional(),
});
export type Harmony = z.infer<typeof HarmonySchema>;

// Hair schema
export const HairSchema = z.object({
  rating10: z.number().min(0).max(10),
  confidence: ConfidenceSchema,
  notes: z.array(z.string()),
  suggestions: z.array(z.string()),
});
export type Hair = z.infer<typeof HairSchema>;

// Symmetry analysis (new)
export const SymmetrySchema = z.object({
  rating10: z.number().min(0).max(10),
  confidence: ConfidenceSchema,
  photoLimitation: z.string().optional(),
  notes: z.array(z.string()),
  asymmetries: z.array(z.object({
    area: z.string(),
    description: z.string(),
    severity: z.enum(['minimal', 'common', 'noticeable']),
  })).optional(),
});
export type Symmetry = z.infer<typeof SymmetrySchema>;

// Safety schema
export const SafetySchema = z.object({
  disclaimer: z.string(),
  tone: z.literal('neutral'),
  photoDisclaimer: z.string().optional(),
});
export type Safety = z.infer<typeof SafetySchema>;

// Tier schema
export const TierSchema = z.object({
  isPremium: z.boolean(),
  depth: DepthSchema,
});
export type Tier = z.infer<typeof TierSchema>;

// Full response schema - enhanced
export const FaceAnalysisResponseSchema = z.object({
  photoQuality: PhotoQualitySchema,
  overall: OverallSchema,
  features: z.array(FeatureSchema),
  harmony: HarmonySchema,
  symmetry: SymmetrySchema.optional(),
  hair: HairSchema,
  topFixes: z.array(TopFixSchema),
  safety: SafetySchema,
  tier: TierSchema,
});
export type FaceAnalysisResponse = z.infer<typeof FaceAnalysisResponseSchema>;

// Request types
export type Gender = 'male' | 'female';

export interface AnalysisRequest {
  frontImage: string; // base64
  sideImage?: string; // base64, optional
  gender: Gender;
  premiumEnabled: boolean;
}

// Photo quality check result (client-side)
export interface PhotoQualityCheck {
  isValid: boolean;
  score: number;
  issues: PhotoQualityIssue[];
  warnings: string[];
}

// Scan history item
export interface ScanHistoryItem {
  id: string;
  timestamp: number;
  overallRating: number;
  frontImageUri: string;
  sideImageUri?: string;
}

// Feature metadata for UI
export interface FeatureMetadata {
  key: string;
  label: string;
  icon: string;
  description: string;
  subFeatures?: string[];
  premiumOnly?: boolean;
}

export const FEATURE_METADATA: Record<string, FeatureMetadata> = {
  skin: {
    key: 'skin',
    label: 'Skin Quality',
    icon: '✨',
    description: 'Texture, clarity, and overall skin health',
    subFeatures: ['Texture/Acne', 'Redness', 'Dark circles', 'Oiliness/Dryness', 'Pigmentation'],
  },
  eye_area: {
    key: 'eye_area',
    label: 'Eye Area',
    icon: '👁️',
    description: 'Periorbital region and eye appearance',
    subFeatures: ['Under-eye darkness', 'Puffiness', 'Eyelid show', 'Eye openness', 'Brow-to-eye distance'],
  },
  eyebrows: {
    key: 'eyebrows',
    label: 'Eyebrows',
    icon: '🎯',
    description: 'Shape, symmetry, and framing',
    subFeatures: ['Thickness', 'Symmetry', 'Shape/Arch', 'Spacing', 'Grooming'],
    premiumOnly: true,
  },
  nose: {
    key: 'nose',
    label: 'Nose',
    icon: '👃',
    description: 'Proportion, shape, and profile',
    subFeatures: ['Bridge', 'Tip', 'Nostrils', 'Projection', 'Width'],
  },
  lips: {
    key: 'lips',
    label: 'Lips',
    icon: '👄',
    description: 'Shape, fullness, and definition',
    subFeatures: ['Upper lip', 'Lower lip', 'Cupids bow', 'Symmetry', 'Hydration'],
  },
  cheekbones: {
    key: 'cheekbones',
    label: 'Cheekbones',
    icon: '💎',
    description: 'Projection and facial contour',
    subFeatures: ['Prominence', 'Position', 'Definition', 'Hollows'],
  },
  jawline: {
    key: 'jawline',
    label: 'Jawline',
    icon: '💪',
    description: 'Definition and mandibular angle',
    subFeatures: ['Definition', 'Gonial angle', 'Width', 'Symmetry'],
  },
  chin: {
    key: 'chin',
    label: 'Chin',
    icon: '📐',
    description: 'Projection and proportion',
    subFeatures: ['Forward projection', 'Height', 'Width', 'Symmetry'],
    premiumOnly: true,
  },
  symmetry: {
    key: 'symmetry',
    label: 'Facial Symmetry',
    icon: '⚖️',
    description: 'Balance between left and right',
    subFeatures: ['Eye alignment', 'Nose deviation', 'Smile symmetry', 'Overall balance'],
  },
  proportions: {
    key: 'proportions',
    label: 'Facial Proportions',
    icon: '📏',
    description: 'Facial thirds and measurements',
    subFeatures: ['Upper third', 'Middle third', 'Lower third', 'Golden ratio'],
    premiumOnly: true,
  },
  neck_posture: {
    key: 'neck_posture',
    label: 'Neck & Posture',
    icon: '🧘',
    description: 'Head position and neck angle',
    subFeatures: ['Forward head posture', 'Neck angle', 'Shoulder position'],
    premiumOnly: true,
  },
  teeth_smile: {
    key: 'teeth_smile',
    label: 'Teeth & Smile',
    icon: '😁',
    description: 'Smile appearance (if visible)',
    subFeatures: ['Whiteness', 'Alignment', 'Smile symmetry', 'Gum show'],
    premiumOnly: true,
  },
  forehead_hairline: {
    key: 'forehead_hairline',
    label: 'Forehead & Hairline',
    icon: '🌊',
    description: 'Forehead proportions and hairline',
    subFeatures: ['Hairline shape', 'Forehead height', 'Density'],
    premiumOnly: true,
  },
  harmony: {
    key: 'harmony',
    label: 'Overall Harmony',
    icon: '🎭',
    description: 'How features work together',
  },
  hair: {
    key: 'hair',
    label: 'Hair',
    icon: '💇',
    description: 'Style and face framing',
    subFeatures: ['Style', 'Texture', 'Face framing', 'Condition'],
  },
};
