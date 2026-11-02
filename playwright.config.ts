import { defineConfig } from '@playwright/test';
import type { ReporterDescription } from '@playwright/test';

const BROWSER_EXECUTION_POLICY = {
  maxWorkers: 4,
} as const;

const GITHUB_REPORTERS: ReporterDescription[] =
  process.env['GITHUB_ACTIONS'] === 'true' ? [['github']] : [];

export default defineConfig({
  testDir: 'test-support/browser/e2e',
  testIgnore: '**/docs-*.spec.ts',
  fullyParallel: true,
  forbidOnly: true,
  workers: BROWSER_EXECUTION_POLICY.maxWorkers,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }], ...GITHUB_REPORTERS],
  projects: [
    ...['mui', 'shadcn'].map((name) => ({
      name,
      testIgnore: ['**/docs-*.spec.ts', '**/pin-readability.spec.ts'],
      use: {
        storageState: {
          cookies: [],
          origins: [4174, 4175, 4176, 4177, 4178].map((port) => ({
            origin: `http://127.0.0.1:${port}`,
            localStorage: [{ name: 'reacd-conformance-adapter', value: name }],
          })),
        },
      },
    })),
    ...(['chromium', 'firefox', 'webkit'] as const).map((browserName) => ({
      name: `pin-${browserName}`,
      testMatch: '**/pin-readability.spec.ts',
      use: {
        browserName,
        ...(browserName === 'chromium'
          ? {
              permissions: ['clipboard-read', 'clipboard-write'],
            }
          : {}),
        storageState: {
          cookies: [],
          origins: [
            {
              origin: 'http://127.0.0.1:4174',
              localStorage: [
                {
                  name: 'reacd-conformance-adapter',
                  value: 'shadcn',
                },
              ],
            },
          ],
        },
      },
    })),
  ],
  use: {
    baseURL: 'http://127.0.0.1:4174',
    browserName: 'chromium',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      command:
        'npm run preview -- --config vite.conformance.config.ts ' +
        '--port 4174 --strictPort',
      url: 'http://127.0.0.1:4174',
      reuseExistingServer: false,
    },
    ...[
      { mode: 'counter', port: 4176 },
      { mode: 'form', port: 4177 },
      { mode: 'dashboard', port: 4178 },
    ].map(({ mode, port }) => ({
      command:
        'npm run preview -- --config vite.examples.config.ts ' +
        `--mode ${mode} --port ${port} --strictPort`,
      url: `http://127.0.0.1:${port}`,
      reuseExistingServer: false,
    })),
  ],
});
