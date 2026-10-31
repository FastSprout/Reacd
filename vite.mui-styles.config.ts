import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'packages/mui/dist',
    emptyOutDir: false,
    cssCodeSplit: true,
    rolldownOptions: {
      input: 'src/adapter/mui/styles.css',
      output: { assetFileNames: 'styles.css' },
    },
  },
});
