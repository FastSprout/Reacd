import { expect, test } from '@playwright/test';
import { openUnsupportedExample } from '../native-capabilities.js';

const WIDTHS = [240, 360, 768, 1440];

for (const profile of ['Spacious', 'Compact']) {
  for (const width of WIDTHS) {
    test(`${profile} remote mention preview reports Editor unavailable at ${width}px`,
      async ({ page }) => {
        await page.setViewportSize({ width, height: 1000 });
        await openUnsupportedExample(page, profile, 'Content and data',
          'EditorMentionLookup', 'Editor');
        await page.locator('html').evaluate(element => {
          element.style.fontSize = '200%';
        });
        await expect(page.getByRole('alert').filter({
          has: page.getByText('Cannot load EditorMentionLookup', { exact: true }),
        })).toBeVisible();
        await expect(page.getByRole('textbox', {
          name: 'Directory lookup document', exact: true,
        })).toHaveCount(0);
        await expect(page.getByRole('listbox', {
          name: 'Remote directory options', exact: true,
        })).toHaveCount(0);
        await expect(page.getByRole('button', {
          name: 'Resolve current', exact: true,
        })).toHaveCount(0);
      },
    );
  }
}
