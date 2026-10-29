import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { RELEASE_ARCHIVE_POLICY } from '../tooling/release/archive.js';
import { PUBLICATION_POLICY } from '../tooling/release/policy.js';

export function runFixtureCommand(
  command: string,
  args: readonly string[],
  cwd: string,
): string {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr);
  return result.stdout;
}

export function releasePackFixture() {
  const root = mkdtempSync(join(tmpdir(), 'reacd-pack-test-'));
  const source = join(root, 'source');
  const manifest = {
    name: PUBLICATION_POLICY.name,
    version: '0.1.0',
    private: false,
    repository: { type: 'git', url: PUBLICATION_POLICY.repository },
    homepage: PUBLICATION_POLICY.homepage,
    bugs: { url: PUBLICATION_POLICY.issues },
    publishConfig: { access: 'public', registry: PUBLICATION_POLICY.registry },
    engines: { node: PUBLICATION_POLICY.node },
    peerDependencies: PUBLICATION_POLICY.peers,
    devDependencies: PUBLICATION_POLICY.peers,
  };
  const files: { path: string }[] = RELEASE_ARCHIVE_POLICY.required.map((path) => ({
    path,
  }));
  function write(path: string, content: string) {
    const target = join(source, 'package', path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
  }
  for (const { path } of files) write(path, `Fixture ${path}\n`);
  write('package.json', JSON.stringify(manifest));
  writeFileSync(join(root, 'package.json'), JSON.stringify(manifest));
  for (const name of ['LICENSE', 'THIRD_PARTY_NOTICES.md']) {
    writeFileSync(join(root, name), readFileSync(join(source, 'package', name)));
  }
  function pack(destination: string) {
    const filename = 'reacd-0.1.0.tgz';
    const archive = join(destination, filename);
    runFixtureCommand(
      'tar',
      ['-czf', archive, '-C', source, ...files.map(({ path }) => `package/${path}`)],
      root,
    );
    const integrity =
      'sha512-' + createHash('sha512').update(readFileSync(archive)).digest('base64');
    return [
      { name: manifest.name, version: manifest.version, filename, integrity, files },
    ];
  }
  return { root, source, manifest, files, write, pack };
}
