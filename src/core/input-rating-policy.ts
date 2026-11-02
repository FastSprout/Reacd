export const INPUT_RATING_POLICY = {
  minLength: 1,
  maxLength: 10,
  length: 5,
  step: 1,
  emptyValue: 0,
  half: 0.5,
} as const;
export const RATING_STEPS = [
  INPUT_RATING_POLICY.step,
  INPUT_RATING_POLICY.half,
] as const;

export const INPUT_RATING_DEFAULTS = {
  clearable: false,
  shadcnHoverable: false,
  muiHoverable: true,
} as const;

export const INPUT_RATING_LABELS = {
  clearPrefix: 'Clear',
  requiredMessage: 'Choose a rating.',
  stars: 'stars',
} as const;
