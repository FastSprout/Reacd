import { expect, test } from '@playwright/test';
import { expectContained, loadedPreview, watchPageErrors } from '../docs-site.js';

for (const width of [375, 1920]) {
  test(`native menu choices and submenu keyboard at ${width}px`, async ({ page }) => {
    const errors = watchPageErrors(page);
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/components/dropdown-menu/');
    const preview = await loadedPreview(page);
    const trigger = preview.getByRole('button', { name: 'Record actions' });
    await trigger.focus();
    await page.keyboard.press('Enter');
    const menu = page.getByRole('menu', { name: 'Record actions', exact: true });
    await expect(menu).toBeVisible();
    const pin = menu.getByRole('menuitemcheckbox', { name: 'Pin record' });
    await pin.click();
    await expect(pin).toBeChecked();
    await expect(preview.getByText('Record is pinned.', { exact: true })).toBeVisible();
    const compact = menu.getByRole('menuitemradio', { name: 'Compact', exact: true });
    await compact.click();
    await expect(compact).toBeChecked();
    await expect(preview.getByText('Density: compact', { exact: true })).toBeVisible();
    const share = menu.getByRole('menuitem', { name: 'Share', exact: true });
    await share.focus();
    await page.keyboard.press('ArrowRight');
    const submenu = page.getByRole('menu', { name: 'Share', exact: true });
    const copy = submenu.getByRole('menuitem', { name: 'Copy record identifier' });
    await expect(copy).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(submenu).toBeHidden();
    await expect(share).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(copy).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(preview.getByText('Record identifier copied locally.'))
      .toBeVisible();
    await expectContained(page);
    expect(errors).toEqual([]);
  });
}
