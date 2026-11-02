import type { Plugin } from 'vite';

export function runtimeModuleManifest(): Plugin {
  return {
    name: 'reacd-runtime-module-provenance',
    generateBundle(_options, bundle) {
      const chunks = Object.values(bundle).flatMap((output) =>
        output.type === 'chunk' ? [[output.fileName, Object.keys(output.modules)]] : [],
      );
      this.emitFile({
        type: 'asset',
        fileName: 'runtime-modules.json',
        source: JSON.stringify(Object.fromEntries(chunks)),
      });
    },
  };
}
