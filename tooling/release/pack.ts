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
import { isDeepStrictEqual } from 'node:util';
import { dirname, join, resolve } from 'node:path';
import { validateReleaseArchive } from './archive.js';
import {
  createDistributionManifest,
  parseDistributionManifest,
  createShadcnDistributionManifest,
  parseShadcnDistributionManifest,
  createMuiDistributionManifest,
  parseMuiDistributionManifest,
} from './distribution.js';
import { stagePublication } from './workspace.js';
import {
  PUBLICATION_POLICY,
  SHADCN_PUBLICATION_POLICY,
  MUI_PUBLICATION_POLICY,
} from './policy.js';
import type { PublicationPolicy } from './policy.js';
import { parsePublicationManifest } from './metadata.js';

function packArchive(root: string, profile: PublicationPolicy): string {
  const sourceRoot = resolve(root, profile.packagePath);
  const core = profile.name === PUBLICATION_POLICY.name;
  const material = profile.name === MUI_PUBLICATION_POLICY.name;
  const output = resolve(root, profile.output);
  const directory = dirname(output);
  mkdirSync(directory, { recursive: true });
  rmSync(output, { force: true });
  try {
    const source: unknown = JSON.parse(
      readFileSync(join(sourceRoot, 'package.json'), 'utf8'),
    );
    const metadata = core
      ? createDistributionManifest(source)
      : material
        ? createMuiDistributionManifest(source)
        : createShadcnDistributionManifest(source);
    if (!core) {
      const engine: unknown = JSON.parse(
        readFileSync(join(root, 'package.json'), 'utf8'),
      );
      if (parsePublicationManifest(engine).version !== metadata.version) {
        throw new Error('Adapter and engine release versions must match.');
      }
    }
    const temporary = mkdtempSync(join(directory, 'pack-'));
    try {
      const workspace = stagePublication(sourceRoot, temporary, metadata);
      const options = { cwd: workspace, encoding: 'utf8' } as const;
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
      if (
        !isDeepStrictEqual(
          core
            ? parseDistributionManifest(manifest)
            : material
              ? parseMuiDistributionManifest(manifest)
              : parseShadcnDistributionManifest(manifest),
          metadata,
        )
      ) {
        throw new Error('Release archive embedded identity differs from its manifest.');
      }
      for (const name of profile.files.filter((file) =>
        ['LICENSE', 'THIRD_PARTY_NOTICES.md', 'README.md'].includes(file),
      )) {
        const content = execFileSync('tar', ['-xOf', path, `package/${name}`], options);
        if (!Buffer.from(content).equals(readFileSync(join(sourceRoot, name)))) {
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

export function packReleaseArchive(root: string): string {
  return packArchive(root, PUBLICATION_POLICY);
}
export function packShadcnArchive(root: string): string {
  return packArchive(root, SHADCN_PUBLICATION_POLICY);
}

export function packMuiArchive(root: string): string {
  return packArchive(root, MUI_PUBLICATION_POLICY);
}
