import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { discover, read } = vi.hoisted(() => ({
  discover: vi.fn<(patterns: readonly string[]) => string[]>(),
  read: vi.fn<(path: string, encoding: string) => string>(),
}));
vi.mock('node:fs', () => ({ globSync: discover, readFileSync: read }));
const originalExitCode = process.exitCode;
beforeEach(() => {
  vi.resetModules();
  discover.mockReset();
  read.mockReset();
  discover.mockReturnValue(['src/core/clean.ts']);
  read.mockReturnValue('export const value = 1;\n');
  process.exitCode = undefined;
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
});
afterEach(() => {
  process.exitCode = originalExitCode;
  vi.restoreAllMocks();
});

describe('repository policy CLI', () => {
  it('discovers maintained families and validates clean files', async () => {
    await import('./policy.js');
    expect(discover).toHaveBeenCalledWith(
      expect.arrayContaining([
        'src/**/*.{ts,tsx,css}',
        'demo/**/*.{ts,tsx}',
        'tooling/**/*.{ts,tsx,txt,html}',
        'scripts/*.{ts,mjs}',
        'docs/**/*.{md,tsx,json}',
        'specs/**/*.md',
        '.github/**/*.yml',
        'release-please-config.json',
        '.release-please-manifest.json',
      ]),
    );
    expect(read).toHaveBeenCalledWith('src/core/clean.ts', 'utf8');
    expect(console.error).not.toHaveBeenCalled();
    expect(process.exitCode).toBeUndefined();
  });
  it('reports violations with path, position, rule, and failing status', async () => {
    discover.mockReturnValue(['README.md', 'package.json']);
    read.mockImplementation((path) =>
      path.endsWith('README.md') ? 'Long '.repeat(30) : '{\n "name": "bad-indent"\n}',
    );
    await import('./policy.js');
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/README\.md:1:1 \[columns\] Wrap this line\./),
    );
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/package\.json:2:1 \[indent\] Use two spaces\./),
    );
    expect(process.exitCode).toBe(1);
  });
  it('rejects an empty inventory instead of silently skipping checks', async () => {
    discover.mockReturnValue([]);
    await expect(import('./policy.js')).rejects.toThrow('repository root');
  });
  it('propagates discovery and read failures', async () => {
    const failure = new Error('Cannot access source.');
    discover.mockImplementation(() => {
      throw failure;
    });
    await expect(import('./policy.js')).rejects.toBe(failure);
    vi.resetModules();
    discover.mockReturnValue(['README.md']);
    read.mockImplementation(() => {
      throw failure;
    });
    await expect(import('./policy.js')).rejects.toBe(failure);
  });
});
