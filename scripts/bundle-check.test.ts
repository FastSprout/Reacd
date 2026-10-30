import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fileURLToPath } from 'node:url';

const { files, read, stat, inspect, log } = vi.hoisted(() => ({
  files: vi.fn<() => string[]>(),
  read: vi.fn<() => string>(),
  stat: vi.fn<() => { size: number }>(),
  inspect: vi.fn<(input: unknown, assets: ReadonlyMap<string, number>) => unknown>(),
  log: vi.fn(),
}));
vi.mock('node:fs', () => ({ globSync: files, readFileSync: read, statSync: stat }));
vi.mock('../tooling/build/bundle-report.js', () => ({ inspectBundle: inspect }));
beforeEach(() => {
  vi.resetModules();
  files.mockReset().mockReturnValue(['assets/main.js']);
  read.mockReset().mockReturnValue('{}');
  stat.mockReset().mockReturnValue({ size: 100 });
  inspect.mockReset().mockReturnValue({ chunkCount: 1 });
  log.mockReset();
  vi.spyOn(console, 'log').mockImplementation(log);
});
describe('bundle acceptance CLI', () => {
  it('reads generated artifacts and reports the validated measurement', async () => {
    files.mockReturnValue(['assets/main.js', 'assets/nested/chunk.js']);
    inspect.mockReturnValue({ chunkCount: 2 });
    await import('./bundle-check.js');
    expect(files).toHaveBeenCalledExactlyOnceWith('**/*.js', {
      cwd: fileURLToPath(new URL('../.cache/conformance-dist/', import.meta.url)),
    });
    expect(inspect).toHaveBeenCalledExactlyOnceWith(
      {},
      new Map([
        ['assets/main.js', 100],
        ['assets/nested/chunk.js', 100],
      ]),
    );
    expect(log).toHaveBeenCalledExactlyOnceWith(
      'Conformance JavaScript bundle acceptance:',
      { chunkCount: 2 },
    );
  });
  it('propagates malformed manifest data without reporting success', async () => {
    read.mockReturnValue('not JSON');
    await expect(import('./bundle-check.js')).rejects.toBeInstanceOf(SyntaxError);
    expect(inspect).not.toHaveBeenCalled();
    expect(log).not.toHaveBeenCalled();
  });
  it('propagates missing assets and rejected bundle budgets', async () => {
    const failure = new Error('Asset missing.');
    stat.mockImplementation(() => {
      throw failure;
    });
    await expect(import('./bundle-check.js')).rejects.toBe(failure);
    expect(log).not.toHaveBeenCalled();
    vi.resetModules();
    stat.mockReturnValue({ size: 100 });
    inspect.mockImplementation(() => {
      throw failure;
    });
    await expect(import('./bundle-check.js')).rejects.toBe(failure);
    expect(log).not.toHaveBeenCalled();
  });
});
