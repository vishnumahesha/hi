import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withDelay,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { colors, borderRadius, spacing } from '@/constants/theme';
import { FIX_TYPE_LABELS, DIFFICULTY_LABELS, IMPACT_LABELS } from '@/constants';
import type { Fix, Impact } from '@/types/face-analysis';

// TopFix type for the top fixes display
interface TopFix {
  title: string;
  impact: Impact;
  why: string;
  steps: string[];
}

interface FixItemProps {
  fix: Fix;
  index: number;
  onPress?: () => void;
}

export function FixItem({ fix, index, onPress }: FixItemProps) {
  const scale = useSharedValue(0);

  React.useEffect(() => {
    scale.value = withDelay(index * 80, withSpring(1, { damping: 15 }));
  }, [index, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  const typeConfig = FIX_TYPE_LABELS[fix.type] || FIX_TYPE_LABELS.no_cost;
  const difficultyConfig = DIFFICULTY_LABELS[fix.difficulty] || DIFFICULTY_LABELS.easy;

  return (
    <Animated.View style={[styles.fixItem, animatedStyle]}>
      <TouchableOpacity
        style={styles.fixContent}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={!onPress}
      >
        <View style={styles.fixHeader}>
          <Text style={styles.fixTitle}>{fix.title}</Text>
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: `${typeConfig.color}20` }]}>
              <Text style={[styles.badgeText, { color: typeConfig.color }]}>
                {typeConfig.label}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: `${difficultyConfig.color}20` }]}>
              <Text style={[styles.badgeText, { color: difficultyConfig.color }]}>
                {difficultyConfig.label}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.timeContainer}>
          <Text style={styles.timeIcon}>⏱️</Text>
          <Text style={styles.timeText}>{fix.timeline}</Text>
        </View>

        <View style={styles.steps}>
          {fix.steps.slice(0, 2).map((step, idx) => (
            <View key={idx} style={styles.stepRow}>
              <View style={styles.stepDot} />
              <Text style={styles.stepText} numberOfLines={1}>
                {step}
              </Text>
            </View>
          ))}
          {fix.steps.length > 2 && (
            <Text style={styles.moreSteps}>+{fix.steps.length - 2} more steps</Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

interface TopFixItemProps {
  fix: TopFix;
  index: number;
  expanded?: boolean;
  onPress?: () => void;
}

export function TopFixItem({ fix, index, expanded = false, onPress }: TopFixItemProps) {
  const scale = useSharedValue(0);

  React.useEffect(() => {
    scale.value = withDelay(index * 100, withSpring(1, { damping: 15 }));
  }, [index, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  const impactConfig = IMPACT_LABELS[fix.impact] || IMPACT_LABELS.medium;

  return (
    <Animated.View style={[styles.topFixItem, animatedStyle]}>
      <TouchableOpacity
        style={styles.topFixContent}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={!onPress}
      >
        <View style={styles.topFixHeader}>
          <View style={styles.indexBadge}>
            <Text style={styles.indexText}>{index + 1}</Text>
          </View>
          <View style={styles.topFixInfo}>
            <Text style={styles.topFixTitle}>{fix.title}</Text>
            <View style={[styles.impactBadge, { backgroundColor: `${impactConfig.color}20` }]}>
              <Text style={[styles.impactText, { color: impactConfig.color }]}>
                {impactConfig.label}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.whyText}>{fix.why}</Text>

        {expanded && (
          <View style={styles.expandedSteps}>
            {fix.steps.map((step, idx) => (
              <View key={idx} style={styles.expandedStepRow}>
                <View style={[styles.expandedStepDot, { backgroundColor: impactConfig.color }]} />
                <Text style={styles.expandedStepText}>{step}</Text>
              </View>
            ))}
          </View>
        )}

        {!expanded && fix.steps.length > 0 && (
          <Text style={styles.viewSteps}>
            View {fix.steps.length} steps →
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

interface ActionListProps {
  fixes: Fix[];
  title?: string;
}

export function ActionList({ fixes, title }: ActionListProps) {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      {fixes.map((fix, index) => (
        <FixItem key={`${fix.title}-${index}`} fix={fix} index={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  fixItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  fixContent: {
    padding: spacing.md,
  },
  fixHeader: {
    marginBottom: spacing.sm,
  },
  fixTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  timeIcon: {
    fontSize: 12,
  },
  timeText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  steps: {
    gap: 4,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  stepDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
  },
  moreSteps: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 4,
  },
  topFixItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderAccent,
    overflow: 'hidden',
  },
  topFixContent: {
    padding: spacing.md,
  },
  topFixHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  indexBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  topFixInfo: {
    flex: 1,
  },
  topFixTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  impactBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  impactText: {
    fontSize: 11,
    fontWeight: '600',
  },
  whyText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  viewSteps: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
  expandedSteps: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    gap: spacing.xs,
  },
  expandedStepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  expandedStepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  expandedStepText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
