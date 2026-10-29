import { expect, it } from 'vitest';
import { CHART_POLICY } from '../../core/chart-policy.js';
import { chartSchema, chartNodeSchema } from './index.js';
const BASE = {
  label: 'Activity',
  description: 'Activity by category.',
  categories: [{ id: 'one', label: 'One' }],
  series: [{ id: 'count', label: 'Count', values: [1] }],
};
it('accepts bounded readonly values, missing data and supported kinds', () => {
  for (const kind of ['line', 'area', 'bar', 'donut']) {
    expect(chartSchema.safeParse({ ...BASE, kind }).success).toBe(true);
  }
  expect(chartSchema.safeParse({ ...BASE, series: [] }).success).toBe(true);
  expect(
    chartSchema.safeParse({
      ...BASE,
      series: [{ id: 'count', label: 'Count', values: [null] }],
    }).success,
  ).toBe(true);
  expect(chartNodeSchema.safeParse({ type: 'Chart', ...BASE }).success).toBe(true);
});
it('rejects invalid dimensions, identities, magnitudes and public escapes', () => {
  const invalid = [
    { ...BASE, label: '' },
    { ...BASE, description: '' },
    { ...BASE, kind: 'custom' },
    { ...BASE, style: {} },
    { ...BASE, onRetry: 'retry' },
    { ...BASE, categories: [...BASE.categories, ...BASE.categories] },
    { ...BASE, series: [...BASE.series, ...BASE.series] },
    { ...BASE, series: [{ ...BASE.series[0], values: [] }] },
    { ...BASE, series: [{ id: 'x', label: 'X', values: [Infinity] }] },
    {
      ...BASE,
      series: [{ id: 'x', label: 'X', values: [CHART_POLICY.maximumMagnitude + 1] }],
    },
    {
      ...BASE,
      categories: Array.from({ length: CHART_POLICY.maxCategories + 1 }, (_, i) => ({
        id: `c${i}`,
        label: `Category ${i}`,
      })),
    },
    {
      ...BASE,
      series: Array.from({ length: CHART_POLICY.maxSeries + 1 }, (_, i) => ({
        id: `s${i}`,
        label: `Series ${i}`,
        values: [1],
      })),
    },
    { ...BASE, kind: 'donut', series: [{ id: 'x', label: 'X', values: [-1] }] },
    {
      ...BASE,
      kind: 'donut',
      series: [...BASE.series, { id: 'other', label: 'Other', values: [2] }],
    },
  ];
  for (const data of invalid) expect(chartSchema.safeParse(data).success).toBe(false);
});
