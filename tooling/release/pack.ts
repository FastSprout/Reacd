import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { RELEASE_ARCHIVE_POLICY, validateReleaseArchive } from './archive.js';
import { parsePublicationManifest } from './metadata.js';

export function packReleaseArchive(root: string): string {
  const output = resolve(root, RELEASE_ARCHIVE_POLICY.output);
  const directory = dirname(output);
  mkdirSync(directory, { recursive: true });
  rmSync(output, { force: true });
  try {
    const source: unknown = JSON.parse(
      readFileSync(join(root, 'package.json'), 'utf8'),
    );
    const metadata = parsePublicationManifest(source);
    const temporary = mkdtempSync(join(directory, 'pack-'));
    try {
      const options = { cwd: root, encoding: 'utf8' } as const;
      const packed: unknown = JSON.parse(
        execFileSync(
          'npm',
          ['pack', '--ignore-scripts', '--json', '--pack-destination', temporary],
          options,
        ),
      );
      const archive = validateReleaseArchive(packed, metadata);
      const path = join(temporary, archive.filename);
      if (!lstatSync(path).isFile()) {
        throw new Error('Release archive must be a regular file.');
      }
      const integrity =
        'sha512-' + createHash('sha512').update(readFileSync(path)).digest('base64');
      if (integrity !== archive.integrity) {
        throw new Error('Release archive integrity verification failed.');
      }
      const members = execFileSync('tar', ['-tzf', path], options)
        .trimEnd()
        .split('\n')
        .sort();
      const expected = archive.files.map(({ path: file }) => `package/${file}`).sort();
      if (JSON.stringify(members) !== JSON.stringify(expected)) {
        throw new Error('Release archive members differ from the validated allowlist.');
      }
      const details = execFileSync('tar', ['-tvzf', path], options)
        .trimEnd()
        .split('\n');
      if (
        details.length !== members.length ||
        details.some((line) => !line.startsWith('-'))
      ) {
        throw new Error('Release archive members must be regular files.');
      }
      const manifest: unknown = JSON.parse(
        execFileSync('tar', ['-xOf', path, 'package/package.json'], options),
      );
      if (parsePublicationManifest(manifest).version !== metadata.version) {
        throw new Error('Release archive embedded identity differs from its manifest.');
      }
      for (const name of ['LICENSE', 'THIRD_PARTY_NOTICES.md']) {
        const content = execFileSync('tar', ['-xOf', path, `package/${name}`], options);
        if (content !== readFileSync(join(root, name), 'utf8')) {
          throw new Error(`Release archive differs from the repository ${name}.`);
        }
      }
      renameSync(path, output);
      return output;
    } finally {
      rmSync(temporary, { recursive: true, force: true });
    }
  } catch (error) {
    rmSync(output, { force: true });
    throw error;
  }
}
