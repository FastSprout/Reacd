import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../src/core/policy.js';

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
  for (const field of await page.locator('.reacd-input-date').all()) {
    expect(
      await field.evaluate((element, tolerance) => {
        const outer = element.getBoundingClientRect();
        return Array.from(element.querySelectorAll('.reacd-date-segment,button')).every(
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
    test(`${profile} dates at ${width}px, 200%, RTL and Arabic`, async ({ page }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await fields(page, profile);
      await contained(page);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await contained(page);
      await page.getByRole('switch', { name: 'Right to left dates' }).check();
      await expect(page.locator('.reacd-input-date').first()).toHaveCSS(
        'direction',
        'rtl',
      );
      await expect(page.locator('.reacd-date-segments').first()).toHaveCSS(
        'direction',
        'ltr',
      );
      await contained(page);
      await page.getByRole('switch', { name: 'Arabic date locale' }).check();
      await expect(page.locator('.reacd-date-segments').first()).toHaveCSS(
        'direction',
        'rtl',
      );
      await contained(page);
      const targets = page.locator(
        '.reacd-date-segment:is([role="spinbutton"],[role="textbox"])',
      );
      for (const segment of await targets.all()) {
        const box = await segment.boundingBox();
        if (box === null) throw new Error('Date segment must have geometry.');
        expect(box.width).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
        expect(box.height).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
      }
    });
  }

  test(`${profile} date keyboard, native form and protected state`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await fields(page, profile);
    const day = page.getByRole('spinbutton', { name: /day, Event date/i });
    await day.focus();
    await page.keyboard.press('ArrowUp');
    await expect(
      page.getByText('Event date: 2024-02-29', { exact: true }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Save dates' }).click();
    await expect(page.getByText('Dates saved.', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Clear End Booking dates' }).click();
    await page.getByRole('button', { name: 'Save dates' }).click();
    await expect(
      page.getByRole('spinbutton', { name: /month, End Booking dates/i }),
    ).toBeFocused();
    await page.getByRole('button', { name: 'Restore sample dates' }).click();
    const month = page.getByRole('spinbutton', { name: /month, Event date/i });
    await month.focus();
    await page.keyboard.press('Backspace');
    await expect(month).not.toHaveAttribute('aria-valuenow');
    await page.getByRole('button', { name: 'Save dates' }).click();
    await expect(month).toBeFocused();
    await expect(
      page.getByText('Complete all date segments or clear the field.'),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Restore sample dates' }).click();
    await page.getByRole('switch', { name: 'Right to left dates' }).check();
    await month.focus();
    await page.keyboard.press('ArrowRight');
    await expect(day).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(
      page.getByText('Event date: 2024-02-29', { exact: true }),
    ).toBeVisible();
    await page.getByRole('switch', { name: 'Arabic date locale' }).check();
    const arabicDay = page.locator('.reacd-date-segment[data-type="day"]').first();
    await arabicDay.focus();
    await page.keyboard.press('ArrowDown');
    await expect(
      page.getByText('Event date: 2024-02-28', { exact: true }),
    ).toBeVisible();
    await page.getByRole('switch', { name: 'Read-only dates' }).check();
    await expect(page.getByRole('button', { name: 'Clear Event date' })).toBeDisabled();
    await page.getByRole('switch', { name: 'Read-only dates' }).uncheck();
    await page.getByRole('switch', { name: 'Disable dates' }).check();
    await expect(page.getByRole('button', { name: 'Clear Event date' })).toBeDisabled();
    expect(errors).toEqual([]);
  });
}
