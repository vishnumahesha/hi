import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, SlideInUp } from 'react-native-reanimated';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { FEATURE_METADATA, CONFIDENCE_LABELS, SCORE_CONTEXT } from '@/constants';
import { RatingMeter } from './RatingMeter';
import type { Feature, Harmony, Hair, Symmetry, Fix } from '@/types/face-analysis';

interface FeatureDetailModalProps {
  visible: boolean;
  onClose: () => void;
  feature?: Feature | null;
  harmony?: Harmony | null;
  hair?: Hair | null;
  symmetry?: Symmetry | null;
  isPremium?: boolean;
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
  if (!visible) return null;

  // Determine what we're showing
  const isFeature = !!feature;
  const isHarmony = !!harmony;
  const isHair = !!hair;
  const isSymmetry = !!symmetry;

  const featureKey = feature?.key || (isHarmony ? 'harmony' : isHair ? 'hair' : isSymmetry ? 'symmetry' : '');
  const metadata = FEATURE_METADATA[featureKey] || { label: 'Details', icon: '📊', description: '' };

  const rating = feature?.rating10 || harmony?.rating10 || hair?.rating10 || symmetry?.rating10 || 0;
  const confidence = feature?.confidence || harmony?.confidence || hair?.confidence || symmetry?.confidence || 'medium';
  const evidence = feature?.evidence || harmony?.evidence || hair?.evidence || symmetry?.evidence || '';
  const confidenceConfig = CONFIDENCE_LABELS[confidence];

  const getRatingColor = () => {
    if (rating <= 3) return colors.rating.low;
    if (rating <= 5) return colors.warning;
    if (rating <= 7) return colors.rating.good;
    return colors.rating.excellent;
  };

