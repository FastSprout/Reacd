export const INPUT_DATE_POLICY = {
  granularity: 'day',
  forceLeadingZeros: true,
  validationBehavior: 'native',
  clearLabel: 'Clear',
  startLabel: 'Start',
  endLabel: 'End',
  invalidValue: 'Date must be within its allowed limits.',
  invalidRange: 'Date range must be ordered and within its allowed limits.',
  incompleteValue: 'Complete all date segments or clear the field.',
} as const;
