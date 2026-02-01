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
  strengthsPreview?: string[];
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
  strengthsPreview = [],
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
    const delay = index * 100;
    scale.value = withDelay(delay, withSpring(1, { damping: 15, stiffness: 100 }));
    opacity.value = withDelay(delay, withSpring(1));
  }, [index, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const getRatingColor = () => {
    if (rating <= 3) return colors.rating.low;
    if (rating <= 6) return colors.rating.medium;
    if (rating <= 8) return colors.rating.good;
    return colors.rating.excellent;
  };

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
          <Text style={styles.description}>{feature.description}</Text>
        </View>
        <View style={styles.ratingSection}>
          <View style={styles.ratingBadge}>
            <Text style={[styles.ratingText, { color: getRatingColor() }]}>
              {rating.toFixed(1)}
            </Text>
          </View>
          {/* Confidence indicator */}
          <View style={[styles.confidenceDot, { backgroundColor: confidenceConfig.color }]} />
        </View>
      </View>

      <View style={styles.meterContainer}>
        <RatingMeter rating={rating} size="small" showLabel={false} delay={index * 100 + 200} />
      </View>

      {/* Confidence note if not high */}
      {confidence !== 'high' && photoLimitations.length > 0 && (
        <View style={styles.limitationContainer}>
          <Text style={styles.limitationIcon}>ℹ️</Text>
          <Text style={styles.limitationText} numberOfLines={1}>
            {photoLimitations[0]}
          </Text>
        </View>
      )}

      {/* Preview text */}
      {strengthsPreview.length > 0 && confidence === 'high' && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewText} numberOfLines={2}>
            {strengthsPreview[0]}
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.tapHint}>Tap for details</Text>
          {hasSubFeatures && isPremium && (
            <View style={styles.subFeaturesBadge}>
              <Text style={styles.subFeaturesText}>+{feature.subFeatures?.length || 0} sub-features</Text>
            </View>
          )}
        </View>
        <View style={styles.footerRight}>
          {isPremium && feature.premiumOnly && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>PRO</Text>
            </View>
          )}
          <Text style={[styles.confidenceLabel, { color: confidenceConfig.color }]}>
            {confidenceConfig.icon}
          </Text>
        </View>
      </View>

      {/* Decorative glow */}
      <View
        style={[
          styles.glow,
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
    alignItems: 'center',
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
  description: {
    fontSize: 12,
    color: colors.textMuted,
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
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '700',
  },
  confidenceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  meterContainer: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  limitationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: `${colors.warning}15`,
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
  previewContainer: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  previewText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
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
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  tapHint: {
    fontSize: 12,
    color: colors.textMuted,
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
  confidenceLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  glow: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.1,
  },
});
