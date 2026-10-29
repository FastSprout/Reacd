import { expect, test } from '@playwright/test';

const WIDTHS = [240, 320, 768, 1440];
const PROFILES = ['Spacious', 'Compact'];
const DIRECTIONS = ['ltr', 'rtl'];
const HEIGHT = 1000;
const TOLERANCE = 1;

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    for (const direction of DIRECTIONS) {
      test(`${profile} pricing ${width}px ${direction} at 200%`, async ({ page }) => {
        await page.setViewportSize({ width, height: HEIGHT });
        await page.goto('/');
        const appearance = page.getByRole('combobox', {
          name: 'Appearance',
          exact: true,
        });
        await appearance.click();
        await page.getByRole('option', { name: profile, exact: true }).click();
        const region = page.getByRole('region', {
          name: 'Pricing components',
          exact: true,
        });
        await expect(region).toBeVisible();
        if (direction === 'rtl') {
          await region.getByRole('switch', { name: 'Pricing RTL' }).check();
        }
        await page.evaluate(() => {
          document.documentElement.style.fontSize = '200%';
        });
        const draft = region.getByLabel('Pricing plan draft');
        await draft.fill('Retained pricing draft');
        const plan = region.getByRole('article', { name: 'Illustrative pricing plan' });
        const before = await plan.boundingBox();
        await region.getByRole('switch', { name: 'Prominent example plan' }).check();
        const after = await plan.boundingBox();
        expect(after?.height).toBeGreaterThanOrEqual(before?.height ?? 0);
        await expect(plan).toHaveCSS('transform', 'none');
        for (const name of [
          'Select illustrative plan',
          'Choose first reference plan',
          'Choose supplemental reference plan',
          'Choose comparison reference tier',
        ]) {
          await region.getByRole('button', { name }).click();
        }
        await expect(region.getByText('Illustrative plan selected')).toBeVisible();
        await expect(
          region.getByText('Comparison reference tier selected'),
        ).toBeVisible();
        for (const name of [
          'Vertical pricing collection',
          'Compact pricing collection',
          'Prominent collection plans',
        ]) {
          await region.getByRole('switch', { name }).check();
        }
        const scroll = region.getByRole('region', {
          name: 'Illustrative comparison table',
          exact: true,
        });
        const nativeCaption = await scroll.locator('caption').boundingBox();
        expect(nativeCaption?.width).toBeLessThanOrEqual(TOLERANCE);
        expect(nativeCaption?.height).toBeLessThanOrEqual(TOLERANCE);
        const overflowing = await scroll.evaluate(
          (element) => element.scrollWidth > element.clientWidth,
        );
        if (overflowing) {
          await scroll.focus();
          const initial = await scroll.evaluate((element) => element.scrollLeft);
          await scroll.press(direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight');
          await expect
            .poll(async () =>
              Math.abs(
                (await scroll.evaluate((element) => element.scrollLeft)) - initial,
              ),
            )
            .toBeGreaterThan(0);
        }
        const choose = region.getByRole('button', {
          name: 'Choose comparison reference tier',
        });
        await scroll.focus();
        await page.keyboard.press('Tab');
        await expect(choose).toBeFocused();
        await expect(choose).toBeInViewport();
        await expect
          .poll(async () => {
            const outer = await scroll.boundingBox();
            const target = await choose.boundingBox();
            return (
              outer !== null &&
              target !== null &&
              target.x >= outer.x - TOLERANCE &&
              target.x + target.width <= outer.x + outer.width + TOLERANCE
            );
          })
          .toBe(true);
        const scrollBox = await scroll.boundingBox();
        const chooseBox = await choose.boundingBox();
        if (scrollBox === null || chooseBox === null)
          throw new Error('Missing tier action geometry.');
        expect(
          chooseBox.width,
          JSON.stringify({ scrollBox, chooseBox }),
        ).toBeLessThanOrEqual(scrollBox.width + TOLERANCE);
        expect(chooseBox.x).toBeGreaterThanOrEqual(scrollBox.x - TOLERANCE);
        expect(chooseBox.x + chooseBox.width).toBeLessThanOrEqual(
          scrollBox.x + scrollBox.width + TOLERANCE,
        );
        if (profile === 'Compact' && width === 320 && direction === 'rtl') {
          await plan.screenshot({ path: '.cache/pricing-plan-Compact-320-rtl.png' });
          await region.locator('.reacd-pricing-comparison').screenshot({
            path: '.cache/pricing-table-Compact-320-rtl.png',
          });
        }
        await appearance.click();
        await page
          .getByRole('option', {
            name: profile === 'Compact' ? 'Spacious' : 'Compact',
            exact: true,
          })
          .click();
        await expect(draft).toHaveValue('Retained pricing draft');
        const escaped = await region.evaluate((element, tolerance) => {
          const outer = element.getBoundingClientRect();
          return Array.from(
            element.querySelectorAll('input,button,p,a,h1,h2,h3,h4,h5,h6'),
          ).some((item) => {
            if (item.closest('.reacd-pricing-table-region')) return false;
            const box = item.getBoundingClientRect();
            return (
              box.width > 0 &&
              (box.left < outer.left - tolerance || box.right > outer.right + tolerance)
            );
          });
        }, TOLERANCE);
        expect(escaped).toBe(false);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(width + TOLERANCE);
      });
    }
  }
}
