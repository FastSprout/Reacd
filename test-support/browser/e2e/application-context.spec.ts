import { expect, test } from '@playwright/test';
import { expectUnsupportedDiagnostic } from '../native-capabilities.js';
import { watchPreviewFailures } from '../preview-failures.js';

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
      const failures = watchPreviewFailures(page);
      await page.goto('/');
      await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
      await page.getByRole('option', { name: profile, exact: true }).click();
      await expect(
        page.getByRole('heading', { name: 'Application shells' }),
      ).toBeVisible();
      await expect(page.getByRole('main')).toHaveCount(1);
      const application = page
        .locator('[lang="en"][dir="ltr"]')
        .filter({
          has: page.getByText('Application content', { exact: true }),
        })
        .last();
      await expect(application).toHaveAttribute('lang', 'en');
      await expect(application).toHaveAttribute('dir', 'ltr');
      await page.getByRole('button', { name: 'Run scoped action' }).click();
      await expect(page.getByText('Scoped actions: 1')).toBeVisible();
      const caption = page.getByText('Scoped compact appearance', { exact: true });
      const body = page.getByText('Scoped actions: 1', { exact: true });
      const captionSize = await caption.evaluate((element) =>
        parseFloat(getComputedStyle(element).fontSize),
      );
      const bodySize = await body.evaluate((element) =>
        parseFloat(getComputedStyle(element).fontSize),
      );
      expect(captionSize).toBeLessThanOrEqual(bodySize);
      expect(
        await caption.evaluate((element) => getComputedStyle(element).fontFamily),
      ).toMatch(/^system-ui/);
      if (test.info().project.name === 'mui') {
        await expectUnsupportedDiagnostic(page, failures, 'Error', 'Error');
        await expect(
          page.getByRole('link', { name: 'Return to the catalog' }),
        ).toHaveCount(0);
      } else {
        await expect(caption).toHaveCSS('font-size', '14px');
        await expect(caption).toHaveCSS('color', 'rgb(75, 93, 114)');
        const theme = caption.locator('xpath=ancestor::*[@data-adapter][1]');
        await expect(theme).toHaveCSS('background-color', 'rgb(233, 237, 242)');
        const recovery = page.getByRole('region', { name: 'Page unavailable' });
        await expect(
          recovery.getByRole('link', { name: 'Return to the catalog' }),
        ).toHaveAttribute('href', '/');
      }
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width + TOLERANCE);
    });
  }
}
