import { expect, test } from '@playwright/test';
import { openUnsupportedExample } from '../native-capabilities.js';

const WIDTHS = [240, 360, 768, 1440];
for (const profile of ['Spacious', 'Compact']) {
  for (const width of WIDTHS) {
    test(`${profile} Listbox native capability gap at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await openUnsupportedExample(page, profile, 'Fields', 'Listbox');
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await expect(
        page.getByRole('alert').filter({ hasText: 'Cannot load Listbox' }),
      ).toBeVisible();
      await expect(
        page.getByRole('listbox', { name: 'Delivery region', exact: true }),
      ).toHaveCount(0);
      await expect(
        page.locator('.reacd-listbox-options,.reacd-listbox-option'),
      ).toHaveCount(0);
      const diagnostic = page.getByRole('alert').filter({
        hasText: 'Cannot load Listbox',
      });
      await expect(diagnostic.locator('input[name=primary]')).toHaveCount(0);
    });
  }
}
