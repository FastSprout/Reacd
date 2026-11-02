import { expect, test } from '@playwright/test';
import { expectContained, loadedPreview, watchPageErrors } from '../docs-site.js';

for (const width of [375, 1920]) {
  test(`native topic editing at ${width}px`, async ({ page }) => {
    const errors = watchPageErrors(page);
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/components/input-tags/');
    const preview = await loadedPreview(page);
    const input = preview.getByRole('combobox', { name: 'Topics', exact: true });
    await input.fill('TypeScript');
    await input.press('Enter');
    await expect(input).toHaveValue('');
    const typed = preview.getByRole('button', { name: 'Remove TypeScript' });
    await expect(typed).toBeVisible();
    await preview.getByRole('button', { name: 'Remove React', exact: true }).click();
    await expect(preview.getByRole('button', { name: 'Remove React', exact: true }))
      .toHaveCount(0);
    await expect(typed).toBeVisible();
    await expect(input).toBeFocused();
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });
    await expectContained(page);
    expect(errors).toEqual([]);
  });
}
