export const FRAMEWORK_ERRORS = {
  nativeElement: 'Native HTML elements are forbidden in reacd application TSX.',
  missingProvider: 'Reacd components require a ReacdProvider ancestor.',
  invalidChildren: 'Use reacd components instead of native HTML children.',
  invalidCallback: 'Expected a callback function.',
  nestedForm: 'Forms cannot be nested.',
} as const;
