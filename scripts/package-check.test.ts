import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import {
  createDistributionManifest,
  createShadcnDistributionManifest,
} from '../tooling/release/distribution.js';

interface CompilationResult {
  status: number | null;
  stdout: string;
  stderr: string;
}
const { execute, compile, browser, exercise, pack, adapterPack, headless } = vi.hoisted(
  () => ({
    exercise: vi.fn<(consumer: string) => Promise<void>>(),
    headless: vi.fn(),
    adapterPack: vi.fn<(root: string) => string>(),
    pack: vi.fn<(root: string) => string>(),
    browser: vi.fn<(root: string, consumer: string) => void>(),
    execute:
      vi.fn<(file: string, args: readonly string[], options?: unknown) => string>(),
    compile:
      vi.fn<
        (file: string, args: readonly string[], options?: unknown) => CompilationResult
      >(),
  }),
);
vi.mock('../tooling/package/browser.js', () => ({
  exerciseInstalledBootstrap: exercise,
}));
vi.mock('../tooling/release/pack.js', () => ({
  packReleaseArchive: pack,
  packShadcnArchive: adapterPack,
}));
vi.mock('../tooling/package/headless.js', () => ({ verifyHeadlessInstall: headless }));
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
const archive = join(root, '.cache/release/package.tgz');
const installedManifest = z.object({
  type: z.literal('module'),
  dependencies: z.strictObject({
    '@fastsprout/reacd': z.string(),
    '@fastsprout/reacd-shadcn': z.string(),
  }),
});
const diagnostics = [
  'TS2745: Children must have type never.',
  'TS2322: Invalid style.',
  'TS2322: Invalid number.',
  'TS2307: Missing @fastsprout/reacd/dist/private.',
  'TS2339: Property render does not exist on the bootstrap handle.',
  'TS2307: Missing @fastsprout/reacd/adapter-runtime/state/store.js',
];
function metadata(path = 'package.json') {
  const input: unknown = JSON.parse(readFileSync(path, 'utf8'));
  return path === 'package.json'
    ? createDistributionManifest(input)
    : createShadcnDistributionManifest(input);
}
function external(file: string, args: readonly string[]): string {
  if (file === 'tar') {
    const target = args[args.indexOf('-C') + 1];
    if (target === undefined) throw new Error('Missing extraction target.');
    const path = target.endsWith('reacd-shadcn')
      ? 'packages/shadcn/package.json'
      : 'package.json';
    writeFileSync(join(target, 'package.json'), JSON.stringify(metadata(path)));
  }
  return '';
}
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
  execute.mockReset().mockImplementation(external);
  compile.mockReset();
  browser.mockReset();
  exercise.mockReset().mockResolvedValue(undefined);
  pack.mockReset().mockReturnValue(archive);
  adapterPack.mockReset().mockReturnValue(join(root, '.cache/release/shadcn.tgz'));
  headless.mockReset();
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

