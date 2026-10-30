import { join } from 'node:path';
import { fileURLToPath, URL as NodeURL } from 'node:url';
import { z } from 'zod';

const EXAMPLE_NAMES = ['counter', 'form', 'dashboard'] as const;
const DEFAULT_EXAMPLE = 'counter';
const exampleNameSchema = z.enum(EXAMPLE_NAMES, {
  error: 'Choose counter, form or dashboard.',
});
const repository = fileURLToPath(new NodeURL('../../', import.meta.url));

export function resolveExample(mode: unknown) {
  const name = exampleNameSchema.parse(
    mode === 'development' || mode === 'production' ? DEFAULT_EXAMPLE : mode,
  );
  return {
    name,
    repository,
    host: join(repository, 'src', 'renderer', 'bootstrap', 'host'),
    entry: join(repository, 'examples', name, 'main.tsx'),
    output: join(repository, '.cache', 'examples', name),
  };
}
