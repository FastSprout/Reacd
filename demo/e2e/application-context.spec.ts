import { expect, test } from '@playwright/test';

const WIDTHS = [240, 320, 768, 1440];
const PROFILES = ['Spacious', 'Compact'];
const HEIGHT = 1000;
const TOLERANCE = 1;

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    test(`${profile} scoped appearance and recovery at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await page.goto('/');
      await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
      await page.getByRole('option', { name: profile, exact: true }).click();
      await expect(
        page.getByRole('heading', { name: 'Application shells' }),
      ).toBeVisible();
      await expect(page.getByRole('main')).toHaveCount(1);
      const application = page.locator('.reacd-app').filter({
        has: page.getByText('Application content', { exact: true }),
      });
      await expect(application).toHaveAttribute('lang', 'en');
      await expect(application).toHaveAttribute('dir', 'ltr');
      await page.getByRole('button', { name: 'Run scoped action' }).click();
      await expect(page.getByText('Scoped actions: 1')).toBeVisible();
      await expect(page.getByText('Scoped compact appearance')).toHaveAttribute(
        'data-role',
        'caption',
      );
      await expect(page.locator('.reacd-theme')).toHaveCSS(
        'background-color',
        'rgb(233, 237, 242)',
      );
      const recovery = page.getByRole('region', { name: 'Page unavailable' });
      await expect(
        recovery.getByRole('link', { name: 'Return to the catalog' }),
      ).toHaveAttribute('href', '/');
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width + TOLERANCE);
    });
  }
}
