import { expect, test } from '@playwright/test';
import { openUnsupportedExample } from '../native-capabilities.js';

const WIDTHS = [240, 320, 375, 600, 768, 1024, 1440, 1920];
for (const profile of ['Spacious', 'Compact']) {
  for (const width of WIDTHS) {
    test(`${profile} Tree native capability gap at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await openUnsupportedExample(page, profile, 'Content and data', 'Tree');
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await expect(
        page.getByRole('alert').filter({ hasText: 'Cannot load Tree' }),
      ).toBeVisible();
      await expect(
        page.getByRole('tree', { name: 'Project documents', exact: true }),
      ).toHaveCount(0);
      await expect(page.getByRole('treeitem')).toHaveCount(0);
      await expect(page.locator('.reacd-tree')).toHaveCount(0);
    });
  }
}
