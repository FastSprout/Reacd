import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { isReleaseVersion } from '../release/policy.js';

const manifest = z.object({
  name: z.string(),
  version: z.string(),
  dependencies: z.record(z.string(), z.string()),
  peerDependencies: z.record(z.string(), z.string()),
  exports: z.record(z.string(), z.unknown()),
});
function read(path: string) {
  const input: unknown = JSON.parse(readFileSync(path, 'utf8'));
  return manifest.parse(input);
}
describe('independent engine and shadcn package boundaries', () => {
  it('keeps the engine independent of design system packages and styles', () => {
    const core = read('package.json');
    expect(isReleaseVersion(core.version)).toBe(true);
    expect(core.dependencies).toEqual({ zod: '4.6.7' });
    expect(core.exports).not.toHaveProperty('./styles.css');
    for (const layer of ['core', 'schema', 'components', 'renderer']) {
      expect(core.exports[`./adapter-runtime/${layer}/*.js`]).toEqual({
        types: `./dist/${layer}/*.d.ts`,
        import: `./dist/${layer}/*.js`,
      });
    }
    expect(core.exports).not.toHaveProperty('./adapter-runtime/*.js');
  });
  it('publishes the complete separately selected adapter and browser styles', () => {
    const adapter = read('packages/shadcn/package.json');
    expect(adapter.name).toBe('@fastsprout/reacd-shadcn');
    expect(adapter.version).toBe(read('package.json').version);
    expect(adapter.peerDependencies['@fastsprout/reacd'])
      .toBe(read('package.json').version);
    expect(adapter.dependencies['@base-ui/react']).toBe('1.9.0');
    expect(adapter.exports['.']).toEqual({
      types: './dist/shadcn.adapter.d.ts',
      import: './dist/shadcn.adapter.js',
    });
    expect(adapter.exports['./styles']).toEqual({
      types: './dist/styles-contract.d.ts',
      import: './dist/styles.js',
    });
  });
});
