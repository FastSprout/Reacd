import { mkdtemp, realpath, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build } from 'vite';
import { expect, it } from 'vitest';
import { runtimeModuleManifest } from './runtime-modules.js';

it('records emitted chunk ownership without treating assets as modules', async () => {
  const root = await mkdtemp(join(tmpdir(), 'reacd-module-manifest-'));
  const entry = join(root, 'entry.js');
  try {
    await writeFile(entry, 'export const answer = 42;');
    const result = await build({
      root,
      configFile: false,
      logLevel: 'silent',
      plugins: [
        {
          name: 'fixture-asset',
          generateBundle() {
            this.emitFile({
              type: 'asset',
              fileName: 'fixture.txt',
              source: 'Not a JavaScript module',
            });
          },
        },
        runtimeModuleManifest(),
      ],
      build: {
        write: false,
        lib: { entry, formats: ['es'], fileName: 'entry' },
      },
    });
    const bundle = Array.isArray(result) ? result[0] : result;
    if (!bundle || !('output' in bundle)) {
      throw new Error('Expected a single in-memory production build.');
    }
    const manifest = bundle.output.find(
      (output) => output.fileName === 'runtime-modules.json',
    );
    if (manifest?.type !== 'asset' || typeof manifest.source !== 'string') {
      throw new Error('Expected a textual module provenance asset.');
    }
    const provenance: unknown = JSON.parse(manifest.source);
    const chunk = bundle.output.find((output) => output.type === 'chunk');
    if (!chunk) throw new Error('Expected the library entry chunk.');
    expect(provenance).toEqual({ [chunk.fileName]: [await realpath(entry)] });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
