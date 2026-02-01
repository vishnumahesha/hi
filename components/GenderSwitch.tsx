import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { colors, borderRadius, spacing } from '@/constants/theme';
import type { Gender } from '@/types/face-analysis';

interface GenderSwitchProps {
  value: Gender;
  onChange: (gender: Gender) => void;
}

export function GenderSwitch({ value, onChange }: GenderSwitchProps) {
  const translateX = useSharedValue(value === 'male' ? 0 : 1);

  React.useEffect(() => {
    translateX.value = withSpring(value === 'male' ? 0 : 1, {
      damping: 15,
      stiffness: 120,
    });
  }, [value, translateX]);

  const animatedIndicator = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value * 120 }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <Animated.View style={[styles.indicator, animatedIndicator]} />
        <TouchableOpacity
          style={styles.option}
          onPress={() => onChange('male')}
          activeOpacity={0.8}
        >
          <Text style={styles.optionIcon}>👨</Text>
          <Text
            style={[
              styles.optionText,
              value === 'male' && styles.optionTextActive,
            ]}
          >
            Male
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={() => onChange('female')}
          activeOpacity={0.8}
        >
          <Text style={styles.optionIcon}>👩</Text>
          <Text
            style={[
              styles.optionText,
              value === 'female' && styles.optionTextActive,
            ]}
          >
            Female
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  track: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: 4,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 120,
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
  },
  option: {
    width: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.xs,
    zIndex: 1,
  },
  optionIcon: {
    fontSize: 18,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textMuted,
  },
  optionTextActive: {
    color: colors.text,
    fontWeight: '600',
  },
});
