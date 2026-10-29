import { expect, test } from '@playwright/test';

const WIDTHS = [240, 320, 768, 1440];
const PROFILES = ['Spacious', 'Compact'];
const DIRECTIONS = ['ltr', 'rtl'];
const HEIGHT = 1000;
const TOLERANCE = 1;

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    for (const direction of DIRECTIONS) {
      test(`${profile} page navigation ${width}px ${direction}`, async ({ page }) => {
        await page.setViewportSize({ width, height: HEIGHT });
        await page.goto('/');
        const appearance = page.getByRole('combobox', {
          name: 'Appearance',
          exact: true,
        });
        await appearance.click();
        await page.getByRole('option', { name: profile, exact: true }).click();
        const region = page.getByRole('region', {
          name: 'Page navigation and actions',
          exact: true,
        });
        await expect(region).toBeVisible();
        if (direction === 'rtl') {
          await region.getByRole('switch', { name: 'Page navigation RTL' }).check();
        }
        const boxes = await region
          .locator('.reacd-page-frame > *')
          .evaluateAll((items) =>
            items.map((item) => {
              const box = item.getBoundingClientRect();
              return { x: box.x, y: box.y };
            }),
          );
        expect(boxes).toHaveLength(3);
        const [left, body, right] = boxes;
        if (!left || !body || !right) throw new Error('Missing page region geometry.');
        if (width === 1440) {
          expect(Math.abs(left.y - body.y)).toBeLessThanOrEqual(TOLERANCE);
          expect(Math.abs(right.y - body.y)).toBeLessThanOrEqual(TOLERANCE);
          expect(left.x < body.x).toBe(direction === 'ltr');
          expect(body.x < right.x).toBe(direction === 'ltr');
        }
        await page.evaluate(() => {
          document.documentElement.style.fontSize = '200%';
        });
        const cta = region.getByLabel('Page CTA draft');
        const draft = region.getByLabel('Three-region page draft');
        await cta.fill('Retained CTA draft');
        await draft.fill('Retained page draft');
        await region.getByRole('button', { name: 'Confirm CTA draft' }).click();
        await expect(region.getByText('Draft confirmed locally')).toBeVisible();
        await region.getByRole('switch', { name: 'Reverse CTA regions' }).check();
        await region.getByRole('switch', { name: 'Show page side regions' }).uncheck();
        await expect(region.getByRole('complementary')).toHaveCount(0);
        await expect(cta).toHaveValue('Retained CTA draft');
        await expect(draft).toHaveValue('Retained page draft');
        const anchor = region.getByRole('link', { name: 'Read anchor target' });
        await anchor.focus();
        await page.keyboard.press('Enter');
        await expect(page).toHaveURL(/#anchor-reference-target$/);
        await expect(
          region.getByRole('heading', { name: 'Anchor reference target' }),
        ).toBeFocused();
        await appearance.click();
        await page
          .getByRole('option', {
            name: profile === 'Compact' ? 'Spacious' : 'Compact',
            exact: true,
          })
          .click();
        await expect(cta).toHaveValue('Retained CTA draft');
        await expect(draft).toHaveValue('Retained page draft');
        const escaped = await region.evaluate((element, tolerance) => {
          const outer = element.getBoundingClientRect();
          return Array.from(
            element.querySelectorAll('input,button,p,a,h1,h2,h3,h4,h5,h6'),
          ).some((item) => {
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
