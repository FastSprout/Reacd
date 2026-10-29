import { describe, expect, it } from 'vitest';
import { inspectBundle } from './bundle-report.js';
import { BUNDLE_POLICY } from './bundle-policy.js';

function fixture() {
  const manifest: Record<string, unknown> = {
    'index.html': {
      file: 'assets/main.js',
      isEntry: true,
      imports: ['runtime'],
      dynamicImports: [...BUNDLE_POLICY.deferredViews],
    },
    runtime: { file: 'assets/runtime.js' },
  };
  const assets = new Map([
    ['assets/main.js', 20],
    ['assets/runtime.js', 30],
  ]);
  for (const [index, key] of BUNDLE_POLICY.deferredViews.entries()) {
    manifest[key] = { file: `assets/view-${index}.js`, isDynamicEntry: true };
    assets.set(`assets/view-${index}.js`, 10);
  }
  return { manifest, assets };
}
describe('production bundle acceptance', () => {
  it('measures actual assets and separates static from deferred reachability', () => {
    const { manifest, assets } = fixture();
    expect(inspectBundle(manifest, assets)).toMatchObject({
      initialStaticBytes: 50,
      largestChunkBytes: 30,
      chunkCount: 8,
      totalJavaScriptBytes: 110,
    });
  });
  it('rejects invalid manifests, unsafe paths and missing entry points', () => {
    for (const value of [
      null,
      [],
      { x: { file: '../escape.js' } },
      { x: { file: 'assets/../escape.js' } },
      { x: { file: '/absolute.js' } },
      { x: { file: 'assets/main.js', imports: [1] } },
      { x: { file: 'assets/main.js' } },
    ])
      expect(() => inspectBundle(value, new Map())).toThrow();
    const { manifest, assets } = fixture();
    manifest['index.html'] = { file: 'assets/main.js', isEntry: false };
    expect(() => inspectBundle(manifest, assets)).toThrow('entry');
    manifest['index.html'] = { file: 'assets/styles.css', isEntry: true };
    expect(() => inspectBundle(manifest, assets)).toThrow('JavaScript');
  });
  it('rejects oversized, missing, unlisted and invalid JavaScript sizes', () => {
    for (const invalid of [-1, NaN, Infinity, 1.5, BUNDLE_POLICY.maxChunkBytes + 1]) {
      const { manifest, assets } = fixture();
      assets.set('assets/main.js', invalid);
      expect(() => inspectBundle(manifest, assets)).toThrow();
    }
    const { manifest, assets } = fixture();
    assets.delete('assets/main.js');
    expect(() => inspectBundle(manifest, assets)).toThrow('missing');
    assets.set('assets/main.js', 20);
    assets.set('assets/orphan.js', 5);
    expect(() => inspectBundle(manifest, assets)).toThrow('unlisted');
    assets.delete('assets/orphan.js');
    assets.set('assets/style.css', 5);
    expect(() => inspectBundle(manifest, assets)).toThrow('JavaScript');
  });
  it('rejects broken imports and improperly attached lazy views', () => {
    const key = BUNDLE_POLICY.deferredViews[0];
    for (const replacement of [
      undefined,
      { file: 'assets/view-0.js', isDynamicEntry: false },
      { file: 'assets/style.css', isDynamicEntry: true },
      { file: 'assets/main.js', isDynamicEntry: true },
    ]) {
      const { manifest, assets } = fixture();
      if (replacement === undefined) delete manifest[key];
      else manifest[key] = replacement;
      expect(() => inspectBundle(manifest, assets)).toThrow();
    }
    for (const entry of [
      { imports: ['missing'], dynamicImports: [...BUNDLE_POLICY.deferredViews] },
      { imports: ['constructor'], dynamicImports: [...BUNDLE_POLICY.deferredViews] },
      { imports: ['runtime', key], dynamicImports: [...BUNDLE_POLICY.deferredViews] },
      { imports: ['runtime'], dynamicImports: [] },
    ]) {
      const { manifest, assets } = fixture();
      manifest['index.html'] = { file: 'assets/main.js', isEntry: true, ...entry };
      expect(() => inspectBundle(manifest, assets)).toThrow();
    }
  });
  it('handles shared static dependencies and cycles without double counting', () => {
    const { manifest, assets } = fixture();
    manifest['runtime'] = { file: 'assets/runtime.js', imports: ['index.html'] };
    manifest['style'] = { file: 'assets/style.css' };
    expect(inspectBundle(manifest, assets).initialStaticBytes).toBe(50);
  });
  it('accepts nested assets and the exact per-chunk byte limit', () => {
    const { manifest, assets } = fixture();
    manifest['runtime'] = { file: 'assets/runtime/shared.js' };
    assets.delete('assets/runtime.js');
    assets.set('assets/runtime/shared.js', BUNDLE_POLICY.maxChunkBytes);
    expect(inspectBundle(manifest, assets)).toMatchObject({
      largestChunkBytes: BUNDLE_POLICY.maxChunkBytes,
      initialStaticBytes: BUNDLE_POLICY.maxChunkBytes + 20,
    });
  });
});
