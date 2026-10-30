import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../../src/core/policy.js';

const WIDTHS = [240, 360, 768, 1440];
const HEIGHT = 1000;
const TOLERANCE = 1;
const LONG_LABEL = 'Unbroken_reference_action_'.repeat(8);

async function fields(page: Page, profile: string) {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Fields', exact: true }).click();
}

for (const profile of ['Spacious', 'Compact']) {
  for (const width of WIDTHS) {
    test(`${profile} field group at ${width}px and 200%`, async ({ page }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await fields(page, profile);
      await page.getByRole('textbox', { name: 'Group action label' }).fill(LONG_LABEL);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await page.getByRole('switch', { name: 'Right to left group' }).check();
      const group = page.getByRole('group', { name: 'Reference search controls' });
      await expect(group).toHaveCSS('direction', 'rtl');
      const action = group.getByRole('button', { name: LONG_LABEL });
      await action.click();
      await expect(group.getByRole('textbox', { name: 'Reference query' })).toHaveValue(
        'Component reference',
      );
      const sizes = await group.getByRole('button').evaluateAll((elements) =>
        elements.map((element) => {
          const box = element.getBoundingClientRect();
          return { width: box.width, height: box.height };
        }),
      );
      for (const size of sizes) {
        expect(size.width).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
        expect(size.height).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
      }
      await page.getByRole('switch', { name: 'Vertical field group' }).check();
      await expect(group).toHaveCSS('flex-direction', 'column');
      const escaped = await group.evaluate((element, tolerance) => {
        const outer = element.getBoundingClientRect();
        return Array.from(element.children).some((child) => {
          const box = child.getBoundingClientRect();
          return (
            box.left < outer.left - tolerance || box.right > outer.right + tolerance
          );
        });
      }, TOLERANCE);
      expect(escaped).toBe(false);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width + TOLERANCE);
    });
  }
  test(`${profile} grouped controls retain keyboard order`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await fields(page, profile);
    const group = page.getByRole('group', { name: 'Reference search controls' });
    await group.getByRole('textbox', { name: 'Reference query' }).focus();
    await page.keyboard.type('Text');
    await page.keyboard.press('Tab');
    await expect(group.getByRole('button', { name: 'Search reference' })).toBeFocused();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await expect(
      group.getByRole('button', { name: 'Clear reference query' }),
    ).toBeFocused();
    await page.keyboard.press('Space');
    await expect(group.getByRole('textbox', { name: 'Reference query' })).toHaveValue(
      '',
    );
    expect(errors).toEqual([]);
  });
}
