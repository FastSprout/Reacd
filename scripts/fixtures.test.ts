import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { parseDocumentJson } from '../src/contract.js';

const { read, write } = vi.hoisted(() => ({
  read: vi.fn<(path: URL, encoding: string) => string>(),
  write: vi.fn<(path: URL, contents: string) => void>(),
}));
vi.mock('node:fs', () => ({ readFileSync: read, writeFileSync: write }));
const originalArguments = process.argv;
const scenarios = ['standard', 'long', 'empty', 'loading', 'error'];
beforeEach(() => {
  vi.resetModules();
  read.mockReset();
  write.mockReset();
  process.argv = ['node', 'fixtures.ts'];
});
afterEach(() => {
  process.argv = originalArguments;
});

describe('fixture CLI', () => {
  it('generates every declared scenario as a valid document', async () => {
    await import('./fixtures.js');
    expect(write.mock.calls.map(([path]) => path.pathname.split('/').at(-1))).toEqual(
      scenarios.map((name) => `${name}.json`),
    );
    for (const [path, output] of write.mock.calls) {
      expect(path.pathname).toMatch(
        /\/test-support\/fixtures\/generative\/[a-z]+\.json$/,
      );
      expect(output.endsWith('\n')).toBe(true);
      expect(parseDocumentJson(output).success).toBe(true);
    }
    expect(read).not.toHaveBeenCalled();
  });
  it('checks all outputs without writing or skipping later scenarios', async () => {
    await import('./fixtures.js');
    const files = new Map(write.mock.calls.map(([path, text]) => [path.href, text]));
    vi.resetModules();
    write.mockClear();
    process.argv.push('--check');
    read.mockImplementation((path) => {
      const contents = files.get(path.href);
      if (contents === undefined) throw new Error('Unexpected fixture path.');
      return contents;
    });
    await import('./fixtures.js');
    expect(read).toHaveBeenCalledTimes(scenarios.length);
    expect(write).not.toHaveBeenCalled();
  });
  it('reports stale output and does not repair files in check mode', async () => {
    process.argv.push('--check');
    read.mockReturnValue('{}');
    await expect(import('./fixtures.js')).rejects.toThrow('Stale fixture: standard.');
    expect(read).toHaveBeenCalledOnce();
    expect(write).not.toHaveBeenCalled();
  });
  it('propagates filesystem failures in generation and check mode', async () => {
    const failure = new Error('Filesystem unavailable.');
    write.mockImplementation(() => {
      throw failure;
    });
    await expect(import('./fixtures.js')).rejects.toBe(failure);
    vi.resetModules();
    process.argv.push('--check');
    read.mockImplementation(() => {
      throw failure;
    });
    await expect(import('./fixtures.js')).rejects.toBe(failure);
  });
});
