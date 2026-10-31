import { expect, it, vi } from 'vitest';

const patch = vi.hoisted(() => vi.fn(() => 2));
vi.mock('../tooling/dependencies/mui-types.js', () => ({
  patchMuiDeclarations: patch,
}));

it('patches only the source checkout and reports the verified file count', async () => {
  const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
  await import('./patch-mui-types.js');
  expect(patch).toHaveBeenCalledExactlyOnceWith(new URL('../', import.meta.url));
  expect(log).toHaveBeenCalledWith('Verified MUI declarations; corrected files: 2.');
  log.mockRestore();
});
