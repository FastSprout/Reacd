import { expect, test } from '@playwright/test';
import { openUnsupportedExample } from '../native-capabilities.js';

const WIDTHS = [240, 360, 768, 1440];
for (const profile of ['Spacious', 'Compact']) {
  for (const width of WIDTHS) {
    test(`${profile} Carousel native capability gap at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await openUnsupportedExample(page, profile, 'Content and data', 'Carousel');
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await expect(
        page.getByRole('alert').filter({ hasText: 'Cannot load Carousel' }),
      ).toBeVisible();
      await expect(
        page.getByRole('region', { name: 'Getting started', exact: true }),
      ).toHaveCount(0);
      await expect(page.getByRole('button', { name: 'Next slide' })).toHaveCount(0);
      await expect(page.locator('.reacd-carousel')).toHaveCount(0);
    });
  }
}
