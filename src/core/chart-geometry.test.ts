import { expect, it } from 'vitest';
import {
  chartDomain,
  chartPoints,
  chartLinePath,
  chartAreaPath,
  chartDonutSlices,
} from './chart-geometry.js';
it('keeps zero in domains and never connects across missing points', () => {
  expect(chartDomain([[5, 10]])).toEqual({ minimum: 0, maximum: 10 });
  expect(chartDomain([[-5, -10]])).toEqual({ minimum: -10, maximum: 0 });
  expect(chartDomain([[0, null]])).toEqual({ minimum: 0, maximum: 1 });
  const domain = chartDomain([[-5, null, 10]]);
  const segments = chartPoints([-5, null, 10], domain, false);
  expect(segments).toHaveLength(2);
  expect(segments.flat().map((point) => point.value)).toEqual([-5, 10]);
  expect(chartLinePath(segments[0] ?? [])).toMatch(/^M /);
  expect(chartLinePath([])).toBe('');
  expect(chartAreaPath([], 100)).toBe('');
  expect(chartAreaPath(segments[0] ?? [], 100)).toMatch(/Z$/);
  expect(chartAreaPath(segments[0] ?? [], 100).match(/M /g)).toHaveLength(1);
  const single = chartPoints([2], chartDomain([[2]]), true);
  expect(single[0]?.[0]?.x).toBe(320);
  expect(chartPoints([null], domain, false)).toEqual([]);
  const forward = chartPoints([1, 2], chartDomain([[1, 2]]), false);
  const reverse = chartPoints([1, 2], chartDomain([[1, 2]]), true);
  expect(forward[0]?.[0]?.x).toBe(reverse[0]?.[1]?.x);
});
it('builds finite donut paths, including a whole ring and missing slices', () => {
  expect(chartDonutSlices([0, null])).toEqual([]);
  const slices = chartDonutSlices([1, null, 0, 3]);
  expect(slices.map((slice) => slice.index)).toEqual([0, 3]);
  expect(slices.every((slice) => !/NaN|Infinity/.test(slice.path))).toBe(true);
  expect(chartDonutSlices([4])[0]?.path.match(/ A /g)).toHaveLength(4);
});
