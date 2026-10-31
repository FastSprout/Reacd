import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  createDistributionManifest,
  parseDistributionManifest,
} from './distribution.js';

function source() {
  const input: unknown = JSON.parse(readFileSync('package.json', 'utf8'));
  return z.record(z.string(), z.unknown()).parse(input);
}

describe('consumer-only publication metadata', () => {
  it('preserves runtime identity while removing repository-only configuration', () => {
    const input = source();
    const output = createDistributionManifest({ ...input, customTool: { run: true } });
    for (const field of [
      'scripts',
      'devDependencies',
      'packageManager',
      'customTool',
    ]) {
      expect(output).not.toHaveProperty(field);
    }
    for (const field of [
      'name',
      'version',
      'description',
      'exports',
      'dependencies',
      'peerDependencies',
      'repository',
      'homepage',
      'bugs',
      'license',
      'type',
      'files',
      'publishConfig',
    ])
      expect(output).toHaveProperty(field, input[field]);
    expect(parseDistributionManifest(output)).toEqual(output);
  });

  it('keeps exact development host validation on the source side', () => {
    expect(() =>
      createDistributionManifest({ ...source(), devDependencies: {} }),
    ).toThrow('Publication manifest');
  });

  it.each(['scripts', 'devDependencies', 'packageManager', 'workspaces', 'customTool'])(
    'rejects development field %s from an embedded manifest',
    (field) => {
      const output = createDistributionManifest(source());
      expect(() => parseDistributionManifest({ ...output, [field]: {} })).toThrow();
    },
  );

  it.each([
    { name: 'reacd' },
    { version: 'invalid' },
    { license: 'Other' },
    { dependencies: { react: '19.3.1' } },
    { dependencies: { library: '^1.0.0' } },
    { exports: { '.': '../outside.js' } },
    { exports: { '.': './dist/../outside.js' } },
  ])('rejects invalid consumer fields %j', (change) => {
    expect(() =>
      parseDistributionManifest({
        ...createDistributionManifest(source()),
        ...change,
      }),
    ).toThrow();
  });

  it('rejects omitted, duplicate or external publication file selectors', () => {
    const valid = createDistributionManifest(source());
    for (const files of [
      ['../private'],
      valid.files.slice(1),
      valid.files.map(() => 'dist'),
    ])
      expect(() => parseDistributionManifest({ ...valid, files })).toThrow();
  });

  it('accepts omitted runtime dependencies but not a malformed dependency map', () => {
    const input = source();
    Reflect.deleteProperty(input, 'dependencies');
    expect(createDistributionManifest(input).dependencies).toEqual({});
    expect(() => createDistributionManifest({ ...input, dependencies: [] })).toThrow();
  });
});
