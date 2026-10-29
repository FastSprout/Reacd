import { expect, test } from '@playwright/test';

const PROFILES = ['Spacious', 'Compact'];
const DIRECTIONS = ['ltr', 'rtl'];
const WIDTH = 320;
const HEIGHT = 1000;
const TOLERANCE = 1;

for (const profile of PROFILES) {
  for (const direction of DIRECTIONS) {
    test(`${profile} portal form ${direction} at 200%`, async ({ page }) => {
      await page.setViewportSize({ width: WIDTH, height: HEIGHT });
      await page.goto('/');
      const appearance = page.getByRole('combobox', {
        name: 'Appearance',
        exact: true,
      });
      await appearance.click();
      await page.getByRole('option', { name: profile, exact: true }).click();
      const region = page.getByRole('region', {
        name: 'Auth and media components',
        exact: true,
      });
      if (direction === 'rtl')
        await region.getByRole('switch', { name: 'Auth media RTL' }).check();
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      const outer = region.getByRole('form', { name: 'Outer portal example' });
      await outer.getByRole('button', { name: 'Open portal form example' }).click();
      const dialog = page.getByRole('dialog', {
        name: 'Local portal form',
        exact: true,
      });
      const inner = dialog.getByRole('form', { name: 'Inner portal example' });
      await expect(inner).toBeVisible();
      await expect(page.getByRole('alert')).toHaveCount(0);
      await inner.getByRole('button', { name: 'Submit inner portal' }).click();
      const nested = await inner.evaluate(
        (element) => element.parentElement?.closest('form') !== null,
      );
      expect(nested).toBe(false);
      const box = await dialog.boundingBox();
      if (box === null) throw new Error('Missing modal geometry.');
      expect(box.x).toBeGreaterThanOrEqual(-TOLERANCE);
      expect(box.x + box.width).toBeLessThanOrEqual(WIDTH + TOLERANCE);
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
      await expect(outer.getByText('Inner submissions: 1')).toBeVisible();
      await expect(outer.getByText('Outer submissions: 0')).toBeVisible();
      await outer.getByRole('button', { name: 'Submit outer portal' }).click();
      await expect(outer.getByText('Outer submissions: 1')).toBeVisible();
      await expect(outer.getByText('Inner submissions: 1')).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(WIDTH + TOLERANCE);
    });
  }
}
