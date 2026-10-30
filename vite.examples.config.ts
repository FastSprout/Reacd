import { join } from 'node:path';
import { defineConfig, mergeAlias } from 'vite';
import base from './vite.config.js';
import { resolveExample } from './tooling/examples/resolve-example.js';

export default defineConfig(({ mode }) => {
  const example = resolveExample(mode);
  const entryAlias = { '/main.tsx': example.entry };
  return {
    ...base,
    root: example.host,
    publicDir: false,
    cacheDir: join(example.repository, '.cache', 'examples-vite', example.name),
    resolve: {
      ...base.resolve,
      alias: mergeAlias(base.resolve?.alias, entryAlias) ?? entryAlias,
    },
    server: {
      ...base.server,
      fs: { ...base.server?.fs, allow: [example.repository] },
    },
    build: {
      ...base.build,
      outDir: example.output,
      emptyOutDir: true,
      rolldownOptions: {
        ...base.build?.rolldownOptions,
        input: { index: join(example.host, 'index.html') },
      },
    },
  };
});
