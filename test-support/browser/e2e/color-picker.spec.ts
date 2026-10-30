import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
const WIDTHS = [240, 360, 768, 1440];
const HEIGHT = 1000;
const TOLERANCE = 1;
async function fields(page: Page, profile: string) {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Fields', exact: true }).click();
}
for (const profile of ['Spacious', 'Compact']) {
  for (const width of WIDTHS)
    test(`${profile} colors ${width}px, RTL and 200%`, async ({ page }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await fields(page, profile);
      await page.getByRole('switch', { name: 'Right to left colors' }).check();
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      const group = page.getByRole('group', { name: 'Reference color', exact: true });
      await expect(group).toHaveCSS('direction', 'rtl');
      const area = group.locator('.reacd-color-area');
      const box = await area.boundingBox();
      if (!box) throw new Error('Missing color area geometry');
      await area.click({ position: { x: box.width / 2, y: box.height / 2 } });
      await expect(group.getByRole('textbox')).not.toHaveValue('#33aa6680');
      const hue = group.getByRole('slider', {
        name: 'Reference color hue',
        exact: true,
      });
      await hue.focus();
      await page.keyboard.press('End');
      const maximum = Number(await hue.inputValue());
      await page.keyboard.press('ArrowRight');
      expect(Number(await hue.inputValue())).toBeLessThan(maximum);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width + TOLERANCE);
      const groupBox = await group.boundingBox();
      if (!groupBox) throw new Error('Missing color group geometry');
      expect(groupBox.x).toBeGreaterThanOrEqual(-TOLERANCE);
      expect(groupBox.x + groupBox.width).toBeLessThanOrEqual(width + TOLERANCE);
      if (profile === 'Spacious' && (width === 360 || width === 1440))
        await group.screenshot({ path: `.cache/form2-color-${width}.png` });
    });
  test(`${profile} colors form, rejection, drafts and protection`, async ({ page }) => {
    await fields(page, profile);
    const form = page.getByRole('form', { name: 'Color form', exact: true });
    await page.evaluate(() => {
      const root = document.querySelector('.reacd-root');
      if (!(root instanceof HTMLElement)) throw new Error('Missing template root');
      root.style.setProperty('--reacd-danger', '#ffffff');
      root.style.setProperty('--reacd-onDanger', '#000000');
    });
    const hex = form.getByRole('textbox', { name: 'Reference color hexadecimal' });
    await hex.fill('#AABBCC80');
    await hex.press('Enter');
    await expect(hex).toHaveValue('#aabbcc80');
    await expect(form.locator('input[name=color]')).toHaveValue('#aabbcc80');
    await hex.fill('#bad');
    await form.getByRole('button', { name: 'Save color' }).click();
    await expect(hex).toBeFocused();
    await expect(form.getByRole('alert')).toBeVisible();
    const textColor = await form.evaluate((element) => getComputedStyle(element).color);
    await expect(form.getByRole('alert')).toHaveCSS('color', textColor);
    await hex.press('Escape');
    await expect(hex).toHaveValue('#aabbcc80');
    await page.getByRole('switch', { name: 'Reject color changes' }).check();
    await form.getByRole('button', { name: 'Black preset' }).click();
    await expect(hex).toHaveValue('#aabbcc80');
    await page.getByRole('switch', { name: 'Read-only color' }).check();
    await expect(hex).toHaveAttribute('readonly', '');
    await expect(form.locator('input[name=color]')).toHaveValue('#aabbcc80');
    await page.getByRole('switch', { name: 'Disable color' }).check();
    await expect(form.locator('input[name=color]')).toHaveCount(0);
  });
}
