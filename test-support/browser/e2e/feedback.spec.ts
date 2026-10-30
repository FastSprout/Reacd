import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

const WIDTHS = [240, 320, 375, 600, 768, 1024, 1440, 1920];
const HEIGHT = 1000;
const TOLERANCE = 1;
const TARGET = 44;
const LONG_NAME = 'Unbroken_identity_'.repeat(40);
const LONG_DESCRIPTION = 'Unbroken_description_'.repeat(80);

async function appearance(page: Page, profile: string) {
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
}
async function family(page: Page, name: string) {
  await page.getByRole('button', { name, exact: true }).click();
}
async function bounds(page: Page, region: Locator) {
  const escaped = await region.evaluate((element, tolerance) => {
    const outer = element.getBoundingClientRect();
    return Array.from(element.querySelectorAll('button,p,span,h5')).some((child) => {
      const box = child.getBoundingClientRect();
      return (
        box.width > 0 &&
        (box.left < outer.left - tolerance || box.right > outer.right + tolerance)
      );
    });
  }, TOLERANCE);
  expect(escaped).toBe(false);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual((await page.evaluate(() => innerWidth)) + TOLERANCE);
}
for (const profile of ['Spacious', 'Compact']) {
  for (const width of WIDTHS) {
    test(`${profile} identities, segments and banners at ${width}px and 200%`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await page.goto('/');
      await appearance(page, profile);
      await family(page, 'Content and data');
      await page.getByLabel('User name', { exact: true }).fill(LONG_NAME);
      await page.getByLabel('User description').fill(LONG_DESCRIPTION);
      await page.getByLabel('Progress segment label').fill(LONG_NAME);
      await page.getByRole('switch', { name: 'Right to left identity' }).check();
      await page.getByRole('switch', { name: 'Right to left segments' }).check();
      await expect(
        page.getByRole('button', { name: LONG_NAME, exact: true }),
      ).toHaveCSS('direction', 'rtl');
      await expect(
        page.getByRole('progressbar', { name: 'Storage allocation' }),
      ).toHaveCSS('direction', 'rtl');
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
        document.documentElement.dir = 'rtl';
      });
      const identity = page.getByRole('region', { name: 'User identity preview' });
      await bounds(page, identity);
      await page.getByRole('switch', { name: 'Vertical identity' }).check();
      await bounds(page, identity);
      const capacity = page.getByRole('region', {
        name: 'Storage allocation preview',
      });
      await bounds(page, capacity);
      await expect(capacity.getByRole('progressbar')).toHaveAttribute(
        'aria-valuenow',
        '40',
      );
      await family(page, 'Actions and feedback');
      await page.getByLabel('Banner title', { exact: true }).fill(LONG_NAME);
      await page.getByLabel('Banner description').fill(LONG_DESCRIPTION);
      await page.getByRole('switch', { name: 'Right to left banner' }).check();
      await expect(page.getByRole('alert', { name: LONG_NAME, exact: true })).toHaveCSS(
        'direction',
        'rtl',
      );
      const banner = page.getByRole('region', { name: 'Maintenance banner preview' });
      await bounds(page, banner);
      const close = banner.getByRole('button', { name: 'Dismiss banner' });
      const box = await close.boundingBox();
      if (box === null) throw new Error('Missing close button geometry.');
      expect(box.width).toBeGreaterThanOrEqual(TARGET);
      expect(box.height).toBeGreaterThanOrEqual(TARGET);
    });
  }
  test(`${profile} feedback actions retain controlled state and keyboard use`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');
    await appearance(page, profile);
    await family(page, 'Content and data');
    const identity = page.getByRole('button', { name: 'Ada Lovelace' });
    await identity.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByText('Profile actions: 1', { exact: true })).toBeVisible();
    await page.getByRole('switch', { name: 'Disable profile action' }).check();
    await expect(identity).toBeDisabled();
    await appearance(page, profile === 'Spacious' ? 'Compact' : 'Spacious');
    await expect(identity).toBeDisabled();
    await expect(page.getByText('Profile actions: 1', { exact: true })).toBeVisible();
    const slider = page.getByRole('slider', { name: /^Application storage/u });
    await slider.focus();
    await page.keyboard.press('ArrowRight');
    await expect(
      page.getByRole('progressbar', { name: 'Storage allocation' }),
    ).toHaveAttribute('aria-valuenow', '41');
    await family(page, 'Actions and feedback');
    await page.getByRole('button', { name: 'Save example work' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByText('Example saves: 1', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Dismiss banner' }).focus();
    await page.keyboard.press('Space');
    const banner = page.getByRole('region', { name: 'Maintenance banner preview' });
    await expect(banner.getByRole('alert')).toHaveCount(0);
    await page.getByRole('switch', { name: 'Show maintenance banner' }).check();
    await expect(banner.getByRole('alert')).toBeVisible();
    expect(errors).toEqual([]);
  });
}
