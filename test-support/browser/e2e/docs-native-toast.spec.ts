import { expect, test } from '@playwright/test';
import { expectContained, loadedPreview, watchPageErrors } from '../docs-site.js';

for (const width of [375, 1920]) {
  test(`native Toast saves, dismisses and undoes at ${width}px`, async ({ page }) => {
    const errors = watchPageErrors(page);
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/components/toast/');
    const preview = await loadedPreview(page);
    const trigger = preview.getByRole('button', { name: 'Save changes', exact: true });
    const card = page.getByRole('dialog', { name: 'Changes saved', exact: true });
    await trigger.click();
    await expect(card).toHaveAttribute('data-radix-collection-item', '');
    await expect(card)
      .toHaveAccessibleDescription('Your project settings were updated.');
    await card.getByRole('button', { name: 'Dismiss notification' }).click();
    await expect(card).toBeHidden();
    await trigger.click();
    await card.getByRole('button', { name: 'Undo changes' }).click();
    await expect(card).toBeHidden();
    await expect(preview.getByText('Changes restored.', { exact: true })).toBeVisible();
    await expectContained(page);
    expect(errors).toEqual([]);
  });
}
