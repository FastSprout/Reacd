import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

const PROFILES = ['Spacious', 'Compact'];
const WIDTHS = [240, 320, 375, 600, 768, 1024, 1440, 1920];
const HEIGHT = 1000;
const TOLERANCE = 1;
const MAX_ANIMATION_MS = 5000;
const LONG_TITLE = 'Long_unbroken_empty_title_'.repeat(20);
const LONG_DESCRIPTION = 'Long_unbroken_empty_description_'.repeat(40);

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
async function contained(page: Page, region: Locator) {
  const failures = await region.evaluate((element, tolerance) => {
    const outer = element.getBoundingClientRect();
    return Array.from(element.querySelectorAll('h2,p,button,input')).flatMap(
      (child) => {
        const box = child.getBoundingClientRect();
        return box.width > 0 &&
          (box.left < outer.left - tolerance || box.right > outer.right + tolerance)
          ? ['Empty state content escaped.']
          : [];
      },
    );
  }, TOLERANCE);
  expect(failures).toEqual([]);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual((await page.evaluate(() => innerWidth)) + TOLERANCE);
}
for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    test(`${profile} loading and empty bounds at ${width}px and 200%`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await data(page, profile);
      await page.getByLabel('Empty title', { exact: true }).fill(LONG_TITLE);
      await page
        .getByLabel('Empty description', { exact: true })
        .fill(LONG_DESCRIPTION);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      const empty = page.getByRole('region', { name: LONG_TITLE, exact: true });
      for (const variant of ['Solid', 'Soft', 'Subtle', 'Naked', 'Outline']) {
        await select(page, 'Empty variant', variant);
        await contained(page, empty);
      }
      const current = page.getByRole('region', {
        name: 'Current placeholder',
        exact: true,
      });
      const skeleton = current.locator('[data-slot="skeleton"]');
      for (const shape of ['Text', 'Avatar', 'Rectangle']) {
        await select(page, 'Placeholder shape', shape);
        for (const size of ['Small', 'Large', 'Medium']) {
          await select(page, 'Placeholder size', size);
          const box = await skeleton
            .locator('.reacd-skeleton-shape')
            .first()
            .boundingBox();
          const parent = await skeleton.boundingBox();
          if (box === null || parent === null)
            throw new Error('Missing placeholder geometry.');
          expect(box.width).toBeGreaterThan(0);
          expect(box.height).toBeGreaterThan(0);
          expect(box.width).toBeLessThanOrEqual(parent.width + TOLERANCE);
          if (shape === 'Avatar')
            expect(Math.abs(box.width - box.height)).toBeLessThanOrEqual(TOLERANCE);
        }
      }
      await select(page, 'Placeholder shape', 'Text');
      await select(page, 'Placeholder lines', 'Eight lines');
      await expect(skeleton.locator('.reacd-skeleton-shape')).toHaveCount(8);
      await page.getByRole('switch', { name: 'Show placeholder' }).uncheck();
      await expect(skeleton).toHaveCount(0);
      await page.getByRole('switch', { name: 'Show placeholder' }).check();
      await expect(skeleton).toHaveCount(1);
      await page.evaluate(() => {
        document.documentElement.dir = 'rtl';
      });
      await contained(page, empty);
    });
  }
  test(`${profile} empty recovery actions preserve host state`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await data(page, profile);
    const query = page.getByLabel('Empty recovery query', { exact: true });
    await query.fill('Preserved recovery query');
    await page.getByRole('switch', { name: 'Empty loading signal' }).check();
    const empty = page.getByRole('region', { name: 'No sample records', exact: true });
    await expect(empty).toHaveAttribute('data-loading', 'true');
    await expect(empty.locator('[data-slot="empty-content"]')).toHaveAttribute(
      'aria-busy',
      'true',
    );
    expect(
      await empty
        .getByRole('status')
        .evaluate((element) => element.closest('[aria-busy="true"]') === null),
    ).toBe(true);
    await expect(empty.getByRole('status')).toHaveText('Refreshing local data');
    await empty.getByRole('button', { name: 'Create sample record' }).focus();
    await page.keyboard.press('Enter');
    await expect(
      page.getByText('Local sample records created: 1', { exact: true }),
    ).toBeVisible();
    await empty.getByRole('button', { name: 'Empty state help' }).focus();
    await page.keyboard.press('Space');
    await expect(
      page.getByText('Change the query or create a local record.', { exact: true }),
    ).toBeVisible();
    await select(page, 'Empty size', 'Large');
    await select(page, 'Empty variant', 'Solid');
    await select(page, 'Appearance', profile === 'Spacious' ? 'Compact' : 'Spacious');
    await expect(query).toHaveValue('Preserved recovery query');
    await page.getByRole('switch', { name: 'Show empty media' }).uncheck();
    await page.getByRole('switch', { name: 'Show empty footer' }).uncheck();
    await expect(empty.getByRole('img')).toHaveCount(0);
    await expect(empty.getByRole('button', { name: 'Empty state help' })).toHaveCount(
      0,
    );
    await page.getByRole('switch', { name: 'Empty loading signal' }).uncheck();
    await expect(empty.getByRole('status')).toHaveCount(0);
    expect(errors).toEqual([]);
  });
  test(`${profile} placeholder animation is bounded and respects preferences`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await data(page, profile);
    const current = page.getByRole('region', {
      name: 'Current placeholder',
      exact: true,
    });
    const visual = current.locator('.reacd-skeleton-visual');
    const motion = await visual.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        name: style.animationName,
        duration: parseFloat(style.animationDuration),
        count: Number(style.animationIterationCount),
      };
    });
    expect(motion.name).toBe('reacd-skeleton-pulse');
    expect(motion.duration * motion.count * 1000).toBeLessThanOrEqual(MAX_ANIMATION_MS);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(visual).toHaveCSS('animation-name', 'none');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.getByRole('switch', { name: 'Animate placeholder' }).uncheck();
    await expect(visual).toHaveCSS('animation-name', 'none');
    await page.getByLabel('Placeholder status label', { exact: true }).fill('');
    await expect(current.getByRole('status')).toHaveCount(0);
    await expect(current.locator('[data-slot="skeleton"]')).toBeVisible();
  });
}
