import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withDelay,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { colors, borderRadius, spacing } from '@/constants/theme';
import { QUALITY_ISSUE_MESSAGES } from '@/constants';
import type { PhotoQualityIssue } from '@/types/face-analysis';

interface PhotoQualityWarningsProps {
  issues: PhotoQualityIssue[];
  score: number;
}

export function PhotoQualityWarnings({ issues, score }: PhotoQualityWarningsProps) {
  const scale = useSharedValue(0);

  React.useEffect(() => {
    scale.value = withDelay(200, withSpring(1, { damping: 15 }));
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  if (issues.length === 0) {
    return (
      <Animated.View style={[styles.successContainer, animatedStyle]}>
        <Text style={styles.successIcon}>✓</Text>
        <View style={styles.successContent}>
          <Text style={styles.successTitle}>Photo Quality: Excellent</Text>
          <Text style={styles.successText}>
            Your photos meet all quality requirements for accurate analysis.
          </Text>
        </View>
      </Animated.View>
    );
  }

  const getSeverity = () => {
    if (score < 50) return 'critical';
    if (score < 70) return 'warning';
    return 'minor';
  };

  const severity = getSeverity();
  const severityConfig = {
    critical: {
      color: colors.error,
      bgColor: `${colors.error}15`,
      borderColor: `${colors.error}30`,
      icon: '⚠️',
      title: 'Poor Photo Quality',
    },
    warning: {
      color: colors.warning,
      bgColor: `${colors.warning}15`,
      borderColor: `${colors.warning}30`,
      icon: '⚡',
      title: 'Photo Quality Issues',
    },
    minor: {
      color: colors.textSecondary,
      bgColor: colors.surfaceLight,
      borderColor: colors.border,
      icon: 'ℹ️',
      title: 'Minor Issues Detected',
    },
  };

  const config = severityConfig[severity];

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        {
          backgroundColor: config.bgColor,
          borderColor: config.borderColor,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.icon}>{config.icon}</Text>
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: config.color }]}>{config.title}</Text>
          <Text style={styles.scoreText}>Quality Score: {score}%</Text>
        </View>
      </View>

      <View style={styles.issuesList}>
        {issues.map((issue, index) => (
          <View key={issue} style={styles.issueRow}>
            <View style={[styles.issueDot, { backgroundColor: config.color }]} />
            <Text style={styles.issueText}>
              {QUALITY_ISSUE_MESSAGES[issue] || issue}
            </Text>
          </View>
        ))}
      </View>

      {severity === 'critical' && (
        <Text style={styles.retakeHint}>
          Consider retaking photos for more accurate results
        </Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.success}15`,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: `${colors.success}30`,
    gap: spacing.sm,
  },
  successIcon: {
    fontSize: 24,
    color: colors.success,
  },
  successContent: {
    flex: 1,
  },
  successTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.success,
  },
  successText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  icon: {
    fontSize: 20,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  scoreText: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  issuesList: {
    gap: spacing.xs,
  },
  issueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  issueDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  issueText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  retakeHint: {
    fontSize: 13,
    color: colors.error,
    fontWeight: '500',
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
});