  const scoreContext = SCORE_CONTEXT[Math.round(rating) as keyof typeof SCORE_CONTEXT] || 'Average';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.icon}>{metadata.icon}</Text>
            <View>
              <Text style={styles.title}>{metadata.label}</Text>
              <Text style={styles.subtitle}>{metadata.description}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Rating Section */}
          <Animated.View entering={FadeIn.delay(100)} style={styles.ratingSection}>
            <View style={styles.ratingHeader}>
              <View style={[styles.ratingBadge, { borderColor: getRatingColor() }]}>
                <Text style={[styles.ratingValue, { color: getRatingColor() }]}>
                  {rating.toFixed(1)}
                </Text>
                <Text style={styles.ratingMax}>/10</Text>
              </View>
              <View style={styles.ratingMeta}>
                <Text style={[styles.scoreContext, { color: getRatingColor() }]}>
                  {scoreContext}
                </Text>
                <View style={styles.confidenceRow}>
                  <View style={[styles.confidenceDot, { backgroundColor: confidenceConfig.color }]} />
                  <Text style={[styles.confidenceText, { color: confidenceConfig.color }]}>
                    {confidence} confidence
                  </Text>
                </View>
              </View>
            </View>
            <RatingMeter rating={rating} size="large" showLabel={false} />
          </Animated.View>

          {/* Evidence Section */}
          {evidence && (
            <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
              <Text style={styles.sectionTitle}>📋 Why This Score</Text>
              <View style={styles.evidenceBox}>
                <Text style={styles.evidenceText}>{evidence}</Text>
              </View>
            </Animated.View>
          )}

          {/* Photo Limitations */}
          {(feature?.photoLimitations?.length || symmetry?.photoLimitation) && (
            <Animated.View entering={FadeInDown.delay(250)} style={styles.section}>
              <View style={styles.warningBox}>
                <Text style={styles.warningIcon}>⚠️</Text>
                <View style={styles.warningContent}>
                  <Text style={styles.warningTitle}>Assessment Limitations</Text>
                  {feature?.photoLimitations?.map((lim, idx) => (
                    <Text key={idx} style={styles.warningText}>• {lim}</Text>
                  ))}
                  {symmetry?.photoLimitation && (
                    <Text style={styles.warningText}>• {symmetry.photoLimitation}</Text>
                  )}
                </View>
              </View>
            </Animated.View>
          )}

          {/* Strengths */}
          {isFeature && feature.strengths && feature.strengths.length > 0 && (
            <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
              <Text style={styles.sectionTitle}>💪 What's Strong</Text>
              <View style={styles.bulletList}>
                {feature.strengths.map((strength, idx) => (
                  <View key={idx} style={styles.bulletItem}>
                    <Text style={styles.bulletIcon}>✓</Text>
                    <Text style={styles.bulletText}>{strength}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Holding Back */}
          {isFeature && feature.holdingBack && feature.holdingBack.length > 0 && (
            <Animated.View entering={FadeInDown.delay(350)} style={styles.section}>
              <Text style={styles.sectionTitle}>🎯 What's Holding It Back</Text>
              <View style={styles.bulletList}>
                {feature.holdingBack.map((issue, idx) => (
                  <View key={idx} style={styles.bulletItem}>
                    <Text style={styles.bulletIconMuted}>•</Text>
                    <Text style={styles.bulletTextMuted}>{issue}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Why It Matters */}
          {feature?.whyItMatters && (
            <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
              <Text style={styles.sectionTitle}>💡 Why It Matters</Text>
              <Text style={styles.whyText}>{feature.whyItMatters}</Text>
            </Animated.View>
          )}

          {/* Sub-Features (Premium) */}
          {isPremium && feature?.subFeatures && feature.subFeatures.length > 0 && (
            <Animated.View entering={FadeInDown.delay(450)} style={styles.section}>
              <Text style={styles.sectionTitle}>🔍 Detailed Breakdown</Text>
              <View style={styles.subFeaturesList}>
                {feature.subFeatures.map((sf, idx) => (
                  <View key={idx} style={styles.subFeatureCard}>
                    <View style={styles.subFeatureHeader}>
                      <Text style={styles.subFeatureName}>{sf.name}</Text>
                      <View style={[
                        styles.subFeatureRating,
                        { borderColor: sf.isStrength ? colors.success : colors.textMuted }
                      ]}>
                        <Text style={[
                          styles.subFeatureRatingText,
                          { color: sf.isStrength ? colors.success : colors.textSecondary }
                        ]}>
                          {sf.rating10.toFixed(1)}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.subFeatureNote}>{sf.note}</Text>
                    {sf.evidence && (
                      <Text style={styles.subFeatureEvidence}>Evidence: {sf.evidence}</Text>
                    )}
                  </View>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Facial Thirds (Harmony) */}
          {isPremium && harmony?.facialThirds && (
            <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
              <Text style={styles.sectionTitle}>📐 Facial Thirds Analysis</Text>
              <View style={styles.thirdsContainer}>
                {['upper', 'middle', 'lower'].map((third) => {
                  const data = harmony.facialThirds?.[third as 'upper' | 'middle' | 'lower'];
                  return (
                    <View key={third} style={styles.thirdRow}>
                      <Text style={styles.thirdLabel}>{third.charAt(0).toUpperCase() + third.slice(1)}</Text>
                      <View style={styles.thirdContent}>
                        <Text style={styles.thirdAssessment}>{data?.assessment}</Text>
                        <Text style={styles.thirdBalance}>{data?.balance}</Text>
                      </View>
                    </View>
                  );
                })}
                <View style={styles.overallBalanceBox}>
                  <Text style={styles.overallBalanceText}>
                    {harmony.facialThirds.overallBalance}
                  </Text>
                </View>
              </View>
            </Animated.View>
          )}

          {/* Asymmetries (Symmetry) */}
          {isPremium && symmetry?.asymmetries && symmetry.asymmetries.length > 0 && (
            <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
              <Text style={styles.sectionTitle}>⚖️ Asymmetry Details</Text>
              <View style={styles.asymmetriesList}>
                {symmetry.asymmetries.map((asym, idx) => (
                  <View key={idx} style={styles.asymmetryCard}>
                    <View style={styles.asymmetryHeader}>
                      <Text style={styles.asymmetryArea}>{asym.area}</Text>
                      <View style={[
                        styles.severityBadge,
                        { backgroundColor: getSeverityColor(asym.severity) }
                      ]}>
                        <Text style={styles.severityText}>{asym.severity}</Text>
                      </View>
                    </View>
                    <Text style={styles.asymmetryDesc}>{asym.description}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.normalNote}>
                <Text style={styles.normalNoteText}>
                  Note: Minor asymmetries are completely normal. Perfect symmetry doesn't exist in nature.
                </Text>
              </View>
            </Animated.View>
          )}

          {/* Notes (Harmony/Hair) */}
          {(harmony?.notes || hair?.notes || symmetry?.notes) && (
            <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
              <Text style={styles.sectionTitle}>📝 Observations</Text>
              <View style={styles.bulletList}>
                {(harmony?.notes || hair?.notes || symmetry?.notes)?.map((note, idx) => (
                  <View key={idx} style={styles.bulletItem}>
                    <Text style={styles.bulletIconMuted}>•</Text>
                    <Text style={styles.bulletTextMuted}>{note}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Fixes Section */}
          {isFeature && feature.fixes && (
            <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
              <Text style={styles.sectionTitle}>🛠️ How to Improve</Text>

              {/* Quick Wins */}
              {feature.fixes.quickWins && feature.fixes.quickWins.length > 0 && (
                <View style={styles.fixCategory}>
                  <View style={styles.fixCategoryHeader}>
                    <Text style={styles.fixCategoryIcon}>⚡</Text>
                    <Text style={styles.fixCategoryTitle}>Quick Wins (Today)</Text>
                  </View>
                  {feature.fixes.quickWins.map((fix, idx) => (
                    <FixCard key={idx} fix={fix} />
                  ))}
                </View>
              )}

              {/* Short Term */}
              {feature.fixes.shortTerm && feature.fixes.shortTerm.length > 0 && (
                <View style={styles.fixCategory}>
                  <View style={styles.fixCategoryHeader}>
                    <Text style={styles.fixCategoryIcon}>📅</Text>
                    <Text style={styles.fixCategoryTitle}>2-4 Week Routine</Text>
                  </View>
                  {feature.fixes.shortTerm.map((fix, idx) => (
                    <FixCard key={idx} fix={fix} />
                  ))}
                </View>
              )}

              {/* Medium Term */}
              {feature.fixes.mediumTerm && feature.fixes.mediumTerm.length > 0 && (
                <View style={styles.fixCategory}>
                  <View style={styles.fixCategoryHeader}>
                    <Text style={styles.fixCategoryIcon}>🎯</Text>
                    <Text style={styles.fixCategoryTitle}>8-12 Week Changes</Text>
                  </View>
                  {feature.fixes.mediumTerm.map((fix, idx) => (
                    <FixCard key={idx} fix={fix} />
                  ))}
                </View>
              )}

              {/* Pro Options (Premium Only) */}
              {isPremium && feature.fixes.proOptions && feature.fixes.proOptions.length > 0 && (
                <View style={styles.fixCategory}>
                  <View style={styles.fixCategoryHeader}>
                    <Text style={styles.fixCategoryIcon}>💎</Text>
                    <Text style={styles.fixCategoryTitle}>Professional Options</Text>
                    <View style={styles.infoOnlyBadge}>
                      <Text style={styles.infoOnlyText}>Info only</Text>
                    </View>
                  </View>
                  {feature.fixes.proOptions.map((fix, idx) => (
                    <FixCard key={idx} fix={fix} isPro />
                  ))}
                </View>
              )}
            </Animated.View>
          )}

          {/* Hair Suggestions */}
          {isHair && hair.suggestions && hair.suggestions.length > 0 && (
            <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
              <Text style={styles.sectionTitle}>💇 Suggestions</Text>
              <View style={styles.bulletList}>
                {hair.suggestions.map((suggestion, idx) => (
                  <View key={idx} style={styles.bulletItem}>
                    <Text style={styles.bulletIcon}>→</Text>
                    <Text style={styles.bulletText}>{suggestion}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

function FixCard({ fix, isPro = false }: { fix: Fix; isPro?: boolean }) {
  return (
    <View style={[styles.fixCard, isPro && styles.fixCardPro]}>
      <View style={styles.fixHeader}>
        <Text style={styles.fixTitle}>{fix.title}</Text>
        <View style={styles.fixMeta}>
          <View style={[styles.typeBadge, getTypeBadgeStyle(fix.type)]}>
            <Text style={styles.typeBadgeText}>{getTypeLabel(fix.type)}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.fixTimeline}>
        <Text style={styles.fixTimelineIcon}>⏱️</Text>
        <Text style={styles.fixTimelineText}>{fix.timeline}</Text>
        <Text style={styles.fixDifficulty}>• {fix.difficulty}</Text>
      </View>
      
      {fix.expectedImpact && (
        <View style={styles.impactRow}>
          <Text style={styles.impactLabel}>Expected:</Text>
          <Text style={styles.impactText}>{fix.expectedImpact}</Text>
        </View>
      )}
      
      <View style={styles.stepsList}>
        {fix.steps.map((step, idx) => (
          <View key={idx} style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{idx + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case 'minimal':
      return `${colors.success}20`;
    case 'common':
      return `${colors.warning}20`;
    case 'noticeable':
      return `${colors.rating.low}20`;
    default:
      return colors.surfaceLight;
  }
}

function getTypeBadgeStyle(type: string) {
  switch (type) {
    case 'no_cost':
      return { backgroundColor: `${colors.success}20`, borderColor: colors.success };
    case 'low_cost':
      return { backgroundColor: `${colors.warning}20`, borderColor: colors.warning };
    case 'procedural':
      return { backgroundColor: `${colors.primary}20`, borderColor: colors.primary };
    default:
      return { backgroundColor: colors.surfaceLight, borderColor: colors.border };
  }
}

function getTypeLabel(type: string) {
  switch (type) {
    case 'no_cost':
      return 'Free';
    case 'low_cost':
      return '$';
    case 'procedural':
      return 'Pro';
    default:
      return type;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  ratingSection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 2,
  },
  ratingValue: {
    fontSize: 32,
    fontWeight: '800',
  },
  ratingMax: {
    fontSize: 16,
    color: colors.textMuted,
    fontWeight: '500',
  },
  ratingMeta: {
    flex: 1,
  },
  scoreContext: {
    fontSize: 14,
    fontWeight: '600',
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 4,
  },
  confidenceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  evidenceBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  evidenceText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: `${colors.warning}10`,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: `${colors.warning}30`,
    gap: spacing.sm,
  },
  warningIcon: {
    fontSize: 16,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.warning,
    marginBottom: 4,
  },
  warningText: {
    fontSize: 12,
    color: colors.warning,
    opacity: 0.8,
  },
  bulletList: {
    gap: spacing.xs,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  bulletIcon: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '600',
  },
  bulletIconMuted: {
    fontSize: 14,
    color: colors.textMuted,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  bulletTextMuted: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  whyText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  subFeaturesList: {
    gap: spacing.sm,
  },
  subFeatureCard: {
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
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  subFeatureRatingText: {
    fontSize: 13,
    fontWeight: '700',
  },
  subFeatureNote: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  subFeatureEvidence: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 4,
  },
  thirdsContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  thirdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  thirdLabel: {
    width: 60,
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'capitalize',
  },
  thirdContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  thirdAssessment: {
    fontSize: 13,
    color: colors.text,
  },
  thirdBalance: {
    fontSize: 12,
    color: colors.textMuted,
  },
  overallBalanceBox: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  overallBalanceText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  asymmetriesList: {
    gap: spacing.sm,
  },
  asymmetryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
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
    fontWeight: '500',
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  asymmetryDesc: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  normalNote: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  normalNoteText: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  fixCategory: {
    marginBottom: spacing.lg,
  },
  fixCategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  fixCategoryIcon: {
    fontSize: 16,
  },
  fixCategoryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  infoOnlyBadge: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginLeft: 'auto',
  },
  infoOnlyText: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '500',
  },
  fixCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fixCardPro: {
    borderColor: colors.primaryDark,
    backgroundColor: `${colors.primary}05`,
  },
  fixHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  fixTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  fixMeta: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  typeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  fixTimeline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  fixTimelineIcon: {
    fontSize: 12,
  },
  fixTimelineText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  fixDifficulty: {
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'capitalize',
  },
  impactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    marginBottom: spacing.sm,
    backgroundColor: colors.surfaceLight,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  impactLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
  },
  impactText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
  },
  stepsList: {
    gap: spacing.xs,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  stepNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
