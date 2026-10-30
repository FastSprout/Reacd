import { defineConfig } from 'vite';
import { fileURLToPath, URL as NodeURL } from 'node:url';
import shared from './vite.config.js';

export default defineConfig({
  ...shared,
  root: fileURLToPath(new NodeURL('./tooling/conformance', import.meta.url)),
  cacheDir: fileURLToPath(new NodeURL('./.cache/vite-conformance', import.meta.url)),
  build: {
    ...shared.build,
    outDir: fileURLToPath(new NodeURL('./.cache/conformance-dist', import.meta.url)),
    rolldownOptions: {
      ...shared.build?.rolldownOptions,
      input: {
        compositionSafety: fileURLToPath(
          new NodeURL('./tooling/conformance/composition-safety.html', import.meta.url),
        ),
        index: fileURLToPath(
          new NodeURL('./tooling/conformance/index.html', import.meta.url),
        ),
        temporalRecovery: fileURLToPath(
          new NodeURL('./tooling/conformance/temporal-recovery.html', import.meta.url),
        ),
        listboxFieldMetadata: fileURLToPath(
          new NodeURL(
            './tooling/conformance/listbox-field-metadata.html',
            import.meta.url,
          ),
        ),
        editorFieldMetadata: fileURLToPath(
          new NodeURL(
            './tooling/conformance/editor-field-metadata.html',
            import.meta.url,
          ),
        ),
      },
    },
  },
});
