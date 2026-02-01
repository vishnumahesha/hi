import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, spacing, shadows } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const sizeStyles = {
    small: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      fontSize: 14,
    },
    medium: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      fontSize: 16,
    },
    large: {
      paddingVertical: spacing.lg - 4,
      paddingHorizontal: spacing.xl,
      fontSize: 18,
    },
  };

  const currentSize = sizeStyles[size];

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={[styles.container, fullWidth && styles.fullWidth]}
      >
        <LinearGradient
          colors={
            isDisabled
              ? [colors.surfaceLight, colors.surface]
              : [colors.primary, colors.primaryDark]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradient,
            {
              paddingVertical: currentSize.paddingVertical,
              paddingHorizontal: currentSize.paddingHorizontal,
            },
            !isDisabled && shadows.glow,
          ]}
        >
          {loading ? (
            <ActivityIndicator color={colors.text} size="small" />
          ) : (
            <View style={styles.content}>
              {icon && <View style={styles.icon}>{icon}</View>}
              <Text
                style={[
                  styles.text,
                  { fontSize: currentSize.fontSize },
                  isDisabled && styles.textDisabled,
                ]}
              >
                {title}
              </Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const variantStyles = {
    secondary: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      textColor: colors.text,
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: colors.primary,
      textColor: colors.primary,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      textColor: colors.primary,
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          backgroundColor: currentVariant.backgroundColor,
          borderColor: currentVariant.borderColor,
          paddingVertical: currentSize.paddingVertical,
          paddingHorizontal: currentSize.paddingHorizontal,
        },
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={currentVariant.textColor} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text
            style={[
              styles.text,
              { fontSize: currentSize.fontSize, color: currentVariant.textColor },
              isDisabled && styles.textDisabled,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {},
  fullWidth: {
    width: '100%',
  },
  gradient: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontWeight: '600',
    color: colors.text,
  },
  textDisabled: {
    color: colors.textMuted,
  },
  disabled: {
    opacity: 0.5,
  },
});
