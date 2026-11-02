import { expect, test } from '@playwright/test';
import { openUnsupportedExample } from '../native-capabilities.js';

for (const profile of ['Spacious', 'Compact']) {
  test(`${profile} reports the capability gap instead of invented editor typography`,
    async ({ page }) => {
      await openUnsupportedExample(page, profile, 'Content and data', 'Editor');
      await expect(page.getByRole('textbox', {
        name: 'Project notes', exact: true,
      })).toHaveCount(0);
      await expect(page.getByRole('toolbar', {
        name: 'Document formatting', exact: true,
      })).toHaveCount(0);
      await expect(page.locator('.reacd-editor-preview')).toHaveCount(0);
      await expect(page.getByRole('combobox', { name: 'Appearance', exact: true }))
        .toHaveText(profile);
    },
  );
}
