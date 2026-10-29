import { BUNDLE_POLICY } from './bundle-policy.js';
import { bundleEntry, bundleManifestSchema, walkBundle } from './bundle-manifest.js';

export function inspectBundle(input: unknown, assets: ReadonlyMap<string, number>) {
  const manifest = bundleManifestSchema.parse(input);
  const root = bundleEntry(manifest, BUNDLE_POLICY.entry);
  if (!root.isEntry) throw new Error('Bundle HTML entry is not marked as an entry.');
  if (!root.file.endsWith('.js')) throw new Error('Bundle entry must be JavaScript.');
  for (const chunk of Object.values(manifest)) {
    for (const key of [...chunk.imports, ...chunk.dynamicImports])
      bundleEntry(manifest, key);
  }
  const initial = walkBundle(manifest, BUNDLE_POLICY.entry, false);
  const initialFiles = new Set(
    Array.from(initial, (key) => bundleEntry(manifest, key).file),
  );
  const reachable = walkBundle(manifest, BUNDLE_POLICY.entry, true);
  for (const key of BUNDLE_POLICY.deferredViews) {
    const entry = bundleEntry(manifest, key);
    if (
      !entry.file.endsWith('.js') ||
      !entry.isDynamicEntry ||
      !reachable.has(key) ||
      initialFiles.has(entry.file)
    ) {
      throw new Error(`View must be reachable only through a dynamic entry: ${key}`);
    }
  }
  const listed = new Set(Object.values(manifest).map((entry) => entry.file));
  for (const [file, size] of assets) {
    if (!file.endsWith('.js')) throw new Error(`Expected a JavaScript asset: ${file}`);
    if (!listed.has(file)) throw new Error(`Bundle has an unlisted asset: ${file}`);
    if (!Number.isSafeInteger(size) || size < 0 || size > BUNDLE_POLICY.maxChunkBytes) {
      throw new Error(`JavaScript chunk violates its byte budget: ${file} (${size})`);
    }
  }
  for (const file of listed) {
    if (file.endsWith('.js') && !assets.has(file)) {
      throw new Error(`JavaScript asset is missing: ${file}`);
    }
  }
  const sizes = Array.from(assets.values());
  return {
    chunkCount: assets.size,
    totalJavaScriptBytes: sizes.reduce((sum, size) => sum + size, 0),
    initialStaticBytes: Array.from(assets).reduce(
      (sum, [file, size]) => sum + (initialFiles.has(file) ? size : 0),
      0,
    ),
    largestChunkBytes: Math.max(0, ...sizes),
  };
}
