import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../../src/core/policy.js';
import { watchPreviewFailures } from '../preview-failures.js';

const WIDTHS = [240, 360, 768, 1440];
const HEIGHT = 1000;
const TOLERANCE = 1;
// MUI X PickerDay's native size; shadcn uses the core calendar target.
const MATERIAL_DAY_PX = 36;
const SELECTED_COLOR = 'rgb(255, 255, 255)';

async function fields(page: Page, profile: string) {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Fields', exact: true }).click();
  return await page.locator('[data-adapter]').first()
    .getAttribute('data-adapter') === 'material-ui';
}
function day(calendar: Locator, value: number, material: boolean) {
  return material ? calendar.getByRole('gridcell', { name: String(value), exact: true })
    : calendar.getByRole('button', { name: new RegExp(`October ${value}, 2026`) })
      .first();
}
async function noPageOverflow(page: Page) {
  await expect.poll(() => page.evaluate(() =>
    document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(TOLERANCE);
}
async function unsupported(page: Page,
  failures: ReturnType<typeof watchPreviewFailures>) {
  const message = 'Adapter "material-ui" does not support component "Calendar".';
  await expect.poll(failures).toContainEqual({
    name: 'UnsupportedAdapterComponentError', adapterId: 'material-ui',
    componentName: 'Calendar', message,
  });
  const alert = page.getByRole('alert').filter({
    hasText: 'Cannot load Calendar variant',
  });
  await expect(alert).toHaveText(`Cannot load Calendar variant${message}`);
  await expect(page.getByRole('group', { name: 'Delivery calendar', exact: true }))
    .toHaveCount(0);
}

for (const profile of ['Spacious', 'Compact']) {
  for (const width of WIDTHS) {
    test(`${profile} calendar ${width}px, 200% and RTL`, async ({ page }) => {
      const failures = watchPreviewFailures(page);
      await page.setViewportSize({ width, height: HEIGHT });
      const material = await fields(page, profile);
      const calendar = page.getByRole('group', {
        name: 'Delivery calendar', exact: true,
      });
      const selected = day(calendar, 30, material);
      await selected.click();
      await expect(page.getByText('Date: 2026-10-30', { exact: true })).toBeVisible();
      await expect(selected).toHaveCSS('color', SELECTED_COLOR);
      await noPageOverflow(page);
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      await page.getByRole('switch', { name: 'Right to left calendar' }).check();
      await expect(calendar).toHaveCSS('direction', 'rtl');
      const targets = calendar.locator(material ? 'button[role=gridcell]' :
        'button[data-day]');
      await expect(targets.first()).toBeVisible();
      const minimum = material ? MATERIAL_DAY_PX : LAYOUT_POLICY.controlTargetPx;
      for (const target of await targets.all()) {
        const bounds = await target.boundingBox();
        if (!bounds) throw new Error('Expected a native calendar day.');
        expect(bounds.width).toBeGreaterThanOrEqual(minimum);
        expect(bounds.height).toBeGreaterThanOrEqual(minimum);
      }
      await expect(calendar.getByRole('region', {
        name: material ? 'Delivery calendar' : 'Delivery calendar grid', exact: true,
      })).toHaveCSS('overflow-x', 'auto');
      await selected.focus();
      await page.keyboard.press('ArrowLeft');
      await expect(day(calendar, 31, material)).toBeFocused();
      await noPageOverflow(page);
      await page.getByRole('switch', { name: 'Show two calendar months' }).check();
      if (material) await unsupported(page, failures);
      else await expect(calendar.getByRole('grid')).toHaveCount(2);
      await noPageOverflow(page);
    });
  }

  test(`${profile} calendar forms, range and protection`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const failures = watchPreviewFailures(page);
    const material = await fields(page, profile);
    const calendar = page.getByRole('group', {
      name: 'Delivery calendar', exact: true,
    });
    const save = page.getByRole('button', { name: 'Save calendar selection' });
    await page.getByRole('button', { name: 'Clear calendar selection' }).click();
    await save.click();
    await expect(page.getByText('Calendar selection is not saved.', { exact: true }))
      .toBeVisible();
    await expect.poll(() => calendar.evaluate(element =>
      element.contains(document.activeElement))).toBe(true);
    await day(calendar, 29, material).click();
    await save.click();
    await expect(page.getByText('Calendar selection saved.', { exact: true }))
      .toBeVisible();
    if (material) {
      await page.getByRole('switch', { name: 'Read-only calendar' }).check();
      await day(calendar, 30, true).click();
      await expect(page.getByText('Date: 2026-10-29', { exact: true })).toBeVisible();
      await page.getByRole('switch', { name: 'Disable calendar' }).check();
      await expect(day(calendar, 29, true)).toBeDisabled();
      await page.getByRole('switch', { name: 'Disable calendar' }).uncheck();
      await page.getByRole('switch', { name: 'Read-only calendar' }).uncheck();
    }
    await page.getByRole('switch', { name: 'Calendar range selection' }).check();
    if (material) await unsupported(page, failures);
    else {
      await page.getByRole('button', { name: 'Clear calendar selection' }).click();
      await day(calendar, 29, false).click();
      await expect(page.getByText('Range: 2026-10-29 to empty', { exact: true }))
        .toBeVisible();
      await day(calendar, 30, false).click();
      await expect(page.getByText('Range: 2026-10-29 to 2026-10-30', { exact: true }))
        .toBeVisible();
      await page.getByRole('switch', { name: 'Read-only calendar' }).check();
      await day(calendar, 31, false).click();
      await expect(page.getByText('Range: 2026-10-29 to 2026-10-30', { exact: true }))
        .toBeVisible();
      await page.getByRole('switch', { name: 'Disable calendar' }).check();
      await expect(calendar.getByRole('button', { name: 'Next month' }))
        .toHaveAttribute('aria-disabled', 'true');
    }
    expect(errors).toEqual([]);
  });
}
