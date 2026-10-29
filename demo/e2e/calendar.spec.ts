import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../src/core/policy.js';

const WIDTHS = [240, 360, 768, 1440];
const HEIGHT = 1000;
const TOLERANCE = 1;
const SELECTED_COLOR = 'rgb(255, 255, 255)';

async function fields(page: Page, profile: string) {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Fields', exact: true }).click();
}

async function noPageOverflow(page: Page) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual((await page.evaluate(() => innerWidth)) + TOLERANCE);
}

for (const profile of ['Spacious', 'Compact']) {
  for (const width of WIDTHS) {
    test(`${profile} calendar ${width}px, 200% and RTL`, async ({ page }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await fields(page, profile);
      const calendar = page.getByRole('group', { name: 'Delivery calendar' });
      await calendar.getByRole('button', { name: /October 30, 2026$/ }).click();
      const selected = calendar.getByRole('button', { name: /October 30, 2026$/ });
      await expect(selected).toHaveCSS('color', SELECTED_COLOR);
      await noPageOverflow(page);
      await page.getByRole('switch', { name: 'Show two calendar months' }).check();
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await page.getByRole('switch', { name: 'Right to left calendar' }).check();
      await expect(calendar).toHaveAttribute('data-direction', 'rtl');
      await expect(calendar).toHaveCSS('direction', 'rtl');
      const targets = await calendar.locator('[data-calendar-day]').evaluateAll(
        (buttons, minimum) =>
          buttons.every((button) => {
            const box = button.getBoundingClientRect();
            return box.width >= minimum && box.height >= minimum;
          }),
        LAYOUT_POLICY.controlTargetPx,
      );
      expect(targets).toBe(true);
      const viewport = calendar.getByRole('region', { name: 'Delivery calendar grid' });
      await expect(viewport).toHaveCSS('overflow-x', 'auto');
      await noPageOverflow(page);
      await selected.focus();
      await page.keyboard.press('ArrowLeft');
      await expect(
        calendar.getByRole('button', { name: /October 31, 2026$/ }),
      ).toBeFocused();
      await noPageOverflow(page);
    });
  }

  test(`${profile} calendar forms, range and protection`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await fields(page, profile);
    const calendar = page.getByRole('group', { name: 'Delivery calendar' });
    await page.getByRole('button', { name: 'Clear calendar selection' }).click();
    await page.getByRole('button', { name: 'Save calendar selection' }).click();
    await expect(
      page.getByText('Calendar selection is not saved.', { exact: true }),
    ).toBeVisible();
    await expect(calendar).toBeFocused();
    await calendar.getByRole('button', { name: /October 29, 2026$/ }).click();
    await page.getByRole('button', { name: 'Save calendar selection' }).click();
    await expect(
      page.getByText('Calendar selection saved.', { exact: true }),
    ).toBeVisible();
    await page.getByRole('switch', { name: 'Calendar range selection' }).check();
    await calendar.getByRole('button', { name: /October 29, 2026$/ }).click();
    await expect(
      page.getByText('Range: 2026-10-29 to empty', { exact: true }),
    ).toBeVisible();
    await calendar.getByRole('button', { name: /October 30, 2026$/ }).click();
    await expect(
      page.getByText('Range: 2026-10-29 to 2026-10-30', { exact: true }),
    ).toBeVisible();
    await page.getByRole('switch', { name: 'Read-only calendar' }).check();
    await calendar.getByRole('button', { name: /October 31, 2026$/ }).click();
    await expect(
      page.getByText('Range: 2026-10-29 to 2026-10-30', { exact: true }),
    ).toBeVisible();
    await page.getByRole('switch', { name: 'Disable calendar' }).check();
    await expect(calendar.getByRole('button', { name: 'Next month' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(errors).toEqual([]);
  });
}
