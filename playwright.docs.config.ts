import { defineConfig, devices } from '@playwright/test';
import base from './playwright.config.js';

const BROWSERS = ['chromium', 'firefox', 'webkit'] as const;
const transportAndCatalog = [
  '**/docs-static-routes.spec.ts',
  '**/docs-catalog.spec.ts',
];

export default defineConfig({
  ...base,
  testMatch: '**/docs-*.spec.ts',
  testIgnore: [],
  outputDir: 'test-results/docs-devices',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report/docs-devices', open: 'never' }],
  ],
  projects: [
    ...BROWSERS.map((browser) => ({
      name: `docs-${browser}`,
      testIgnore:
        browser === 'chromium'
          ? ['**/docs-touch.spec.ts']
          : ['**/docs-touch.spec.ts', ...transportAndCatalog],
      use: { browserName: browser, storageState: { cookies: [], origins: [] } },
    })),
    {
      name: 'docs-iphone',
      testMatch: '**/docs-touch.spec.ts',
      use: { ...devices['iPhone 13'], browserName: 'webkit' },
    },
    {
      name: 'docs-android',
      testMatch: '**/docs-touch.spec.ts',
      use: { ...devices['Pixel 7'], browserName: 'chromium' },
    },
  ],
  use: { ...base.use, baseURL: 'http://127.0.0.1:4175' },
  webServer: {
    command:
      'npm run preview -- --config vite.site.config.ts ' + '--port 4175 --strictPort',
    url: 'http://127.0.0.1:4175',
    reuseExistingServer: false,
  },
});
