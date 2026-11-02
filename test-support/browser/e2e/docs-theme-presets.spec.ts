import { expect, test } from '@playwright/test';
import { chooseAdapter, expectContained, loadedPreview, watchPageErrors } from
  '../docs-site.js';
import { THEME_PRESETS } from '../../../tooling/site/design/presets.js';

const THEME_INTERACTION_TIMEOUT = 60_000;
test.setTimeout(THEME_INTERACTION_TIMEOUT);

for (const width of [375, 1920]) {
  test(`one-click themes update the complete gallery at ${width}px`,
    async ({ page }) => {
      const errors = watchPageErrors(page);
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.setViewportSize({ width, height: 1000 });
      await page.goto('/');
      await loadedPreview(page);
      const presets = page.getByRole('group', { name: 'Theme preset', exact: true });
      const opener = page.getByRole('button', { name: 'Customize theme' });
      const canvas = page.locator('[data-adapter="shadcn-ui"]')
        .filter({ has: opener }).last();
      const email = page.getByRole('textbox', { name: 'Account email' });
      await email.fill('theme@example.com');
      const cobalt = presets.getByRole('button', { name: 'Cobalt theme' });
      await cobalt.click();
      await expect(cobalt).toHaveAttribute('aria-pressed', 'true');
      await expect(page.getByRole('button', { name: 'Connect account' }))
        .toHaveCSS('background-color', 'rgb(96, 165, 250)');
      await expect(canvas).toHaveCSS('background-color', 'rgb(9, 9, 11)');
      await chooseAdapter(page, 'Material UI');
      const material = page.locator('[data-adapter="material-ui"]').first();
      const connect = material.getByRole('button', { name: 'Connect account' });
      await expect(connect).toHaveCSS('background-color', 'rgb(96, 165, 250)');
      await expect(connect).toHaveCSS('border-radius', '4px');
      await expect(connect).toHaveCSS('font-family', /system-ui/);
      await expect(email).toHaveValue('theme@example.com');
      for (const preset of THEME_PRESETS) {
        const button = presets.getByRole('button', {
          name: `${preset.label} theme`, exact: true,
        });
        await button.click();
        await expect(button).toHaveAttribute('aria-pressed', 'true');
        await expect(email).toHaveValue('theme@example.com');
        await expectContained(page);
      }
      await presets.getByRole('button', { name: 'Mint theme', exact: true }).click();
      await expect(connect).toHaveCSS('font-family', /Public Sans/);
      await presets.getByRole('button', { name: 'Mono theme', exact: true }).click();
      await expect(connect).toHaveCSS('border-radius', '0px');
      await expect(connect).toHaveCSS('background-color', 'rgb(250, 250, 250)');
      await cobalt.focus();
      await page.keyboard.press('Enter');
      await expect(cobalt).toHaveAttribute('aria-pressed', 'true');
      await opener.click();
      const dialog = page.getByRole('dialog', { name: 'Customize theme' });
      await dialog.getByRole('combobox', { name: 'Primary color' }).click();
      await page.getByRole('option', { name: 'Green', exact: true }).click();
      await expect(connect).toHaveCSS('background-color', 'rgb(52, 211, 153)');
      await expect(dialog).toBeVisible();
      await dialog.getByRole('button', { name: 'Close', exact: true }).click();
      await expect(opener).toBeFocused();
      await expect(presets.getByRole('button', { pressed: true })).toHaveCount(0);
      await expect(page.getByText('Custom theme', { exact: true })).toBeVisible();
      await chooseAdapter(page, 'shadcn/ui');
      await expect(page.getByRole('button', { name: 'Connect account' }))
        .toHaveCSS('background-color', 'rgb(52, 211, 153)');
      await expect(email).toHaveValue('theme@example.com');
      await page.reload();
      await loadedPreview(page);
      await expect(page.getByRole('button', { name: 'Connect account' }))
        .toHaveCSS('background-color', 'rgb(52, 211, 153)');
      await page.locator('html').evaluate(element => {
        element.style.fontSize = '200%';
      });
      await presets.getByRole('button', { name: 'Default theme' }).click();
      await expect(page.getByRole('button', { name: 'Connect account' }))
        .toHaveCSS('background-color', 'rgb(250, 250, 250)');
      await expectContained(page);
      expect(errors).toEqual([]);
    });
}
