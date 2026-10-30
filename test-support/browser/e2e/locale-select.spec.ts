import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../../src/core/policy.js';

const PROFILES = ['Spacious', 'Compact'];
const WIDTHS = [240, 360, 768, 1440];
const VIEWPORT_HEIGHT = 1000;
const TOLERANCE = 1;

async function actions(page: Page, profile: string) {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Actions and feedback', exact: true }).click();
}

async function contained(page: Page) {
  const trigger = page.getByRole('combobox', { name: 'Application language' });
  const box = await trigger.boundingBox();
  if (box === null) throw new Error('Language selector has no visible geometry.');
  expect(box.height).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
  expect(box.x).toBeGreaterThanOrEqual(-TOLERANCE);
  expect(box.x + box.width).toBeLessThanOrEqual(
    (page.viewportSize()?.width ?? 0) + TOLERANCE,
  );
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual((page.viewportSize()?.width ?? 0) + TOLERANCE);
}

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    test(`${profile} locales at ${width}px, 200% and RTL`, async ({ page }) => {
      await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
      await actions(page, profile);
      await contained(page);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      const trigger = page.getByRole('combobox', { name: 'Application language' });
      await trigger.click();
      await expect(page.getByRole('option', { name: 'Polish (Poland)' })).toBeVisible();
      await page.getByRole('option', { name: 'Arabic', exact: true }).click();
      await expect(trigger).toBeFocused();
      await expect(trigger).toHaveCSS('direction', 'rtl');
      await contained(page);
      await trigger.click();
      await expect(page.getByRole('option', { name: 'Arabic' })).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(trigger).toBeFocused();
    });
  }

  test(`${profile} locale keyboard writes and protected inspection`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await actions(page, profile);
    const trigger = page.getByRole('combobox', { name: 'Application language' });
    await expect(trigger).toHaveAccessibleDescription(
      'The host controls language resources and direction.',
    );
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(
      page.getByRole('option', { name: 'English (United States)' }),
    ).toBeFocused();
    await page.keyboard.type('Polish');
    await expect(page.getByRole('option', { name: 'Polish (Poland)' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByText('Selected locale: pl-PL')).toBeVisible();
    await expect(trigger).toBeFocused();
    await page.getByRole('switch', { name: 'Read-only language' }).check();
    await trigger.click();
    await page.getByRole('option', { name: 'Arabic' }).click();
    await expect(trigger).toHaveText('Polish (Poland)');
    await page.getByRole('switch', { name: 'Read-only language' }).uncheck();
    await page.getByRole('switch', { name: 'Disable language' }).check();
    await expect(trigger).toBeDisabled();
    expect(errors).toEqual([]);
  });
}
