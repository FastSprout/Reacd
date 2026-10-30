import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../../src/core/policy.js';

const PROFILES = ['Spacious', 'Compact'];
const WIDTHS = [240, 360, 768, 1440];
const HEIGHT = 1000;
const TOLERANCE = 1;

async function fields(page: Page, profile: string) {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Fields', exact: true }).click();
}

async function contained(page: Page) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual((page.viewportSize()?.width ?? 0) + TOLERANCE);
  for (const field of await page.locator('.reacd-input-time').all()) {
    expect(
      await field.evaluate((element, tolerance) => {
        const outer = element.getBoundingClientRect();
        return Array.from(element.querySelectorAll('.reacd-time-segment,button')).every(
          (child) => {
            const box = child.getBoundingClientRect();
            return (
              box.left >= outer.left - tolerance && box.right <= outer.right + tolerance
            );
          },
        );
      }, TOLERANCE),
    ).toBe(true);
  }
}

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    test(`${profile} time at ${width}px, 200%, RTL and Arabic`, async ({ page }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await fields(page, profile);
      await contained(page);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await contained(page);
      await page.getByRole('switch', { name: 'Right to left times' }).check();
      await expect(page.locator('.reacd-input-time').first()).toHaveCSS(
        'direction',
        'rtl',
      );
      await expect(page.locator('.reacd-time-segments').first()).toHaveCSS(
        'direction',
        'ltr',
      );
      await contained(page);
      await page.getByRole('switch', { name: 'Arabic time locale' }).check();
      await expect(page.locator('.reacd-time-segments').first()).toHaveCSS(
        'direction',
        'rtl',
      );
      await contained(page);
      const targets = page.locator('.reacd-time-segment[role="spinbutton"]');
      for (const segment of await targets.all()) {
        const box = await segment.boundingBox();
        if (box === null) throw new Error('Time segment must have geometry.');
        expect(box.width).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
        expect(box.height).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
      }
    });
  }

  test(`${profile} time keyboard, native form and protected state`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await fields(page, profile);
    const hour = page.getByRole('spinbutton', { name: /hour, Arrival time/i });
    await hour.focus();
    await page.keyboard.press('ArrowUp');
    await expect(page.getByText('Arrival: 13:30:00', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Save times' }).click();
    await expect(page.getByText('Times saved.', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Clear End Availability' }).click();
    await page.getByRole('button', { name: 'Save times' }).click();
    await expect(
      page.getByRole('spinbutton', { name: /hour, End Availability/i }),
    ).toBeFocused();
    await page.getByRole('button', { name: 'Restore sample times' }).click();
    await hour.focus();
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await expect(hour).not.toHaveAttribute('aria-valuenow');
    await page.getByRole('button', { name: 'Save times' }).click();
    await expect(hour).toBeFocused();
    await expect(
      page.getByText('Complete all time segments or clear the field.'),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Restore sample times' }).click();
    await page.getByRole('switch', { name: 'Right to left times' }).check();
    await hour.focus();
    await page.keyboard.press('ArrowRight');
    await expect(
      page.getByRole('spinbutton', { name: /minute, Arrival time/i }),
    ).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(page.getByText('Arrival: 12:31:00', { exact: true })).toBeVisible();
    await page.getByRole('switch', { name: 'Arabic time locale' }).check();
    const arabicHour = page.locator('.reacd-time-segment[data-type="hour"]').first();
    await arabicHour.focus();
    await page.keyboard.press('ArrowUp');
    await expect(page.getByText('Arrival: 13:31:00', { exact: true })).toBeVisible();
    await page.getByRole('switch', { name: 'Read-only times' }).check();
    await expect(
      page.getByRole('button', { name: 'Clear Arrival time' }),
    ).toBeDisabled();
    await page.getByRole('switch', { name: 'Read-only times' }).uncheck();
    await page.getByRole('switch', { name: 'Disable times' }).check();
    await expect(
      page.getByRole('button', { name: 'Clear Arrival time' }),
    ).toBeDisabled();
    expect(errors).toEqual([]);
  });
}
