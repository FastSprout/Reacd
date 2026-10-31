import { readFileSync, rmSync } from 'node:fs';
import { afterEach, describe, expect, it } from 'vitest';
import { releasePackFixture } from '../../test-support/release-pack.js';
import { parseShadcnPublicationManifest } from './metadata.js';
import {
  createShadcnDistributionManifest,
  parseShadcnDistributionManifest,
} from './distribution.js';

const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});
describe('source-driven adapter package metadata', () => {
  it.each(['0.2.0', '0.3.0'])(
    'accepts matching release and core peer %s',
    (version) => {
      const fixture = releasePackFixture(true, version);
      roots.push(fixture.root);
      const metadata = parseShadcnPublicationManifest(fixture.manifest);
      expect(metadata.version).toBe(version);
      expect(metadata.peerDependencies['@fastsprout/reacd']).toBe(version);
      const output = createShadcnDistributionManifest(fixture.manifest);
      expect(parseShadcnDistributionManifest(output)).toEqual(output);
      expect(output).not.toHaveProperty('devDependencies');
    },
  );
  it.each(['dependencies', 'devDependencies'] as const)(
    'rejects the engine in adapter %s',
    (field) => {
      const fixture = releasePackFixture(true);
      roots.push(fixture.root);
      expect(() =>
        parseShadcnPublicationManifest({
          ...fixture.manifest,
          [field]: { ...fixture.manifest[field], '@fastsprout/reacd': '0.1.0' },
        }),
      ).toThrow();
      if (field === 'dependencies') {
        expect(() =>
          parseShadcnDistributionManifest({
            ...createShadcnDistributionManifest(fixture.manifest),
            dependencies: {
              ...fixture.manifest.dependencies,
              '@fastsprout/reacd': '0.1.0',
            },
          }),
        ).toThrow();
      }
    },
  );
  it('rejects a core peer that differs from the adapter release', () => {
    const input: unknown = JSON.parse(
      readFileSync('packages/shadcn/package.json', 'utf8'),
    );
    const fixture = releasePackFixture(true);
    roots.push(fixture.root);
    expect(input).toBeDefined();
    expect(() =>
      parseShadcnPublicationManifest({
        ...fixture.manifest,
        peerDependencies: {
          ...fixture.manifest.peerDependencies,
          '@fastsprout/reacd': '9.0.0',
        },
      }),
    ).toThrow();
    expect(() =>
      parseShadcnDistributionManifest({
        ...createShadcnDistributionManifest(fixture.manifest),
        peerDependencies: {
          ...fixture.manifest.peerDependencies,
          '@fastsprout/reacd': '9.0.0',
        },
      }),
    ).toThrow();
  });
});
