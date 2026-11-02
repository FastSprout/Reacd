import { expect, test } from '@playwright/test';
import { expectContained, loadedPreview, watchPageErrors } from '../docs-site.js';

for (const width of [375, 1920]) {
  test(`native command status permits recovery at ${width}px`, async ({ page }) => {
    const errors = watchPageErrors(page);
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/components/command-palette/');
    const preview = await loadedPreview(page);
    const status = preview.getByRole('combobox', { name: 'Command result status' });
    const query = preview.getByRole('combobox', { name: 'Sample command search' });
    for (const state of ['Loading', 'Error']) {
      await status.click();
      await page.getByRole('option', { name: state, exact: true }).click();
      await expect(query).toBeEnabled();
      await query.fill('profile');
      await expect(query).toHaveValue('profile');
      await expect(preview.getByRole('option')).toHaveCount(0);
      await expect(preview.getByRole(state === 'Error' ? 'alert' : 'status'))
        .toContainText(state === 'Error' ? 'could not be loaded' : 'Loading');
      await query.press('Enter');
      await expect(preview.getByText('No command selected.', { exact: true }))
        .toBeVisible();
    }
    await status.click();
    await page.getByRole('option', { name: 'Ready', exact: true }).click();
    await query.focus();
    await query.press('ArrowDown');
    await query.press('Enter');
    await expect(preview.getByText('Profile opened locally.', { exact: true }))
      .toBeVisible();
    await expectContained(page);
    expect(errors).toEqual([]);
  });
}
