import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  FadeInDown,
} from 'react-native-reanimated';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';
import { Button } from '@/components';
import { useAppStore } from '@/store/useAppStore';

export default function UpgradeScreen() {
  const router = useRouter();
  const { premiumEnabled, setPremiumEnabled, scansRemaining } = useAppStore();

  const glowOpacity = useSharedValue(0.3);

  React.useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 1500 }),
        withTiming(0.3, { duration: 1500 })
      ),
      -1,
      true
    );
  }, [glowOpacity]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handleEnablePremium = () => {
    setPremiumEnabled(true);
    Alert.alert(
      '🎉 Premium Activated!',
      'You now have access to all premium features. This is a demo mode.',
      [{ text: 'Got it', onPress: () => router.back() }]
    );
  };

  const handleDisablePremium = () => {
    setPremiumEnabled(false);
    Alert.alert('Premium Disabled', 'You are now using the free tier.');
  };

  const features = [
    {
      icon: '♾️',
      title: 'Unlimited Scans',
      free: '3 scans/day',
      premium: 'Unlimited',
    },
    {
      icon: '🔬',
      title: 'Analysis Depth',
      free: 'Basic insights',
      premium: 'Deep analysis',
    },
    {
      icon: '💡',
      title: 'Improvement Tips',
      free: '3-5 suggestions',
      premium: '15-20 suggestions',
    },
    {
      icon: '📝',
      title: 'Explanations',
      free: 'Summary only',
      premium: 'Detailed "why"',
    },
    {
      icon: '⚡',
      title: 'Processing',
      free: 'Standard',
      premium: 'Priority',
    },
    {
      icon: '🎯',
      title: 'Feature Details',
      free: 'Basic',
      premium: 'Comprehensive',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upgrade</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={styles.heroSection}
        >
          <Animated.View style={[styles.heroGlow, glowStyle]} />
          <Text style={styles.heroEmoji}>✨</Text>
          <Text style={styles.heroTitle}>Face Analyzer Pro</Text>
          <Text style={styles.heroSubtitle}>
            Unlock the full potential of AI facial analysis
          </Text>
        </Animated.View>

        {/* Current Status */}
        {premiumEnabled ? (
          <View style={styles.statusCard}>
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statusGradient}
            >
              <Text style={styles.statusIcon}>👑</Text>
              <View style={styles.statusContent}>
                <Text style={styles.statusTitle}>Premium Active</Text>
                <Text style={styles.statusText}>
                  You have access to all features
                </Text>
              </View>
            </LinearGradient>
          </View>
        ) : (
          <View style={styles.limitCard}>
            <Text style={styles.limitIcon}>⏳</Text>
            <View style={styles.limitContent}>
              <Text style={styles.limitTitle}>Free Tier</Text>
              <Text style={styles.limitText}>
                {scansRemaining} scans remaining today
              </Text>
            </View>
          </View>
        )}

        {/* Feature Comparison */}
        <View style={styles.comparisonSection}>
          <Text style={styles.sectionTitle}>Compare Plans</Text>

          <View style={styles.comparisonHeader}>
            <View style={styles.comparisonHeaderItem}>
              <Text style={styles.planLabel}>Free</Text>
            </View>
            <View style={[styles.comparisonHeaderItem, styles.premiumHeader]}>
              <Text style={styles.planLabelPremium}>Pro</Text>
            </View>
          </View>

          {features.map((feature, index) => (
            <Animated.View
              key={feature.title}
              entering={FadeInDown.delay(200 + index * 50).springify()}
              style={styles.featureRow}
            >
              <View style={styles.featureInfo}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <Text style={styles.featureTitle}>{feature.title}</Text>
              </View>
              <View style={styles.featureValues}>
                <View style={styles.featureValue}>
                  <Text style={styles.freeValue}>{feature.free}</Text>
                </View>
                <View style={[styles.featureValue, styles.premiumValue]}>
                  <Text style={styles.premiumValueText}>{feature.premium}</Text>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Demo Toggle */}
        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>🧪 Demo Mode</Text>
          <Text style={styles.demoText}>
            This is a hackathon demo. Toggle premium features below to see the difference in analysis depth.
          </Text>

          {premiumEnabled ? (
            <Button
              title="Disable Premium (Demo)"
              onPress={handleDisablePremium}
              variant="outline"
              fullWidth
            />
          ) : (
            <Button
              title="Enable Premium (Demo)"
              onPress={handleEnablePremium}
              fullWidth
            />
          )}
        </View>

        {/* Price Card (mock) */}
        {!premiumEnabled && (
          <View style={styles.priceSection}>
            <LinearGradient
              colors={colors.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.priceCard}
            >
              <View style={styles.priceHeader}>
                <Text style={styles.priceLabel}>Premium</Text>
                <View style={styles.priceBadge}>
                  <Text style={styles.priceBadgeText}>BEST VALUE</Text>
                </View>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceAmount}>$4.99</Text>
                <Text style={styles.pricePeriod}>/month</Text>
              </View>
              <Text style={styles.priceNote}>
                Cancel anytime • 7-day free trial
              </Text>
              <TouchableOpacity
                style={styles.subscribeButton}
                onPress={handleEnablePremium}
              >
                <Text style={styles.subscribeButtonText}>
                  Start Free Trial
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}

        {/* Footer Note */}
        <Text style={styles.footerNote}>
          In production, this would integrate with your app store subscription system.
        </Text>
      </ScrollView>
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
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: colors.text,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    position: 'relative',
  },
  heroGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.primary,
    top: -50,
  },
  heroEmoji: {
    fontSize: 56,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  statusCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  statusGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  statusIcon: {
    fontSize: 32,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  statusText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  limitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    gap: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  limitIcon: {
    fontSize: 32,
  },
  limitContent: {
    flex: 1,
  },
  limitTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  limitText: {
    fontSize: 14,
    color: colors.warning,
    marginTop: 2,
  },
  comparisonSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  comparisonHeader: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    paddingLeft: '45%',
  },
  comparisonHeaderItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  premiumHeader: {
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.sm,
  },
  planLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  planLabelPremium: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.xs,
  },
  featureInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    width: '45%',
  },
  featureIcon: {
    fontSize: 20,
  },
  featureTitle: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
  },
  featureValues: {
    flexDirection: 'row',
    flex: 1,
  },
  featureValue: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  freeValue: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
  premiumValue: {
    backgroundColor: `${colors.primary}20`,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.xs,
  },
  premiumValueText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  demoSection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  demoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  demoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  priceSection: {
    marginBottom: spacing.xl,
  },
  priceCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.glow,
  },
  priceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  priceBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  priceBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.xs,
  },
  priceAmount: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.text,
  },
  pricePeriod: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 4,
  },
  priceNote: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: spacing.lg,
  },
  subscribeButton: {
    backgroundColor: colors.text,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    width: '100%',
    alignItems: 'center',
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  footerNote: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
