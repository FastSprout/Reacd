import { expect, test } from '@playwright/test';

const WIDTHS = [240, 320, 768, 1440];
const PROFILES = ['Spacious', 'Compact'];
const DIRECTIONS = ['ltr', 'rtl'];
const HEIGHT = 1000;
const TOLERANCE = 1;

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    for (const direction of DIRECTIONS) {
      test(`${profile} tabs ${width}px ${direction} at 200%`, async ({ page }) => {
        await page.setViewportSize({ width, height: HEIGHT });
        await page.goto('/');
        await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
        await page.getByRole('option', { name: profile, exact: true }).click();
        await page.getByRole('button', { name: 'Navigation', exact: true }).click();
        if (direction === 'rtl')
          await page.getByRole('switch', { name: 'Right to left navigation' }).check();
        await page.evaluate(() => {
          document.documentElement.style.fontSize = '200%';
        });
        const list = page.getByRole('tablist', { name: 'Account settings' });
        await expect(list).toHaveCSS('direction', direction);
        const first = list.getByRole('tab', { name: 'Account preferences' });
        await expect(
          list.getByRole('tab', { name: /^Restricted settings:/ }),
        ).toHaveCSS('opacity', '1');
        const last = list.getByRole('tab', { name: 'Billing preferences' });
        const alias = page.getByLabel('Account alias');
        await alias.fill('Retained account');
        await first.focus();
        await page.keyboard.press(direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight');
        await expect(last).toBeFocused();
        await expect(last).toHaveAttribute('aria-selected', 'true');
        await expect(alias).toBeHidden();
        await page.keyboard.press('Home');
        await expect(first).toBeFocused();
        await expect(alias).toHaveValue('Retained account');
        await page.getByRole('switch', { name: 'Manual tab activation' }).check();
        await page.getByRole('switch', { name: 'Vertical tabs' }).check();
        await first.focus();
        await page.keyboard.press('ArrowDown');
        await expect(last).toBeFocused();
        await expect(first).toHaveAttribute('aria-selected', 'true');
        await page.keyboard.press('Enter');
        await expect(last).toHaveAttribute('aria-selected', 'true');
        await page.keyboard.press('Home');
        await expect(first).toBeFocused();
        await page.keyboard.press('Space');
        await expect(first).toHaveAttribute('aria-selected', 'true');
        await expect(alias).toHaveValue('Retained account');
        const panel = page.getByRole('tabpanel', { name: 'Account preferences' });
        const panelId = await panel.getAttribute('id');
        if (panelId === null) throw new Error('Missing tab panel identity.');
        await expect(first).toHaveAttribute('aria-controls', panelId);
        const disabled = page.getByRole('link', { name: 'Unavailable destination' });
        await expect(disabled).not.toHaveAttribute('href');
        const [popup] = await Promise.all([
          page.waitForEvent('popup'),
          page.getByRole('link', { name: 'Open catalog in new window' }).click(),
        ]);
        await popup.waitForLoadState();
        expect(await popup.evaluate(() => window.opener === null)).toBe(true);
        await popup.close();
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(width + TOLERANCE);
      });
    }
  }
}
