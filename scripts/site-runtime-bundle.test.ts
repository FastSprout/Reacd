import { mkdtemp, readFile, readdir, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build, mergeConfig } from 'vite';
import type { Plugin } from 'vite';
import { expect, it, vi } from 'vitest';
import configuration from '../vite.site-build.config.js';
import { assertLazyMaterialRuntime } from '../tooling/site/build/manifest.js';
import { BUNDLE_POLICY } from '../tooling/build/bundle-policy.js';

it('keeps native MUI and Emotion out of actual initial runtime imports', async () => {
  const output = await mkdtemp(join(tmpdir(), 'reacd-runtime-bundle-'));
  vi.stubEnv('NODE_ENV', 'production');
  try {
    const publicAsset: Plugin = {
      name: 'public-asset-bundle-acceptance',
      async buildStart() {
        this.emitFile({
          type: 'asset',
          name: 'color-mode-light.svg',
          source: await readFile('tooling/site/public/color-mode-light.svg'),
        });
      },
    };
    await build(
      mergeConfig(configuration, {
        logLevel: 'silent',
        build: { outDir: output },
        plugins: [publicAsset],
      }),
    );
    const manifest: unknown = JSON.parse(
      await readFile(join(output, '.vite/manifest.json'), 'utf8'),
    );
    const modules: unknown = JSON.parse(
      await readFile(join(output, 'runtime-modules.json'), 'utf8'),
    );
    expect(() => assertLazyMaterialRuntime(manifest, modules)).not.toThrow();
    const assets = await readdir(join(output, 'assets'));
    const sizes = await Promise.all(assets.filter(file => file.endsWith('.js'))
      .map(async file => (await stat(join(output, 'assets', file))).size));
    expect(Math.max(...sizes)).toBeLessThanOrEqual(BUNDLE_POLICY.maxChunkBytes);
    expect(assets).toContain('site.css');
    expect(assets.filter((file) => file.endsWith('.css'))).toEqual(['site.css']);
    const styles = await readFile(join(output, 'assets/site.css'), 'utf8');
    expect(styles).toContain('@font-face');
    expect(styles).toContain('.reacd-page-article');
    expect(assets.some((file) => /^color-mode-light-[\w-]+\.svg$/.test(file))).toBe(
      true,
    );
  } finally {
    vi.unstubAllEnvs();
    await rm(output, { recursive: true, force: true });
  }
}, 60_000);
