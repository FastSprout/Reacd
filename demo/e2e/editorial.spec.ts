import { expect, test } from '@playwright/test';

const WIDTHS = [240, 320, 768, 1440];
const PROFILES = ['Spacious', 'Compact'];
const DIRECTIONS = ['ltr', 'rtl'];
const HEIGHT = 1000;
const TOLERANCE = 1;

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    for (const direction of DIRECTIONS) {
      test(`${profile} editorial ${width}px ${direction} at 200%`, async ({ page }) => {
        await page.setViewportSize({ width, height: HEIGHT });
        await page.goto('/');
        const appearance = page.getByRole('combobox', {
          name: 'Appearance',
          exact: true,
        });
        await appearance.click();
        await page.getByRole('option', { name: profile, exact: true }).click();
        const region = page.getByRole('region', {
          name: 'Editorial page components',
          exact: true,
        });
        await expect(region).toBeVisible();
        if (direction === 'rtl') {
          await region.getByRole('switch', { name: 'Editorial RTL' }).check();
        }
        await page.evaluate(() => {
          document.documentElement.style.fontSize = '200%';
        });
        const media = region.getByRole('img', {
          name: 'Unavailable editorial image placeholder',
        });
        await media.scrollIntoViewIfNeeded();
        await expect(media).toHaveText(/Image unavailable/);
        const mediaBox = await media.boundingBox();
        expect(mediaBox?.width).toBeGreaterThan(0);
        expect(mediaBox?.height).toBeGreaterThan(0);
        const draft = region.getByLabel('Blog post draft');
        await draft.fill('Retained editorial draft');
        await region
          .getByRole('button', { name: 'Inspect illustrative article' })
          .click();
        await expect(
          region.getByText('Article inspected', { exact: true }),
        ).toBeVisible();
        await region
          .getByRole('button', { name: 'Review illustrative version' })
          .click();
        await expect(
          region.getByText('Version reviewed', { exact: true }),
        ).toBeVisible();
        await region.getByRole('switch', { name: 'Vertical blog collection' }).check();
        await region
          .getByRole('switch', { name: 'Version indicator', exact: true })
          .uncheck();
        await region
          .getByRole('switch', { name: 'Collection version indicators' })
          .check();
        await expect(
          region.getByRole('article', { name: 'Review illustrative version' }),
        ).toHaveAttribute('data-indicator', 'false');
        await expect(
          region.getByRole('article', { name: 'Illustrative version record' }),
        ).toHaveAttribute('data-indicator', 'true');
        const title = region.getByRole('button', {
          name: 'Inspect illustrative article',
        });
        await title.focus();
        await page.keyboard.press('Tab');
        await expect(draft).toBeFocused();
        if (profile === 'Compact' && width === 320 && direction === 'rtl') {
          await region.getByRole('article', { name: 'Inspect illustrative article' })
            .screenshot({ path: '.cache/editorial-Compact-320-rtl.png' });
        }
        await appearance.click();
        await page
          .getByRole('option', {
            name: profile === 'Compact' ? 'Spacious' : 'Compact',
            exact: true,
          })
          .click();
        await expect(draft).toHaveValue('Retained editorial draft');
        const escaped = await region.evaluate((element, tolerance) => {
          const outer = element.getBoundingClientRect();
          return Array.from(
            element.querySelectorAll('input,button,p,a,time,h1,h2,h3,h4,h5,h6'),
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
