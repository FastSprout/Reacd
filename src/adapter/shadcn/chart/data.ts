import type { ChartProps } from
  '@fastsprout/reacd/adapter-runtime/components/chart/chart.props.js';
import { CHART_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/chart-policy.js';

type Categories = ChartProps['categories'];
type Series = ChartProps['series'];
type ChartValue = string | number | null;

export function seriesKey(index: number): string {
  return `series_${index}`;
}

export function chartRows(categories: Categories, series: Series) {
  return categories.map((category, row) => ({
    category: category.label,
    ...Object.fromEntries<ChartValue>(series.map((item, column) => [
      seriesKey(column), item.values[row] ?? null,
    ])),
  }));
}

export function chartConfiguration(series: Series) {
  return Object.fromEntries<{ label: string }>(series.map((item, index) => [
    seriesKey(index), { label: item.label },
  ]));
}

export function numericDomain(series: Series): [number, number] {
  const values = series.flatMap(item => item.values).filter(value => value !== null);
  const minimum = Math.min(CHART_POLICY.zero, ...values);
  const maximum = Math.max(CHART_POLICY.zero, ...values);
  return [minimum, maximum === minimum ? minimum + CHART_POLICY.unitDomain : maximum];
}

export function positiveShares(categories: Categories, series: Series) {
  return categories.flatMap((category, index) => {
    const value = series[0]?.values[index] ?? null;
    return value !== null && value > CHART_POLICY.zero
      ? [{ category: category.label, value }]
      : [];
  });
}
