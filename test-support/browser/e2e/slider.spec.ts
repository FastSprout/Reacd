import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../../src/core/policy.js';

const PROFILES = ['Spacious', 'Compact'];
const WIDTHS = [240, 360, 768, 1440];
const HEIGHT = 1000;
const TOLERANCE = 1;

async function fields(page: Page, profile: string) {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Fields', exact: true }).click();
}

async function contained(page: Page) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual((page.viewportSize()?.width ?? 0) + TOLERANCE);
  for (const thumb of await page.locator('.reacd-range-thumb').all()) {
    const box = await thumb.boundingBox();
    if (box === null) throw new Error('Slider thumb must have geometry.');
    expect(box.width).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
    expect(box.height).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
  }
}

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    test(`${profile} Slider at ${width}px, 200% and RTL`, async ({ page }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await fields(page, profile);
      await contained(page);
      await page.getByRole('switch', { name: 'Right to left sliders' }).check();
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await contained(page);
      const minimum = page.getByRole('slider', { name: 'Minimum Price interval' });
      await minimum.focus();
      await page.keyboard.press('ArrowRight');
      await expect(minimum).toHaveAttribute('aria-valuenow', '19');
      const vertical = page.getByRole('slider', { name: 'Vertical output' });
      await expect(vertical).toHaveAttribute('aria-orientation', 'vertical');
      await vertical.focus();
      await page.keyboard.press('ArrowUp');
      await expect(vertical).toHaveAttribute('aria-valuenow', '21');
    });
  }

  test(`${profile} Slider endpoints, pointer, readonly and native values`, async ({
    page,
  }) => {
    await fields(page, profile);
    const minimum = page.getByRole('slider', { name: 'Minimum Price interval' });
    const maximum = page.getByRole('slider', { name: 'Maximum Price interval' });
    await minimum.focus();
    await page.keyboard.press('End');
    await expect(minimum).toHaveAttribute('aria-valuenow', '80');
    await expect(maximum).toHaveAttribute('aria-valuenow', '80');
    await maximum.focus();
    await page.keyboard.press('Home');
    await expect(maximum).toHaveAttribute('aria-valuenow', '80');
    const output = page.getByRole('slider', { name: 'Output level', exact: true });
    const root = page.locator('.reacd-range-root').filter({ has: output });
    const track = root.locator('.reacd-range-control');
    await track.scrollIntoViewIfNeeded();
    const box = await track.boundingBox();
    if (box === null) throw new Error('Slider control must have geometry.');
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await expect(output).not.toHaveAttribute('aria-valuenow', '20');
    const canonical = await output.getAttribute('aria-valuenow');
    await page.getByRole('switch', { name: 'Read-only sliders' }).check();
    await output.focus();
    await page.keyboard.press('Home');
    await expect(output).toHaveAttribute('aria-valuenow', canonical ?? '');
    await page.getByRole('button', { name: 'Save sliders' }).click();
    await expect(page.getByText('Sliders saved.', { exact: true })).toBeVisible();
    const form = page.getByRole('form', { name: 'Slider form' });
    expect(
      await form.evaluate((element) => {
        if (!(element instanceof HTMLFormElement)) throw new Error('Expected form.');
        return Object.fromEntries(new FormData(element));
      }),
    ).toEqual({ level: canonical, 'price.start': '80', 'price.end': '80' });
    await page.getByRole('switch', { name: 'Disable sliders' }).check();
    await expect(output).toBeDisabled();
  });
}
