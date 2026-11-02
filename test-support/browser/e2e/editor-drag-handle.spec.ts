import { expect, test } from '@playwright/test';
import { openUnsupportedExample } from '../native-capabilities.js';

const WIDTHS = [240, 360, 768, 1440];

for (const profile of ['Spacious', 'Compact']) {
  for (const width of WIDTHS) {
    test(`${profile} exposes the block editor capability gap at ${width}px`,
      async ({ page }) => {
        await page.setViewportSize({ width, height: 1000 });
        await openUnsupportedExample(page, profile, 'Content and data',
          'EditorDragHandle', 'Editor');
        await page.locator('html').evaluate(element => {
          element.style.fontSize = '200%';
        });
        await expect(page.getByRole('alert').filter({
          has: page.getByText('Cannot load EditorDragHandle', { exact: true }),
        })).toBeVisible();
        await expect(page.getByRole('textbox', {
          name: 'Block reorder document', exact: true,
        })).toHaveCount(0);
        await expect(page.getByRole('group', {
          name: 'Review block', exact: true,
        })).toHaveCount(0);
        await expect(page.locator('[data-reacd-block]')).toHaveCount(0);
      },
    );
  }
}
