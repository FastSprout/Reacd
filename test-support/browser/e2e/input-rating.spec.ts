import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../../src/core/policy.js';

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
function rating(page: Page) {
  const form = page.getByRole('form', { name: 'Rating form', exact: true });
  return test.info().project.name === 'mui'
    ? form.locator('.MuiRating-root')
    : form.locator('[data-slot="slider"]');
}
async function contained(page: Page) {
  const root = rating(page);
  await expect(root).toHaveCount(1);
  await expect(root).toBeVisible();
  const fits = await root.evaluate((element, tolerance) => {
    const parent = element.parentElement?.getBoundingClientRect();
    const box = element.getBoundingClientRect();
    if (!parent) throw new Error('Expected native rating field metadata.');
    return box.left >= parent.left - tolerance && box.right <= parent.right + tolerance;
  }, TOLERANCE);
  expect(fits).toBe(true);
  const bounds = await root.boundingBox();
  if (!bounds) throw new Error('Expected native rating hit area.');
  expect(bounds.width).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
  expect(bounds.height).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual((page.viewportSize()?.width ?? 0) + TOLERANCE);
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
      await rating(page).scrollIntoViewIfNeeded();
      await expect(rating(page)).toBeInViewport();
      await page.getByRole('switch', { name: 'Right to left rating' }).check();
      await expect(rating(page)).toHaveCSS('direction', 'rtl');
      await contained(page);
      if (test.info().project.name === 'mui') {
        await expect(
          page.getByRole('radio', { name: '2.5 Stars', exact: true }),
        ).toBeChecked();
      } else {
        await expect(
          page.getByRole('slider', { name: 'Service rating' }),
        ).toHaveAttribute('aria-valuetext', '2.5 of 5 stars');
      }
    });
  }
  test(`${profile} rating pointer, half-step keyboard and required form`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await fields(page, profile);
    const material = test.info().project.name === 'mui';
    const control = rating(page);
    const box = await control.boundingBox();
    if (!box) throw new Error('Expected native rating geometry.');
    const point = { x: box.width * POINTER_FRACTION, y: box.height / 2 };
    await control.hover({ position: point });
    await expect(page.getByText('Rating: 2.5 of 5', { exact: true })).toBeVisible();
    if (material) {
      await page
        .locator('label')
        .filter({
          has: page.getByText('1.5 Stars', { exact: true }),
        })
        .click();
    } else await control.click({ position: point });
    await expect(page.getByText('Rating: 1.5 of 5', { exact: true })).toBeVisible();
    const keyboard = material
      ? page.getByRole('radio', { name: '1.5 Stars', exact: true })
      : page.getByRole('slider', { name: 'Service rating' });
    await keyboard.focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByText('Rating: 2 of 5', { exact: true })).toBeVisible();
    await page.getByRole('switch', { name: 'Right to left rating' }).check();
    await expect(control).toHaveCSS('direction', 'rtl');
    if (material)
      await page.getByRole('radio', { name: '2 Stars', exact: true }).focus();
    else await keyboard.focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByText('Rating: 1.5 of 5', { exact: true })).toBeVisible();
    if (material) {
      await page
        .locator('label')
        .filter({
          has: page.getByText('4 Stars', { exact: true }),
        })
        .click();
    } else await control.click({ position: point });
    await expect(page.getByText('Rating: 4 of 5', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Clear Service rating' }).click();
    await page.getByRole('button', { name: 'Save rating' }).click();
    await expect(page.getByText('Rating is not saved.', { exact: true })).toBeVisible();
    const focus = material
      ? page.getByRole('group', { name: /^Service rating(?: \*)?$/ })
      : keyboard;
    await expect(focus).toBeFocused();
    if (material) {
      await page.getByRole('radio', { name: '0.5 Stars', exact: true }).focus();
      await page.keyboard.press('Space');
    } else await page.keyboard.press('ArrowLeft');
    await expect(page.getByText('Rating: 0.5 of 5', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Save rating' }).click();
    await expect(page.getByText('Rating saved.', { exact: true })).toBeVisible();
    const form = page.getByRole('form', { name: 'Rating form', exact: true });
    const nativeValue = () =>
      form.evaluate((element) => {
        if (!(element instanceof HTMLFormElement))
          throw new Error('Missing rating form.');
        return [...new FormData(element)];
      });
    expect(await nativeValue()).toEqual([['serviceRating', '0.5']]);
    await page.getByRole('switch', { name: 'Read-only rating' }).check();
    if (material) {
      await expect(
        form.getByRole('img', { name: '0.5 Stars', exact: true }),
      ).toBeVisible();
      await expect(form.getByRole('radio')).toHaveCount(0);
      const readonlyRating = form.getByRole('img', {
        name: '0.5 Stars',
        exact: true,
      });
      await readonlyRating.scrollIntoViewIfNeeded();
      const readonlyBox = await readonlyRating.boundingBox();
      if (readonlyBox === null) throw new Error('Missing native readonly rating.');
      await page.mouse.click(
        readonlyBox.x + readonlyBox.width / 2,
        readonlyBox.y + readonlyBox.height / 2,
      );
    } else {
      await expect(keyboard).toHaveAttribute('aria-readonly', 'true');
      await keyboard.focus();
      await page.keyboard.press('ArrowRight');
    }
    await expect(page.getByText('Rating: 0.5 of 5', { exact: true })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Clear Service rating' }),
    ).toBeDisabled();
    expect(await nativeValue()).toEqual([['serviceRating', '0.5']]);
    expect(errors).toEqual([]);
  });
}
