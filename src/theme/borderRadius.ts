import { scale } from '../utils/scale';

export const borderRadius = {
  none: 0,
  sm: scale(4),
  base: scale(8),
  md: scale(12),
  lg: scale(16),
  xl: scale(20),
  '2xl': scale(24),
  full: 9999,
};

export type BorderRadius = typeof borderRadius;

