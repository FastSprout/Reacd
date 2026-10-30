import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  testDir: './browser/e2e',
  testMatch: 'temporal-recovery.spec.ts',
  workers: 1,
  retries: 0,
  reporter: [['list']],
  outputDir: '../.cache/recovery-browser-results',
  use: {
    baseURL: 'http://127.0.0.1:5201',
    browserName: 'chromium',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    cwd: fileURLToPath(new URL('../', import.meta.url)),
    command:
      'node node_modules/vite/bin/vite.js preview ' +
      '--config test-support/temporal-recovery.vite.ts ' +
      '--host 127.0.0.1 --port 5201 --strictPort',
    url: 'http://127.0.0.1:5201/temporal-recovery.html',
    reuseExistingServer: false,
  },
});
