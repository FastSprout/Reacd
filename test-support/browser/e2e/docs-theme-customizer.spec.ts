import { expect, test } from '@playwright/test';
import { expectContained, loadedPreview, watchPageErrors } from '../docs-site.js';

const CHOICES = [
  ['Primary color', 'Blue'],
  ['Neutral color', 'Slate'],
  ['Font family', 'System'],
  ['Corner radius', 'Small'],
  ['Density', 'Compact'],
] as const;

for (const width of [375, 1920]) {
  for (const textScale of [100, 200]) {
    test(`theme controls persist at ${width}px and ${textScale}% text`, async ({
      page,
    }) => {
      const errors = watchPageErrors(page);
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.setViewportSize({ width, height: 1000 });
      await page.goto('/examples/counter/');
      await loadedPreview(page);
      await page.locator('html').evaluate((element, scale) => {
        element.style.fontSize = `${scale}%`;
      }, textScale);
      await page.getByRole('button', { name: 'Increment', exact: true }).click();
      const opener = page.getByRole('button', { name: 'Customize theme' });
      await opener.click();
      const dialog = page.getByRole('dialog', { name: 'Customize theme' });
      await expect(dialog).toBeVisible();
      for (const [label, option] of CHOICES) {
        const selector = dialog.getByRole('combobox', { name: label });
        await selector.click();
        await page.getByRole('option', { name: option, exact: true }).click();
        await expect(selector).toHaveText(option);
        await expectContained(page);
      }
      await dialog.getByRole('button', { name: 'Close', exact: true }).click();
      await expect(opener).toBeFocused();
      // The dismissed sheet can expose Increment beneath the pointer.
      await page.mouse.move(0, 0);
      await expect(page.getByText('Count: 1', { exact: true })).toBeVisible();
      const canvas = page.locator('[data-adapter="shadcn-ui"]')
        .filter({ has: opener }).last();
      const increment = page.getByRole('button', { name: 'Increment', exact: true });
      await expect(canvas).toHaveCSS('background-color', 'rgb(15, 23, 42)');
      await expect(increment).toHaveCSS('background-color', 'rgb(96, 165, 250)');
      await expect(increment).toHaveCSS('--radius', '0.25rem');
      await expect(increment).toHaveCSS('--text-base', '0.875rem');
      await expectContained(page);
      await page.reload();
      await loadedPreview(page);
      await expect(canvas).toHaveCSS('background-color', 'rgb(15, 23, 42)');
      await expect(increment).toHaveCSS('background-color', 'rgb(96, 165, 250)');
      await opener.click();
      for (const [label, option] of CHOICES) {
        await expect(dialog.getByRole('combobox', { name: label }))
          .toHaveText(option);
      }
      await dialog.getByRole('button', { name: 'Reset theme' }).click();
      await dialog.getByRole('button', { name: 'Close', exact: true }).click();
      await page.mouse.move(0, 0);
      await expect(canvas).toHaveCSS('background-color', 'rgb(10, 10, 10)');
      await expect(increment).toHaveCSS('background-color', 'rgb(250, 250, 250)');
      await expectContained(page);
      expect(errors).toEqual([]);
    });
  }
}
