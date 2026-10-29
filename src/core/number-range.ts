export interface NumberRange {
  readonly start: number;
  readonly end: number;
}

export interface NumberRangeBounds {
  readonly min?: number | undefined;
  readonly max?: number | undefined;
}

export function isOrderedNumberRange(value: NumberRange): boolean {
  return (
    Number.isFinite(value.start) &&
    Number.isFinite(value.end) &&
    value.start <= value.end
  );
}
