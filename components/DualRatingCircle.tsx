import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
  withSpring,
  withSequence,
  withRepeat,
  Easing,
  useAnimatedStyle,
  interpolate,
  runOnJS,
  FadeIn,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, spacing } from '@/constants/theme';

// Particle component with burst animation
const Particle = ({ 
  delay, 
  color, 
  startX, 
  startY, 
  endX, 
  endY 
}: { 
  delay: number; 
  color: string; 
  startX: number; 
  startY: number; 
  endX: number; 
  endY: number;
}) => {
  const progress = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 200 }));
    progress.value = withDelay(
      delay,
      withSequence(
        withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) }),
        withTiming(1, { duration: 400 }),
      )
    );
    
    // Fade out
    setTimeout(() => {
      opacity.value = withTiming(0, { duration: 400 });
    }, delay + 800);
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: color,
    opacity: opacity.value,
    transform: [
      { translateX: interpolate(progress.value, [0, 1], [startX, endX]) },
      { translateY: interpolate(progress.value, [0, 1], [startY, endY]) },
      { scale: interpolate(progress.value, [0, 0.5, 1], [0, 1.2, 0.5]) },
    ],
  }));

  return <Animated.View style={style} />;
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedView = Animated.View;

interface DualRatingCircleProps {
  currentScore: number;
  potentialScore: number;
  maxRating?: number;
  size?: number;
  strokeWidth?: number;
  delay?: number;
}

