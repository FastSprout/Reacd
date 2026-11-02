import { expect, test } from '@playwright/test';
import { openUnsupportedExample } from '../native-capabilities.js';

const WIDTHS = [240, 360, 768, 1440];
for (const profile of ['Spacious', 'Compact']) {
  for (const width of WIDTHS) {
    test(`${profile} ColorPicker native capability gap at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await openUnsupportedExample(page, profile, 'Fields', 'ColorPicker');
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await expect(
        page.getByRole('alert').filter({ hasText: 'Cannot load ColorPicker' }),
      ).toBeVisible();
      await expect(
        page.getByRole('group', { name: 'Reference color', exact: true }),
      ).toHaveCount(0);
      await expect(
        page.getByRole('slider', { name: 'Reference color hue' }),
      ).toHaveCount(0);
      await expect(page.locator('.reacd-color-area,input[type=color]')).toHaveCount(0);
    });
  }
}
