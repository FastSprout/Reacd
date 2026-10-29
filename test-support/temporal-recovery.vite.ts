import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

export default defineConfig({
  root: 'test-support',
  plugins: [tailwindcss(), react()],
  cacheDir: '.cache/vite-recovery-browser',
  build: {
    outDir: '../recovery-browser-dist',
    emptyOutDir: true,
    rolldownOptions: { input: resolve('test-support/temporal-recovery.html') },
  },
});