describe('verified packed consumer runner', () => {
  it('installs the canonical verified tarball in a clean consumer', async () => {
    let installed = false;
    execute.mockImplementation((file, args, options) => {
      if (file === 'npm') {
        const { cwd } = z.object({ cwd: z.string() }).parse(options);
        const input: unknown = JSON.parse(
          readFileSync(join(cwd, 'package.json'), 'utf8'),
        );
        const consumer = installedManifest.parse(input);
        expect(consumer.dependencies['@fastsprout/reacd']).toMatch(/^file:.*\.tgz$/);
        expect(existsSync(join(cwd, 'node_modules'))).toBe(false);
        expect(args[0]).toBe('install');
        expect(args).toContain('--ignore-scripts');
        expect(args).not.toContain('--legacy-peer-deps');
        installed = true;
      }
      return external(file, args);
    });
    await import('./package-check.js');
    expect(installed).toBe(true);
    expect(pack).toHaveBeenCalledExactlyOnceWith(root);
    expect(browser).toHaveBeenCalledExactlyOnceWith(
      root,
      join(await temporaryPath(), 'clean-consumer'),
    );
    expect(exercise).toHaveBeenCalledExactlyOnceWith(
      join(await temporaryPath(), 'clean-consumer'),
    );
    expect(execute).toHaveBeenCalledWith('tar', [
      '-xf',
      archive,
      '-C',
      join(await temporaryPath(), 'node_modules', '@fastsprout/reacd'),
      '--strip-components=1',
    ]);
    await expectRemoved();
  });

  it('compiles all six boundary fixtures with strict scoped JSX', async () => {
    const configurations: unknown[] = [];
    compile.mockReset().mockImplementation((_file, _args, options) => {
      const { cwd } = z.object({ cwd: z.string() }).parse(options);
      for (const host of ['react', 'react-dom', 'jotai']) {
        expect(existsSync(join(cwd, 'node_modules', host))).toBe(true);
      }
      const configuration: unknown = JSON.parse(
        readFileSync(join(cwd, 'negative.json'), 'utf8'),
      );
      configurations.push(configuration);
      return {
        status: 1,
        stdout: diagnostics[configurations.length - 1] ?? '',
        stderr: '',
      };
    });
    await import('./package-check.js');
    expect(configurations).toHaveLength(6);
    expect(configurations).toMatchObject(
      ['native', 'style', 'value', 'private', 'bootstrap-escape', 'runtime-state'].map(
        (name) => ({
          compilerOptions: {
            strict: true,
            noEmit: true,
            jsxImportSource: '@fastsprout/reacd',
            skipLibCheck: false,
          },
          files: [`${name}.tsx`],
        }),
      ),
    );
    expect(execute.mock.calls.map((call) => call[0])).toEqual([
      'tar',
      'tar',
      process.execPath,
      process.execPath,
      'npm',
      process.execPath,
    ]);
    expect(console.log).toHaveBeenCalledOnce();
    await expectRemoved();
  });

  it('fails closed when the shared archive factory rejects publication', async () => {
    const failure = new Error('Verified archive failed its member/identity gate.');
    pack.mockImplementation(() => {
      throw failure;
    });
    await expect(import('./package-check.js')).rejects.toBe(failure);
    expect(execute).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
    await expectRemoved();
  });

  it('rejects development fields in an extracted manifest', async () => {
    vi.mocked(readFile).mockResolvedValueOnce(
      JSON.stringify({
        ...metadata(),
        scripts: { example: 'unapproved' },
      }),
    );
    await expect(import('./package-check.js')).rejects.toThrow();
    expect(compile).not.toHaveBeenCalled();
    await expectRemoved();
  });

  it.each(['build', 'interaction'])('cleans up failed browser %s', async (stage) => {
    const failure = new Error('Installed browser check failed.');
    if (stage === 'build') {
      browser.mockImplementation(() => {
        throw failure;
      });
    } else exercise.mockRejectedValueOnce(failure);
    await expect(import('./package-check.js')).rejects.toBe(failure);
    expect(console.log).not.toHaveBeenCalled();
    await expectRemoved();
  });

  it.each([1, 2, 3, 4, 5, 6])('cleans up after command %s fails', async (stage) => {
    const failure = new Error('External command failed.');
    execute.mockImplementation((file, args) => {
      if (execute.mock.calls.length === stage) throw failure;
      return external(file, args);
    });
    await expect(import('./package-check.js')).rejects.toBe(failure);
    expect(console.log).not.toHaveBeenCalled();
    await expectRemoved();
  });

  it.each([0, null])('rejects negative fixture exit status %s', async (status) => {
    compile.mockReset().mockReturnValue({ status, stdout: '', stderr: '' });
    await expect(import('./package-check.js')).rejects.toThrow('native must fail');
    await expectRemoved();
  });

  it('rejects compilation failing for an unrelated diagnostic', async () => {
    compile.mockReset().mockReturnValue({
      status: 1,
      stdout: 'TS2307: unrelated',
      stderr: '',
    });
    await expect(import('./package-check.js')).rejects.toThrow();
    await expectRemoved();
  });

  it('removes partial installations after a fixture read fails', async () => {
    const failure = new Error('Cannot read consumer fixture.');
    vi.mocked(readFile)
      .mockResolvedValueOnce(JSON.stringify(metadata()))
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
