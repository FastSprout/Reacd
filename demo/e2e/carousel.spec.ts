import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../src/core/policy.js';
const WIDTHS = [240, 360, 768, 1440];
const HEIGHT = 1000;
const TOLERANCE = 1;
async function content(page: Page, profile: string) {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Content and data', exact: true }).click();
}
async function contained(page: Page) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual((await page.evaluate(() => innerWidth)) + TOLERANCE);
}
for (const profile of ['Spacious', 'Compact']) {
  for (const width of WIDTHS) {
    test(`${profile} carousel ${width}px, 200%, RTL and reduced motion`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await content(page, profile);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await page.getByRole('switch', { name: 'Right to left carousel' }).check();
      const region = page.getByRole('region', { name: 'Reference slides' });
      await expect(region).toHaveCSS('direction', 'rtl');
      await contained(page);
      await region.focus();
      await page.keyboard.press('ArrowLeft');
      await expect(
        page.getByRole('button', { name: 'Review slide action' }),
      ).toBeVisible();
      await expect(
        page.getByRole('textbox', { name: 'Profile slide draft' }),
      ).toHaveCount(0);
      const control = region.getByRole('button', { name: 'Next slide' });
      const box = await control.boundingBox();
      if (box === null) throw new Error('Missing carousel control geometry.');
      expect(box.width).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
      expect(box.height).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
      await contained(page);
      await page.getByRole('switch', { name: 'Vertical carousel keys' }).check();
      await region.focus();
      await page.keyboard.press('ArrowDown');
      await expect(
        page.getByRole('progressbar', { name: 'Review progress' }),
      ).toBeVisible();
      await contained(page);
    });
  }
  test(`${profile} carousel host focus, native forms and preserved edits`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await content(page, profile);
    const region = page.getByRole('region', { name: 'Reference slides' });
    const draft = page.getByRole('textbox', { name: 'Profile slide draft' });
    await draft.fill('Edited profile');
    await draft.press('ArrowRight');
    await expect(draft).toBeFocused();
    await page.getByRole('button', { name: 'Submit active slide' }).click();
    await expect(
      page.getByText('Slide form submissions: 1', { exact: true }),
    ).toBeVisible();
    await draft.focus();
    await page
      .getByRole('button', { name: 'Advance carousel from host' })
      .evaluate((button) => {
        if (!(button instanceof HTMLButtonElement))
          throw new Error('Missing host control.');
        button.click();
      });
    await expect(region).toBeFocused();
    await page.getByRole('button', { name: 'Submit active slide' }).click();
    await expect(
      page.getByText('Slide form submissions: 1', { exact: true }),
    ).toBeVisible();
    const quantity = page.getByRole('textbox', { name: 'Review quantity' });
    await expect(quantity).toBeFocused();
    await quantity.fill('2');
    await page.getByRole('button', { name: 'Submit active slide' }).click();
    await expect(
      page.getByText('Slide form submissions: 2', { exact: true }),
    ).toBeVisible();
    const outside = page.getByRole('button', { name: 'Preview loading slides' });
    await outside.focus();
    await page
      .getByRole('button', { name: 'Advance carousel from host' })
      .evaluate((button) => {
        if (!(button instanceof HTMLButtonElement))
          throw new Error('Missing host control.');
        button.click();
      });
    await expect(outside).toBeFocused();
    await region.focus();
    await page.keyboard.press('Home');
    await expect(draft).toHaveValue('Edited profile');
    await page.getByRole('switch', { name: 'Readonly carousel' }).check();
    await expect(region.getByRole('button', { name: 'Next slide' })).toBeDisabled();
    expect(errors).toEqual([]);
  });
}
