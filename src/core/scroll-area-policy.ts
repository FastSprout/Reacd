export const SCROLL_AREA_ORIENTATIONS = ['vertical', 'horizontal'] as const;
export const SCROLL_AREA_EXTENTS = ['small', 'medium', 'large'] as const;
export const SCROLL_AREA_POLICY = {
  extentRem: { small: 12, medium: 20, large: 32 },
} as const;
export const SCROLL_AREA_DEFAULTS = {
  orientation: 'vertical',
  extent: 'medium',
} as const;
