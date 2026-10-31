import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

const hosts = {
  react: '19.3.1',
  'react-dom': '19.3.1',
  jotai: '3.0.1',
};
const dependencies = z.record(z.string(), z.string());
const manifestSchema = z.object({
  private: z.boolean(),
  dependencies,
  devDependencies: dependencies,
  peerDependencies: dependencies.optional(),
});

async function manifest(): Promise<unknown> {
  return JSON.parse(await readFile('package.json', 'utf8'));
}

describe('publication contract', () => {
  it('declares the real public package and canonical repository', async () => {
    expect(await manifest()).toMatchObject({
      name: '@fastsprout/reacd',
      private: false,
      repository: {
        type: 'git',
        url: 'git+https://github.com/FastSprout/Reacd.git',
      },
      homepage: 'https://reacd.dev/',
      bugs: { url: 'https://github.com/FastSprout/Reacd/issues' },
      publishConfig: {
        access: 'public',
        registry: 'https://registry.npmjs.org/',
      },
    });
  });

  it('exposes browser bootstrap separately from the Node root export', async () => {
    expect(await manifest()).toMatchObject({
      exports: {
        '.': { types: './dist/index.d.ts', import: './dist/index.js' },
        './bootstrap': {
          types: './dist/renderer/bootstrap/bootstrap.d.ts',
          import: './dist/bootstrap.js',
        },
      },
    });
  });

  it('requires one tested React/Jotai host through peers', async () => {
    const value = manifestSchema.parse(await manifest());
    expect(value.peerDependencies).toEqual(hosts);
    for (const [name, version] of Object.entries(hosts)) {
      expect(value.dependencies).not.toHaveProperty(name);
      expect(value.devDependencies[name]).toBe(version);
    }
  });

  it('ships the complete unchanged upstream MIT notice', async () => {
    expect(await readFile('THIRD_PARTY_NOTICES.md', 'utf8')).toBe(
      await readFile('src/adapter/shadcn/vendor/LICENSE.md', 'utf8'),
    );
    const input: unknown = JSON.parse(await readFile(
      'packages/shadcn/package.json', 'utf8'));
    const { files } = z.object({ files: z.array(z.string()) }).parse(input);
    expect(files).toContain('LICENSE');
    expect(files).toContain('THIRD_PARTY_NOTICES.md');
  });
});
