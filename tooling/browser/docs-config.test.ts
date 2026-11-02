import { expect, it } from 'vitest';
import configuration from '../../playwright.docs.config.js';
import base from '../../playwright.config.js';

it('allocates docs to one host without adapter duplication', () => {
  expect(base.testIgnore).toBe('**/docs-*.spec.ts');
  expect(configuration.testMatch).toBe('**/docs-*.spec.ts');
  expect(configuration.testIgnore).toEqual([]);
  expect(configuration.retries).toBe(0);
  expect(configuration.forbidOnly).toBe(true);
  expect(configuration.use?.baseURL).toBe('http://127.0.0.1:4175');
  expect(configuration.webServer).toEqual({
    command: 'npm run preview -- --config vite.site.config.ts --port 4175 --strictPort',
    url: 'http://127.0.0.1:4175',
    reuseExistingServer: false,
  });
  expect(configuration.projects?.map((project) => project.name)).toEqual([
    'docs-chromium',
    'docs-firefox',
    'docs-webkit',
    'docs-iphone',
    'docs-android',
  ]);
});

it('retains catalog and transport alongside three-engine interaction', () => {
  const projects = configuration.projects ?? [];
  expect(projects[0]?.testIgnore).toEqual(['**/docs-touch.spec.ts']);
  for (const project of projects.slice(1, 3)) {
    expect(project.testIgnore).toEqual([
      '**/docs-touch.spec.ts',
      '**/docs-static-routes.spec.ts',
      '**/docs-catalog.spec.ts',
    ]);
    expect(project.use?.storageState).toEqual({ cookies: [], origins: [] });
  }
  expect(projects[3]?.use?.browserName).toBe('webkit');
  expect(projects[3]?.use?.isMobile).toBe(true);
  expect(projects[4]?.use?.browserName).toBe('chromium');
  expect(projects[4]?.use?.isMobile).toBe(true);
  expect(projects[3]?.testMatch).toBe('**/docs-touch.spec.ts');
  expect(projects[4]?.testMatch).toBe('**/docs-touch.spec.ts');
});
