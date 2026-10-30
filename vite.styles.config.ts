import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    outDir: 'dist/adapter/shadcn',
    emptyOutDir: false,
    cssCodeSplit: true,
    rolldownOptions: {
      input: 'src/adapter/shadcn/styles.css',
      output: { assetFileNames: 'styles.css' },
    },
  },
});
