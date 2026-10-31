import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const TEST_EXECUTION_POLICY = {
  maxWorkers: 2,
  moduleCachePath: fileURLToPath(new URL('./.cache/vitest-root', import.meta.url)),
} as const;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@fastsprout/reacd/adapter-runtime/core': fileURLToPath(
        new URL('./src/core/', import.meta.url),
      ),
      '@fastsprout/reacd/adapter-runtime/schema': fileURLToPath(
        new URL('./src/schema/', import.meta.url),
      ),
      '@fastsprout/reacd/adapter-runtime/components': fileURLToPath(
        new URL('./src/components/', import.meta.url),
      ),
      '@fastsprout/reacd/adapter-runtime/renderer': fileURLToPath(
        new URL('./src/renderer/', import.meta.url),
      ),
      '@fastsprout/reacd-shadcn/styles.css': fileURLToPath(
        new URL('./src/adapter/shadcn/styles.css', import.meta.url),
      ),
      '@fastsprout/reacd-shadcn/styles': fileURLToPath(
        new URL('./src/adapter/shadcn/styles.ts', import.meta.url),
      ),
      '@fastsprout/reacd-shadcn': fileURLToPath(
        new URL('./src/adapter/shadcn/shadcn.adapter.ts', import.meta.url),
      ),
      '@fastsprout/reacd/jsx-runtime': fileURLToPath(
        new URL('./src/jsx-runtime.ts', import.meta.url),
      ),
      '@fastsprout/reacd/jsx-dev-runtime': fileURLToPath(
        new URL('./src/jsx-dev-runtime.ts', import.meta.url),
      ),
      '@fastsprout/reacd/generative': fileURLToPath(
        new URL('./src/generative.ts', import.meta.url),
      ),
      '@fastsprout/reacd/bootstrap': fileURLToPath(
        new URL('./src/bootstrap.ts', import.meta.url),
      ),
      '@fastsprout/reacd': fileURLToPath(new URL('./src/index.ts', import.meta.url)),
    },
  },
  test: {
    maxWorkers: TEST_EXECUTION_POLICY.maxWorkers,
    fsModuleCachePath: TEST_EXECUTION_POLICY.moduleCachePath,
    projects: [
      {
        extends: true,
        test: {
          name: 'runtime',
          environment: 'jsdom',
          setupFiles: ['test-support/setup.ts'],
          include: [
            'src/**/*.test.{ts,tsx}',
            'examples/**/*.test.{ts,tsx}',
            'tooling/**/*.test.{ts,tsx}',
            'docs/examples/**/*.test.tsx',
          ],
        },
      },
      {
        extends: true,
        test: {
          name: 'cli',
          environment: 'node',
          setupFiles: [],
          include: ['scripts/**/*.test.ts'],
        },
      },
    ],
    coverage: {
      provider: 'v8',
      include: [
        'vite.site.config.ts',
        'vite.conformance.config.ts',
        'src/**/*.{ts,tsx}',
        'examples/**/*.{ts,tsx}',
        'tooling/**/*.{ts,tsx}',
        'scripts/**/*.{ts,mjs}',
        'docs/examples/**/*.tsx',
      ],
      exclude: [
        'src/adapter/shadcn/vendor/**',
        '**/*.test.*',
        '**/*.spec.*',
        '**/__tests__/**',
        'test-support/**',
      ],
      reporter: ['text', 'html', 'json-summary'],
      thresholds: {
        perFile: true,
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
});
