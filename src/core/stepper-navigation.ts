export interface StepTarget {
  key: string;
  disabled?: boolean | undefined;
}

export function reachableStepKeys(
  items: readonly StepTarget[],
  value: string,
  linear: boolean,
): string[] {
  const enabled = items.filter((item) => !item.disabled);
  const current = enabled.findIndex((item) => item.key === value);
  return enabled
    .filter((_item, index) => !linear || index <= current + 1)
    .map((item) => item.key);
}

export function stepFocusTarget(
  keys: readonly string[],
  current: string,
  key: string,
  orientation: 'horizontal' | 'vertical',
  direction: 'ltr' | 'rtl',
): string | undefined {
  if (key === 'Home') return keys[0];
  if (key === 'End') return keys.at(-1);
  const forward =
    orientation === 'vertical'
      ? 'ArrowDown'
      : direction === 'rtl'
        ? 'ArrowLeft'
        : 'ArrowRight';
  const backward =
    orientation === 'vertical'
      ? 'ArrowUp'
      : direction === 'rtl'
        ? 'ArrowRight'
        : 'ArrowLeft';
  if (key !== forward && key !== backward) return undefined;
  const index = keys.indexOf(current);
  const next = index + (key === forward ? 1 : -1);
  return keys[next] ?? current;
}
