// Design System Tokens - Cyber-Minimalist Developer System
// Centralized design constants following DRY principle

export const colors = {
  // Surface colors
  surface: '#111318',
  surfaceDim: '#111318',
  surfaceBright: '#37393e',
  surfaceContainerLowest: '#0c0e12',
  surfaceContainerLow: '#1a1c20',
  surfaceContainer: '#1e2024',
  surfaceContainerHigh: '#282a2e',
  surfaceContainerHighest: '#333539',
  
  // On-surface colors
  onSurface: '#e2e2e8',
  onSurfaceVariant: '#b9caca',
  inverseSurface: '#e2e2e8',
  inverseOnSurface: '#2f3035',
  
  // Outline
  outline: '#849495',
  outlineVariant: '#3a494a',
  
  // Primary (Cyan)
  primary: '#e9feff',
  onPrimary: '#003739',
  primaryContainer: '#00f5ff',
  onPrimaryContainer: '#006c71',
  inversePrimary: '#00696e',
  primaryFixed: '#63f7ff',
  primaryFixedDim: '#00dce5',
  onPrimaryFixed: '#002021',
  onPrimaryFixedVariant: '#004f53',
  surfaceTint: '#00dce5',
  
  // Secondary (Emerald)
  secondary: '#4edea3',
  onSecondary: '#003824',
  secondaryContainer: '#00a572',
  onSecondaryContainer: '#00311f',
  secondaryFixed: '#6ffbbe',
  secondaryFixedDim: '#4edea3',
  onSecondaryFixed: '#002113',
  onSecondaryFixedVariant: '#005236',
  
  // Tertiary
  tertiary: '#fcf8ff',
  onTertiary: '#1000a9',
  tertiaryContainer: '#dbdaff',
  onTertiaryContainer: '#4c4ed9',
  tertiaryFixed: '#e1e0ff',
  tertiaryFixedDim: '#c0c1ff',
  onTertiaryFixed: '#07006c',
  onTertiaryFixedVariant: '#2f2ebe',
  
  // Error
  error: '#ffb4ab',
  onError: '#690005',
  errorContainer: '#93000a',
  onErrorContainer: '#ffdad6',
  
  // Background
  background: '#111318',
  onBackground: '#e2e2e8',
  
  // Category accent colors
  accent: {
    blue: '#00dce5',
    green: '#4edea3',
    red: '#ffb4ab',
    purple: '#c0c1ff',
    yellow: '#ffbd2e',
  }
};

export const typography = {
  display: {
    fontFamily: '"Geist", system-ui, -apple-system, sans-serif',
    fontSize: '64px',
    fontWeight: '800',
    lineHeight: '1.1',
    letterSpacing: '-0.04em',
  },
  headlineLg: {
    fontFamily: '"Geist", system-ui, -apple-system, sans-serif',
    fontSize: '40px',
    fontWeight: '700',
    lineHeight: '1.2',
    letterSpacing: '-0.02em',
  },
  headlineLgMobile: {
    fontFamily: '"Geist", system-ui, -apple-system, sans-serif',
    fontSize: '32px',
    fontWeight: '700',
    lineHeight: '1.2',
  },
  headlineMd: {
    fontFamily: '"Geist", system-ui, -apple-system, sans-serif',
    fontSize: '24px',
    fontWeight: '600',
    lineHeight: '1.3',
  },
  bodyLg: {
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    fontSize: '18px',
    fontWeight: '400',
    lineHeight: '1.6',
  },
  bodyMd: {
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '1.5',
  },
  codeSm: {
    fontFamily: '"JetBrains Mono", "Consolas", monospace',
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '1.4',
  },
  labelCaps: {
    fontFamily: '"JetBrains Mono", "Consolas", monospace',
    fontSize: '12px',
    fontWeight: '600',
    lineHeight: '1.2',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
};

export const spacing = {
  unit: '4px',
  containerMax: '1200px',
  gutter: '24px',
  marginMobile: '16px',
  sectionGap: '120px',
  cardPadding: '32px',
};

export const borderRadius = {
  sm: '0.125rem', // 2px
  default: '0.25rem', // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  full: '9999px',
};

export const shadows = {
  glowPrimary: '0 0 20px rgba(0, 220, 229, 0.15)',
  glowSecondary: '0 0 20px rgba(78, 222, 163, 0.15)',
  glowStrong: '0 0 30px rgba(0, 220, 229, 0.3)',
};

export const transitions = {
  default: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
  slow: 'all 0.6s ease-out',
};

export const breakpoints = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1200px',
};

// Glassmorphism effects
export const glass = {
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(12px)',
};
