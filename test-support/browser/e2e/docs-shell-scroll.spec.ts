import { expect, test } from '@playwright/test';
import { loadedPreview } from '../docs-site.js';

const ORIGIN = process.env['REACD_SITE_ORIGIN'] ?? 'http://127.0.0.1:4175';

for (const entry of [
  { route: '/components/button/', label: /^Usage$/ },
  { route: '/components/button/', label: /^API$/ },
  { route: '/changelog/', label: /^0\.3\.0/ },
]) {
  test(`fragment ${entry.label} clears the sticky header`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${ORIGIN}${entry.route}`);
    const contents = page.getByRole('complementary', { name: 'On this page' });
    const link = contents.getByRole('link', { name: entry.label });
    const href = await link.getAttribute('href');
    if (!href?.startsWith('#')) throw new Error('Missing fragment destination.');
    await link.click();
    const target = page.locator(`[id=${JSON.stringify(href.slice(1))}]`);
    await expect
      .poll(async () => {
        const heading = await target.boundingBox();
        const banner = await page.getByRole('banner').boundingBox();
        if (!heading || !banner) throw new Error('Missing fragment geometry.');
        expect(banner.y).toBe(0);
        return heading.y - banner.y - banner.height;
      })
      .toBeGreaterThanOrEqual(0);
  });
}

test('scaled compact navigation focus clears the wrapped header', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 1000 });
  await page.goto(`${ORIGIN}/components/button/`);
  await loadedPreview(page);
  await page.evaluate(async () => {
    await document.fonts.ready;
    document.documentElement.style.fontSize = '200%';
  });
  await page.getByRole('button', { name: 'Navigation', exact: true }).click();
  const viewport = page
    .getByRole('region', { name: 'Navigation', exact: true })
    .and(page.locator('[tabindex="0"]'));
  await viewport.focus();
  await page.keyboard.press('Tab');
  const filter = page.getByRole('textbox', { name: 'Filter navigation' });
  await expect(filter).toBeFocused();
  await expect
    .poll(async () => {
      const field = await filter.boundingBox();
      const banner = await page.getByRole('banner').boundingBox();
      if (!field || !banner) throw new Error('Missing focused navigation geometry.');
      return field.y - banner.y - banner.height;
    })
    .toBeGreaterThanOrEqual(0);
});
