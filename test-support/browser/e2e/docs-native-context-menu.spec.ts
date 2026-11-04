import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { expectContained, loadedPreview, watchPageErrors } from '../docs-site.js';

async function settledNativeMenu(menu: Locator) {
  await expect(menu).toHaveCSS('opacity', '1');
  await expect.poll(() => menu.evaluate((element) =>
    element.getAnimations().every((animation) =>
      !animation.pending && animation.playState !== 'running',
    ),
  )).toBe(true);
}

for (const width of [375, 1440]) {
  test(`native context menu choices and keyboard at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors = watchPageErrors(page);
    await page.goto('/components/context-menu/');
    const preview = await loadedPreview(page);
    const record = preview.getByRole('group', { name: 'Sample record context' });
    await record.click({ button: 'right' });
    const menu = page.getByRole('menu', { name: 'Sample record context', exact: true });
    await expect(menu).toBeVisible();
    await settledNativeMenu(menu);
    const bounds = await menu.boundingBox();
    if (!bounds) throw new Error('Missing native context menu geometry.');
    expect(bounds.x).toBeGreaterThanOrEqual(-2);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width + 2);
    expect(bounds.y).toBeGreaterThanOrEqual(-2);
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(1002);
    await menu.getByRole('menuitemcheckbox', { name: 'Pin record' }).click();
    await expect(
      menu.getByRole('menuitemcheckbox', { name: 'Pin record' }),
    ).toHaveAttribute('aria-checked', 'true');
    await menu.getByRole('menuitemradio', { name: 'Compact', exact: true }).click();
    await expect(page.getByText('Density: compact', { exact: true })).toBeVisible();
    await menu.getByRole('menuitem', { name: 'Share', exact: true }).click();
    const submenu = page.getByRole('menu', { name: 'Share', exact: true });
    await expect(submenu).toBeVisible();
    await settledNativeMenu(submenu);
    await page.keyboard.press('Escape');
    await expect(submenu).toBeHidden();
    await expect(menu).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await record.focus();
    const recordWidth = await record.evaluate((element) =>
      element.getBoundingClientRect().width,
    );
    await page.keyboard.press('Shift+F10');
    await expect(menu).toBeVisible();
    const anchorWidth = await menu.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).getPropertyValue('--anchor-width')),
    );
    expect(anchorWidth).toBeCloseTo(recordWidth, 0);
    await menu.getByRole('menuitem', { name: 'Confirm sample record' }).click();
    await expect(menu).toBeVisible();
    await expect(
      page.getByText('Sample record confirmed locally.', { exact: true }),
    ).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(record).toBeFocused();
    await record.click({ button: 'right' });
    await menu.getByRole('menuitem', { name: 'Share', exact: true }).click();
    await expect(submenu).toBeVisible();
    await settledNativeMenu(submenu);
    await page.getByRole('menuitem', { name: 'Copy record identifier' }).click();
    await expect(page.getByText('Record identifier copied locally.', {
      exact: true,
    })).toBeVisible();
    await expect(menu).toBeHidden();
    await expectContained(page);
    expect(errors).toEqual([]);
  });
}
