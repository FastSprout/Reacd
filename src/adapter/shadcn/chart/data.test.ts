import { expect, it } from 'vitest';
import { chartRows, numericDomain, positiveShares, seriesKey } from './data.js';

it('maps validated values to opaque SDK keys without changing null or zero', () => {
  const categories = [{ id: 'a.b', label: 'First' }, { id: 'c-d', label: 'Second' }];
  const series = [{ id: 'series.name', label: 'Count', values: [0, null] }];
  expect(seriesKey(0)).toBe('series_0');
  expect(chartRows(categories, series)).toEqual([
    { category: 'First', series_0: 0 }, { category: 'Second', series_0: null },
  ]);
  expect(positiveShares(categories, series)).toEqual([]);
  expect(positiveShares(categories, [])).toEqual([]);
  expect(positiveShares(categories, [{ ...series[0], id: 'count', label: 'Count',
    values: [2, 3] }])).toEqual([
    { category: 'First', value: 2 }, { category: 'Second', value: 3 },
  ]);
});

it('includes zero and gives empty/constant domains a stable nonzero extent', () => {
  const series = (values: readonly (number | null)[]) => [{
    id: 'count', label: 'Count', values,
  }];
  expect(numericDomain(series([2, 5]))).toEqual([0, 5]);
  expect(numericDomain(series([-5, -2]))).toEqual([-5, 0]);
  expect(numericDomain(series([-5, 2]))).toEqual([-5, 2]);
  expect(numericDomain(series([0, null, 0]))).toEqual([0, 1]);
  expect(numericDomain([])).toEqual([0, 1]);
});
