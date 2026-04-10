import { MD3LightTheme } from 'react-native-paper';
import { AffectiveState } from '@/constants/DummyData';

export const palette = {
  navy: '#0A1224',
  ink: '#1D2A42',
  slate: '#61708C',
  mist: '#EDF3FF',
  surface: '#F9FBFF',
  border: '#D7E3FA',
  primary: '#3D8BFF',
  primaryMuted: '#DDEBFF',
  secondary: '#22C7A8',
  secondaryMuted: '#D9FBF2',
  warning: '#FFB545',
  warningMuted: '#FFF1D8',
  danger: '#FF6B86',
  dangerMuted: '#FFE0E8',
  accent: '#8A7CFF',
  accentMuted: '#ECE9FF',
  sky: '#8BE7FF',
  glow: '#9AC7FF',
};

export const gradients = {
  hero: ['#081120', '#11305B', '#3D8BFF'] as const,
  calm: ['#F1F7FF', '#EEFDF8'] as const,
  alert: ['#FFF5E8', '#FFF0F6'] as const,
};

export const appTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: palette.primary,
    secondary: palette.secondary,
    tertiary: palette.accent,
    background: palette.mist,
    surface: palette.surface,
    surfaceVariant: '#EAF1FF',
    outline: palette.border,
    error: palette.danger,
    onPrimary: '#FFFFFF',
    onSurface: palette.navy,
    onSurfaceVariant: palette.slate,
  },
  roundness: 22,
};

export const Colors = {
  light: {
    text: palette.navy,
    background: palette.mist,
    tint: palette.primary,
    icon: palette.slate,
    tabIconDefault: '#8C96A8',
    tabIconSelected: palette.primary,
  },
  dark: {
    text: palette.surface,
    background: palette.navy,
    tint: palette.surface,
    icon: '#C0C7D4',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: palette.surface,
  },
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
};

export const radii = {
  sm: 14,
  md: 20,
  lg: 28,
  pill: 999,
};

export const shadows = {
  card: {
    elevation: 4,
    shadowColor: '#0A1224',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 22,
  },
};

export const emotionThemes: Record<
  AffectiveState,
  {
    gradient: [string, string, string];
    surfaceTint: string;
    accent: string;
    soft: string;
  }
> = {
  curiosity: {
    gradient: ['#071624', '#0E4A5E', '#22C7A8'],
    surfaceTint: '#ECFFF8',
    accent: palette.secondary,
    soft: '#D9F6EC',
  },
  confusion: {
    gradient: ['#0C1730', '#374D75', '#FFB545'],
    surfaceTint: '#FFF9EE',
    accent: palette.warning,
    soft: '#FFF1D6',
  },
  frustration: {
    gradient: ['#17142C', '#5A2B4A', '#FF6B86'],
    surfaceTint: '#FFF3F7',
    accent: palette.danger,
    soft: '#FFE2E8',
  },
  boredom: {
    gradient: ['#0B1630', '#433E73', '#8A7CFF'],
    surfaceTint: '#F4F2FF',
    accent: palette.accent,
    soft: '#EEE7FF',
  },
};

export const getEmotionTheme = (state: AffectiveState) => emotionThemes[state];
