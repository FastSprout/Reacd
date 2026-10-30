import { expect, it } from 'vitest';
import configuration from '../../playwright.config.js';

it('serves built examples alongside both existing mandatory conformance hosts', () => {
  expect(configuration.webServer).toEqual([
    expect.objectContaining({
      command:
        'npm run preview -- --config vite.conformance.config.ts ' +
        '--port 4174 --strictPort',
      url: 'http://127.0.0.1:4174',
      reuseExistingServer: false,
    }),
    expect.objectContaining({
      command:
        'npm run preview -- --config vite.site.config.ts ' + '--port 4175 --strictPort',
      url: 'http://127.0.0.1:4175',
      reuseExistingServer: false,
    }),
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
  ]);
  expect(configuration.workers).toBe(2);
  expect(configuration.retries).toBe(0);
  expect(configuration.forbidOnly).toBe(true);
  expect(configuration.testDir).toBe('test-support/browser/e2e');
});
