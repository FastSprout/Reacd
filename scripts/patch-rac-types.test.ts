import { expect, it, vi } from 'vitest';

const patch = vi.hoisted(() => vi.fn(() => 2));
vi.mock('../tooling/dependencies/rac-types.js', () => ({
  patchRacDeclarations: patch,
}));

it('checks installed React Aria declarations', async () => {
  const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
  await import('./patch-rac-types.js');
  expect(patch).toHaveBeenCalledWith(new URL('../', import.meta.url));
  expect(log).toHaveBeenCalledWith('Verified RAC declarations; corrected files: 2.');
  log.mockRestore();
});
