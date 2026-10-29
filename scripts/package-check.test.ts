import { existsSync, readFileSync } from 'node:fs';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

interface CompilationResult {
  status: number | null;
  stdout: string;
  stderr: string;
}
const { execute, compile } = vi.hoisted(() => ({
  execute:
    vi.fn<(file: string, args: readonly string[], options?: unknown) => string>(),
  compile:
    vi.fn<
      (file: string, args: readonly string[], options?: unknown) => CompilationResult
    >(),
}));
vi.mock('node:child_process', () => ({ execFileSync: execute, spawnSync: compile }));
vi.mock('node:fs/promises', async (importOriginal) => {
  const original = await importOriginal<typeof import('node:fs/promises')>();
  return {
    ...original,
    mkdtemp: vi.fn(original.mkdtemp),
    readFile: vi.fn(original.readFile),
    rm: vi.fn(original.rm),
  };
});
const actualFs =
  await vi.importActual<typeof import('node:fs/promises')>('node:fs/promises');
const root = process.cwd();
const archive = [{ filename: 'reacd-local.tgz', files: [{ path: 'dist/index.js' }] }];
const diagnostics = [
  'TS2745: Children must have type never.',
  'TS2322: Invalid style.',
  'TS2322: Invalid number.',
  'TS2307: Missing reacd/dist/private.',
];
async function temporaryPath() {
  const result = vi.mocked(mkdtemp).mock.results[0];
  if (result?.type !== 'return') throw new Error('Temporary path was not allocated.');
  const path = await result.value;
  if (typeof path !== 'string') throw new Error('Expected a string path.');
  return path;
}
async function expectRemoved() {
  const path = await temporaryPath();
  expect(relative(root, path).startsWith('..')).toBe(true);
  expect(existsSync(path)).toBe(false);
  expect(rm).toHaveBeenCalledWith(path, { recursive: true, force: true });
}
beforeEach(() => {
  vi.resetModules();
  execute.mockReset().mockReturnValue(JSON.stringify(archive));
  compile.mockReset();
  for (const stdout of diagnostics)
    compile.mockReturnValueOnce({ status: 1, stdout, stderr: '' });
  vi.mocked(mkdtemp).mockReset().mockImplementation(actualFs.mkdtemp);
  vi.mocked(readFile).mockReset().mockImplementation(actualFs.readFile);
  vi.mocked(rm).mockReset().mockImplementation(actualFs.rm);
  vi.spyOn(console, 'log').mockImplementation(() => undefined);
});
afterEach(async () => {
  for (const result of vi.mocked(mkdtemp).mock.results) {
    if (result.type !== 'return') continue;
    const path = await result.value.catch(() => undefined);
    if (typeof path === 'string')
      await actualFs.rm(path, { recursive: true, force: true });
  }
  vi.restoreAllMocks();
});

describe('packed consumer runner', () => {
  it('uses an isolated real workspace and compiles all intended fixtures', async () => {
    const configurations: unknown[] = [];
    compile.mockReset().mockImplementation((_file, _args, options) => {
      if (
        typeof options !== 'object' ||
        options === null ||
        !('cwd' in options) ||
        typeof options.cwd !== 'string'
      )
        throw new Error('Missing compiler cwd.');
      const configuration: unknown = JSON.parse(
        readFileSync(join(options.cwd, 'negative.json'), 'utf8'),
      );
      configurations.push(configuration);
      return {
        status: 1,
        stdout: diagnostics[configurations.length - 1] ?? '',
        stderr: '',
      };
    });
    await import('./package-check.js');
    expect(configurations).toHaveLength(4);
    expect(configurations).toMatchObject(
      ['native', 'style', 'value', 'private'].map((name) => ({
        compilerOptions: {
          strict: true,
          noEmit: true,
          jsxImportSource: 'reacd',
          skipLibCheck: false,
        },
        files: [`${name}.tsx`],
      })),
    );
    expect(execute).toHaveBeenCalledWith(
      'npm',
      ['pack', '--ignore-scripts', '--json', '--pack-destination', expect.any(String)],
      { cwd: root, encoding: 'utf8' },
    );
    expect(execute.mock.calls.map((call) => call[0])).toEqual([
      'npm',
      'tar',
      process.execPath,
      process.execPath,
    ]);
    expect(console.log).toHaveBeenCalledOnce();
    await expectRemoved();
  });
  it.each(['not-json', JSON.stringify([]), JSON.stringify([{ filename: 1 }])])(
    'rejects malformed pack output and removes its workspace: %s',
    async (output) => {
      execute.mockReturnValue(output);
      await expect(import('./package-check.js')).rejects.toThrow();
      expect(compile).not.toHaveBeenCalled();
      await expectRemoved();
    },
  );
  it.each([
    'specs/private.md',
    'fixtures/private.ts',
    'test-support/helper.ts',
    'src/__tests__/private.ts',
    'dist/index.test.js',
    'dist/index.js.map',
  ])('rejects forbidden archive entry %s', async (path) => {
    execute.mockReturnValue(JSON.stringify([{ ...archive[0], files: [{ path }] }]));
    await expect(import('./package-check.js')).rejects.toThrow();
    expect(execute).toHaveBeenCalledOnce();
    await expectRemoved();
  });
  it.each([1, 2, 3, 4])('cleans up after external command %s fails', async (stage) => {
    const failure = new Error('External command failed.');
    execute.mockImplementation(() => {
      if (execute.mock.calls.length === stage) throw failure;
      return JSON.stringify(archive);
    });
    await expect(import('./package-check.js')).rejects.toBe(failure);
    expect(console.log).not.toHaveBeenCalled();
    await expectRemoved();
  });
  it.each([0, null])(
    'rejects a negative fixture with exit status %s',
    async (status) => {
      compile.mockReset().mockReturnValue({ status, stdout: '', stderr: '' });
      await expect(import('./package-check.js')).rejects.toThrow('native must fail');
      await expectRemoved();
    },
  );
  it('rejects compilation that failed for an unrelated diagnostic', async () => {
    compile
      .mockReset()
      .mockReturnValue({ status: 1, stdout: 'TS2307: unrelated', stderr: '' });
    await expect(import('./package-check.js')).rejects.toThrow();
    await expectRemoved();
  });
  it('removes partial installations after a fixture read fails', async () => {
    const failure = new Error('Cannot read consumer fixture.');
    vi.mocked(readFile)
      .mockResolvedValueOnce(await actualFs.readFile('package.json', 'utf8'))
      .mockRejectedValueOnce(failure);
    await expect(import('./package-check.js')).rejects.toBe(failure);
    await expectRemoved();
  });
  it('propagates workspace allocation failure without attempting cleanup', async () => {
    const failure = new Error('Cannot allocate workspace.');
    vi.mocked(mkdtemp).mockRejectedValueOnce(failure);
    await expect(import('./package-check.js')).rejects.toBe(failure);
    expect(rm).not.toHaveBeenCalled();
    expect(execute).not.toHaveBeenCalled();
  });
  it('reports failed cleanup instead of claiming a successful check', async () => {
    const failure = new Error('Cannot remove workspace.');
    vi.mocked(rm).mockRejectedValueOnce(failure);
    await expect(import('./package-check.js')).rejects.toBe(failure);
    expect(console.log).not.toHaveBeenCalled();
    expect(existsSync(await temporaryPath())).toBe(true);
  });
});
