import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../../src/core/policy.js';

const PROFILES = ['Spacious', 'Compact'];
const WIDTHS = [240, 360, 768, 1440];
const VIEWPORT_HEIGHT = 1000;
const ROUNDING_TOLERANCE = 1;

async function fields(page: Page, profile: string) {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Fields', exact: true }).click();
}

async function contained(page: Page) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual((page.viewportSize()?.width ?? 0) + ROUNDING_TOLERANCE);
  for (const control of await page.locator('.reacd-checkbox [role="checkbox"]').all()) {
    const box = await control.boundingBox();
    if (box === null) throw new Error('Checkbox must have geometry.');
    expect(box.width).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
    expect(box.height).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
  }
}

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    test(`${profile} Checkbox at ${width}px, 200% and RTL`, async ({ page }) => {
      await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
      await fields(page, profile);
      await contained(page);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await page.getByRole('switch', { name: 'Right to left approval' }).check();
      const writer = page.getByRole('checkbox', { name: 'Approve selected accounts' });
      await expect(writer).toHaveAttribute('aria-checked', 'mixed');
      await expect(writer.locator('svg')).toHaveCSS('display', 'none');
      await expect(page.getByRole('form', { name: 'Approval form' })).toHaveCSS(
        'direction',
        'rtl',
      );
      await contained(page);
    });
  }

  test(`${profile} mixed, required, readonly and canonical checkbox values`, async ({
    page,
  }) => {
    await fields(page, profile);
    const writer = page.getByRole('checkbox', { name: 'Approve selected accounts' });
    const reader = page.getByRole('checkbox', { name: 'Approval reader' });
    const form = page.getByRole('form', { name: 'Approval form' });
    await page.getByRole('switch', { name: 'Read-only approval' }).check();
    await page.getByRole('button', { name: 'Save approval' }).click();
    await expect(writer).toBeFocused();
    await writer.click();
    await expect(writer).toHaveAttribute('aria-checked', 'mixed');
    expect(
      await form.evaluate((element) => {
        if (!(element instanceof HTMLFormElement)) throw new Error('Expected form.');
        return [...new FormData(element)];
      }),
    ).toEqual([]);
    await page.getByRole('switch', { name: 'Read-only approval' }).uncheck();
    await writer.focus();
    await page.keyboard.press('Space');
    await expect(writer).toHaveAttribute('aria-checked', 'true');
    await expect(reader).toHaveAttribute('aria-checked', 'true');
    await reader.click();
    await expect(writer).toHaveAttribute('aria-checked', 'true');
    await page.getByRole('button', { name: 'Save approval' }).click();
    await expect(page.getByText('Approval saved.', { exact: true })).toBeVisible();
    expect(
      await form.evaluate((element) => {
        if (!(element instanceof HTMLFormElement)) throw new Error('Expected form.');
        return Object.fromEntries(new FormData(element));
      }),
    ).toEqual({ approval: 'approved' });
    await page.getByRole('switch', { name: 'Mixed approval state' }).check();
    await page.getByRole('button', { name: 'Save approval' }).click();
    await expect(writer).toBeFocused();
    await expect(writer).toHaveAttribute('aria-checked', 'mixed');
    await page.getByRole('switch', { name: 'Disable approval' }).check();
    await expect(writer).toBeDisabled();
    expect(
      await form.evaluate((element) => {
        if (!(element instanceof HTMLFormElement)) throw new Error('Expected form.');
        return [...new FormData(element)];
      }),
    ).toEqual([]);
  });
}
