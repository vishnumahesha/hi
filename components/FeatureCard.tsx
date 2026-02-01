import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withDelay,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { colors, borderRadius, spacing, shadows } from '@/constants/theme';
import { FEATURE_METADATA, CONFIDENCE_LABELS } from '@/constants';
import { RatingMeter } from './RatingMeter';
import type { Confidence } from '@/types/face-analysis';

interface FeatureCardProps {
  featureKey: string;
  rating: number;
  confidence?: Confidence;
  evidence?: string;
  strengthsPreview?: string[];
  holdingBackPreview?: string[];
  photoLimitations?: string[];
  hasSubFeatures?: boolean;
  onPress: () => void;
  index?: number;
  isPremium?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function FeatureCard({
  featureKey,
  rating,
  confidence = 'medium',
  evidence,
  strengthsPreview = [],
  holdingBackPreview = [],
  photoLimitations = [],
  hasSubFeatures = false,
  onPress,
  index = 0,
  isPremium = false,
}: FeatureCardProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  const feature = FEATURE_METADATA[featureKey] || {
    label: featureKey,
    icon: '✨',
    description: '',
  };

  const confidenceConfig = CONFIDENCE_LABELS[confidence];

  React.useEffect(() => {
    const delay = index * 80;
    scale.value = withDelay(delay, withSpring(1, { damping: 15, stiffness: 100 }));
    opacity.value = withDelay(delay, withSpring(1));
  }, [index, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const getRatingColor = () => {
    if (rating <= 3) return colors.rating.low;
    if (rating <= 5) return colors.warning;
    if (rating <= 7) return colors.rating.good;
    return colors.rating.excellent;
  };

  // Determine if this is a strength or weakness
  const isStrength = rating >= 6;
  const isWeakness = rating < 5;

  return (
    <AnimatedTouchable
      style={[styles.container, animatedStyle]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{feature.icon}</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{feature.label}</Text>
          {/* Score context */}
          <Text style={[styles.scoreContext, { color: getRatingColor() }]}>
            {rating <= 4 ? 'Below avg' : rating <= 5.5 ? 'Average' : rating <= 7 ? 'Above avg' : 'Strong'}
          </Text>
        </View>
        <View style={styles.ratingSection}>
          <View style={[styles.ratingBadge, { borderColor: getRatingColor() }]}>
            <Text style={[styles.ratingText, { color: getRatingColor() }]}>
              {rating.toFixed(1)}
            </Text>
          </View>
          {/* Confidence indicator */}
          <View style={styles.confidenceRow}>
            <View style={[styles.confidenceDot, { backgroundColor: confidenceConfig.color }]} />
            <Text style={[styles.confidenceText, { color: confidenceConfig.color }]}>
              {confidence}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.meterContainer}>
        <RatingMeter rating={rating} size="small" showLabel={false} delay={index * 80 + 150} />
      </View>

      {/* Evidence - WHY this rating */}
      {evidence && (
        <View style={styles.evidenceContainer}>
          <Text style={styles.evidenceLabel}>Why this score:</Text>
          <Text style={styles.evidenceText} numberOfLines={2}>
            {evidence}
          </Text>
        </View>
      )}

      {/* Confidence warning if not high */}
      {confidence !== 'high' && photoLimitations.length > 0 && (
        <View style={styles.limitationContainer}>
          <Text style={styles.limitationIcon}>⚠️</Text>
          <Text style={styles.limitationText} numberOfLines={1}>
            {photoLimitations[0]}
          </Text>
        </View>
      )}

      {/* Quick summary - strength or area for improvement */}
      {(strengthsPreview.length > 0 || holdingBackPreview.length > 0) && (
        <View style={styles.summaryContainer}>
          {isStrength && strengthsPreview.length > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryIcon}>💪</Text>
              <Text style={styles.summaryTextStrength} numberOfLines={1}>
                {strengthsPreview[0]}
              </Text>
            </View>
          )}
          {isWeakness && holdingBackPreview.length > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryIcon}>🎯</Text>
              <Text style={styles.summaryTextWeakness} numberOfLines={1}>
                {holdingBackPreview[0]}
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.tapHint}>Tap for fixes →</Text>
          {hasSubFeatures && isPremium && (
            <View style={styles.subFeaturesBadge}>
              <Text style={styles.subFeaturesText}>+{feature.subFeatures?.length || 0} breakdown</Text>
            </View>
          )}
        </View>
        {isPremium && feature.premiumOnly && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>PRO</Text>
          </View>
        )}
      </View>

      {/* Colored accent based on rating */}
      <View
        style={[
          styles.accentBar,
          { backgroundColor: getRatingColor() },
        ]}
      />
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
    overflow: 'hidden',
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  scoreContext: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  ratingSection: {
    alignItems: 'flex-end',
    gap: 4,
  },
  ratingBadge: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '700',
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  confidenceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  confidenceText: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  meterContainer: {
    marginBottom: spacing.sm,
  },
  evidenceContainer: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  evidenceLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  evidenceText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  limitationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: `${colors.warning}10`,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  limitationIcon: {
    fontSize: 12,
  },
  limitationText: {
    flex: 1,
    fontSize: 11,
    color: colors.warning,
  },
  summaryContainer: {
    marginBottom: spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  summaryIcon: {
    fontSize: 12,
  },
  summaryTextStrength: {
    flex: 1,
    fontSize: 12,
    color: colors.success,
  },
  summaryTextWeakness: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tapHint: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  subFeaturesBadge: {
    backgroundColor: `${colors.accent}20`,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  subFeaturesText: {
    fontSize: 10,
    color: colors.accent,
    fontWeight: '500',
  },
  premiumBadge: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderTopLeftRadius: borderRadius.lg,
    borderBottomLeftRadius: borderRadius.lg,
  },
});
