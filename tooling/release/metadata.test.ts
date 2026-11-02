import { readFileSync } from 'node:fs';
import { z } from 'zod';
import { describe, expect, it } from 'vitest';
import { parsePublicationManifest } from './metadata.js';

function manifest() {
  return {
    name: '@fastsprout/reacd',
    version: '0.1.0',
    private: false,
    repository: {
      type: 'git',
      url: 'git+https://github.com/FastSprout/Reacd.git',
    },
    homepage: 'https://reacd.dev/',
    bugs: { url: 'https://github.com/FastSprout/Reacd/issues' },
    publishConfig: { access: 'public', registry: 'https://registry.npmjs.org/' },
    engines: { node: '>=22.12.0' },
    peerDependencies: { react: '19.3.1', 'react-dom': '19.3.1', jotai: '3.0.1' },
    devDependencies: { react: '19.3.1', 'react-dom': '19.3.1', jotai: '3.0.1' },
    dependencies: { zod: '4.6.7', '@fastsprout/reacd-shadcn': '0.1.0' },
  };
}

describe('publication metadata', () => {
  it('returns validated identity and exact host peers', () => {
    expect(parsePublicationManifest(manifest())).toEqual({
      name: '@fastsprout/reacd',
      version: '0.1.0',
      peerDependencies: manifest().peerDependencies,
    });
    for (const version of ['1.0.0-rc.1', '1.0.0+build.42']) {
      expect(
        parsePublicationManifest({
          ...manifest(),
          version,
          dependencies: { '@fastsprout/reacd-shadcn': version },
        }).version,
      ).toBe(version);
    }
  });

  it.each([null, [], 1, 'manifest'])('rejects nonobjects: %j', (value) => {
    expect(() => parsePublicationManifest(value)).toThrow('Publication manifest');
  });

  it.each([
    { name: '@other/reacd' },
    { name: 'reacd' },
    { private: true },
    { version: '01.0.0' },
    { version: 1 },
    { version: 'v1.0.0' },
    { version: ' 1.0.0' },
    { repository: null },
    { repository: { type: 'svn', url: manifest().repository.url } },
    { repository: { type: 'git', url: 'https://example.com/fork' } },
    { homepage: 'http://reacd.dev/' },
    { bugs: { url: 'https://example.com/issues' } },
    { publishConfig: { access: 'restricted' } },
    { publishConfig: { access: 'public', registry: 'https://example.com/' } },
    { engines: { node: '>=20' } },
    { peerDependencies: { ...manifest().peerDependencies, react: '^19.3.1' } },
    { devDependencies: { ...manifest().devDependencies, jotai: '3.0.0' } },
    { dependencies: { react: '19.3.1' } },
  ])('rejects altered publication fields: %j', (change) => {
    expect(() => parsePublicationManifest({ ...manifest(), ...change })).toThrow(
      'Publication manifest',
    );
  });

  it('requires runtime default adapter and rejects malformed maps', () => {
    const input = manifest();
    const withoutDependencies = { ...input };
    Reflect.deleteProperty(withoutDependencies, 'dependencies');
    expect(() => parsePublicationManifest(withoutDependencies)).toThrow();
    expect(() => parsePublicationManifest({ ...input, dependencies: [] })).toThrow(
      'Publication manifest',
    );
  });
});

it('requires the public default SDK dependency at the engine release version', () => {
  const input: unknown = JSON.parse(readFileSync('package.json', 'utf8'));
  const manifest = z.record(z.string(), z.unknown()).parse(input);
  const version = manifest['version'];
  expect(manifest['dependencies']).toHaveProperty('@fastsprout/reacd-shadcn', version);
  expect(parsePublicationManifest(manifest).version).toBe(version);
  expect(() =>
    parsePublicationManifest({
      ...manifest,
      dependencies: { '@fastsprout/reacd-shadcn': '0.0.0' },
    }),
  ).toThrow();
});
