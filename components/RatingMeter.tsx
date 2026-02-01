import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withDelay,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors, borderRadius, spacing } from '@/constants/theme';

interface RatingMeterProps {
  rating: number;
  maxRating?: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  delay?: number;
  animated?: boolean;
}

export function RatingMeter({
  rating,
  maxRating = 10,
  size = 'medium',
  showLabel = true,
  delay = 0,
  animated = true,
}: RatingMeterProps) {
  const animatedWidth = useSharedValue(0);
  const percentage = (rating / maxRating) * 100;

  React.useEffect(() => {
    if (animated) {
      animatedWidth.value = withDelay(
        delay,
        withSpring(percentage, {
          damping: 15,
          stiffness: 80,
        })
      );
    } else {
      animatedWidth.value = percentage;
    }
  }, [rating, animated, delay, percentage, animatedWidth]);

  const getRatingColor = () => {
    if (rating <= 3) return colors.rating.low;
    if (rating <= 6) return colors.rating.medium;
    if (rating <= 8) return colors.rating.good;
    return colors.rating.excellent;
  };

  const getGlowColor = () => {
    const baseColor = getRatingColor();
    return `${baseColor}40`;
  };

  const dimensions = {
    small: { height: 6, borderRadius: 3 },
    medium: { height: 10, borderRadius: 5 },
    large: { height: 14, borderRadius: 7 },
  };

  const animatedBarStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value}%`,
  }));

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.track,
          {
            height: dimensions[size].height,
            borderRadius: dimensions[size].borderRadius,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.fill,
            animatedBarStyle,
            {
              height: dimensions[size].height,
              borderRadius: dimensions[size].borderRadius,
              backgroundColor: getRatingColor(),
              shadowColor: getRatingColor(),
            },
          ]}
        />
        <View
          style={[
            styles.glow,
            {
              backgroundColor: getGlowColor(),
              height: dimensions[size].height * 2,
              borderRadius: dimensions[size].borderRadius * 2,
            },
          ]}
        />
      </View>
      {showLabel && (
        <Text style={[styles.label, { color: getRatingColor() }]}>
          {rating.toFixed(1)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  track: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    overflow: 'hidden',
    position: 'relative',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  glow: {
    position: 'absolute',
    left: 0,
    top: '50%',
    width: '100%',
    transform: [{ translateY: -10 }],
    opacity: 0.3,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    minWidth: 35,
    textAlign: 'right',
  },
});
