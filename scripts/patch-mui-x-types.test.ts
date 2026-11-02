import { expect, it, vi } from 'vitest';

const patch = vi.hoisted(() => vi.fn(() => 3));
vi.mock('../tooling/dependencies/mui-x-types.js', () => ({
  patchMuiXDeclarations: patch,
}));

it('patches only the source checkout and reports the verified file count', async () => {
  const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
  await import('./patch-mui-x-types.js');
  expect(patch).toHaveBeenCalledExactlyOnceWith(new URL('../', import.meta.url));
  expect(log).toHaveBeenCalledWith('Verified MUI X declarations; corrected files: 3.');
  log.mockRestore();
});
