import { expect, test } from '@playwright/test';
import { openUnsupportedExample } from '../native-capabilities.js';

const WIDTHS = [240, 360, 768, 1440];
for (const profile of ['Spacious', 'Compact']) {
  for (const width of WIDTHS) {
    test(`${profile} FileUpload native capability gap at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await openUnsupportedExample(page, profile, 'Fields', 'FileUpload');
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await expect(
        page.getByRole('alert').filter({ hasText: 'Cannot load FileUpload' }),
      ).toBeVisible();
      await expect(
        page.getByRole('group', { name: 'Attachments', exact: true }),
      ).toHaveCount(0);
      await expect(
        page.locator('input[type=file],input[name=attachments]'),
      ).toHaveCount(0);
      await expect(page.getByRole('button', { name: 'Choose files' })).toHaveCount(0);
    });
  }
}
