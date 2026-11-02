import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { buildSite } from '../tooling/site/build/site.js';
import { buildAppearance } from '../tooling/site/build/appearance.js';

vi.mock('../tooling/site/build/site.js', () => ({ buildSite: vi.fn() }));
vi.mock('../tooling/site/build/appearance.js', () => ({ buildAppearance: vi.fn() }));
beforeEach(() => {
  vi.resetModules();
  vi.mocked(buildSite).mockReset().mockResolvedValue(undefined);
  vi.mocked(buildAppearance).mockReset().mockResolvedValue(undefined);
  vi.spyOn(process, 'cwd').mockReturnValue('/workspace');
});
afterEach(() => vi.restoreAllMocks());

it('builds the current checkout without deploying', async () => {
  await import('./site-build.js');
  expect(buildSite).toHaveBeenCalledWith('/workspace');
  expect(buildAppearance).toHaveBeenCalledWith('/workspace');
  expect(buildAppearance).toHaveBeenCalledBefore(vi.mocked(buildSite));
});

it('propagates build failures to the invoking check', async () => {
  vi.mocked(buildSite).mockRejectedValueOnce(new Error('Invalid documentation'));
  await expect(import('./site-build.js')).rejects.toThrow('Invalid documentation');
});
