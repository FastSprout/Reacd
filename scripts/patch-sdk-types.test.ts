import { expect, it, vi } from 'vitest';

const patched = vi.hoisted(() => vi.fn());
vi.mock('./patch-mui-types.js', () => {
  patched('mui');
  return {};
});
vi.mock('./patch-rac-types.js', () => {
  patched('rac');
  return {};
});
vi.mock('./patch-mui-x-types.js', () => {
  patched('mui-x');
  return {};
});
vi.mock('./patch-mui-charts-types.js', () => {
  patched('mui-charts');
  return {};
});

vi.mock('./patch-rtk-types.js', () => {
  patched('rtk');
  return {};
});

it('verifies all pinned SDK declaration corrections at install', async () => {
  await import('./patch-sdk-types.js');
  expect(patched.mock.calls).toEqual([
    ['mui'], ['mui-x'], ['mui-charts'], ['rac'], ['rtk'],
  ]);
});
