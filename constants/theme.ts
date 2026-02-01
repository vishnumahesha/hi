export const colors = {
  // Primary palette - deep violet to electric purple
  primary: '#8B5CF6',
  primaryDark: '#7C3AED',
  primaryLight: '#A78BFA',
  primaryGlow: 'rgba(139, 92, 246, 0.4)',

  // Accent - electric cyan
  accent: '#06B6D4',
  accentLight: '#22D3EE',
  accentGlow: 'rgba(6, 182, 212, 0.4)',

  // Secondary accent - rose
  rose: '#F43F5E',
  roseLight: '#FB7185',

  // Background - rich dark navy
  background: '#0A0A0F',
  backgroundSecondary: '#12121A',
  backgroundTertiary: '#1A1A25',
  surface: '#1E1E2E',
  surfaceLight: '#252535',
  surfaceHighlight: '#2A2A3E',

  // Text
  text: '#FAFAFA',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
  textAccent: '#C4B5FD',

  // Status colors
  success: '#10B981',
  successLight: '#34D399',
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  error: '#EF4444',
  errorLight: '#F87171',
  info: '#3B82F6',

  // Rating colors (gradient from low to high)
  rating: {
    low: '#EF4444', // 0-3
    medium: '#F59E0B', // 4-6
    good: '#10B981', // 7-8
    excellent: '#8B5CF6', // 9-10
  },

  // Borders
  border: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.12)',
  borderAccent: 'rgba(139, 92, 246, 0.3)',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',

  // Gradients (as arrays for LinearGradient)
  gradients: {
    primary: ['#8B5CF6', '#6366F1'],
    accent: ['#06B6D4', '#3B82F6'],
    dark: ['#12121A', '#0A0A0F'],
    surface: ['#1E1E2E', '#12121A'],
    glow: ['rgba(139, 92, 246, 0.2)', 'rgba(139, 92, 246, 0)'],
    rating: ['#10B981', '#8B5CF6'],
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  // Using system fonts with fallbacks - in production would use custom fonts
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    xxl: 32,
    display: 40,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
};

export const animations = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
    spring: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
  },
};
