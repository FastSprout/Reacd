import { defineConfig } from '@playwright/test';

const BROWSER_EXECUTION_POLICY = {
  maxWorkers: 2,
} as const;

export default defineConfig({
  testDir: 'demo/e2e',
  fullyParallel: true,
  forbidOnly: true,
  workers: BROWSER_EXECUTION_POLICY.maxWorkers,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4174',
    browserName: 'chromium',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      command: 'npm run preview -- --port 4174 --strictPort',
      url: 'http://127.0.0.1:4174',
      reuseExistingServer: false,
    },
    {
      command: '.venv-docs/bin/python -m http.server 4175 --bind 127.0.0.1 -d site',
      url: 'http://127.0.0.1:4175',
      reuseExistingServer: false,
    },
  ],
});
