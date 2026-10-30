import { defineConfig } from 'vite';
import { fileURLToPath, URL as NodeURL } from 'node:url';

export default defineConfig({
  root: fileURLToPath(new NodeURL('./', import.meta.url)),
  appType: 'mpa',
  build: {
    outDir: fileURLToPath(new NodeURL('./site', import.meta.url)),
  },
  preview: {
    host: '127.0.0.1',
  },
});
