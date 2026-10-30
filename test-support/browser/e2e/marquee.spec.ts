import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../../src/core/policy.js';
const WIDTHS = [240, 360, 768, 1440];
const HEIGHT = 1000;
const TOLERANCE = 1;
async function content(page: Page, profile: string) {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Content and data', exact: true }).click();
}
async function contained(page: Page) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual((await page.evaluate(() => innerWidth)) + TOLERANCE);
}
for (const profile of ['Spacious', 'Compact']) {
  for (const width of WIDTHS) {
    test(`${profile} marquee ${width}px, 200%, RTL and static reading`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await content(page, profile);
      const longText = 'A long unbroken notice: ' + 'International'.repeat(30);
      await page.getByRole('textbox', { name: 'Marquee notice text' }).fill(longText);
      await page.getByRole('switch', { name: 'Right to left marquee' }).check();
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      const region = page.getByRole('region', { name: 'Reference notices' });
      await expect(region).toHaveCSS('direction', 'rtl');
      await expect(region.getByRole('status')).toContainText('reduced-motion');
      await expect(region.getByRole('listitem').first()).toHaveText(longText);
      await expect(region.getByRole('button')).toHaveCount(0);
      await contained(page);
    });
  }
  test(`${profile} marquee motion, pause, original content and preference`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await content(page, profile);
    const region = page.getByRole('region', { name: 'Reference notices' });
    const track = region.locator('.reacd-marquee-track');
    const resume = region.getByRole('button', { name: 'Resume movement' });
    await expect(track).toHaveCSS('animation-play-state', 'paused');
    const box = await resume.boundingBox();
    if (box === null) throw new Error('Missing motion control geometry.');
    expect(box.width).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
    expect(box.height).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
    await resume.click();
    const outside = page.getByRole('switch', { name: 'Readonly marquee' });
    await outside.focus();
    await page.mouse.move(0, 0);
    await expect(track).toHaveCSS('animation-play-state', 'running');
    const before = await track.evaluate(
      (element) => getComputedStyle(element).transform,
    );
    await expect
      .poll(() => track.evaluate((element) => getComputedStyle(element).transform))
      .not.toBe(before);
    await region.getByRole('button', { name: 'Pause movement' }).click();
    await outside.focus();
    await page.mouse.move(0, 0);
    await expect(track).toHaveCSS('animation-play-state', 'paused');
    await region.getByText('Read all notices', { exact: true }).click();
    await expect(region.getByRole('listitem')).toHaveCount(2);
    await expect(region.locator('[aria-hidden="true"]')).toHaveAttribute('inert');
    await expect(
      region.locator('[aria-hidden="true"] a, [aria-hidden="true"] button'),
    ).toHaveCount(0);
    await page.getByRole('switch', { name: 'Right to left marquee' }).check();
    await expect(track).toHaveAttribute('data-reverse', 'true');
    await page.getByRole('switch', { name: 'Backward marquee' }).check();
    await expect(track).toHaveAttribute('data-reverse', 'false');
    await outside.check();
    await expect(region.getByRole('status')).toContainText('Read-only');
    await expect(region.getByRole('button')).toHaveCount(0);
    await outside.uncheck();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(region.getByRole('status')).toContainText('reduced-motion');
    await expect(region.getByRole('listitem')).toHaveCount(2);
    await expect(region.getByRole('button')).toHaveCount(0);
    await contained(page);
    expect(errors).toEqual([]);
  });
}
