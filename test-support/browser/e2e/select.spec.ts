import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../../src/core/policy.js';

const PROFILES = ['Spacious', 'Compact'];
const WIDTHS = [240, 360, 768, 1440];
const HEIGHT = 1000;
const TOLERANCE = 1;
const LONG_LABEL = 'Regional approval and international logistics coordination';

async function fields(page: Page, profile: string) {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Fields', exact: true }).click();
}

async function contained(page: Page) {
  const width = page.viewportSize()?.width ?? 0;
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(width + TOLERANCE);
  const trigger = page.getByRole('combobox', { name: 'Release status', exact: true });
  const box = await trigger.boundingBox();
  if (box === null) throw new Error('Choice trigger must have geometry.');
  expect(box.width).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
  expect(box.height).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
  const popup = page.locator('.reacd-base-select-popup:visible');
  const bounds = await popup.boundingBox();
  if (bounds === null) throw new Error('Choice popup must have geometry.');
  expect(bounds.x).toBeGreaterThanOrEqual(-TOLERANCE);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(width + TOLERANCE);
  expect(
    await popup.evaluate((element) => element.scrollWidth - element.clientWidth),
  ).toBeLessThanOrEqual(TOLERANCE);
}

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    test(`${profile} Select at ${width}px, 200% and RTL`, async ({ page }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await fields(page, profile);
      await page.getByRole('switch', { name: 'Right to left choices' }).check();
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      const trigger = page.getByRole('combobox', {
        name: 'Release status',
        exact: true,
      });
      await trigger.click();
      await expect(
        page.getByRole('option', { name: LONG_LABEL, exact: true }),
      ).toBeVisible();
      await expect(page.locator('.reacd-select-positioner:visible')).toHaveCSS(
        'direction',
        'rtl',
      );
      await contained(page);
      await page.getByRole('option', { name: LONG_LABEL, exact: true }).click();
      await expect(trigger).toContainText(LONG_LABEL);
      await expect(
        page.getByRole('combobox', { name: 'Release reader' }),
      ).toContainText(LONG_LABEL);
    });
  }

  test(`${profile} single/multiple choices preserve native data`, async ({ page }) => {
    await fields(page, profile);
    const form = page.getByRole('form', { name: 'Choice form' });
    const trigger = page.getByRole('combobox', { name: 'Release status', exact: true });
    await page.getByRole('button', { name: 'Clear Release status' }).click();
    await page.getByRole('button', { name: 'Save choices' }).click();
    await expect(trigger).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await page.getByRole('option', { name: LONG_LABEL, exact: true }).click();
    const many = page.getByRole('combobox', { name: 'Included statuses' });
    await many.click();
    await page.getByRole('option', { name: LONG_LABEL, exact: true }).click();
    await page.keyboard.press('Escape');
    expect(
      await form.evaluate((element) => {
        if (!(element instanceof HTMLFormElement)) throw new Error('Expected form.');
        return [...new FormData(element)];
      }),
    ).toEqual([
      ['status', 'review'],
      ['included', 'draft'],
      ['included', 'review'],
    ]);
    await page.getByRole('switch', { name: 'Read-only choices' }).check();
    await trigger.click();
    await page.getByRole('option', { name: 'Draft', exact: true }).click();
    await page.keyboard.press('Escape');
    await expect(trigger).toContainText(LONG_LABEL);
    await page.getByRole('button', { name: 'Save choices' }).click();
    await expect(page.getByText('Selection saved.', { exact: true })).toBeVisible();
    await page.getByRole('switch', { name: 'Loading choices' }).check();
    await expect(trigger).toHaveAttribute('aria-busy', 'true');
    await expect(
      page.getByRole('button', { name: 'Clear Release status' }),
    ).toBeDisabled();
  });
}
