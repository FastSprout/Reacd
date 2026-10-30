import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../../src/core/policy.js';
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
    test(`${profile} files ${width}px, RTL and 200%`, async ({ page }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await fields(page, profile);
      await page.getByRole('switch', { name: 'Right to left files' }).check();
      await page.getByRole('button', { name: 'Restore sample file' }).click();
      const form = page.getByRole('form', { name: 'Files form', exact: true });
      await form.locator('input[type=file]').setInputFiles({
        name: `${'LongFileName'.repeat(18)}.txt`,
        mimeType: 'text/plain',
        buffer: Buffer.from('Hello'),
      });
      await expect(form.getByRole('listitem')).toHaveCount(2);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      const group = form.getByRole('group', { name: 'Attachments', exact: true });
      await expect(group).toHaveCSS('direction', 'rtl');
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width + TOLERANCE);
      const box = await group.boundingBox();
      if (!box) throw new Error('Missing file group geometry');
      expect(box.x).toBeGreaterThanOrEqual(-TOLERANCE);
      expect(box.x + box.width).toBeLessThanOrEqual(width + TOLERANCE);
      const readableWidth = await page.evaluate(
        (rem) =>
          Number.parseFloat(getComputedStyle(document.documentElement).fontSize) * rem,
        LAYOUT_POLICY.stackTrackRem,
      );
      for (const filename of await group.locator('li > span').all()) {
        const textBox = await filename.boundingBox();
        if (!textBox) throw new Error('Missing filename geometry');
        expect(textBox.width).toBeGreaterThanOrEqual(
          Math.min(box.width, readableWidth) - TOLERANCE,
        );
      }
      if (profile === 'Spacious' && (width === 360 || width === 1440))
        await group.screenshot({ path: `.cache/form2-files-${width}.png` });
    });
  test(`${profile} files real bytes, native form, rejection and protection`, async ({
    page,
  }) => {
    await fields(page, profile);
    const form = page.getByRole('form', { name: 'Files form', exact: true });
    await page.getByRole('button', { name: 'Save files' }).click();
    await expect(form.getByRole('button', { name: 'Choose files' })).toBeFocused();
    await page.getByRole('switch', { name: 'Read-only files' }).check();
    await page.getByRole('button', { name: 'Save files' }).click();
    await expect(form.getByRole('group', { name: 'Attachments' })).toBeFocused();
    await page.getByRole('switch', { name: 'Read-only files' }).uncheck();
    await form.locator('input[type=file]').setInputFiles({
      name: 'actual.bin',
      mimeType: 'application/octet-stream',
      buffer: Buffer.from([0, 255, 128]),
    });
    await expect(form.getByText('actual.bin', { exact: true })).toBeVisible();
    await expect(form.locator('input[name=attachments]')).toHaveValue(/AP\+A/);
    await page.getByRole('switch', { name: 'Reject file changes' }).check();
    await form.getByRole('button', { name: 'Remove actual.bin' }).click();
    await expect(form.getByText('actual.bin', { exact: true })).toBeVisible();
    await page.getByRole('switch', { name: 'Read-only files' }).check();
    await expect(form.getByRole('button', { name: 'Choose files' })).toHaveCount(0);
    await expect(form.locator('input[name=attachments]')).toHaveValue(/AP\+A/);
    await page.getByRole('switch', { name: 'Disable files' }).check();
    await expect(form.locator('input[name=attachments]')).toHaveCount(0);
  });
}
