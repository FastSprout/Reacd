import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const PROFILES = ['Spacious', 'Compact'];
const WIDTHS = [240, 320, 375, 600, 768, 1024, 1440, 1920];
const HEIGHT = 1000;
const TOLERANCE = 1;
const LONG_KEY = 'Long_sample_key_'.repeat(24);
async function select(page: Page, name: string, option: string) {
  const trigger = page.getByRole('combobox', { name, exact: true });
  await trigger.click();
  await page.getByRole('option', { name: option, exact: true }).click();
  await expect(trigger).toBeFocused();
}
async function data(page: Page, profile: string) {
  await page.goto('/');
  await select(page, 'Appearance', profile);
  await page.getByRole('button', { name: 'Content and data', exact: true }).click();
}
async function bounds(page: Page) {
  const result = await page.evaluate(() => ({
    viewport: innerWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(result.scroll).toBeLessThanOrEqual(result.viewport + TOLERANCE);
  const failures = await page.locator('.reacd-kbd').evaluateAll(
    (keys, tolerance) =>
      keys.flatMap((key) => {
        const box = key.getBoundingClientRect();
        if (box.width === 0) return [];
        const range = document.createRange();
        range.selectNodeContents(key);
        const text = range.getBoundingClientRect();
        return text.left < box.left - tolerance || text.right > box.right + tolerance
          ? ['Keyboard notation escaped its container.']
          : [];
      }),
    TOLERANCE,
  );
  expect(failures).toEqual([]);
}
async function ready(page: Page, title: string) {
  const popup = page.getByRole('dialog', { name: title, exact: true });
  await expect(popup).toBeVisible();
  await expect(popup).toHaveCSS('opacity', '1');
  return popup;
}
for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    test(`${profile} popover and keyboard bounds at ${width}px and 200%`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await data(page, profile);
      await page.getByLabel('Key value', { exact: true }).fill(LONG_KEY);
      for (const size of ['Small', 'Large', 'Medium'])
        await select(page, 'Key size', size);
      for (const variant of ['Soft', 'Subtle', 'Solid', 'Outline'])
        await select(page, 'Key variant', variant);
      for (const intent of ['Primary', 'Danger', 'Secondary'])
        await select(page, 'Key intent', intent);
      await bounds(page);
      await page.getByRole('switch', { name: 'Long popover content' }).check();
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await page.getByRole('button', { name: 'Open details popover' }).click();
      const popup = await ready(page, 'Draft details');
      const box = await popup.boundingBox();
      if (box === null) throw new Error('Missing popover geometry.');
      expect(box.x).toBeGreaterThanOrEqual(-TOLERANCE);
      expect(box.y).toBeGreaterThanOrEqual(-TOLERANCE);
      expect(box.x + box.width).toBeLessThanOrEqual(width + TOLERANCE);
      expect(box.y + box.height).toBeLessThanOrEqual(HEIGHT + TOLERANCE);
      await popup.getByRole('button', { name: 'Close details popover' }).click();
      await expect(popup).toHaveCount(0);
      await page.evaluate(() => {
        document.documentElement.dir = 'rtl';
      });
      await bounds(page);
    });
  }
  test(`${profile} popover fields, layers, and retained data`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await data(page, profile);
    await select(page, 'Key platform', 'Apple');
    const key = page.getByRole('region', { name: 'Current key', exact: true });
    await expect(key.getByRole('img', { name: 'Command' })).toHaveText('⌘');
    await page.getByRole('button', { name: 'Open details popover' }).click();
    const popup = await ready(page, 'Draft details');
    await expect(popup.getByLabel('Popover draft')).toBeFocused();
    await popup.getByLabel('Popover draft').fill('Retained browser draft');
    await popup.getByRole('combobox', { name: 'Popover choice' }).click();
    await expect(page.getByRole('option', { name: 'Beta', exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(popup).toBeVisible();
    await select(page, 'Popover choice', 'Beta');
    await popup.getByRole('button', { name: 'Open nested popover' }).click();
    const nested = await ready(page, 'Nested details');
    await page.keyboard.press('Escape');
    await expect(nested).toHaveCount(0);
    await expect(popup).toBeVisible();
    await popup.getByRole('button', { name: 'Save local draft' }).click();
    await popup.getByRole('button', { name: 'Close details popover' }).click();
    await select(page, 'Appearance', profile === 'Spacious' ? 'Compact' : 'Spacious');
    await page.getByRole('button', { name: 'Open details popover' }).click();
    await ready(page, 'Draft details');
    await expect(popup.getByLabel('Popover draft')).toHaveValue(
      'Retained browser draft',
    );
    await popup.getByRole('button', { name: 'Close details popover' }).click();
    await page.getByRole('button', { name: 'Open popover parent dialog' }).click();
    const parent = page.getByRole('dialog', { name: 'Popover parent dialog' });
    const trigger = parent.getByRole('button', { name: 'Open dialog popover' });
    await expect(trigger).toBeFocused();
    await trigger.click();
    const child = await ready(page, 'Dialog details');
    await select(page, 'Dialog popover choice', 'Alpha');
    await child.getByRole('button', { name: 'Hide parent dialog' }).click();
    await expect(parent).toHaveCount(0);
    await expect(child).toHaveCount(0);
    await page.getByRole('button', { name: 'Open popover parent dialog' }).click();
    await ready(page, 'Dialog details');
    await expect(child.getByRole('combobox')).toContainText('Alpha');
    await child.getByRole('button', { name: 'Dialog popover action' }).focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    await expect(child.getByRole('tooltip')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(child.getByRole('tooltip')).toHaveCount(0);
    await expect(child).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(child).toHaveCount(0);
    await expect(parent).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(parent).toHaveCount(0);
    expect(errors).toEqual([]);
  });
  test(`${profile} hover previews and modal click focus behave independently`, async ({
    page,
  }) => {
    await data(page, profile);
    await page.getByRole('switch', { name: 'Modal popover' }).check();
    await select(page, 'Popover mode', 'Hover');
    const mode = page.getByRole('combobox', { name: 'Popover mode', exact: true });
    await page.getByRole('button', { name: 'Open details popover' }).hover();
    const popup = await ready(page, 'Draft details');
    await expect(popup).toHaveAttribute('aria-modal', 'false');
    await expect(mode).toBeFocused();
    await popup.hover();
    await expect(popup).toBeVisible();
    await page.getByRole('heading', { name: 'Popover preview', exact: true }).hover();
    await expect(popup).toHaveCount(0);
    await select(page, 'Popover mode', 'Click');
    await page.getByRole('button', { name: 'Open details popover' }).click();
    await ready(page, 'Draft details');
    await expect(popup).toHaveAttribute('aria-modal', 'true');
    await expect(popup.getByLabel('Popover draft')).toBeFocused();
    for (let index = 0; index < 12; index++) {
      await page.keyboard.press('Tab');
      await expect
        .poll(() =>
          popup.evaluate((element) => element.contains(document.activeElement)),
        )
        .toBe(true);
    }
    await popup.getByRole('button', { name: 'Close details popover' }).click();
    await page.getByRole('switch', { name: 'Dismissible popover' }).uncheck();
    await page.getByRole('button', { name: 'Open details popover' }).click();
    await ready(page, 'Draft details');
    await page.keyboard.press('Escape');
    await expect(popup).toBeVisible();
    await popup.getByRole('button', { name: 'Close details popover' }).click();
  });
}
test.describe('touch popover', () => {
  test.use({ hasTouch: true, viewport: { width: 375, height: 900 } });
  test('opens by tap without forcing the virtual keyboard', async ({ page }) => {
    await data(page, 'Spacious');
    await page.getByRole('button', { name: 'Open details popover' }).tap();
    const popup = await ready(page, 'Draft details');
    await expect(popup).toBeFocused();
    await popup.getByRole('button', { name: 'Close details popover' }).tap();
    await expect(popup).toHaveCount(0);
  });
});
