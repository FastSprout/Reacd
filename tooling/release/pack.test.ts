import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import {
  releasePackFixture,
  runFixtureCommand,
} from '../../test-support/release-pack.js';
import { RELEASE_ARCHIVE_POLICY } from './archive.js';
import { packReleaseArchive } from './pack.js';

const mocks = vi.hoisted(() => ({
  remove: vi.fn<typeof import('node:fs').rmSync>(),
  exec: vi.fn<
    (
      command: string,
      args: readonly string[],
      options: { cwd: string; encoding: 'utf8' },
    ) => string
  >(),
}));
vi.mock('node:fs', async (original) => {
  const filesystem = await original<typeof import('node:fs')>();
  mocks.remove.mockImplementation(filesystem.rmSync);
  return { ...filesystem, rmSync: mocks.remove };
});
vi.mock('node:child_process', async (original) => ({
  ...(await original<typeof import('node:child_process')>()),
  execFileSync: mocks.exec,
}));

let fixture: ReturnType<typeof releasePackFixture>;
let npmOutput: (destination: string) => string;
const output = () => join(fixture.root, RELEASE_ARCHIVE_POLICY.output);
const releaseFiles = () => readdirSync(join(fixture.root, '.cache/release'));
beforeEach(() => {
  fixture = releasePackFixture();
  npmOutput = (destination) => JSON.stringify(fixture.pack(destination));
  mocks.exec.mockReset().mockImplementation((command, args, options) => {
    if (command === 'npm') {
      const destination = args.at(-1);
      if (destination === undefined) throw new Error('Missing destination.');
      return npmOutput(destination);
    }
    return runFixtureCommand(command, args, options.cwd);
  });
  mkdirSync(join(fixture.root, '.cache/release'), { recursive: true });
  writeFileSync(output(), 'stale release');
});
afterEach(() => rmSync(fixture.root, { recursive: true, force: true }));

function rejectsCleanly(pattern: string | RegExp) {
  expect(() => packReleaseArchive(fixture.root)).toThrow(pattern);
  expect(existsSync(output())).toBe(false);
  expect(releaseFiles()).toEqual([]);
}

describe('verified local release archive', () => {
  it('emits only verified bytes at the fixed local path without scripts', () => {
    const path = packReleaseArchive(fixture.root);
    expect(path).toBe(output());
    expect(releaseFiles()).toEqual(['package.tgz']);
    expect(readFileSync(path).subarray(0, 2)).toEqual(Buffer.from([31, 139]));
    const invocation = mocks.exec.mock.calls.find(([name]) => name === 'npm');
    expect(invocation).toEqual([
      'npm',
      [
        'pack',
        '--ignore-scripts',
        '--json',
        '--pack-destination',
        expect.stringContaining(join('.cache', 'release', 'pack-')),
      ],
      { cwd: fixture.root, encoding: 'utf8' },
    ]);
    expect(mocks.exec.mock.calls.every(([name]) => ['npm', 'tar'].includes(name))).toBe(
      true,
    );
  });

  it('clears stale output even when repository metadata is missing or invalid', () => {
    rmSync(join(fixture.root, 'package.json'));
    rejectsCleanly(/ENOENT/);
    writeFileSync(join(fixture.root, 'package.json'), '{}');
    rejectsCleanly(/Publication manifest/);
  });

  it.each(['null', '{}', '[]', 'invalid'])('rejects npm JSON %s', (json) => {
    npmOutput = () => json;
    rejectsCleanly(/./);
  });

  it('propagates pack failure and cleans its private temporary directory', () => {
    npmOutput = () => {
      throw new Error('npm failed');
    };
    rejectsCleanly('npm failed');
  });

  it('rejects a reported archive pathname escape', () => {
    npmOutput = (destination) =>
      JSON.stringify(
        fixture
          .pack(destination)
          .map((archive) => ({ ...archive, filename: '../outside.tgz' })),
      );
    rejectsCleanly('identity');
  });

  it('rejects archive bytes that do not match the reported SHA-512', () => {
    npmOutput = (destination) => {
      const result = fixture.pack(destination);
      writeFileSync(join(destination, 'fastsprout-reacd-0.1.0.tgz'), 'tampered');
      return JSON.stringify(result);
    };
    rejectsCleanly('integrity');
  });

  it('rejects an archive file replaced by a symbolic link', () => {
    npmOutput = (destination) => {
      const result = fixture.pack(destination);
      const path = join(destination, 'fastsprout-reacd-0.1.0.tgz');
      rmSync(path);
      symlinkSync(join(fixture.root, 'LICENSE'), path);
      return JSON.stringify(result);
    };
    rejectsCleanly('regular file');
  });

  it('removes the moved final archive when subsequent cleanup fails', async () => {
    const filesystem = await vi.importActual<typeof import('node:fs')>('node:fs');
    mocks.remove
      .mockImplementationOnce(filesystem.rmSync)
      .mockImplementationOnce((path, options) => {
        expect(existsSync(output())).toBe(true);
        filesystem.rmSync(path, options);
        throw new Error('Temporary cleanup failed');
      });
    rejectsCleanly('Temporary cleanup failed');
  });

  it.each(['LICENSE', 'THIRD_PARTY_NOTICES.md'])('checks the entire %s', (name) => {
    fixture.write(name, `Unapproved replacement for ${name}`);
    rejectsCleanly(name);
  });

  it('revalidates embedded publication metadata', () => {
    fixture.write(
      'package.json',
      JSON.stringify({ ...fixture.manifest, version: '0.2.0' }),
    );
    rejectsCleanly('identity');
  });

  it('rejects missing actual members even if npm reports them', () => {
    fixture.files.splice(0, 1);
    npmOutput = (destination) =>
      JSON.stringify(
        fixture.pack(destination).map((archive) => ({
          ...archive,
          files: RELEASE_ARCHIVE_POLICY.required.map((path) => ({ path })),
        })),
      );
    rejectsCleanly('members');
  });

  it('rejects unexpected actual members hidden from npm JSON', () => {
    fixture.write('.env', 'secret');
    fixture.files.push({ path: '.env' });
    npmOutput = (destination) =>
      JSON.stringify(
        fixture.pack(destination).map((archive) => ({
          ...archive,
          files: archive.files.filter(({ path }) => path !== '.env'),
        })),
      );
    rejectsCleanly('members');
  });

  it('rejects duplicate actual members hidden from npm JSON', () => {
    fixture.files.push({ path: 'LICENSE' });
    npmOutput = (destination) =>
      JSON.stringify(
        fixture
          .pack(destination)
          .map((archive) => ({ ...archive, files: archive.files.slice(0, -1) })),
      );
    rejectsCleanly('members');
  });

  it('rejects symbolic links even for allowlisted compiled paths', () => {
    symlinkSync('../LICENSE', join(fixture.source, 'package/dist/linked.js'));
    fixture.files.push({ path: 'dist/linked.js' });
    rejectsCleanly('regular');
  });

  it('propagates invalid embedded JSON without leaving a final archive', () => {
    fixture.write('package.json', 'invalid');
    rejectsCleanly(/JSON/);
  });
});
