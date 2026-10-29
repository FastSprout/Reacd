import { beforeEach, expect, it, vi } from 'vitest';
const { validate, publish } = vi.hoisted(() => ({
  validate:
    vi.fn<(root: string, entries: readonly unknown[], built: boolean) => void>(),
  publish: vi.fn<(build: string, site: string) => void>(),
}));
vi.mock('../tooling/docs-preview/artifacts.js', () => ({
  validateReferences: validate,
  publishPreviewAssets: publish,
}));
beforeEach(() => {
  vi.resetModules();
  validate.mockReset();
  publish.mockReset();
});
it('checks all source declarations without copying generated files', async () => {
  process.argv.push('--source');
  await import('./docs-assets.js');
  expect(validate.mock.calls.at(0)?.at(1)).toHaveLength(150);
  expect(validate.mock.calls.at(0)?.at(2)).toBe(false);
  expect(publish).not.toHaveBeenCalled();
  process.argv.pop();
});
it('validates built references and copies compiled assets', async () => {
  await import('./docs-assets.js');
  expect(validate.mock.calls.at(0)?.at(2)).toBe(true);
  expect(publish).toHaveBeenCalledExactlyOnceWith(
    `${process.cwd()}/.cache/docs-preview-dist`,
    `${process.cwd()}/site`,
  );
});
