import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

const WIDTHS = [240, 320, 375, 600, 768, 1024, 1440, 1920];
const HEIGHT = 1000;
const TOLERANCE = 1;
const TARGET = 44;
const ARROW_REPEATS = 12;

async function content(page: Page, profile: string) {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Content and data', exact: true }).click();
}
async function contained(region: Locator) {
  const escaped = await region.evaluate((element, tolerance) => {
    const outer = element.getBoundingClientRect();
    return Array.from(element.querySelectorAll('li,button,p,span')).some((child) => {
      const box = child.getBoundingClientRect();
      return (
        box.width > 0 &&
        (box.left < outer.left - tolerance || box.right > outer.right + tolerance)
      );
    });
  }, TOLERANCE);
  expect(escaped).toBe(false);
}
for (const profile of ['Spacious', 'Compact']) {
  for (const width of WIDTHS) {
    test(`${profile} timeline and scroll bounds at ${width}px, RTL and 200%`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await content(page, profile);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
        document.documentElement.dir = 'rtl';
      });
      const timeline = page.getByRole('list', { name: 'Delivery milestones' });
      await page.getByRole('switch', { name: 'Right to left timeline' }).check();
      await expect(timeline).toHaveCSS('direction', 'rtl');
      await contained(timeline);
      await page.getByRole('switch', { name: 'Horizontal timeline' }).check();
      await page.getByRole('switch', { name: 'Reverse timeline' }).check();
      await contained(timeline);
      const build = timeline.getByRole('button', { name: 'Implementation' });
      await build.focus();
      await page.keyboard.press('Enter');
      await expect(
        page.getByText('Current milestone: build', { exact: true }),
      ).toBeVisible();
      await expect(timeline.locator('[aria-current="step"]')).toHaveCount(1);
      await expect(
        timeline.getByRole('button', { name: 'Release review' }),
      ).toBeDisabled();
      const scroll = page.getByRole('region', { name: 'Reference records' });
      await page.getByRole('switch', { name: 'Right to left records' }).check();
      await expect(scroll).toHaveCSS('direction', 'rtl');
      await scroll.focus();
      await expect(scroll).toBeFocused();
      expect(
        await scroll.evaluate((element) => element.scrollHeight > element.clientHeight),
      ).toBe(true);
      await page.keyboard.press('End');
      await expect
        .poll(() => scroll.evaluate((element) => element.scrollTop))
        .toBeGreaterThan(0);
      await page.getByRole('switch', { name: 'Horizontal records' }).check();
      expect(
        await scroll.evaluate((element) => element.scrollWidth > element.clientWidth),
      ).toBe(true);
      await scroll.focus();
      for (let index = 0; index < ARROW_REPEATS; index += 1)
        await page.keyboard.press('ArrowLeft');
      await expect
        .poll(() => scroll.evaluate((element) => Math.abs(element.scrollLeft)))
        .toBeGreaterThan(0);
      const action = scroll.getByRole('button', { name: 'Open State' });
      await action.click();
      await expect(page.getByText('Opened State.', { exact: true })).toBeVisible();
      const box = await action.boundingBox();
      if (box === null) throw new Error('Missing scroll action geometry.');
      expect(box.height).toBeGreaterThanOrEqual(TARGET);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual((await page.evaluate(() => innerWidth)) + TOLERANCE);
    });
  }
}
