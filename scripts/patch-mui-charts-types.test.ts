import { expect, it, vi } from 'vitest';

const patch = vi.hoisted(() => vi.fn(() => 41));
vi.mock('../tooling/dependencies/mui-charts-types.js', () => ({
  patchMuiChartsDeclarations: patch,
}));

it('patches only the checkout SDK declarations and reports the count', async () => {
  const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
  await import('./patch-mui-charts-types.js');
  expect(patch).toHaveBeenCalledExactlyOnceWith(new URL('../', import.meta.url));
  expect(log).toHaveBeenCalledWith(
    'Verified MUI Charts declarations; corrected files: 41.',
  );
  log.mockRestore();
});
