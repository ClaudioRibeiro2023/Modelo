/**
 * Design Tokens - Colors
 * 
 * Paleta de cores semântica para o design system.
 * Customize estes valores para cada projeto derivado.
 */

export const colors = {
  // Brand Colors - Cores principais da marca
  brand: {
    primary: {
      50: '#E6F7FA',
      100: '#CCF0F5',
      200: '#99E0EB',
      300: '#66D1E0',
      400: '#33C1D6',
      500: '#0087A8', // Default
      600: '#006C86',
      700: '#005165',
      800: '#003643',
      900: '#001B22',
    },
    secondary: {
      50: '#E6F2F4',
      100: '#CCE5E9',
      200: '#99CAD3',
      300: '#66B0BD',
      400: '#3395A7',
      500: '#005F73', // Default
      600: '#004C5C',
      700: '#003945',
      800: '#00262E',
      900: '#001317',
    },
    accent: {
      50: '#F4FAF8',
      100: '#E9F5F1',
      200: '#D3EBE3',
      300: '#BDE1D5',
      400: '#A7D7C7',
      500: '#94D2BD', // Default
      600: '#76A897',
      700: '#597E71',
      800: '#3B544B',
      900: '#1E2A26',
    },
  },

  // Semantic Colors - Estados e feedback
  semantic: {
    success: {
      50: '#ECFDF5',
      100: '#D1FAE5',
      200: '#A7F3D0',
      300: '#6EE7B7',
      400: '#34D399',
      500: '#10B981',
      600: '#059669',
      700: '#047857',
      800: '#065F46',
      900: '#064E3B',
    },
    warning: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B',
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
    },
    error: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA',
      300: '#FCA5A5',
      400: '#F87171',
      500: '#EF4444',
      600: '#DC2626',
      700: '#B91C1C',
      800: '#991B1B',
      900: '#7F1D1D',
    },
    info: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      200: '#BFDBFE',
      300: '#93C5FD',
      400: '#60A5FA',
      500: '#3B82F6',
      600: '#2563EB',
      700: '#1D4ED8',
      800: '#1E40AF',
      900: '#1E3A8A',
    },
  },

  // Neutral Colors - Grays
  neutral: {
    0: '#FFFFFF',
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },
} as const

// Tokens semânticos para surfaces
export const surfaces = {
  light: {
    base: colors.neutral[50],
    elevated: colors.neutral[0],
    muted: colors.neutral[100],
    subtle: colors.neutral[200],
    overlay: 'rgba(15, 23, 42, 0.5)',
  },
  dark: {
    base: colors.neutral[900],
    elevated: colors.neutral[800],
    muted: colors.neutral[700],
    subtle: colors.neutral[600],
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
} as const

// Tokens semânticos para texto
export const textColors = {
  light: {
    primary: colors.neutral[900],
    secondary: colors.neutral[600],
    muted: colors.neutral[400],
    disabled: colors.neutral[300],
    inverse: colors.neutral[0],
    link: colors.brand.primary[500],
    linkHover: colors.brand.primary[600],
  },
  dark: {
    primary: colors.neutral[50],
    secondary: colors.neutral[300],
    muted: colors.neutral[500],
    disabled: colors.neutral[600],
    inverse: colors.neutral[900],
    link: colors.brand.primary[400],
    linkHover: colors.brand.primary[300],
  },
} as const

// Tokens semânticos para bordas
export const borderColors = {
  light: {
    default: colors.neutral[200],
    muted: colors.neutral[100],
    strong: colors.neutral[300],
    focus: colors.brand.primary[500],
  },
  dark: {
    default: colors.neutral[700],
    muted: colors.neutral[800],
    strong: colors.neutral[600],
    focus: colors.brand.primary[400],
  },
} as const

export type ColorScale = typeof colors.brand.primary
export type SemanticColor = keyof typeof colors.semantic
export type NeutralColor = keyof typeof colors.neutral
