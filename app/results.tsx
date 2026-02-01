import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius } from '@/constants/theme';
import {
  CircularRating,
  ConfidenceBadge,
  FeatureCard,
  PhotoQualityWarnings,
  TopFixItem,
  FeatureDetailModal,
  Button,
} from '@/components';
import { FEATURE_METADATA, CONFIDENCE_LABELS } from '@/constants';
import { useAppStore } from '@/store/useAppStore';
import { getMockResponse } from '@/data/mock-response';
import type { Feature, Harmony, Hair, Symmetry } from '@/types/face-analysis';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ResultsScreen() {
  const router = useRouter();
  const { analysisResult, premiumEnabled, clearPhotos, analysisError } = useAppStore();

  // Use mock data as fallback
  const result = analysisResult || getMockResponse(premiumEnabled);

  // Modal state
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [selectedHarmony, setSelectedHarmony] = useState<Harmony | null>(null);
  const [selectedHair, setSelectedHair] = useState<Hair | null>(null);
  const [selectedSymmetry, setSelectedSymmetry] = useState<Symmetry | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Expanded top fixes
  const [expandedFixes, setExpandedFixes] = useState<Set<number>>(new Set());

  const handleFeaturePress = (feature: Feature) => {
    setSelectedFeature(feature);
    setSelectedHarmony(null);
    setSelectedHair(null);
    setSelectedSymmetry(null);
    setModalVisible(true);
  };

  const handleHarmonyPress = () => {
    setSelectedFeature(null);
    setSelectedHarmony(result.harmony);
    setSelectedHair(null);
    setSelectedSymmetry(null);
    setModalVisible(true);
  };

  const handleHairPress = () => {
    setSelectedFeature(null);
    setSelectedHarmony(null);
    setSelectedHair(result.hair);
    setSelectedSymmetry(null);
    setModalVisible(true);
  };

  const handleSymmetryPress = () => {
    setSelectedFeature(null);
    setSelectedHarmony(null);
    setSelectedHair(null);
    setSelectedSymmetry(result.symmetry || null);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedFeature(null);
    setSelectedHarmony(null);
    setSelectedHair(null);
    setSelectedSymmetry(null);
  };

  const toggleFix = (index: number) => {
    setExpandedFixes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleNewScan = () => {
    clearPhotos();
    router.replace('/');
  };

  const handleUpgrade = () => {
    router.push('/upgrade');
  };

  const overallConfidenceConfig = CONFIDENCE_LABELS[result.overall.confidence];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleNewScan} style={styles.newScanButton}>
          <Text style={styles.newScanText}>← New Scan</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Your Results</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Error warning */}
        {analysisError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>
              Analysis had issues. Showing estimated results.
            </Text>
          </View>
        )}

        {/* Overall Rating */}
        <Animated.View
          entering={FadeIn.delay(200)}
          style={styles.overallSection}
        >
          <CircularRating rating={result.overall.rating10} />
          
          {/* Overall confidence */}
          <View style={styles.overallConfidence}>
            <View style={[styles.overallConfidenceDot, { backgroundColor: overallConfidenceConfig.color }]} />
            <Text style={[styles.overallConfidenceText, { color: overallConfidenceConfig.color }]}>
              {overallConfidenceConfig.label}
            </Text>
          </View>
          
          <Text style={styles.overallSummary}>{result.overall.summary}</Text>
          
          {result.overall.confidenceNote && (
            <View style={styles.confidenceNoteBox}>
              <Text style={styles.confidenceNoteIcon}>ℹ️</Text>
              <Text style={styles.confidenceNoteText}>{result.overall.confidenceNote}</Text>
            </View>
          )}
        </Animated.View>

        {/* Photo Quality & Confidence */}
        <Animated.View entering={FadeIn.delay(400)} style={styles.qualitySection}>
          <ConfidenceBadge
            confidence={result.overall.confidence}
            photoQualityScore={result.photoQuality.score}
          />
          {result.photoQuality.issues.length > 0 && (
            <PhotoQualityWarnings
              issues={result.photoQuality.issues}
              score={result.photoQuality.score}
            />
          )}
          
          {/* Photo limitations summary */}
          {result.photoQuality.limitations && result.photoQuality.limitations.length > 0 && (
            <View style={styles.limitationsBox}>
              <Text style={styles.limitationsTitle}>📷 Photo Limitations</Text>
              {result.photoQuality.limitations.map((lim, idx) => (
                <View key={idx} style={styles.limitationRow}>
                  <Text style={styles.limitationFeature}>{lim.feature}:</Text>
                  <Text style={styles.limitationDesc}>{lim.limitation}</Text>
                </View>
              ))}
            </View>
          )}
        </Animated.View>

        {/* Feature Ratings */}
        <View style={styles.featuresSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Feature Analysis</Text>
            <Text style={styles.sectionSubtitle}>
              Tap any feature for details{premiumEnabled ? ' and sub-features' : ''}
            </Text>
          </View>
          
          <View style={styles.featuresGrid}>
            {result.features.map((feature, index) => (
              <Animated.View 
                key={feature.key} 
                style={styles.featureCardWrapper}
                entering={FadeInDown.delay(500 + index * 80)}
              >
                <FeatureCard
                  featureKey={feature.key}
                  rating={feature.rating10}
                  confidence={feature.confidence}
                  strengthsPreview={feature.strengths}
                  photoLimitations={feature.photoLimitations}
                  hasSubFeatures={!!feature.subFeatures && feature.subFeatures.length > 0}
                  onPress={() => handleFeaturePress(feature)}
                  index={index}
                  isPremium={premiumEnabled}
                />
              </Animated.View>
            ))}

            {/* Symmetry Card */}
            {result.symmetry && (
              <Animated.View 
                style={styles.featureCardWrapper}
                entering={FadeInDown.delay(500 + result.features.length * 80)}
              >
                <FeatureCard
                  featureKey="symmetry"
                  rating={result.symmetry.rating10}
                  confidence={result.symmetry.confidence}
                  strengthsPreview={result.symmetry.notes}
                  photoLimitations={result.symmetry.photoLimitation ? [result.symmetry.photoLimitation] : []}
                  hasSubFeatures={!!result.symmetry.asymmetries}
                  onPress={handleSymmetryPress}
                  index={result.features.length}
                  isPremium={premiumEnabled}
                />
              </Animated.View>
            )}

            {/* Harmony Card */}
            <Animated.View 
              style={styles.featureCardWrapper}
              entering={FadeInDown.delay(500 + (result.features.length + 1) * 80)}
            >
              <FeatureCard
                featureKey="harmony"
                rating={result.harmony.rating10}
                confidence={result.harmony.confidence}
                strengthsPreview={result.harmony.notes}
                hasSubFeatures={!!result.harmony.facialThirds}
                onPress={handleHarmonyPress}
                index={result.features.length + 1}
                isPremium={premiumEnabled}
              />
            </Animated.View>

            {/* Hair Card */}
            <Animated.View 
              style={styles.featureCardWrapper}
              entering={FadeInDown.delay(500 + (result.features.length + 2) * 80)}
            >
              <FeatureCard
                featureKey="hair"
                rating={result.hair.rating10}
                confidence={result.hair.confidence}
                strengthsPreview={result.hair.notes}
                onPress={handleHairPress}
                index={result.features.length + 2}
                isPremium={premiumEnabled}
              />
            </Animated.View>
          </View>
        </View>

        {/* Top Fixes */}
        <View style={styles.fixesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Action Plan</Text>
            <Text style={styles.sectionSubtitle}>
              Top improvements ranked by impact
            </Text>
          </View>
          <View style={styles.fixesList}>
            {result.topFixes.map((fix, index) => (
              <TopFixItem
                key={`${fix.title}-${index}`}
                fix={fix}
                index={index}
                expanded={expandedFixes.has(index)}
                onPress={() => toggleFix(index)}
              />
            ))}
          </View>
        </View>

        {/* Premium Upsell */}
        {!premiumEnabled && (
          <View style={styles.premiumSection}>
            <View style={styles.premiumCard}>
              <Text style={styles.premiumIcon}>🔓</Text>
              <Text style={styles.premiumTitle}>Unlock Full Analysis</Text>
              <Text style={styles.premiumText}>
                Get deeper insights with sub-feature breakdowns, detailed "why" explanations, and more personalized fixes.
              </Text>
              <View style={styles.premiumFeatures}>
                <Text style={styles.premiumFeature}>✓ Sub-feature ratings (5+ per category)</Text>
                <Text style={styles.premiumFeature}>✓ Detailed explanations for each finding</Text>
                <Text style={styles.premiumFeature}>✓ 15-20 personalized fixes</Text>
                <Text style={styles.premiumFeature}>✓ Facial thirds analysis</Text>
                <Text style={styles.premiumFeature}>✓ Symmetry breakdown</Text>
                <Text style={styles.premiumFeature}>✓ Unlimited scans</Text>
              </View>
              <Button
                title="Upgrade to Premium"
                onPress={handleUpgrade}
                fullWidth
              />
            </View>
          </View>
        )}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>{result.safety.disclaimer}</Text>
          {result.safety.photoDisclaimer && (
            <Text style={styles.photoDisclaimer}>{result.safety.photoDisclaimer}</Text>
          )}
        </View>
      </ScrollView>

      {/* Feature Detail Modal */}
      <FeatureDetailModal
        visible={modalVisible}
        onClose={handleCloseModal}
        feature={selectedFeature}
        harmony={selectedHarmony}
        hair={selectedHair}
        symmetry={selectedSymmetry}
        isPremium={premiumEnabled}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  newScanButton: {
    paddingVertical: spacing.xs,
  },
  newScanText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  placeholder: {
    width: 80,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: `${colors.warning}20`,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: `${colors.warning}40`,
  },
  errorIcon: {
    fontSize: 18,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: colors.warning,
  },
  overallSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  overallConfidence: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  overallConfidenceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  overallConfidenceText: {
    fontSize: 14,
    fontWeight: '500',
  },
  overallSummary: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  confidenceNoteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  confidenceNoteIcon: {
    fontSize: 14,
  },
  confidenceNoteText: {
    flex: 1,
    fontSize: 13,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  qualitySection: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  limitationsBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  limitationsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  limitationRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  limitationFeature: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  limitationDesc: {
    flex: 1,
    fontSize: 13,
    color: colors.textMuted,
  },
  featuresSection: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
  featuresGrid: {
    gap: spacing.sm,
  },
  featureCardWrapper: {
    width: '100%',
  },
  fixesSection: {
    marginBottom: spacing.xl,
  },
  fixesList: {
    gap: spacing.sm,
  },
  premiumSection: {
    marginBottom: spacing.xl,
  },
  premiumCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderAccent,
    alignItems: 'center',
  },
  premiumIcon: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  premiumText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  premiumFeatures: {
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  premiumFeature: {
    fontSize: 14,
    color: colors.success,
  },
  disclaimer: {
    padding: spacing.md,
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
  },
  disclaimerText: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 18,
    textAlign: 'center',
  },
  photoDisclaimer: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
});
