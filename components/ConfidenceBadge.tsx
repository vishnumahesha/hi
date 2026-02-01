import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, spacing } from '@/constants/theme';
import type { Confidence } from '@/types/face-analysis';

interface ConfidenceBadgeProps {
  confidence: Confidence;
  photoQualityScore?: number;
}

export function ConfidenceBadge({ confidence, photoQualityScore }: ConfidenceBadgeProps) {
  const getConfidenceConfig = () => {
    switch (confidence) {
      case 'high':
        return {
          label: 'High Confidence',
          icon: '✓',
          colors: [colors.success, '#059669'] as [string, string],
          textColor: colors.success,
        };
      case 'medium':
        return {
          label: 'Medium Confidence',
          icon: '~',
          colors: [colors.warning, '#D97706'] as [string, string],
          textColor: colors.warning,
        };
      case 'low':
        return {
          label: 'Low Confidence',
          icon: '!',
          colors: [colors.error, '#DC2626'] as [string, string],
          textColor: colors.error,
        };
    }
  };

  const config = getConfidenceConfig();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <LinearGradient
          colors={config.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconContainer}
        >
          <Text style={styles.icon}>{config.icon}</Text>
        </LinearGradient>
        <View style={styles.textContainer}>
          <Text style={[styles.label, { color: config.textColor }]}>
            {config.label}
          </Text>
          {photoQualityScore !== undefined && (
            <Text style={styles.qualityScore}>
              Photo Quality: {photoQualityScore}%
            </Text>
          )}
        </View>
      </View>
      {confidence !== 'high' && (
        <Text style={styles.hint}>
          {confidence === 'low'
            ? 'Results may be less accurate due to photo quality issues'
            : 'Better lighting or angles could improve accuracy'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  qualityScore: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  hint: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
});
