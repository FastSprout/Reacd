import { expect, test } from '@playwright/test';

const ORIGIN = process.env['REACD_SITE_ORIGIN'] ?? 'http://127.0.0.1:4175';

test('server navigation rails expose links without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 1000 },
  });
  try {
    const page = await context.newPage();
    await page.goto(`${ORIGIN}/components/button/`);
    for (const entry of [
      { rail: 'Navigation', link: 'Get started' },
      { rail: 'On this page', link: 'Usage' },
    ]) {
      const rail = page.getByRole('complementary', { name: entry.rail, exact: true });
      await expect(
        rail.getByRole('link', { name: entry.link, exact: true }),
      ).toBeVisible();
      await expect
        .poll(async () => (await rail.boundingBox())?.height ?? 0)
        .toBeGreaterThan(0);
      const bounds = await rail.boundingBox();
      if (!bounds) throw new Error('Missing server navigation rail.');
      expect(bounds.height).toBeLessThanOrEqual(1000);
      if (entry.rail === 'Navigation') {
        const viewport = rail
          .getByRole('region', {
            name: 'Navigation',
            exact: true,
          })
          .and(page.locator('[tabindex="0"]'));
        const start = await viewport.evaluate((element) => element.scrollTop);
        await viewport.focus();
        await page.keyboard.press('End');
        await expect
          .poll(() => viewport.evaluate((element) => element.scrollTop))
          .toBeGreaterThan(start);
      }
    }
  } finally {
    await context.close();
  }
});
