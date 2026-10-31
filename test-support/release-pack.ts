import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import {
  RELEASE_ARCHIVE_POLICY,
  SHADCN_ARCHIVE_POLICY,
  MUI_ARCHIVE_POLICY,
} from '../tooling/release/archive.js';
import { PUBLICATION_POLICY } from '../tooling/release/policy.js';
import {
  createDistributionManifest,
  createShadcnDistributionManifest,
  createMuiDistributionManifest,
} from '../tooling/release/distribution.js';

export function runFixtureCommand(
  command: string,
  args: readonly string[],
  cwd: string,
): string {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr);
  return result.stdout;
}

export function releasePackFixture(
  adapter: boolean | 'mui' = false,
  version = '0.1.0',
) {
  const material = adapter === 'mui';
  const packagePath = material ? 'packages/mui' : 'packages/shadcn';
  const root = mkdtempSync(join(tmpdir(), 'reacd-pack-test-'));
  const input: unknown = JSON.parse(
    readFileSync(adapter ? `${packagePath}/package.json` : 'package.json', 'utf8'),
  );
  const sourceRoot = adapter ? join(root, packagePath) : root;
  const manifest = {
    ...(adapter
      ? material
        ? createMuiDistributionManifest(input)
        : createShadcnDistributionManifest(input)
      : createDistributionManifest(input)),
    version,
    devDependencies: PUBLICATION_POLICY.peers,
    scripts: { example: 'vite --config vite.examples.config.ts' },
    packageManager: 'npm@11.19.0',
  };
  if (adapter) {
    manifest.peerDependencies[PUBLICATION_POLICY.name] = version;
    const engineInput: unknown = JSON.parse(readFileSync('package.json', 'utf8'));
    writeFileSync(
      join(root, 'package.json'),
      JSON.stringify({
        ...createDistributionManifest(engineInput),
        version,
        devDependencies: PUBLICATION_POLICY.peers,
      }),
    );
  }
  const required = adapter
    ? material
      ? MUI_ARCHIVE_POLICY
      : SHADCN_ARCHIVE_POLICY
    : RELEASE_ARCHIVE_POLICY;
  const files: { path: string }[] = required.required.map((path) => ({
    path,
  }));
  function write(path: string, content: string) {
    const target = join(sourceRoot, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
  }
  for (const { path } of files) write(path, `Fixture ${path}\n`);
  write('package.json', JSON.stringify(manifest));
  function pack(destination: string, workspace: string) {
    const filename = `${
      adapter
        ? material
          ? 'fastsprout-reacd-mui'
          : 'fastsprout-reacd-shadcn'
        : 'fastsprout-reacd'
    }-${version}.tgz`;
    const archive = join(destination, filename);
    runFixtureCommand(
      'tar',
      ['-czf', archive, '-C', workspace, ...files.map(({ path }) => path)],
      root,
    );
    const unpacked = join(destination, 'tar-source');
    mkdirSync(join(unpacked, 'package'), { recursive: true });
    runFixtureCommand('tar', ['-xf', archive, '-C', join(unpacked, 'package')], root);
    runFixtureCommand(
      'tar',
      ['-czf', archive, '-C', unpacked, ...files.map(({ path }) => `package/${path}`)],
      root,
    );
    const integrity =
      'sha512-' + createHash('sha512').update(readFileSync(archive)).digest('base64');
    return [
      { name: manifest.name, version: manifest.version, filename, integrity, files },
    ];
  }
  return { root, sourceRoot, manifest, files, write, pack };
}
