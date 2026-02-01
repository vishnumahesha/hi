import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, spacing } from '@/constants/theme';

interface PremiumBannerProps {
  scansRemaining: number;
  isPremium: boolean;
  onUpgrade: () => void;
}

export function PremiumBanner({ scansRemaining, isPremium, onUpgrade }: PremiumBannerProps) {
  if (isPremium) {
    return (
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.premiumContainer}
      >
        <View style={styles.premiumBadge}>
          <Text style={styles.premiumBadgeText}>PRO</Text>
        </View>
        <View style={styles.premiumContent}>
          <Text style={styles.premiumTitle}>Premium Active</Text>
          <Text style={styles.premiumSubtitle}>Unlimited scans • Full analysis depth</Text>
        </View>
        <Text style={styles.premiumIcon}>✨</Text>
      </LinearGradient>
    );
  }

  const isLow = scansRemaining <= 1;

  return (
    <TouchableOpacity onPress={onUpgrade} activeOpacity={0.8}>
      <View style={[styles.freeContainer, isLow && styles.freeContainerWarning]}>
        <View style={styles.scansInfo}>
          <View style={styles.scansCountContainer}>
            <Text style={[styles.scansCount, isLow && styles.scansCountWarning]}>
              {scansRemaining}
            </Text>
            <Text style={styles.scansLabel}>
              {scansRemaining === 1 ? 'scan' : 'scans'} left today
            </Text>
          </View>
          <Text style={styles.freeHint}>
            {isLow
              ? 'Upgrade for unlimited scans'
              : 'Free tier • Limited analysis'}
          </Text>
        </View>
        <View style={styles.upgradeHint}>
          <Text style={styles.upgradeText}>Upgrade →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  premiumContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  premiumBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  premiumBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 1,
  },
  premiumContent: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  premiumSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  premiumIcon: {
    fontSize: 24,
  },
  freeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  freeContainerWarning: {
    borderColor: colors.warning,
    backgroundColor: `${colors.warning}10`,
  },
  scansInfo: {
    flex: 1,
  },
  scansCountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
  },
  scansCount: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
  },
  scansCountWarning: {
    color: colors.warning,
  },
  scansLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  freeHint: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  upgradeHint: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  upgradeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});
