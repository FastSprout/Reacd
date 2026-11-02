import { z } from 'zod';

const chunkSchema = z.object({
  file: z.string().min(1),
  src: z.string().optional(),
  isEntry: z.boolean().optional(),
  isDynamicEntry: z.boolean().optional(),
  imports: z.array(z.string()).default([]),
  dynamicImports: z.array(z.string()).default([]),
});
const manifestSchema = z.record(z.string(), chunkSchema);
const provenanceSchema = z.record(z.string(), z.array(z.string()));
type Manifest = z.infer<typeof manifestSchema>;
const SITE_ENTRY = 'tooling/site/runtime/client.tsx';
const MATERIAL_ENTRY = 'src/adapter/mui/mui.adapter.ts';
const MATERIAL_MODULE = /(?:[\\/]adapter[\\/]mui[\\/]|[\\/](?:@mui|@emotion)[\\/])/;

function reachable(manifest: Manifest, roots: readonly string[], dynamic: boolean) {
  const pending = [...roots];
  const visited = new Map<string, z.infer<typeof chunkSchema>>();
  for (const key of pending) {
    if (visited.has(key)) continue;
    const chunk = manifest[key];
    if (!chunk) throw new Error(`Runtime manifest references a missing chunk: ${key}`);
    visited.set(key, chunk);
    pending.push(...chunk.imports);
    if (dynamic) pending.push(...chunk.dynamicImports);
  }
  return visited;
}

export function assertLazyMaterialRuntime(input: unknown, provenance: unknown): void {
  const manifest = manifestSchema.parse(input);
  const modules = provenanceSchema.parse(provenance);
  const entries = Object.entries(manifest)
    .filter(([, chunk]) => chunk.src === SITE_ENTRY && chunk.isEntry)
    .map(([key]) => key);
  if (entries.length !== 1) throw new Error('Expected one runtime site entry.');
  for (const chunk of reachable(manifest, entries, false).values()) {
    const owned = modules[chunk.file];
    if (!owned)
      throw new Error(`Runtime chunk has no module provenance: ${chunk.file}`);
    if (owned.some((id) => MATERIAL_MODULE.test(id))) {
      throw new Error(`Initial documentation eagerly loads Material UI: ${chunk.file}`);
    }
  }
  const all = reachable(manifest, entries, true);
  if (
    ![...all.values()].some(
      (chunk) => chunk.src === MATERIAL_ENTRY && chunk.isDynamicEntry,
    )
  ) {
    throw new Error('Material UI must remain an explicit runtime dynamic entry.');
  }
}
