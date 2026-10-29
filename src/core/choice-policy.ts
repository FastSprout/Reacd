export const CHOICE_ORIENTATIONS = ['vertical', 'horizontal'] as const;
export const CHOICE_DEFAULTS = { orientation: 'vertical', emptyValue: '' } as const;
export const CHOICE_POLICY = {
  minItems: 1,
  minMaxSelection: 1,
  markerRatio: 2,
} as const;
