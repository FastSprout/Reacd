import { expect, test } from '@playwright/test';
import { openUnsupportedExample } from '../native-capabilities.js';

const PROFILES = ['Spacious', 'Compact'];
const WIDTHS = [240, 360, 768, 1440];

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    test(`${profile} reports the native Editor gap at ${width}px and 200% text`,
      async ({ page }) => {
        await page.setViewportSize({ width, height: 1000 });
        await openUnsupportedExample(page, profile, 'Content and data', 'Editor');
        await page.locator('html').evaluate(element => {
          element.style.fontSize = '200%';
        });
        const diagnostic = page.getByRole('alert').filter({
          has: page.getByText('Cannot load Editor', { exact: true }),
        });
        await expect(diagnostic).toBeVisible();
        await expect(page.getByRole('textbox', {
          name: 'Project notes', exact: true,
        })).toHaveCount(0);
        await expect(page.getByRole('toolbar', {
          name: 'Document formatting', exact: true,
        })).toHaveCount(0);
        await expect(page.locator('.ProseMirror')).toHaveCount(0);
      },
    );
  }

  test(`${profile} identifies unavailable controlled Editor declarations`,
    async ({ page }) => {
      await openUnsupportedExample(page, profile, 'Content and data',
        'EditorControlled', 'Editor');
      await expect(page.getByRole('textbox', {
        name: 'Controlled article', exact: true,
      })).toHaveCount(0);
    },
  );
}
