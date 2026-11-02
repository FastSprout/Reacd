import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { expectUnsupportedDiagnostic } from '../native-capabilities.js';
import { watchPreviewFailures } from '../preview-failures.js';

const PROFILES = ['Spacious', 'Compact'];
const WIDTHS = [240, 320, 375, 600, 768, 1024, 1440, 1920];
const HEIGHT = 1000;
const TOLERANCE = 1;

async function data(page: Page, profile: string) {
  const failures = watchPreviewFailures(page);
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Content and data', exact: true }).click();
  const key = page.getByRole('img', { name: 'Escape', exact: true });
  await expect(key).toBeVisible();
  await expect(key).toHaveText('Esc');
  expect(await key.evaluate((element) => element.tagName)).toBe('KBD');
  if (test.info().project.name === 'mui') {
    await expectUnsupportedDiagnostic(page, failures, 'Popover', 'Popover');
    await expect(page.getByRole('button', { name: 'Add delivery note' })).toHaveCount(
      0,
    );
    return false;
  }
  return true;
}

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    test(`${profile} native popover and key at ${width}px, RTL and 200%`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      const supported = await data(page, profile);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
        document.documentElement.dir = 'rtl';
      });
      if (supported) {
        const trigger = page.getByRole('button', { name: 'Add delivery note' });
        await trigger.click();
        const popup = page.getByRole('dialog', { name: 'Delivery instructions' });
        const input = popup.getByRole('textbox', { name: 'Delivery note' });
        await expect(input).toBeVisible();
        await input.fill('Leave the parcel at reception.');
        const box = await popup.boundingBox();
        if (!box) throw new Error('Missing native popover geometry.');
        expect(box.x).toBeGreaterThanOrEqual(-TOLERANCE);
        expect(box.x + box.width).toBeLessThanOrEqual(width + TOLERANCE);
        await input.focus();
        await page.keyboard.press('Escape');
        await expect(popup).toHaveCount(0);
        await expect(trigger).toBeFocused();
        await trigger.click();
        await expect(input).toHaveValue('Leave the parcel at reception.');
        await popup.getByRole('button', { name: 'Save note' }).click();
        await expect(popup).toHaveCount(0);
        await expect(
          page.getByText('Saved note: Leave the parcel at reception.', { exact: true }),
        ).toBeVisible();
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width + TOLERANCE);
    });
  }
}

test.describe('touch popover', () => {
  test.use({ hasTouch: true, viewport: { width: 375, height: 900 } });
  test('saves a delivery note with native touch controls or reports its gap', async ({
    page,
  }) => {
    if (!(await data(page, 'Spacious'))) return;
    const trigger = page.getByRole('button', { name: 'Add delivery note' });
    await trigger.tap();
    const popup = page.getByRole('dialog', { name: 'Delivery instructions' });
    await popup.getByRole('textbox', { name: 'Delivery note' }).fill('Ring once.');
    await popup.getByRole('button', { name: 'Save note' }).tap();
    await expect(popup).toHaveCount(0);
    await expect(
      page.getByText('Saved note: Ring once.', { exact: true }),
    ).toBeVisible();
  });
});
