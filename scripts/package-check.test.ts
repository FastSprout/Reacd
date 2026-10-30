import { existsSync, readFileSync } from 'node:fs';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

interface CompilationResult {
  status: number | null;
  stdout: string;
  stderr: string;
}
const { execute, compile, browser } = vi.hoisted(() => ({
  browser: vi.fn<(root: string, consumer: string) => void>(),
  execute:
    vi.fn<(file: string, args: readonly string[], options?: unknown) => string>(),
  compile:
    vi.fn<
      (file: string, args: readonly string[], options?: unknown) => CompilationResult
    >(),
}));
vi.mock('../tooling/package/bootstrap.js', () => ({
  buildInstalledBootstrap: browser,
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
const installedManifest = z.object({
  type: z.literal('module'),
  dependencies: z.object({
    '@fastsprout/reacd': z.string(),
    react: z.literal('19.3.1'),
    'react-dom': z.literal('19.3.1'),
    jotai: z.literal('3.0.1'),
  }),
});
const archive = [
  {
    filename: 'fastsprout-reacd-0.1.0.tgz',
    files: [
      { path: 'dist/index.js' },
      { path: 'LICENSE' },
      { path: 'THIRD_PARTY_NOTICES.md' },
    ],
  },
];
const diagnostics = [
  'TS2745: Children must have type never.',
  'TS2322: Invalid style.',
  'TS2322: Invalid number.',
  'TS2307: Missing @fastsprout/reacd/dist/private.',
  'TS2339: Property render does not exist on the bootstrap handle.',
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
  browser.mockReset();
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
  it('installs the tarball in a clean consumer with shared hosts', async () => {
    let installed = false;
    execute.mockImplementation((file, args, options) => {
      if (file === 'npm' && args[0] === 'install') {
        if (
          typeof options !== 'object' ||
          options === null ||
          !('cwd' in options) ||
          typeof options.cwd !== 'string'
        ) {
          throw new Error('Missing isolated installation cwd.');
        }
        const metadata: unknown = JSON.parse(
          readFileSync(join(options.cwd, 'package.json'), 'utf8'),
        );
        const consumer = installedManifest.parse(metadata);
        expect(consumer.dependencies['@fastsprout/reacd']).toMatch(/^file:.*\.tgz$/);
        expect(existsSync(join(options.cwd, 'node_modules'))).toBe(false);
        expect(args).toContain('--ignore-scripts');
        expect(args).not.toContain('--legacy-peer-deps');
        installed = true;
      }
      return JSON.stringify(archive);
    });
    await import('./package-check.js');
    expect(installed).toBe(true);
    expect(browser).toHaveBeenCalledExactlyOnceWith(
      root, join(await temporaryPath(), 'clean-consumer'),
    );
    const extracted = join(
      await temporaryPath(), 'node_modules', '@fastsprout/reacd',
    );
    expect(execute).toHaveBeenCalledWith('tar', expect.arrayContaining([
      '-C', extracted,
    ]));
    await expectRemoved();
  });
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
      for (const host of ['react', 'react-dom', 'jotai']) {
        expect(existsSync(join(options.cwd, 'node_modules', host))).toBe(true);
      }
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
    expect(configurations).toHaveLength(5);
    expect(configurations).toMatchObject(
      ['native', 'style', 'value', 'private', 'bootstrap-escape'].map((name) => ({
        compilerOptions: {
          strict: true,
          noEmit: true,
          jsxImportSource: '@fastsprout/reacd',
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
      'npm',
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
  it.each(['LICENSE', 'THIRD_PARTY_NOTICES.md'])(
    'rejects an archive missing the required notice %s',
    async (missing) => {
      execute.mockReturnValue(
        JSON.stringify([
          {
            ...archive[0],
            files: archive[0]?.files.filter((file) => file.path !== missing),
          },
        ]),
      );
      await expect(import('./package-check.js')).rejects.toThrow(missing);
      expect(compile).not.toHaveBeenCalled();
      await expectRemoved();
    },
  );
  it('cleans its workspace after an installed browser build fails', async () => {
    const failure = new Error('Installed bootstrap build failed.');
    browser.mockImplementation(() => { throw failure; });
    await expect(import('./package-check.js')).rejects.toBe(failure);
    expect(console.log).not.toHaveBeenCalled();
    await expectRemoved();
  });
  it.each([1, 2, 3, 4, 5, 6])(
    'cleans up after external command %s fails',
    async (stage) => {
      const failure = new Error('External command failed.');
      execute.mockImplementation(() => {
        if (execute.mock.calls.length === stage) throw failure;
        return JSON.stringify(archive);
      });
      await expect(import('./package-check.js')).rejects.toBe(failure);
      expect(console.log).not.toHaveBeenCalled();
      await expectRemoved();
    },
  );
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
