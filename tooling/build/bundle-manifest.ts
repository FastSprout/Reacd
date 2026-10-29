import { z } from 'zod';

const assetPathSchema = z
  .string()
  .regex(/^assets\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_.-]+$/);
const chunkSchema = z.object({
  file: assetPathSchema,
  isEntry: z.boolean().optional(),
  isDynamicEntry: z.boolean().optional(),
  imports: z.array(z.string()).default([]),
  dynamicImports: z.array(z.string()).default([]),
});
export const bundleManifestSchema = z.record(z.string(), chunkSchema);
export type BundleManifest = z.infer<typeof bundleManifestSchema>;

export function bundleEntry(manifest: BundleManifest, key: string) {
  const entry = Object.hasOwn(manifest, key) ? manifest[key] : undefined;
  if (entry === undefined) throw new Error(`Bundle entry is missing: ${key}`);
  return entry;
}
export function walkBundle(
  manifest: BundleManifest,
  entry: string,
  includeDynamic: boolean,
): ReadonlySet<string> {
  const seen = new Set<string>();
  function visit(key: string): void {
    if (seen.has(key)) return;
    const chunk = bundleEntry(manifest, key);
    seen.add(key);
    chunk.imports.forEach(visit);
    if (includeDynamic) chunk.dynamicImports.forEach(visit);
  }
  visit(entry);
  return seen;
}
