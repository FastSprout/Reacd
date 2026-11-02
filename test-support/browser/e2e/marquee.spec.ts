import { expect, test } from '@playwright/test';
import { openUnsupportedExample } from '../native-capabilities.js';

const WIDTHS = [240, 360, 768, 1440];
for (const profile of ['Spacious', 'Compact']) {
  for (const width of WIDTHS) {
    test(`${profile} Marquee native capability gap at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await openUnsupportedExample(page, profile, 'Content and data', 'Marquee');
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await expect(
        page.getByRole('alert').filter({ hasText: 'Cannot load Marquee' }),
      ).toBeVisible();
      await expect(
        page.getByRole('region', { name: 'Reference notices', exact: true }),
      ).toHaveCount(0);
      await expect(page.getByRole('button', { name: 'Resume movement' })).toHaveCount(
        0,
      );
      await expect(page.locator('.reacd-marquee-track')).toHaveCount(0);
    });
  }
}
