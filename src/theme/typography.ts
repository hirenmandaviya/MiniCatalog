import { normalizeFont } from '../utils/scale';

export const typography = {
  // Font families
  fontFamily: {
    regular: 'Gilroy-Regular',
    medium: 'Gilroy-Medium',
    semiBold: 'Gilroy-SemiBold',
    bold: 'Gilroy-Bold',
  },
  
  // Font sizes
  fontSize: {
    xs: normalizeFont(10),
    sm: normalizeFont(12),
    base: normalizeFont(14),
    md: normalizeFont(16),
    lg: normalizeFont(18),
    xl: normalizeFont(20),
    '2xl': normalizeFont(24),
    '3xl': normalizeFont(28),
    '4xl': normalizeFont(32),
    '5xl': normalizeFont(40),
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
  
  // Font weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
};

export type Typography = typeof typography;

