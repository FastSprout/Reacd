export const INPUT_NUMBER_POLICY = {
  minimum: -Number.MAX_SAFE_INTEGER,
  maximum: Number.MAX_SAFE_INTEGER,
  maxFractionDigits: 12,
  minFractionDigits: 0,
  step: 1,
  smallStep: 0.1,
  largeStep: 10,
  locale: 'en-US',
} as const;

export const NUMBER_FORMAT_STYLES = ['decimal', 'percent', 'currency'] as const;
