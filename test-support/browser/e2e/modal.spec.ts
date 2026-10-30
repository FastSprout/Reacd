import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const WIDTHS = [240, 320, 375, 600, 768, 1024, 1440, 1920];
const HEIGHT = 1000;
const TOLERANCE = 1;
const EDGE = 1;
const PROFILES = ['Spacious', 'Compact'];
async function appearance(page: Page, profile: string) {
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
}
async function actions(page: Page, profile: string) {
  await page.goto('/');
  await appearance(page, profile);
  await page.getByRole('button', { name: 'Actions and feedback' }).click();
}
async function bounded(page: Page) {
  const dialog = page.getByRole('dialog');
  const geometry = await dialog.evaluate((element) => {
    const box = element.getBoundingClientRect();
    return {
      left: box.left,
      right: box.right,
      top: box.top,
      bottom: box.bottom,
      scroll: element.scrollHeight,
      height: element.clientHeight,
      width: window.innerWidth,
      viewportHeight: window.innerHeight,
      documentWidth: document.documentElement.scrollWidth,
    };
  });
  expect(geometry.left).toBeGreaterThanOrEqual(-TOLERANCE);
  expect(geometry.top).toBeGreaterThanOrEqual(-TOLERANCE);
  expect(geometry.right).toBeLessThanOrEqual(geometry.width + TOLERANCE);
  expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewportHeight + TOLERANCE);
  expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.width + TOLERANCE);
  await dialog.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  await expect(
    dialog.getByRole('button', { name: 'Close', exact: true }),
  ).toBeVisible();
}

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    test(`${profile} modal contains long content at ${width}px and 200%`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await actions(page, profile);
      await page.getByRole('switch', { name: 'Long dialog content' }).click();
      await page.getByRole('button', { name: 'Open modal example' }).click();
      await bounded(page);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await bounded(page);
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).toHaveCount(0);
      await page.getByRole('switch', { name: 'Fullscreen example' }).click();
      await page.getByRole('button', { name: 'Open modal example' }).click();
      await bounded(page);
    });
  }
  test(`${profile} modal focus, nesting, dismissal, themes, and retention`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await actions(page, profile);
    const external = page.getByRole('button', { name: 'Open programmatically' });
    await external.click();
    await page.keyboard.press('Escape');
    await expect(external).toBeFocused();
    const trigger = page.getByRole('button', { name: 'Open modal example' });
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: 'Edit modal example' });
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await dialog.getByLabel('Modal note').fill('Retained example');
    await dialog.getByRole('combobox', { name: 'Modal role' }).click();
    await page.getByRole('option', { name: 'Editor', exact: true }).click();
    await expect(dialog.getByRole('combobox', { name: 'Modal role' })).toContainText(
      'Editor',
    );
    await expect(dialog.getByRole('combobox', { name: 'Modal role' })).toBeFocused();
    await dialog.getByRole('button', { name: 'Close', exact: true }).focus();
    await page.keyboard.press('Tab');
    await expect(dialog.getByLabel('Modal note')).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(
      dialog.getByRole('button', { name: 'Close', exact: true }),
    ).toBeFocused();
    await dialog.getByRole('button', { name: 'Open nested modal' }).click();
    await expect(page.getByRole('dialog', { name: 'Nested modal' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(
      dialog.getByRole('button', { name: 'Open nested modal' }),
    ).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    await trigger.click();
    await expect(dialog.getByLabel('Modal note')).toHaveValue('Retained example');
    await expect(dialog.getByRole('combobox', { name: 'Modal role' })).toContainText(
      'Editor',
    );
    await page.mouse.click(EDGE, EDGE);
    await expect(dialog).toHaveCount(0);
    await page.getByRole('switch', { name: 'Require explicit close' }).click();
    await trigger.click();
    await page.keyboard.press('Escape');
    await page.mouse.click(EDGE, EDGE);
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Close', exact: true }).click();
    await page.getByRole('switch', { name: 'Non-modal example' }).click();
    await trigger.click();
    const before = await dialog.evaluate((element) =>
      getComputedStyle(element).getPropertyValue('--reacd-medium'),
    );
    await appearance(page, profile === 'Spacious' ? 'Compact' : 'Spacious');
    const after = await dialog.evaluate((element) =>
      getComputedStyle(element).getPropertyValue('--reacd-medium'),
    );
    expect(after).not.toBe(before);
    await expect(dialog.getByLabel('Modal note')).toHaveValue('Retained example');
    await dialog.getByRole('button', { name: 'Apply example' }).click();
    await expect(dialog).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}
