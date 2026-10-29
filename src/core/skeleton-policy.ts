export const SKELETON_SHAPES = ['text', 'avatar', 'rectangle'] as const;
export const SKELETON_SIZES = ['small', 'medium', 'large'] as const;
export const SKELETON_DEFAULTS = {
  shape: 'text',
  size: 'medium',
  lines: 3,
  animated: true,
  show: true,
} as const;
export const SKELETON_POLICY = {
  minLines: 1,
  maxLines: 8,
  lineEm: { small: 0.75, medium: 1, large: 1.25 },
  rectangleRem: { small: 6, medium: 10, large: 14 },
  lastLinePercent: 75,
  pulseDurationMs: 1500,
  pulseIterations: 3,
  pulseOpacity: 0.45,
} as const;
