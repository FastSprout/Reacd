import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../src/core/policy.js';

const PROFILES = ['Spacious', 'Compact'];
const WIDTHS = [240, 360, 768, 1440];
const HEIGHT = 1000;
const TOLERANCE = 1;
const POINTER_FRACTION = 0.25;

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
  const invalid = await page.locator('.reacd-input-rating').evaluateAll(
    (elements, tolerance) =>
      elements.some((element) => {
        const parent = element.parentElement?.getBoundingClientRect();
        const box = element.getBoundingClientRect();
        return (
          parent !== undefined &&
          (box.left < parent.left - tolerance || box.right > parent.right + tolerance)
        );
      }),
    TOLERANCE,
  );
  expect(invalid).toBe(false);
  const targets = await page.locator('.reacd-rating-star').evaluateAll(
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
    test(`${profile} rating containment at ${width}px and 200%`, async ({ page }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await fields(page, profile);
      await contained(page);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await contained(page);
      await page
        .getByRole('slider', { name: 'Service rating' })
        .scrollIntoViewIfNeeded();
      await expect(
        page.getByRole('slider', { name: 'Service rating' }),
      ).toBeInViewport();
      await page.getByRole('switch', { name: 'Right to left rating' }).check();
      await expect(page.locator('.reacd-input-rating')).toHaveCSS('direction', 'rtl');
      await contained(page);
      const half = page.locator('.reacd-rating-star-fill[data-half="true"]');
      await expect(half).toHaveCSS('clip-path', 'inset(0px 0px 0px 50%)');
    });
  }
  test(`${profile} rating pointer, half-step keyboard and required form`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await fields(page, profile);
    const control = page.locator('.reacd-rating-control');
    const box = await control.boundingBox();
    if (box === null) throw new Error('Expected rating geometry.');
    const point = { x: box.width * POINTER_FRACTION, y: box.height / 2 };
    await control.hover({ position: point });
    await expect(page.getByText('Rating: 2.5 of 5', { exact: true })).toBeVisible();
    await control.click({ position: point });
    await expect(page.getByText('Rating: 1.5 of 5', { exact: true })).toBeVisible();
    const slider = page.getByRole('slider', { name: 'Service rating' });
    await slider.focus();
    await page.keyboard.press('ArrowRight');
    await expect(slider).toHaveAttribute('aria-valuenow', '2');
    await page.getByRole('switch', { name: 'Right to left rating' }).check();
    await expect(control).toHaveCSS('direction', 'rtl');
    await slider.focus();
    await page.keyboard.press('ArrowRight');
    await expect(slider).toHaveAttribute('aria-valuenow', '1.5');
    await control.click({ position: point });
    await expect(slider).toHaveAttribute('aria-valuenow', '4');
    await page.getByRole('button', { name: 'Clear Service rating' }).click();
    await page.getByRole('button', { name: 'Save rating' }).click();
    await expect(page.getByText('Rating is not saved.', { exact: true })).toBeVisible();
    await expect(slider).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(slider).toHaveAttribute('aria-valuenow', '0.5');
    await page.getByRole('button', { name: 'Save rating' }).click();
    await expect(page.getByText('Rating saved.', { exact: true })).toBeVisible();
    await page.getByRole('switch', { name: 'Read-only rating' }).check();
    await expect(slider).toHaveAttribute('aria-readonly', 'true');
    await expect(
      page.getByRole('button', { name: 'Clear Service rating' }),
    ).toBeDisabled();
    expect(errors).toEqual([]);
  });
}
