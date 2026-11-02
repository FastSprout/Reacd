import { expect, test } from '@playwright/test';
import { expectContained, loadedPreview, watchPageErrors } from '../docs-site.js';

for (const width of [375, 1920]) {
  test(`native suggestions preview at ${width}px`, async ({ page }) => {
    const errors = watchPageErrors(page);
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/components/input-menu/');
    const preview = await loadedPreview(page);
    const input = page.getByRole('combobox', { name: 'Destination', exact: true });
    await input.fill('Par');
    await expect(page.getByRole('option', { name: 'Paris', exact: true }))
      .toBeVisible();
    await input.press('ArrowDown');
    await input.press('Enter');
    await expect(input).toHaveValue('Paris');
    await input.fill('Another city');
    await input.press('Escape');
    await preview.getByRole('button', { name: 'Clear text: Destination' }).click();
    await expect(input).toHaveValue('');
    await expect(input).toBeFocused();
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });
    await expectContained(page);
    expect(errors).toEqual([]);
  });
}
