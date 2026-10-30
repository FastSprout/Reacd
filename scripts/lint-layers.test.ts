import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { discover, read } = vi.hoisted(() => ({
  discover: vi.fn<(patterns: readonly string[]) => string[]>(),
  read: vi.fn<(path: string, encoding: string) => string>(),
}));
vi.mock('node:fs', () => ({ globSync: discover, readFileSync: read }));
const previousExit = process.exitCode;

beforeEach(() => {
  vi.resetModules();
  discover.mockReset().mockReturnValue(['src/core/value.ts']);
  read.mockReset().mockReturnValue('export const value = 1;');
  process.exitCode = undefined;
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
});
afterEach(() => {
  process.exitCode = previousExit;
  vi.restoreAllMocks();
});

describe('layer lint CLI', () => {
  it('discovers production sources without local specifications', async () => {
    await import('./lint-layers.js');
    expect(discover).toHaveBeenCalledWith(['src/**/*.{ts,tsx,mts,cts}']);
    expect(read).toHaveBeenCalledWith(
      expect.stringMatching(/src\/core\/value\.ts$/),
      'utf8',
    );
    expect(console.error).not.toHaveBeenCalled();
    expect(process.exitCode).toBeUndefined();
  });

  it('reports positioned violations and sets a failing workflow status', async () => {
    discover.mockReturnValue(['src/core/a.ts', 'src/core/b.ts']);
    read.mockImplementation((path) =>
      path.endsWith('a.ts') ? "import './b.js';" : "\nexport * from './a.js';",
    );
    await import('./lint-layers.js');
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/src\/core\/b\.ts:2:1 \[architecture-cycle\]/),
    );
    expect(process.exitCode).toBe(1);
  });

  it('rejects an empty production inventory', async () => {
    discover.mockReturnValue(['src/core/value.test.ts']);
    await expect(import('./lint-layers.js')).rejects.toThrow('production modules');
  });

  it('propagates discovery and read failures', async () => {
    const failure = new Error('Cannot read source.');
    discover.mockImplementation(() => {
      throw failure;
    });
    await expect(import('./lint-layers.js')).rejects.toBe(failure);
    vi.resetModules();
    discover.mockReturnValue(['src/core/a.ts']);
    read.mockImplementation(() => {
      throw failure;
    });
    await expect(import('./lint-layers.js')).rejects.toBe(failure);
  });
});
