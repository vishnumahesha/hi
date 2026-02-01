import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withDelay,
  withSpring,
  useSharedValue,
  FadeInRight,
} from 'react-native-reanimated';
import { colors, borderRadius, spacing } from '@/constants/theme';

interface Lever {
  lever: string;
  delta: number;
  timeline: string;
  priority: number;
}

interface Top3LeversProps {
  levers: Lever[];
  totalGain: number;
  timelineToFull: string;
  onLeverPress?: (lever: Lever) => void;
}

export function Top3Levers({ levers, totalGain, timelineToFull, onLeverPress }: Top3LeversProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Your Top 3 Levers</Text>
          <Text style={styles.subtitle}>Highest-impact improvements</Text>
        </View>
        <View style={styles.totalGainBadge}>
          <Text style={styles.totalGainText}>+{totalGain.toFixed(1)}</Text>
          <Text style={styles.totalGainLabel}>total</Text>
        </View>
      </View>

      <View style={styles.leversContainer}>
        {levers.map((lever, index) => (
          <Animated.View
            key={lever.lever}
            entering={FadeInRight.delay(index * 150).springify()}
          >
            <TouchableOpacity
              style={styles.leverCard}
              onPress={() => onLeverPress?.(lever)}
              activeOpacity={0.7}
            >
              <View style={[styles.priorityBadge, getPriorityStyle(lever.priority)]}>
                <Text style={styles.priorityText}>#{lever.priority}</Text>
              </View>
              
              <View style={styles.leverContent}>
                <Text style={styles.leverName}>{lever.lever}</Text>
                <View style={styles.leverMeta}>
                  <View style={styles.deltaBadge}>
                    <Text style={styles.deltaText}>+{lever.delta.toFixed(1)}</Text>
                  </View>
                  <Text style={styles.timeline}>{lever.timeline}</Text>
                </View>
              </View>

              <View style={styles.impactBar}>
                <View 
                  style={[
                    styles.impactFill, 
                    { width: `${(lever.delta / totalGain) * 100}%` },
                    getPriorityBarStyle(lever.priority),
                  ]} 
                />
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerIcon}>⏱️</Text>
        <Text style={styles.footerText}>
          Full potential in <Text style={styles.footerHighlight}>{timelineToFull}</Text>
        </Text>
      </View>
    </View>
  );
}

function getPriorityStyle(priority: number) {
  switch (priority) {
    case 1:
      return { backgroundColor: colors.success };
    case 2:
      return { backgroundColor: colors.warning };
    case 3:
      return { backgroundColor: colors.primary };
    default:
      return { backgroundColor: colors.textMuted };
  }
}

function getPriorityBarStyle(priority: number) {
  switch (priority) {
    case 1:
      return { backgroundColor: colors.success };
    case 2:
      return { backgroundColor: colors.warning };
    case 3:
      return { backgroundColor: colors.primary };
    default:
      return { backgroundColor: colors.textMuted };
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderAccent,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  headerLeft: {},
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  totalGainBadge: {
    backgroundColor: `${colors.success}15`,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${colors.success}30`,
  },
  totalGainText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.success,
  },
  totalGainLabel: {
    fontSize: 10,
    color: colors.success,
    fontWeight: '500',
    marginTop: -2,
  },
  leversContainer: {
    gap: spacing.sm,
  },
  leverCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    position: 'relative',
    overflow: 'hidden',
  },
  priorityBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
  },
  leverContent: {
    flex: 1,
  },
  leverName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  leverMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  deltaBadge: {
    backgroundColor: `${colors.success}20`,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  deltaText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.success,
  },
  timeline: {
    fontSize: 12,
    color: colors.textMuted,
  },
  impactBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.surface,
  },
  impactFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerIcon: {
    fontSize: 14,
  },
  footerText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  footerHighlight: {
    color: colors.primary,
    fontWeight: '600',
  },
});
