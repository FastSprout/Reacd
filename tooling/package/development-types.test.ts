import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, it } from 'vitest';
import { installedTypeDependencies } from './development-types.js';

it('pins isolated consumer typing tools to the checked dependency installation', () => {
  const root = mkdtempSync(join(tmpdir(), 'reacd-type-dependencies-'));
  try {
    for (const name of ['node', 'react', 'react-dom']) {
      const folder = join(root, 'node_modules/@types', name);
      mkdirSync(folder, { recursive: true });
      writeFileSync(join(folder, 'package.json'), '{"version":"1.2.3"}');
    }
    expect(installedTypeDependencies(root)).toEqual({
      '@types/node': '1.2.3',
      '@types/react': '1.2.3',
      '@types/react-dom': '1.2.3',
    });
    writeFileSync(
      join(root, 'node_modules/@types/node/package.json'),
      '{"version":"latest"}',
    );
    expect(() => installedTypeDependencies(root)).toThrow();
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
