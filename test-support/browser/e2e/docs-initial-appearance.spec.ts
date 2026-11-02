import { expect, test } from '@playwright/test';
import { SITE_POLICY } from '../../../tooling/site/policy.js';
import { watchPageErrors } from '../docs-site.js';
import { DEFAULT_DESIGN_PREFERENCES } from
  '../../../tooling/site/design/preferences.js';

const scenarios = [
  { name: 'system dark', system: 'dark', saved: null, dark: true },
  { name: 'saved dark', system: 'light', saved: 'dark', dark: true },
  { name: 'saved light', system: 'dark', saved: 'light', dark: false },
  { name: 'invalid preference', system: 'dark', saved: 'invalid', dark: true },
] as const;

for (const scenario of scenarios) {
  test(`first paint honors ${scenario.name} before app startup`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scenario.system });
    await page.addInitScript(
      ({ key, saved }) => {
        localStorage.removeItem(key);
        if (saved !== null) localStorage.setItem(key, saved);
      },
      { key: SITE_POLICY.appearancePreference, saved: scenario.saved },
    );
    await page.route('**/assets/site.js', (route) => route.abort());
    await page.route('**/index.json', (route) => route.abort());
    await page.goto('/getting-started/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const canvas = page.locator('[data-adapter="shadcn-ui"]').first();
    await expect(canvas).toHaveCSS(
      'background-color',
      scenario.dark ? 'rgb(10, 10, 10)' : 'rgb(255, 255, 255)',
    );
    await expect(canvas).toHaveCSS(
      'color',
      scenario.dark ? 'rgb(250, 250, 250)' : 'rgb(24, 24, 24)',
    );
    await expect(page.locator('html')).toHaveCSS(
      'color-scheme',
      scenario.dark ? 'dark' : 'light',
    );
  });
}

test('uses system dark before startup when preference storage is blocked', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() { throw new DOMException('Storage blocked', 'SecurityError'); },
    });
  });
  await page.route('**/assets/site.js', (route) => route.abort());
  await page.goto('/getting-started/');
  await expect(page.locator('[data-adapter="shadcn-ui"]').first()).toHaveCSS(
    'background-color', 'rgb(10, 10, 10)',
  );
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'dark');
});

test('restores the saved palette before loading the application', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.addInitScript(({ key, design }) => {
    localStorage.setItem(key, JSON.stringify(design));
  }, {
    key: SITE_POLICY.designPreference,
    design: { ...DEFAULT_DESIGN_PREFERENCES, primary: 'blue', neutral: 'slate' },
  });
  await page.route('**/assets/site.js', (route) => route.abort());
  await page.goto('/getting-started/');
  const canvas = page.locator('[data-adapter="shadcn-ui"]').first();
  await expect(canvas).toHaveCSS('background-color', 'rgb(15, 23, 42)');
  await expect(canvas).toHaveCSS('--primary', '#60a5fa');
});

test('preserves painted markup when preferences change before hydration', async ({
  page,
}) => {
  const errors = watchPageErrors(page);
  await page.addInitScript(
    (key) => localStorage.setItem(key, 'dark'),
    SITE_POLICY.appearancePreference,
  );
  let release = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route('**/index.json', async (route) => {
    await gate;
    await route.continue();
  });
  await page.goto('/getting-started/', { waitUntil: 'commit' });
  const canvas = page.locator('[data-adapter="shadcn-ui"]').first();
  await expect(canvas).toHaveCSS('background-color', 'rgb(10, 10, 10)');
  await page.evaluate(
    (key) => localStorage.setItem(key, 'light'),
    SITE_POLICY.appearancePreference,
  );
  release();
  await expect(page.locator('html')).not.toHaveAttribute('data-reacd-boot');
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'light');
  expect(errors).toEqual([]);
});
