import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../src/core/policy.js';

const WIDTHS = [240, 360, 768, 1440];
const HEIGHT = 1000;
const TOLERANCE = 1;
async function open(page: Page, profile: string) {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Content and data', exact: true }).click();
}
async function press(page: Page, name: string) {
  await page.getByRole('button', { name, exact: true }).click();
}
async function key(page: Page) {
  const value = await page.getByText(/^Lookup key: /).textContent();
  if (value === null) throw new Error('Missing current request key.');
  return value.slice('Lookup key: '.length);
}
for (const profile of ['Spacious', 'Compact']) {
  for (const width of WIDTHS) {
    test(`${profile} remote mention ${width}px, RTL and 200%`, async ({ page }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await open(page, profile);
      await page.getByRole('switch', { name: 'Right to left lookup' }).check();
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      const box = page.getByRole('textbox', { name: 'Directory lookup document' });
      await box.pressSequentially('@qq');
      await expect(page.getByText('Loading results.')).toBeVisible();
      await press(page, 'Resolve current');
      const option = page.getByRole('option', {
        name: `Directory entry ${await key(page)}`,
        exact: true,
      });
      await expect(option).toBeVisible();
      const menu = page.getByRole('listbox', { name: 'Remote directory options' });
      await expect(menu).toHaveCSS('direction', 'rtl');
      const bounds = await option.boundingBox();
      if (bounds === null) throw new Error('Missing remote option geometry.');
      expect(bounds.width).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
      expect(bounds.height).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
      expect(bounds.x).toBeGreaterThanOrEqual(-TOLERANCE);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width + TOLERANCE);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width + TOLERANCE);
      if (profile === 'Spacious' && (width === 360 || width === 1440))
        await menu.screenshot({ path: `.cache/editor-lookup-${width}.png` });
      await option.click();
      await expect(box).toBeFocused();
    });
  }
  test(`${profile} correlated remote replies and native mention insertion`, async ({
    page,
  }) => {
    await open(page, profile);
    const box = page.getByRole('textbox', { name: 'Directory lookup document' });
    await expect(page.getByText('Lookup requests: 0')).toBeVisible();
    await box.pressSequentially('@qq');
    await expect(page.getByText('Lookup requests: 3')).toBeVisible();
    const first = await key(page);
    await press(page, 'Clear response');
    await expect(page.getByText('Delivered response: none')).toBeVisible();
    await press(page, 'Fail current');
    await expect(page.getByRole('alert')).toContainText('Simulated lookup error.');
    await press(page, 'Empty current');
    await expect(page.getByText('No matching results.')).toBeVisible();
    await press(page, 'Resolve current');
    await press(page, 'Save response for replay');
    await box.focus();
    await page.keyboard.press('End');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.type('rr');
    await expect(page.getByText('Lookup query: rr')).toBeVisible();
    const second = await key(page);
    await press(page, 'Resolve current');
    const count = await page.getByText(/^Lookup requests: /).textContent();
    await press(page, 'Replay saved response');
    await expect(page.getByText(/^Lookup requests: /)).toHaveText(count ?? '');
    await expect(
      page.getByRole('option', { name: `Directory entry ${second}`, exact: true }),
    ).toBeVisible();
    await box.focus();
    await page.keyboard.press('End');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.type('qq');
    await expect(page.getByText('Lookup query: qq')).toBeVisible();
    const third = await key(page);
    expect(third).not.toBe(first);
    await press(page, 'Replay saved response');
    await expect(
      page.getByRole('option', { name: `Directory entry ${first}`, exact: true }),
    ).toHaveCount(0);
    await press(page, 'Resolve current');
    await page
      .getByRole('option', {
        name: `Directory entry ${third}`,
        exact: true,
      })
      .click();
    await expect(box).toHaveText(`@Directory entry ${third} `);
    await expect(box).toBeFocused();
    await press(page, 'Reset lookup document');
    await page.getByRole('switch', { name: 'Reject lookup edits' }).check();
    await box.pressSequentially('@qq');
    await expect(box).toHaveText('');
    const protectedCount = await page.getByText(/^Lookup requests: /).textContent();
    await page.getByRole('switch', { name: 'Read-only lookup document' }).check();
    await expect(box).toHaveAttribute('aria-readonly', 'true');
    await page.getByRole('switch', { name: 'Disable lookup document' }).check();
    await expect(box).toHaveAttribute('aria-disabled', 'true');
    await expect(page.getByText(/^Lookup requests: /)).toHaveText(protectedCount ?? '');
  });
}
