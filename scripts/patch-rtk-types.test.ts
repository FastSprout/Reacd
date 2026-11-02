import { expect, it, vi } from 'vitest';

const patch = vi.hoisted(() => vi.fn(() => 2));
vi.mock('../tooling/dependencies/rtk-types.js', () => ({
  patchRtkDeclarations: patch,
}));

it('checks the installed pinned Redux Toolkit declarations', async () => {
  const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
  await import('./patch-rtk-types.js');
  expect(patch).toHaveBeenCalledWith(new URL('../', import.meta.url));
  expect(log).toHaveBeenCalledWith('Verified RTK declarations; corrected files: 2.');
  log.mockRestore();
});
