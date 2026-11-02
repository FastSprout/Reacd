import { expect, test } from '@playwright/test';
import { expectContained, loadedPreview, watchPageErrors } from '../docs-site.js';

for (const width of [375, 1920]) {
  test(`required radio group works without an explicit name at ${width}px`,
    async ({ page }) => {
      const errors = watchPageErrors(page);
      await page.setViewportSize({ width, height: 1080 });
      await page.goto('/components/radio-group/');
      const preview = await loadedPreview(page);
      await preview.getByRole('button', { name: 'Save delivery' }).click();
      const standard = preview.getByRole('radio', { name: 'Standard delivery' });
      await expect(standard).toBeFocused();
      await standard.check();
      await preview.getByRole('button', { name: 'Save delivery' }).click();
      await expect(preview.getByText('Saved delivery: standard', { exact: true }))
        .toBeVisible();
      await expectContained(page);
      expect(errors).toEqual([]);
    });

  test(`multiple selection serializes while its SDK popup is closed at ${width}px`,
    async ({ page }) => {
      const errors = watchPageErrors(page);
      await page.setViewportSize({ width, height: 1080 });
      await page.goto('/components/select/');
      const preview = await loadedPreview(page);
      await preview.getByRole('combobox', { name: 'Included statuses' }).click();
      await page.getByRole('option', {
        name: 'Regional approval and international logistics coordination',
      }).click();
      await page.keyboard.press('Escape');
      const form = preview.getByRole('form', { name: 'Choice form' });
      expect(await form.evaluate((element) => {
        if (!(element instanceof HTMLFormElement)) throw new Error('Missing form');
        return new FormData(element).getAll('included');
      })).toEqual(['draft', 'review']);
      await preview.getByRole('button', { name: 'Save choices' }).click();
      await expect(preview.getByText('Selection saved.', { exact: true }))
        .toBeVisible();
      await expectContained(page);
      expect(errors).toEqual([]);
    });

  test(`range slider preserves named endpoints at ${width}px`, async ({ page }) => {
    const errors = watchPageErrors(page);
    await page.setViewportSize({ width, height: 1080 });
    await page.goto('/components/slider/');
    const preview = await loadedPreview(page);
    const minimum = preview.getByRole('slider', { name: 'Minimum Price interval' });
    await minimum.focus();
    await minimum.press('ArrowRight');
    await expect(minimum).toHaveAttribute('aria-valuenow', '21');
    const form = preview.getByRole('form', { name: 'Slider form' });
    expect(await form.evaluate((element) => {
      if (!(element instanceof HTMLFormElement)) throw new Error('Missing form');
      const data = new FormData(element);
      return [data.get('price.start'), data.get('price.end')];
    })).toEqual(['21', '80']);
    await preview.getByRole('switch', { name: 'Read-only sliders' }).check();
    await minimum.focus();
    await minimum.press('ArrowRight');
    await expect(minimum).toHaveAttribute('aria-valuenow', '21');
    await expect(minimum).toHaveAttribute('aria-readonly', 'true');
    await expectContained(page);
    expect(errors).toEqual([]);
  });
}
