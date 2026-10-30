import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../../src/core/policy.js';

const WIDTHS = [240, 320, 375, 600, 768, 1024, 1440, 1920];
const PROFILES = ['Spacious', 'Compact'];
const HEIGHT = 1000;
const TOLERANCE = 1;
async function appearance(page: Page, profile: string) {
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
}
async function fields(page: Page, profile: string) {
  await page.goto('/');
  await appearance(page, profile);
  await page.getByRole('button', { name: 'Fields', exact: true }).click();
}
async function contained(page: Page) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual((page.viewportSize()?.width ?? 0) + TOLERANCE);
  const failures = await page
    .locator('.reacd-choice-group, .reacd-choice-item, .reacd-choice-text')
    .evaluateAll(
      (elements, tolerance): string[] =>
        elements.flatMap<string>((element) => {
          const box = element.getBoundingClientRect();
          const parent = element.parentElement?.getBoundingClientRect();
          return parent &&
            (box.left < parent.left - tolerance || box.right > parent.right + tolerance)
            ? [element.getAttribute('class') ?? element.tagName]
            : [];
        }),
      TOLERANCE,
    );
  expect(failures).toEqual([]);
  const targets = await page.locator('.reacd-choice-control').evaluateAll(
    (elements, minimum) =>
      elements.every((element) => {
        const box = element.getBoundingClientRect();
        return box.width >= minimum && box.height >= minimum;
      }),
    LAYOUT_POLICY.controlTargetPx,
  );
  expect(targets).toBe(true);
  expect(
    await page.locator('.reacd-radio-dot, .reacd-choice-check').evaluateAll(
      (elements, tolerance) =>
        elements.every((element) => {
          const box = element.getBoundingClientRect();
          const parent = element
            .closest('.reacd-choice-control')
            ?.getBoundingClientRect();
          return (
            parent !== undefined &&
            box.left >= parent.left - tolerance &&
            box.right <= parent.right + tolerance &&
            box.top >= parent.top - tolerance &&
            box.bottom <= parent.bottom + tolerance
          );
        }),
      TOLERANCE,
    ),
  ).toBe(true);
}

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    test(`${profile} choice groups wrap at ${width}px and 200%`, async ({ page }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await fields(page, profile);
      await page.getByRole('radio', { name: 'Standard delivery' }).click();
      await page.getByRole('checkbox', { name: 'Email notifications' }).check();
      await page.getByRole('checkbox', { name: 'SMS notifications' }).check();
      await contained(page);
      await page.getByRole('switch', { name: 'Arrange delivery horizontally' }).click();
      await page.getByRole('switch', { name: 'Arrange channels horizontally' }).click();
      await contained(page);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await contained(page);
      await page
        .getByRole('radio', { name: 'Express delivery' })
        .scrollIntoViewIfNeeded();
      await expect(
        page.getByRole('radio', { name: 'Express delivery' }),
      ).toBeInViewport();
      await page
        .getByRole('checkbox', { name: 'SMS notifications' })
        .scrollIntoViewIfNeeded();
      await expect(
        page.getByRole('checkbox', { name: 'SMS notifications' }),
      ).toBeInViewport();
    });
  }
  test(`${profile} choice groups validate forms, keyboard, limits, and themes`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await fields(page, profile);
    await page.getByRole('button', { name: 'Save delivery' }).click();
    await expect(page.getByText('No delivery saved.')).toBeVisible();
    const standard = page.getByRole('radio', { name: 'Standard delivery' });
    await standard.focus();
    await page.keyboard.press('Space');
    await expect(standard).toBeChecked();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('radio', { name: 'Express delivery' })).toBeFocused();
    await page.getByRole('button', { name: 'Save delivery' }).click();
    await expect(page.getByText('Saved delivery: express')).toBeVisible();
    await page.getByRole('button', { name: 'Save channels' }).click();
    await expect(page.getByText('No channels saved.')).toBeVisible();
    const email = page.getByRole('checkbox', { name: 'Email notifications' });
    const sms = page.getByRole('checkbox', { name: 'SMS notifications' });
    const inApp = page.getByRole('checkbox', { name: 'In-app notifications' });
    await email.check();
    await sms.check();
    await expect(inApp).toHaveAttribute('aria-disabled', 'true');
    await sms.focus();
    await page.keyboard.press('Tab');
    await expect(inApp).toBeFocused();
    await page.keyboard.press('Space');
    await expect(inApp).not.toBeChecked();
    await email.uncheck();
    await inApp.check();
    await page.getByRole('button', { name: 'Save channels' }).click();
    await expect(page.getByText('Saved channels: sms, inApp')).toBeVisible();
    await expect(
      page.getByRole('checkbox', { name: 'Unavailable channel' }),
    ).toBeDisabled();
    await appearance(page, profile === 'Spacious' ? 'Compact' : 'Spacious');
    await expect(inApp).toBeChecked();
    await expect(page.getByRole('radio', { name: 'Express delivery' })).toBeChecked();
    await page.getByRole('button', { name: 'Clear channels' }).click();
    await page.getByRole('switch', { name: 'Disable channel choices' }).click();
    await page.getByRole('button', { name: 'Save channels' }).click();
    await expect(page.getByText('Saved channels:', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Clear delivery' }).click();
    await page.getByRole('switch', { name: 'Disable delivery choices' }).click();
    await page.getByRole('button', { name: 'Save delivery' }).click();
    await expect(page.getByText('Saved delivery:', { exact: true })).toBeVisible();
    expect(errors).toEqual([]);
  });
}
