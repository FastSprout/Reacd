import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const TEST_EXECUTION_POLICY = {
  maxWorkers: 4,
  moduleCachePath: fileURLToPath(new URL('./.cache/vitest-root', import.meta.url)),
} as const;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'reacd/jsx-runtime': fileURLToPath(
        new URL('./src/jsx-runtime.ts', import.meta.url),
      ),
      'reacd/jsx-dev-runtime': fileURLToPath(
        new URL('./src/jsx-dev-runtime.ts', import.meta.url),
      ),
      'reacd/generative': fileURLToPath(
        new URL('./src/generative.ts', import.meta.url),
      ),
      reacd: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
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
            'demo/**/*.test.{ts,tsx}',
            'tooling/**/*.test.ts',
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
        'src/**/*.{ts,tsx}',
        'demo/**/*.{ts,tsx}',
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
