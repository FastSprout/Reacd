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
import { z } from 'zod';
import {
  releasePackFixture,
  runFixtureCommand,
} from '../../test-support/release-pack.js';
import { RELEASE_ARCHIVE_POLICY } from './archive.js';
import { packReleaseArchive, packShadcnArchive } from './pack.js';

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
let npmOutput: (destination: string, workspace: string) => string;
const output = () => join(fixture.root, RELEASE_ARCHIVE_POLICY.output);
const releaseFiles = () => readdirSync(join(fixture.root, '.cache/release'));
beforeEach(() => {
  fixture = releasePackFixture();
  npmOutput = (destination, workspace) =>
    JSON.stringify(fixture.pack(destination, workspace));
  mocks.exec.mockReset().mockImplementation((command, args, options) => {
    if (command === 'npm') {
      const destination = args.at(-1);
      if (destination === undefined) throw new Error('Missing destination.');
      return npmOutput(destination, options.cwd);
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
    const destination = invocation?.[1].at(-1);
    if (destination === undefined) throw new Error('Missing npm pack destination.');
    expect(invocation).toEqual([
      'npm',
      [
        'pack',
        '--ignore-scripts',
        '--json',
        '--pack-destination',
        expect.stringContaining(join('.cache', 'release', 'pack-')),
      ],
      { cwd: join(destination, 'publication'), encoding: 'utf8' },
    ]);
    expect(mocks.exec.mock.calls.every(([name]) => ['npm', 'tar'].includes(name))).toBe(
      true,
    );
  });

  it('packs consumer metadata without changing the source manifest', () => {
    const original = readFileSync(join(fixture.root, 'package.json'));
    const path = packReleaseArchive(fixture.root);
    const manifest: unknown = JSON.parse(
      runFixtureCommand('tar', ['-xOf', path, 'package/package.json'], fixture.root),
    );
    expect(manifest).not.toHaveProperty('scripts');
    expect(manifest).not.toHaveProperty('devDependencies');
    expect(manifest).not.toHaveProperty('packageManager');
    expect(readFileSync(join(fixture.root, 'package.json'))).toEqual(original);
  });

  it('packs a matching adapter release without a hardcoded version', () => {
    rmSync(fixture.root, { recursive: true, force: true });
    fixture = releasePackFixture(true, '0.3.0');
    const result = packShadcnArchive(fixture.root);
    expect(result).toBe(join(fixture.root, '.cache/release/shadcn.tgz'));
    expect(readFileSync(result).subarray(0, 2)).toEqual(Buffer.from([31, 139]));
  });

  it('rejects mismatched engine and adapter release versions', () => {
    rmSync(fixture.root, { recursive: true, force: true });
    fixture = releasePackFixture(true, '0.3.0');
    const input: unknown = JSON.parse(readFileSync(join(fixture.root, 'package.json'),
      'utf8'));
    const engine = z.record(z.string(), z.unknown()).parse(input);
    writeFileSync(join(fixture.root, 'package.json'), JSON.stringify({
      ...engine, version: '0.4.0',
    }));
    expect(() => packShadcnArchive(fixture.root)).toThrow('versions must match');
  });

  it('preserves and verifies adapter attribution bytes', () => {
    rmSync(fixture.root, { recursive: true, force: true });
    fixture = releasePackFixture(true);
    npmOutput = (destination, workspace) => {
      writeFileSync(join(workspace, 'THIRD_PARTY_NOTICES.md'), 'tampered');
      return JSON.stringify(fixture.pack(destination, workspace));
    };
    expect(() => packShadcnArchive(fixture.root)).toThrow('THIRD_PARTY_NOTICES');
  });

  it('rejects duplicated engine modules in the adapter archive', () => {
    rmSync(fixture.root, { recursive: true, force: true });
    fixture = releasePackFixture(true);
    fixture.write('dist/core/leak.js', 'export {};');
    fixture.files.push({ path: 'dist/core/leak.js' });
    expect(() => packShadcnArchive(fixture.root)).toThrow('Cross-package');
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
    npmOutput = (destination, workspace) =>
      JSON.stringify(
        fixture
          .pack(destination, workspace)
          .map((archive) => ({ ...archive, filename: '../outside.tgz' })),
      );
    rejectsCleanly('identity');
  });

  it('rejects archive bytes that do not match the reported SHA-512', () => {
    npmOutput = (destination, workspace) => {
      const result = fixture.pack(destination, workspace);
      writeFileSync(join(destination, 'fastsprout-reacd-0.1.0.tgz'), 'tampered');
      return JSON.stringify(result);
    };
    rejectsCleanly('integrity');
  });

  it('rejects an archive file replaced by a symbolic link', () => {
    npmOutput = (destination, workspace) => {
      const result = fixture.pack(destination, workspace);
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

  it.each(['LICENSE', 'README.md'])(
    'checks the entire %s',
    (name) => {
      npmOutput = (destination, workspace) => {
        writeFileSync(join(workspace, name), `Unapproved replacement for ${name}`);
        return JSON.stringify(fixture.pack(destination, workspace));
      };
      rejectsCleanly(name);
    },
  );

  it('revalidates embedded publication metadata', () => {
    npmOutput = (destination, workspace) => {
      const embedded: unknown = JSON.parse(
        readFileSync(join(workspace, 'package.json'), 'utf8'),
      );
      const value = z.record(z.string(), z.unknown()).parse(embedded);
      writeFileSync(
        join(workspace, 'package.json'),
        JSON.stringify({
          ...value,
          version: '0.2.0',
        }),
      );
      return JSON.stringify(fixture.pack(destination, workspace));
    };
    rejectsCleanly('identity');
  });

  it('rejects missing actual members even if npm reports them', () => {
    fixture.files.splice(0, 1);
    npmOutput = (destination, workspace) =>
      JSON.stringify(
        fixture.pack(destination, workspace).map((archive) => ({
          ...archive,
          files: RELEASE_ARCHIVE_POLICY.required.map((path) => ({ path })),
        })),
      );
    rejectsCleanly('members');
  });

  it('rejects unexpected actual members hidden from npm JSON', () => {
    fixture.files.push({ path: '.env' });
    npmOutput = (destination, workspace) => {
      writeFileSync(join(workspace, '.env'), 'secret');
      return JSON.stringify(
        fixture.pack(destination, workspace).map((archive) => ({
          ...archive,
          files: archive.files.filter(({ path }) => path !== '.env'),
        })),
      );
    };
    rejectsCleanly('members');
  });

  it('rejects duplicate actual members hidden from npm JSON', () => {
    fixture.files.push({ path: 'LICENSE' });
    npmOutput = (destination, workspace) =>
      JSON.stringify(
        fixture
          .pack(destination, workspace)
          .map((archive) => ({ ...archive, files: archive.files.slice(0, -1) })),
      );
    rejectsCleanly('members');
  });

  it('rejects symbolic links even for allowlisted compiled paths', () => {
    fixture.files.push({ path: 'dist/linked.js' });
    npmOutput = (destination, workspace) => {
      symlinkSync('../LICENSE', join(workspace, 'dist/linked.js'));
      return JSON.stringify(fixture.pack(destination, workspace));
    };
    rejectsCleanly('regular');
  });

  it('propagates invalid embedded JSON without leaving a final archive', () => {
    npmOutput = (destination, workspace) => {
      writeFileSync(join(workspace, 'package.json'), 'invalid');
      return JSON.stringify(fixture.pack(destination, workspace));
    };
    rejectsCleanly(/JSON/);
  });
});
