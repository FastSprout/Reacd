import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../src/core/policy.js';

const PROFILES = ['Spacious', 'Compact'];
const WIDTHS = [240, 360, 768, 1440];
const HEIGHT = 1000;
const TOLERANCE = 1;
const LONG_TAG = 'long_unbroken_topic_name';

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
  const form = page.getByRole('form', { name: 'Topics form', exact: true });
  const escaped = await form
    .locator('.reacd-input-tags')
    .evaluate((element, tolerance) => {
      const box = element.getBoundingClientRect();
      return Array.from(
        element.querySelectorAll(
          '.reacd-tags-chip, .reacd-tags-text, .reacd-tags-remove, .reacd-tags-input',
        ),
      ).some((child) => {
        const rect = child.getBoundingClientRect();
        return rect.left < box.left - tolerance || rect.right > box.right + tolerance;
      });
    }, TOLERANCE);
  expect(escaped).toBe(false);
  const targets = await form.locator('.reacd-tags-remove').evaluateAll(
    (elements, minimum) =>
      elements.every((element) => {
        const box = element.getBoundingClientRect();
        return box.width >= minimum && box.height >= minimum;
      }),
    LAYOUT_POLICY.controlTargetPx,
  );
  expect(targets).toBe(true);
}
for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    test(`${profile} tags at ${width}px, 200% and scoped RTL`, async ({ page }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await fields(page, profile);
      const form = page.getByRole('form', { name: 'Topics form', exact: true });
      const input = form.getByRole('combobox', { name: 'Topics', exact: true });
      await input.fill(LONG_TAG);
      await input.press('Enter');
      await contained(page);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await contained(page);
      await page.getByRole('switch', { name: 'Right to left tags' }).check();
      await expect(form.locator('.reacd-input-tags')).toHaveCSS('direction', 'rtl');
      await contained(page);
    });
  }
  test(`${profile} tags keyboard, paste, validity and protection`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await fields(page, profile);
    const form = page.getByRole('form', { name: 'Topics form', exact: true });
    const input = form.getByRole('combobox', { name: 'Topics', exact: true });
    await page.getByRole('button', { name: 'Clear topics' }).click();
    await page.getByRole('button', { name: 'Save topics' }).click();
    await expect(
      page.getByText('Topics are not saved.', { exact: true }),
    ).toBeVisible();
    await expect(input).toBeFocused();
    await input.fill('React');
    await input.press('Enter');
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.evaluate(async () => {
      await navigator.clipboard.writeText('Vue,東京');
    });
    await input.focus();
    await page.keyboard.press('ControlOrMeta+V');
    await expect(form.getByRole('button', { name: 'Remove 東京' })).toBeVisible();
    await page.getByRole('button', { name: 'Save topics' }).click();
    await expect(page.getByText('Topics saved.', { exact: true })).toBeVisible();
    await input.fill('React');
    await input.press('Enter');
    await expect(form.getByRole('alert')).toContainText('Tags must be unique.');
    await expect(input).toHaveValue('React');
    await input.clear();
    await page.getByRole('switch', { name: 'Right to left tags' }).check();
    await input.focus();
    await page.keyboard.press('ArrowRight');
    await expect(form.locator('.reacd-tags-chip').last()).toBeFocused();
    await page.keyboard.press('Delete');
    await expect(form.getByRole('button', { name: 'Remove 東京' })).toHaveCount(0);
    await page.getByRole('switch', { name: 'Read-only topics' }).check();
    await expect(input).toHaveAttribute('readonly');
    await expect(page.getByRole('button', { name: 'Clear topics' })).toBeDisabled();
    expect(errors).toEqual([]);
  });
}
