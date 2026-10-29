import { PROGRESS_GROUP_POLICY } from './progress-group-policy.js';

export function progressGroupLayout<Item extends { value: number }>(
  items: readonly Item[],
  max: number,
) {
  const clamped = items.map((item) => ({
    ...item,
    value: Math.min(max, Math.max(0, item.value)),
  }));
  const total = clamped.reduce((sum, item) => sum + item.value, 0);
  const denominator = Math.max(max, total);
  return {
    value: Math.min(total, max),
    items: clamped.map((item) => ({
      ...item,
      percent: (item.value / denominator) * PROGRESS_GROUP_POLICY.percent,
    })),
  };
}
