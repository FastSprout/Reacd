import { expect, test } from '@playwright/test';
import { openUnsupportedExample } from '../native-capabilities.js';

for (const profile of ['Spacious', 'Compact']) {
  test(`${profile} contains unsupported Editor without a made-up startup retry`,
    async ({ page }) => {
      await openUnsupportedExample(page, profile, 'Content and data', 'Editor');
      await expect(page.getByRole('button', { name: 'Retry editor', exact: true }))
        .toHaveCount(0);
      await page.getByRole('button', { name: 'Fields', exact: true }).click();
      const name = page.getByRole('textbox', { name: 'Name', exact: true });
      await name.fill('Preserved neighboring field');
      await page.getByRole('button', {
        name: 'Content and data', exact: true,
      }).click();
      await expect(page.getByRole('alert').filter({
        has: page.getByText('Cannot load Editor', { exact: true }),
      })).toBeVisible();
      await page.getByRole('button', { name: 'Fields', exact: true }).click();
      await expect(name).toHaveValue('Preserved neighboring field');
    },
  );
}
