import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../../src/core/policy.js';

const PROFILES = ['Spacious', 'Compact'];
const WIDTHS = [240, 360, 768, 1440];
const HEIGHT = 1000;
const TOLERANCE = 1;

async function openFields(page: Page, profile: string) {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Fields', exact: true }).click();
}

async function contained(page: Page) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual((page.viewportSize()?.width ?? 0) + TOLERANCE);
  for (const list of await page.locator('.reacd-listbox-options').all()) {
    expect(
      await list.evaluate((element, tolerance) => {
        const outer = element.getBoundingClientRect();
        return [...element.querySelectorAll('[role="option"]')].every((option) => {
          const box = option.getBoundingClientRect();
          return (
            box.left >= outer.left - tolerance &&
            box.right <= outer.right + tolerance &&
            option.scrollWidth <= option.clientWidth + tolerance
          );
        });
      }, TOLERANCE),
    ).toBe(true);
  }
  for (const option of await page.locator('.reacd-listbox-option').all()) {
    const box = await option.boundingBox();
    if (box === null) throw new Error('Expected visible option geometry.');
    expect(box.height).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
  }
}

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    test(`${profile} Listbox at ${width}px, 200% and scoped RTL`, async ({ page }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await openFields(page, profile);
      await contained(page);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await contained(page);
      await page.getByRole('switch', { name: 'Right to left regions' }).check();
      for (const list of await page.locator('.reacd-listbox').all()) {
        await expect(list).toHaveCSS('direction', 'rtl');
      }
      await contained(page);
    });
  }

  test(`${profile} Listbox native keyboard, veto, Clear and required form`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await openFields(page, profile);
    const list = page.getByRole('listbox', { name: 'Primary region', exact: true });
    const north = list.getByRole('option', { name: 'North region', exact: true });
    const west = list.getByRole('option', { name: 'West region', exact: true });
    await north.focus();
    await page.keyboard.press('ArrowDown');
    await expect(west).toBeFocused();
    await expect(page.getByText('Primary: 42', { exact: true })).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(page.getByText('Primary: west', { exact: true })).toBeVisible();
    await page.getByRole('switch', { name: 'Reject selection requests' }).check();
    await north.click();
    await expect(page.getByText('Primary: west', { exact: true })).toBeVisible();
    await page.getByRole('switch', { name: 'Reject selection requests' }).uncheck();
    const clear = page.getByRole('button', { name: 'Clear primary region' });
    await clear.click();
    await expect(clear).toBeDisabled();
    await expect
      .poll(() => list.evaluate((element) => element.contains(document.activeElement)))
      .toBe(true);
    await page.getByRole('button', { name: 'Save regions' }).click();
    await expect(
      page.getByText('Region selection is not saved.', { exact: true }),
    ).toBeVisible();
    await expect
      .poll(() => list.evaluate((element) => element.contains(document.activeElement)))
      .toBe(true);
    await page.getByRole('button', { name: 'Restore regions' }).click();
    await page.getByRole('switch', { name: 'Read-only regions' }).check();
    await expect(clear).toBeDisabled();
    await west.click();
    await expect(page.getByText('Primary: 42', { exact: true })).toBeVisible();
    await page.getByRole('switch', { name: 'Read-only regions' }).uncheck();
    await page.getByRole('button', { name: 'Clear additional regions' }).click();
    await expect(page.getByText('Additional: none', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Save regions' }).click();
    await expect(
      page.getByText('Region selection saved.', { exact: true }),
    ).toBeVisible();
    const form = page.getByRole('form', { name: 'Region selection', exact: true });
    expect(
      await form.evaluate((element) =>
        element instanceof HTMLFormElement ? [...new FormData(element)] : [],
      ),
    ).toEqual([['primary', '42']]);
    expect(errors).toEqual([]);
  });

  test(`${profile} Listbox guards a browser IME Enter signal`, async ({ page }) => {
    await openFields(page, profile);
    const list = page.getByRole('listbox', { name: 'Primary region', exact: true });
    const west = list.getByRole('option', { name: 'West region', exact: true });
    await west.focus();
    const signal = await west.evaluate((element) => {
      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        isComposing: true,
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(event);
      return { composing: event.isComposing, prevented: event.defaultPrevented };
    });
    expect(signal).toEqual({ composing: true, prevented: true });
    await expect(page.getByText('Primary: 42', { exact: true })).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(page.getByText('Primary: west', { exact: true })).toBeVisible();
  });
}