export function DualRatingCircle({
  currentScore,
  potentialScore,
  maxRating = 10,
  size = 280,
  strokeWidth = 18,
  delay = 300,
}: DualRatingCircleProps) {
  const currentProgress = useSharedValue(0);
  const potentialProgress = useSharedValue(0);
  const rotation = useSharedValue(0);
  const glowPulse = useSharedValue(0);
  const glowIntensity = useSharedValue(0);
  const scoreOpacity = useSharedValue(0);
  const scoreScale = useSharedValue(0.5);
  const ringScale = useSharedValue(0.8);
  const shimmer = useSharedValue(0);

  const [displayScore, setDisplayScore] = useState(0);
  const [displayPotential, setDisplayPotential] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);

  const currentPercentage = currentScore / maxRating;
  const potentialPercentage = potentialScore / maxRating;
  const possibleGain = potentialScore - currentScore;

  const radius = (size - strokeWidth * 2) / 2;
  const potentialRadius = radius + strokeWidth + 8;
  const circumference = 2 * Math.PI * radius;
  const potentialCircumference = 2 * Math.PI * potentialRadius;

  useEffect(() => {
    // Initial spin animation
    rotation.value = withSequence(
      withTiming(720, { duration: 1500, easing: Easing.out(Easing.cubic) }),
      withTiming(720, { duration: 0 })
    );

    // Scale in animation
    ringScale.value = withSequence(
      withDelay(delay, withSpring(1.05, { damping: 8, stiffness: 100 })),
      withSpring(1, { damping: 12, stiffness: 150 })
    );

    // Progress animations
    currentProgress.value = withDelay(
      delay + 800,
      withTiming(currentPercentage, {
        duration: 2000,
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
      })
    );

    potentialProgress.value = withDelay(
      delay + 1200,
      withTiming(potentialPercentage, {
        duration: 1800,
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
      })
    );

    // Score counting animation
    const scoreDuration = 2000;
    const startTime = Date.now();
    const scoreDelay = delay + 800;
    
    setTimeout(() => {
      const animate = () => {
        const elapsed = Date.now() - startTime - scoreDelay;
        const progress = Math.min(elapsed / scoreDuration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        
        setDisplayScore(parseFloat((currentScore * easedProgress).toFixed(1)));
        setDisplayPotential(parseFloat((potentialScore * easedProgress).toFixed(1)));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayScore(currentScore);
          setDisplayPotential(potentialScore);
          runOnJS(setAnimationComplete)(true);
        }
      };
      animate();
    }, scoreDelay);

    // Score reveal animation
    scoreOpacity.value = withDelay(
      delay + 600,
      withTiming(1, { duration: 600 })
    );
    
    scoreScale.value = withDelay(
      delay + 600,
      withSpring(1, { damping: 10, stiffness: 100 })
    );

    // Glow pulse animation (starts after ring fills)
    setTimeout(() => {
      glowIntensity.value = withTiming(1, { duration: 500 });
      glowPulse.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }, delay + 2500);

    // Shimmer effect
    shimmer.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );
  }, [currentScore, potentialScore, delay]);

  const currentAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - currentProgress.value),
  }));

  const potentialAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: potentialCircumference * (1 - potentialProgress.value),
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: ringScale.value },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowPulse.value, [0, 1], [0.2, 0.5]) * glowIntensity.value,
    transform: [
      { scale: interpolate(glowPulse.value, [0, 1], [1, 1.3]) },
    ],
  }));

  const outerGlowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowPulse.value, [0, 1], [0.1, 0.3]) * glowIntensity.value,
    transform: [
      { scale: interpolate(glowPulse.value, [0, 1], [1.2, 1.6]) },
    ],
  }));

  const scoreContainerStyle = useAnimatedStyle(() => ({
    opacity: scoreOpacity.value,
    transform: [
      { scale: scoreScale.value },
    ],
  }));

  // Get colors based on score
  const getCurrentColor = () => {
    if (currentScore <= 3) return colors.rating.low;
    if (currentScore <= 5) return colors.warning;
    if (currentScore <= 7) return colors.rating.good;
    return colors.rating.excellent;
  };

  const getPotentialColor = () => {
    if (potentialScore <= 5) return colors.warning;
    if (potentialScore <= 7) return colors.rating.good;
    return colors.rating.excellent;
  };

  const currentColor = getCurrentColor();
  const potentialColor = getPotentialColor();

  return (
    <View style={[styles.wrapper, { width: size + 80, height: size + 80 }]}>
      {/* Outer glow layer */}
      <AnimatedView
        style={[
          styles.outerGlow,
          {
            backgroundColor: currentColor,
            width: size + 60,
            height: size + 60,
          },
          outerGlowStyle,
        ]}
      />
      
      {/* Inner glow layer */}
      <AnimatedView
        style={[
          styles.glow,
          {
            backgroundColor: currentColor,
            width: size * 0.7,
            height: size * 0.7,
          },
          glowStyle,
        ]}
      />

      <AnimatedView style={[styles.container, { width: size + 40, height: size + 40 }, containerStyle]}>
        <Svg width={size + 40} height={size + 40} style={styles.svg}>
          <Defs>
            <LinearGradient id="currentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={currentColor} />
              <Stop offset="50%" stopColor={currentColor} stopOpacity={0.9} />
              <Stop offset="100%" stopColor={currentColor} stopOpacity={0.7} />
            </LinearGradient>
            <LinearGradient id="potentialGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={potentialColor} stopOpacity={0.6} />
              <Stop offset="100%" stopColor={potentialColor} stopOpacity={0.25} />
            </LinearGradient>
            <LinearGradient id="shimmerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="white" stopOpacity={0} />
              <Stop offset="50%" stopColor="white" stopOpacity={0.3} />
              <Stop offset="100%" stopColor="white" stopOpacity={0} />
            </LinearGradient>
          </Defs>

          {/* Potential score ring (outer, ghost) */}
          <Circle
            cx={(size + 40) / 2}
            cy={(size + 40) / 2}
            r={potentialRadius}
            stroke={colors.surfaceLight}
            strokeWidth={8}
            fill="none"
            opacity={0.25}
          />
          <AnimatedCircle
            cx={(size + 40) / 2}
            cy={(size + 40) / 2}
            r={potentialRadius}
            stroke="url(#potentialGradient)"
            strokeWidth={8}
            fill="none"
            strokeDasharray={potentialCircumference}
            animatedProps={potentialAnimatedProps}
            strokeLinecap="round"
            transform={`rotate(-90, ${(size + 40) / 2}, ${(size + 40) / 2})`}
          />

          {/* Current score ring (inner, solid) */}
          <Circle
            cx={(size + 40) / 2}
            cy={(size + 40) / 2}
            r={radius}
            stroke={colors.surfaceLight}
            strokeWidth={strokeWidth}
            fill="none"
            opacity={0.3}
          />
          <AnimatedCircle
            cx={(size + 40) / 2}
            cy={(size + 40) / 2}
            r={radius}
            stroke="url(#currentGradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            animatedProps={currentAnimatedProps}
            strokeLinecap="round"
            transform={`rotate(-90, ${(size + 40) / 2}, ${(size + 40) / 2})`}
          />
        </Svg>
      </AnimatedView>

      {/* Center content - not rotated */}
      <AnimatedView style={[styles.content, scoreContainerStyle]}>
        <Text style={styles.labelSmall}>CURRENT</Text>
        <Text style={[styles.currentScore, { color: currentColor }]}>
          {displayScore.toFixed(1)}
        </Text>
        <Text style={styles.outOf}>/10</Text>
        <View style={styles.divider} />
        <View style={styles.potentialRow}>
          <Text style={[styles.potentialLabel, { color: potentialColor }]}>
            POTENTIAL
          </Text>
          <Text style={[styles.potentialScore, { color: potentialColor }]}>
            {displayPotential.toFixed(1)}
          </Text>
        </View>
        <View style={[styles.gainBadge, { backgroundColor: `${potentialColor}25`, borderColor: `${potentialColor}40` }]}>
          <Text style={[styles.gainText, { color: potentialColor }]}>
            +{possibleGain.toFixed(1)} possible
          </Text>
        </View>
      </AnimatedView>

      {/* Success particles when complete */}
      {animationComplete && (
        <View style={styles.particleContainer}>
          <Particle delay={0} color={currentColor} startX={0} startY={0} endX={-50} endY={-60} />
          <Particle delay={50} color={potentialColor} startX={0} startY={0} endX={50} endY={-60} />
          <Particle delay={100} color={currentColor} startX={0} startY={0} endX={-60} endY={-30} />
          <Particle delay={150} color={potentialColor} startX={0} startY={0} endX={60} endY={-30} />
          <Particle delay={200} color={currentColor} startX={0} startY={0} endX={-50} endY={50} />
          <Particle delay={250} color={potentialColor} startX={0} startY={0} endX={50} endY={50} />
          <Particle delay={300} color={currentColor} startX={0} startY={0} endX={-30} endY={60} />
          <Particle delay={350} color={potentialColor} startX={0} startY={0} endX={30} endY={60} />
          <Particle delay={400} color={currentColor} startX={0} startY={0} endX={0} endY={-70} />
          <Particle delay={450} color={potentialColor} startX={0} startY={0} endX={0} endY={70} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
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
    position: 'absolute',
  },
  labelSmall: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 2,
    marginBottom: 4,
  },
  currentScore: {
    fontSize: 72,
    fontWeight: '800',
    letterSpacing: -3,
    lineHeight: 72,
  },
  outOf: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.textMuted,
    marginTop: -8,
    marginBottom: 4,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: colors.border,
    marginVertical: 12,
    borderRadius: 1,
  },
  potentialRow: {
    alignItems: 'center',
  },
  potentialLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  potentialScore: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -1,
  },
  gainBadge: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  gainText: {
    fontSize: 14,
    fontWeight: '700',
  },
  glow: {
    position: 'absolute',
    borderRadius: 999,
    zIndex: -1,
  },
  outerGlow: {
    position: 'absolute',
    borderRadius: 999,
    zIndex: -2,
  },
  particleContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
});
