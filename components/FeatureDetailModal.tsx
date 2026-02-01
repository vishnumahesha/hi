import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { colors, borderRadius, spacing, shadows } from '@/constants/theme';
import { FEATURE_METADATA, CONFIDENCE_LABELS, ASYMMETRY_LABELS } from '@/constants';
import { RatingMeter } from './RatingMeter';
import { FixItem } from './ActionList';
import type { Feature, Harmony, Hair, Symmetry, SubFeature } from '@/types/face-analysis';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FeatureDetailModalProps {
  visible: boolean;
  onClose: () => void;
  feature?: Feature | null;
  harmony?: Harmony | null;
  hair?: Hair | null;
  symmetry?: Symmetry | null;
  isPremium?: boolean;
}

function SubFeatureItem({ subFeature, index }: { subFeature: SubFeature; index: number }) {
  const getRatingColor = (rating: number) => {
    if (rating <= 3) return colors.rating.low;
    if (rating <= 6) return colors.rating.medium;
    if (rating <= 8) return colors.rating.good;
    return colors.rating.excellent;
  };

  return (
    <View style={styles.subFeatureItem}>
      <View style={styles.subFeatureHeader}>
        <Text style={styles.subFeatureName}>{subFeature.name}</Text>
        <View style={styles.subFeatureRating}>
          <Text style={[styles.subFeatureScore, { color: getRatingColor(subFeature.rating10) }]}>
            {subFeature.rating10.toFixed(1)}
          </Text>
          {subFeature.isStrength && (
            <View style={styles.strengthBadge}>
              <Text style={styles.strengthBadgeText}>✓</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.subFeatureMeter}>
        <RatingMeter rating={subFeature.rating10} size="small" showLabel={false} delay={index * 50} />
      </View>
      <Text style={styles.subFeatureNote}>{subFeature.note}</Text>
    </View>
  );
}

export function FeatureDetailModal({
  visible,
  onClose,
  feature,
  harmony,
  hair,
  symmetry,
  isPremium = false,
}: FeatureDetailModalProps) {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 100 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 250 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, translateY, opacity]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleClose = () => {
    translateY.value = withTiming(SCREEN_HEIGHT, { duration: 250 }, () => {
      runOnJS(onClose)();
    });
    opacity.value = withTiming(0, { duration: 200 });
  };

  // Determine what content to show
  const isHarmony = !!harmony;
  const isHair = !!hair;
  const isSymmetry = !!symmetry;
  const isFeature = !!feature;

  const featureKey = feature?.key ?? (isHarmony ? 'harmony' : isHair ? 'hair' : 'symmetry');
  const featureInfo = FEATURE_METADATA[featureKey] || { label: featureKey, icon: '✨', description: '' };

  const rating = feature?.rating10 ?? harmony?.rating10 ?? hair?.rating10 ?? symmetry?.rating10 ?? 0;
  const confidence = feature?.confidence ?? harmony?.confidence ?? hair?.confidence ?? symmetry?.confidence ?? 'medium';
  const confidenceConfig = CONFIDENCE_LABELS[confidence];

  const getRatingColor = () => {
    if (rating <= 3) return colors.rating.low;
    if (rating <= 6) return colors.rating.medium;
    if (rating <= 8) return colors.rating.good;
    return colors.rating.excellent;
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
      <View style={styles.container}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            onPress={handleClose}
            activeOpacity={1}
          />
        </Animated.View>

        <Animated.View style={[styles.modal, modalStyle]}>
          <View style={styles.handle} />

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerIcon}>
                <Text style={styles.icon}>{featureInfo.icon}</Text>
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.title}>{featureInfo.label}</Text>
                <Text style={styles.description}>{featureInfo.description}</Text>
              </View>
              <View style={styles.ratingContainer}>
                <Text style={[styles.ratingValue, { color: getRatingColor() }]}>
                  {rating.toFixed(1)}
                </Text>
                <Text style={styles.ratingLabel}>/10</Text>
              </View>
            </View>

            <View style={styles.meterContainer}>
              <RatingMeter rating={rating} size="large" showLabel={false} />
            </View>

            {/* Confidence Badge */}
            <View style={[styles.confidenceBadge, { borderColor: confidenceConfig.color }]}>
              <View style={[styles.confidenceIcon, { backgroundColor: confidenceConfig.color }]}>
                <Text style={styles.confidenceIconText}>{confidenceConfig.icon}</Text>
              </View>
              <View style={styles.confidenceInfo}>
                <Text style={[styles.confidenceLabel, { color: confidenceConfig.color }]}>
                  {confidenceConfig.label}
                </Text>
                {(feature?.photoLimitations?.length ?? 0) > 0 && (
                  <Text style={styles.confidenceNote}>
                    {feature?.photoLimitations?.[0]}
                  </Text>
                )}
                {isSymmetry && symmetry?.photoLimitation && (
                  <Text style={styles.confidenceNote}>{symmetry.photoLimitation}</Text>
                )}
              </View>
            </View>

            {/* Feature specific content */}
            {isFeature && feature && (
              <>
                {/* Sub-features (Premium only) */}
                {isPremium && feature.subFeatures && feature.subFeatures.length > 0 && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionIcon}>📊</Text>
                      <Text style={styles.sectionTitle}>Detailed Breakdown</Text>
                      <View style={styles.proBadge}>
                        <Text style={styles.proBadgeText}>PRO</Text>
                      </View>
                    </View>
                    <View style={styles.subFeaturesList}>
                      {feature.subFeatures.map((sub, idx) => (
                        <SubFeatureItem key={sub.name} subFeature={sub} index={idx} />
                      ))}
                    </View>
                  </View>
                )}

                {/* Strengths */}
                {feature.strengths.length > 0 && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionIcon}>💪</Text>
                      <Text style={styles.sectionTitle}>Strengths</Text>
                    </View>
                    <View style={styles.bulletList}>
                      {feature.strengths.map((strength, idx) => (
                        <View key={idx} style={styles.bulletItem}>
                          <View style={[styles.bullet, { backgroundColor: colors.success }]} />
                          <Text style={styles.bulletText}>{strength}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Imperfections */}
                {feature.imperfections.length > 0 && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionIcon}>🎯</Text>
                      <Text style={styles.sectionTitle}>Areas for Improvement</Text>
                    </View>
                    <View style={styles.bulletList}>
                      {feature.imperfections.map((imp, idx) => (
                        <View key={idx} style={styles.bulletItem}>
                          <View style={[styles.bullet, { backgroundColor: colors.warning }]} />
                          <Text style={styles.bulletText}>{imp}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Why explanations (Premium) */}
                {isPremium && feature.why.length > 0 && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionIcon}>💡</Text>
                      <Text style={styles.sectionTitle}>Why This Matters</Text>
                      <View style={styles.proBadge}>
                        <Text style={styles.proBadgeText}>PRO</Text>
                      </View>
                    </View>
                    <View style={styles.bulletList}>
                      {feature.why.map((why, idx) => (
                        <View key={idx} style={styles.bulletItem}>
                          <View style={[styles.bullet, { backgroundColor: colors.primary }]} />
                          <Text style={styles.bulletText}>{why}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Fixes */}
                {feature.fixes.length > 0 && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionIcon}>🔧</Text>
                      <Text style={styles.sectionTitle}>How to Improve</Text>
                    </View>
                    <View style={styles.fixesList}>
                      {feature.fixes.map((fix, idx) => (
                        <FixItem key={`${fix.title}-${idx}`} fix={fix} index={idx} />
                      ))}
                    </View>
                  </View>
                )}
              </>
            )}

            {/* Symmetry content */}
            {isSymmetry && symmetry && (
              <>
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionIcon}>📝</Text>
                    <Text style={styles.sectionTitle}>Analysis Notes</Text>
                  </View>
                  <View style={styles.bulletList}>
                    {symmetry.notes.map((note, idx) => (
                      <View key={idx} style={styles.bulletItem}>
                        <View style={[styles.bullet, { backgroundColor: colors.primary }]} />
                        <Text style={styles.bulletText}>{note}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Asymmetries list (non-judgmental) */}
                {isPremium && symmetry.asymmetries && symmetry.asymmetries.length > 0 && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionIcon}>⚖️</Text>
                      <Text style={styles.sectionTitle}>Natural Variations</Text>
                      <View style={styles.proBadge}>
                        <Text style={styles.proBadgeText}>PRO</Text>
                      </View>
                    </View>
                    <View style={styles.asymmetriesList}>
                      {symmetry.asymmetries.map((asym, idx) => {
                        const severityInfo = ASYMMETRY_LABELS[asym.severity];
                        return (
                          <View key={idx} style={styles.asymmetryItem}>
                            <View style={styles.asymmetryHeader}>
                              <Text style={styles.asymmetryArea}>{asym.area}</Text>
                              <View style={[styles.severityBadge, { backgroundColor: `${colors.textMuted}20` }]}>
                                <Text style={styles.severityText}>{severityInfo.label}</Text>
                              </View>
                            </View>
                            <Text style={styles.asymmetryDesc}>{asym.description}</Text>
                            <Text style={styles.severityNote}>{severityInfo.note}</Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                )}
              </>
            )}

            {/* Harmony content */}
            {isHarmony && harmony && (
              <>
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionIcon}>📊</Text>
                    <Text style={styles.sectionTitle}>Analysis Notes</Text>
                  </View>
                  <View style={styles.bulletList}>
                    {harmony.notes.map((note, idx) => (
                      <View key={idx} style={styles.bulletItem}>
                        <View style={[styles.bullet, { backgroundColor: colors.primary }]} />
                        <Text style={styles.bulletText}>{note}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Facial thirds (Premium) */}
                {isPremium && harmony.facialThirds && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionIcon}>📏</Text>
                      <Text style={styles.sectionTitle}>Facial Thirds Analysis</Text>
                      <View style={styles.proBadge}>
                        <Text style={styles.proBadgeText}>PRO</Text>
                      </View>
                    </View>
                    <View style={styles.thirdsContainer}>
                      <View style={styles.thirdItem}>
                        <Text style={styles.thirdLabel}>Upper Third</Text>
                        <Text style={styles.thirdValue}>{harmony.facialThirds.upper}</Text>
                      </View>
                      <View style={styles.thirdItem}>
                        <Text style={styles.thirdLabel}>Middle Third</Text>
                        <Text style={styles.thirdValue}>{harmony.facialThirds.middle}</Text>
                      </View>
                      <View style={styles.thirdItem}>
                        <Text style={styles.thirdLabel}>Lower Third</Text>
                        <Text style={styles.thirdValue}>{harmony.facialThirds.lower}</Text>
                      </View>
                      <View style={[styles.thirdItem, styles.thirdItemBalance]}>
                        <Text style={styles.thirdLabel}>Overall Balance</Text>
                        <Text style={styles.thirdValue}>{harmony.facialThirds.balance}</Text>
                      </View>
                    </View>
                  </View>
                )}
              </>
            )}

            {/* Hair content */}
            {isHair && hair && (
              <>
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionIcon}>📝</Text>
                    <Text style={styles.sectionTitle}>Current Assessment</Text>
                  </View>
                  <View style={styles.bulletList}>
                    {hair.notes.map((note, idx) => (
                      <View key={idx} style={styles.bulletItem}>
                        <View style={[styles.bullet, { backgroundColor: colors.success }]} />
                        <Text style={styles.bulletText}>{note}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {hair.suggestions.length > 0 && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionIcon}>💇</Text>
                      <Text style={styles.sectionTitle}>Suggestions</Text>
                    </View>
                    <View style={styles.bulletList}>
                      {hair.suggestions.map((suggestion, idx) => (
                        <View key={idx} style={styles.bulletItem}>
                          <View style={[styles.bullet, { backgroundColor: colors.accent }]} />
                          <Text style={styles.bulletText}>{suggestion}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </>
            )}

            {/* Premium upsell */}
            {!isPremium && (
              <View style={styles.premiumUpsell}>
                <Text style={styles.premiumUpsellIcon}>🔒</Text>
                <Text style={styles.premiumUpsellTitle}>
                  Unlock Full Analysis
                </Text>
                <Text style={styles.premiumUpsellText}>
                  Premium includes detailed sub-feature breakdowns, "why" explanations, and more personalized fixes
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  modal: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: SCREEN_HEIGHT * 0.9,
    ...shadows.lg,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.surfaceLight,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 28,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  description: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  ratingValue: {
    fontSize: 32,
    fontWeight: '800',
  },
  ratingLabel: {
    fontSize: 16,
    color: colors.textMuted,
  },
  meterContainer: {
    marginBottom: spacing.md,
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  confidenceIcon: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confidenceIconText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  confidenceInfo: {
    flex: 1,
  },
  confidenceLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  confidenceNote: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionIcon: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  proBadge: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  proBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1,
  },
  bulletList: {
    gap: spacing.sm,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  fixesList: {
    gap: spacing.sm,
  },
  subFeaturesList: {
    gap: spacing.sm,
  },
  subFeatureItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subFeatureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  subFeatureName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  subFeatureRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  subFeatureScore: {
    fontSize: 16,
    fontWeight: '700',
  },
  strengthBadge: {
    backgroundColor: `${colors.success}20`,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  strengthBadgeText: {
    fontSize: 10,
    color: colors.success,
    fontWeight: '700',
  },
  subFeatureMeter: {
    marginBottom: spacing.xs,
  },
  subFeatureNote: {
    fontSize: 12,
    color: colors.textMuted,
  },
  asymmetriesList: {
    gap: spacing.sm,
  },
  asymmetryItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  asymmetryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  asymmetryArea: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  severityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  severityText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  asymmetryDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  severityNote: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  thirdsContainer: {
    gap: spacing.sm,
  },
  thirdItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  thirdItemBalance: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  thirdLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  },
  thirdValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  premiumUpsell: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderAccent,
    marginTop: spacing.md,
  },
  premiumUpsellIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  premiumUpsellTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  premiumUpsellText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    padding: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  closeButton: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
