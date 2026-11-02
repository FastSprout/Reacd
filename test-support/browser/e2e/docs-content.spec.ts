import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import { loadedPreview, watchPageErrors } from '../docs-site.js';

test.describe('static document styling', () => {
  test.use({ javaScriptEnabled: false });

  test('every route has default SDK styles before JavaScript', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    for (const route of ['/', '/changelog/', '/components/button/']) {
      await page.goto(route);
      const header = page.getByRole('banner');
      await expect(header).toHaveCSS('position', 'sticky');
      await expect(page.locator('body')).toHaveCSS('margin', '0px');
      const bounds = await header.boundingBox();
      expect(bounds?.y).toBe(0);
      expect(bounds?.height).toBe(route === '/' ? 64 : 112);
      const title = page.getByRole('heading', { level: 1 });
      await expect(title).toHaveCSS('font-family', /Public Sans/);
      expect(
        await title.evaluate((element) =>
          Number.parseFloat(getComputedStyle(element).fontSize),
        ),
      ).toBeGreaterThan(30);
    }
  });
});

test('SSR metadata and highlighted source match the compiled view', async ({
  page,
}) => {
  const errors = watchPageErrors(page);
  await page.goto('/components/button/');
  await loadedPreview(page);
  await expect(page).toHaveTitle('Button · reacd');
  await expect(
    page.getByRole('heading', { level: 1, exact: true, name: 'Button' }),
  ).toHaveCount(1);
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
    'href',
    'https://reacd.dev/components/button/',
  );
  const source = page.getByRole('region', { name: 'tsx', exact: true }).first();
  const expected = (await readFile('docs/examples/button.tsx', 'utf8')).trimEnd();
  await expect.poll(() => source.textContent()).toBe(expected);
  const colors = await source
    .locator('span')
    .evaluateAll((elements) => [
      ...new Set(elements.map((element) => getComputedStyle(element).color)),
    ]);
  expect(colors.length).toBeGreaterThan(1);
  expect(errors).toEqual([]);
});

test('copying publishes the original Markdown source through the browser host', async ({
  page,
  request,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          Reflect.set(globalThis, '__copied', text);
        },
      },
    });
  });
  await page.goto('/components/button/');
  await page.getByRole('button', { name: 'Copy page', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Copied page', exact: true }),
  ).toBeVisible();
  const source = await request.get('/components/button/index.md');
  expect(source.ok()).toBe(true);
  const copied = await page.evaluate(() => {
    const value: unknown = Reflect.get(globalThis, '__copied');
    return value;
  });
  expect(copied).toBe(await source.text());
});

test('missing clipboard support releases the failed copy action', async ({ page }) => {
  const errors = watchPageErrors(page);
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    });
  });
  await page.goto('/components/button/');
  await page.getByRole('button', { name: 'Copy page', exact: true }).click();
  await expect(
    page.getByText('Copy failed. Try again.', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Copy page', exact: true }),
  ).toBeEnabled();
  expect(errors).toEqual([]);
});

test('invalid page data replaces the app without executing markup', async ({
  page,
}) => {
  const errors = watchPageErrors(page);
  await page.route('**/components/button/index.json', (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        page: {
          html: '<img src=x onerror="globalThis.__executed=true">',
        },
      }),
    }),
  );
  await page.goto('/components/button/');
  await expect(page.getByRole('alert')).toContainText('This page could not start');
  await expect(page.getByRole('alert')).toContainText(
    'Reload the page to try loading the documentation again.',
  );
  await expect(page.getByRole('button', { name: 'Reload page' })).toBeVisible();
  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.locator('[data-adapter="shadcn-ui"]')).toHaveCount(1);
  const executed = await page.evaluate(() => {
    const value: unknown = Reflect.get(globalThis, '__executed');
    return value;
  });
  expect(executed).toBeUndefined();
  await expect(page.locator('[onerror]')).toHaveCount(0);
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
    'href',
    'https://reacd.dev/components/button/',
  );
  expect(errors).toEqual([]);
});
