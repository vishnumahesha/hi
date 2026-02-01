import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  withDelay,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { analyzeface } from '@/services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ANALYSIS_STEPS = [
  { icon: '🔍', text: 'Detecting facial features...' },
  { icon: '📐', text: 'Analyzing proportions...' },
  { icon: '⚖️', text: 'Evaluating symmetry...' },
  { icon: '✨', text: 'Calculating ratings...' },
  { icon: '💡', text: 'Generating suggestions...' },
];

export default function AnalyzingScreen() {
  const router = useRouter();
  const {
    frontPhotoUri,
    sidePhotoUri,
    gender,
    premiumEnabled,
    setAnalysisResult,
    setIsAnalyzing,
    setAnalysisError,
    incrementScanCount,
  } = useAppStore();

  const [currentStep, setCurrentStep] = React.useState(0);
  const analysisStarted = useRef(false);

  // Animation values
  const pulse = useSharedValue(1);
  const rotate = useSharedValue(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    // Start animations
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );

    rotate.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );

    progress.value = withTiming(100, { duration: 12000, easing: Easing.linear });

    // Step through analysis phases
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < ANALYSIS_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 2500);

    return () => {
      clearInterval(stepInterval);
      cancelAnimation(pulse);
      cancelAnimation(rotate);
      cancelAnimation(progress);
    };
  }, [pulse, rotate, progress]);

  useEffect(() => {
    if (!frontPhotoUri) {
      router.replace('/capture-front');
      return;
    }

    if (analysisStarted.current) return;
    analysisStarted.current = true;

    const runAnalysis = async () => {
      setIsAnalyzing(true);
      setAnalysisError(null);

      try {
        const result = await analyzeface({
          frontImage: frontPhotoUri,
          sideImage: sidePhotoUri || undefined,
          gender,
          premiumEnabled,
        });

        setAnalysisResult(result);
        await incrementScanCount();

        // Small delay to let the animation feel complete
        setTimeout(() => {
          router.replace('/results');
        }, 500);
      } catch (error) {
        console.error('Analysis error:', error);
        setAnalysisError(error instanceof Error ? error.message : 'Analysis failed');
        // Still navigate to results - will show mock data
        setTimeout(() => {
          router.replace('/results');
        }, 500);
      } finally {
        setIsAnalyzing(false);
      }
    };

    runAnalysis();
  }, [
    frontPhotoUri,
    sidePhotoUri,
    gender,
    premiumEnabled,
    router,
    setAnalysisResult,
    setIsAnalyzing,
    setAnalysisError,
    incrementScanCount,
  ]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  const currentStepData = ANALYSIS_STEPS[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Photos being analyzed */}
        <View style={styles.photosContainer}>
          <Animated.View style={[styles.photoWrapper, pulseStyle]}>
            {frontPhotoUri && (
              <Image source={{ uri: frontPhotoUri }} style={styles.photo} />
            )}
            <View style={styles.photoOverlay} />
          </Animated.View>

          {sidePhotoUri && (
            <Animated.View style={[styles.photoWrapperSmall, pulseStyle]}>
              <Image source={{ uri: sidePhotoUri }} style={styles.photo} />
              <View style={styles.photoOverlay} />
            </Animated.View>
          )}

          {/* Scanning effect */}
          <Animated.View style={[styles.scanRing, rotateStyle]}>
            <View style={styles.scanDot} />
          </Animated.View>
        </View>

        {/* Current step */}
        <View style={styles.stepContainer}>
          <Text style={styles.stepIcon}>{currentStepData.icon}</Text>
          <Text style={styles.stepText}>{currentStepData.text}</Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, progressStyle]} />
          </View>
          <Text style={styles.progressHint}>AI analysis in progress...</Text>
        </View>

        {/* Steps indicator */}
        <View style={styles.stepsIndicator}>
          {ANALYSIS_STEPS.map((step, index) => (
            <View
              key={index}
              style={[
                styles.stepDot,
                index <= currentStep && styles.stepDotActive,
                index === currentStep && styles.stepDotCurrent,
              ]}
            />
          ))}
        </View>

        {/* Safety note */}
        <View style={styles.safetyNote}>
          <Text style={styles.safetyIcon}>🔒</Text>
          <Text style={styles.safetyText}>
            Your photos are processed securely and will not be stored
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  photosContainer: {
    width: 200,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    position: 'relative',
  },
  photoWrapper: {
    width: 160,
    height: 210,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: colors.primary,
  },
  photoWrapperSmall: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    width: 80,
    height: 105,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.accent,
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  scanRing: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: colors.primary,
    borderRightColor: colors.primaryLight,
  },
  scanDot: {
    position: 'absolute',
    top: -4,
    left: '50%',
    marginLeft: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  stepIcon: {
    fontSize: 24,
  },
  stepText: {
    fontSize: 18,
    color: colors.text,
    fontWeight: '500',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: colors.surface,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressHint: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  stepsIndicator: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceLight,
  },
  stepDotActive: {
    backgroundColor: colors.primary,
  },
  stepDotCurrent: {
    width: 24,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  safetyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
  },
  safetyIcon: {
    fontSize: 16,
  },
  safetyText: {
    fontSize: 13,
    color: colors.textMuted,
    flex: 1,
  },
});
