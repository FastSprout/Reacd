export const CHOICE_ORIENTATIONS = ['vertical', 'horizontal'] as const;
export const CHOICE_DEFAULTS = { orientation: 'vertical', emptyValue: '' } as const;
export const CHOICE_POLICY = {
  minItems: 1,
  minMaxSelection: 1,
  requiredMessage: 'Choose an option to continue.',
  markerRatio: 2,
  checkboxMarkerRem: 1.125,
  checkboxGlyphRem: 1,
  checkboxRadiusRem: 0.25,
} as const;
