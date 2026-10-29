import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../src/core/policy.js';
const WIDTHS = [240, 360, 768, 1440];
const HEIGHT = 1000;
const TOLERANCE = 1;
async function content(page: Page, profile: string) {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Content and data', exact: true }).click();
}
async function contained(page: Page) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual((await page.evaluate(() => innerWidth)) + TOLERANCE);
}
for (const profile of ['Spacious', 'Compact']) {
  for (const width of WIDTHS) {
    test(`${profile} table ${width}px, 200%, RTL and local data scrolling`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await content(page, profile);
      const caption = 'LongReference'.repeat(10);
      await page.getByRole('textbox', { name: 'Table caption' }).fill(caption);
      await page.getByRole('switch', { name: 'Right to left table' }).check();
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      const region = page.getByRole('region', { name: caption, exact: true });
      await expect(region).toHaveCSS('direction', 'rtl');
      await region.focus();
      await expect(region).toBeFocused();
      await page.keyboard.press('ArrowLeft');
      const sort = region.getByRole('button', { name: 'Sort Amount' });
      const box = await sort.boundingBox();
      if (box === null) throw new Error('Missing table control geometry.');
      expect(box.width).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
      expect(box.height).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
      await expect(region.getByRole('table', { name: caption })).toBeVisible();
      await contained(page);
    });
  }
  test(`${profile} table controlled query, keyboard, permissions and retry`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await content(page, profile);
    const region = page.getByRole('region', { name: 'Reference orders', exact: true });
    const group = region.locator('..');
    await region.getByRole('checkbox', { name: 'Select row alpha' }).check();
    await expect(
      region.getByRole('checkbox', { name: 'Select row alpha' }),
    ).toBeChecked();
    await group.getByRole('button', { name: 'Next page' }).click();
    await expect(group.getByRole('status')).toContainText('Page 2 of 3');
    const sort = region.getByRole('button', { name: 'Sort Amount' });
    await sort.focus();
    await page.keyboard.press('Enter');
    await expect(group.getByRole('status')).toContainText('Page 1 of 3');
    await expect(region.getByRole('cell', { name: 'Beta', exact: true })).toBeVisible();
    const filter = region.getByRole('searchbox', { name: 'Filter Name' });
    await filter.fill('Gamma');
    await expect(
      region.getByRole('cell', { name: 'Gamma', exact: true }),
    ).toBeVisible();
    await page.getByRole('switch', { name: 'Reject table proposals' }).check();
    await filter.fill('Beta');
    await expect(filter).toHaveValue('Gamma');
    await page.getByRole('switch', { name: 'Reject table proposals' }).uncheck();
    await filter.fill('');
    await page.getByRole('switch', { name: 'Readonly table' }).check();
    await expect(sort).toBeDisabled();
    await expect(filter).toBeDisabled();
    await page.getByRole('switch', { name: 'Readonly table' }).uncheck();
    await page.getByRole('button', { name: 'Preview loading table' }).click();
    await expect(page.getByText('Loading data…', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Preview failed table' }).click();
    await page.getByRole('button', { name: 'Retry table' }).click();
    await expect(region.getByRole('table', { name: 'Reference orders' })).toBeVisible();
    await page.getByRole('switch', { name: 'Empty table preview' }).check();
    await expect(group.getByText('No matching rows.', { exact: true })).toBeVisible();
    await contained(page);
    expect(errors).toEqual([]);
  });
}
