import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, spacing } from '@/constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  strokeWidth?: number;
  delay?: number;
}

export function CircularRating({
  rating,
  maxRating = 10,
  size = 180,
  strokeWidth = 12,
  delay = 300,
}: CircularRatingProps) {
  const progress = useSharedValue(0);
  const percentage = rating / maxRating;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  React.useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(percentage, {
        duration: 1500,
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
      })
    );
  }, [rating, delay, percentage, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  const getRatingColor = () => {
    if (rating <= 3) return colors.rating.low;
    if (rating <= 6) return colors.rating.medium;
    if (rating <= 8) return colors.rating.good;
    return colors.rating.excellent;
  };

  const getGradientColors = () => {
    if (rating <= 3) return [colors.rating.low, '#DC2626'];
    if (rating <= 6) return [colors.rating.medium, '#D97706'];
    if (rating <= 8) return [colors.rating.good, '#059669'];
    return [colors.rating.excellent, '#6366F1'];
  };

  const gradientColors = getGradientColors();

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Defs>
          <LinearGradient id="ratingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={gradientColors[0]} />
            <Stop offset="100%" stopColor={gradientColors[1]} />
          </LinearGradient>
        </Defs>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.surfaceLight}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated progress circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#ratingGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
      </Svg>
      <View style={styles.content}>
        <Text style={[styles.rating, { color: getRatingColor() }]}>
          {rating.toFixed(1)}
        </Text>
        <Text style={styles.label}>out of 10</Text>
      </View>
      {/* Glow effect */}
      <View
        style={[
          styles.glow,
          {
            backgroundColor: getRatingColor(),
            width: size * 0.6,
            height: size * 0.6,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  svg: {
    position: 'absolute',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rating: {
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -2,
  },
  label: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: -4,
  },
  glow: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.15,
    zIndex: -1,
  },
});
