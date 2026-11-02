import { hasInlineOverflow } from '../inline-overflow.js';
import { expect, test } from '@playwright/test';

const WIDTHS = [240, 320, 768, 1440];
const PROFILES = ['Spacious', 'Compact'];
const DIRECTIONS = ['ltr', 'rtl'];
const HEIGHT = 1000;
const TOLERANCE = 1;
const HERO_TITLE = 'PageHeroRetainsReadableLongUnbrokenContentAcrossNarrowScreens';

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    for (const direction of DIRECTIONS) {
      test(`${profile} page presentation ${width}px ${direction} 200%`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: HEIGHT });
        await page.goto('/');
        const appearance = page.getByRole('combobox', {
          name: 'Appearance',
          exact: true,
        });
        await appearance.click();
        await page.getByRole('option', { name: profile, exact: true }).click();
        const region = page.getByRole('region', {
          name: 'Page presentation',
          exact: true,
        });
        await expect(region).toBeVisible();
        if (direction === 'rtl') {
          await region.getByRole('switch', { name: 'Page presentation RTL' }).check();
        }
        await page.evaluate(() => {
          document.documentElement.style.fontSize = '200%';
        });
        await region.getByRole('button', { name: 'Inspect feature details' }).click();
        await expect(
          region.getByText('Feature inspected', { exact: true }),
        ).toBeVisible();
        await region
          .getByRole('button', { name: 'Toggle feature explanation' })
          .click();
        await expect(region.getByText('Feature explanation expanded')).toBeVisible();
        const card = region.getByLabel('Page card draft');
        const hero = region.getByLabel('Page hero draft');
        await card.fill('Retained card');
        await hero.fill('Retained hero');
        const material = test.info().project.name === 'mui';
        const heading = region.getByRole('heading', {
          name: HERO_TITLE,
          exact: true,
        });
        const copy = heading.locator(material ? '../..' : '..');
        const columns = copy.locator('..');
        const content = columns.locator(':scope > *').filter({
          has: page.getByLabel('Page hero draft'),
        });
        const heroSurface = columns.locator('..');
        await expect(copy).toHaveCount(1);
        await expect(content).toHaveCount(1);
        const copyBox = await copy.boundingBox();
        const contentBox = await content.boundingBox();
        if (copyBox === null || contentBox === null) {
          throw new Error('Hero regions must have measurable geometry.');
        }
        if (width === 1440) {
          expect(Math.abs(copyBox.y - contentBox.y)).toBeLessThanOrEqual(TOLERANCE);
          expect(Math.abs(copyBox.x - contentBox.x)).toBeGreaterThan(TOLERANCE);
          expect(copyBox.x > contentBox.x).toBe(direction === 'rtl');
        } else {
          expect(contentBox.y).toBeGreaterThanOrEqual(copyBox.y + copyBox.height);
        }
        if (
          (width === 320 && direction === 'rtl') ||
          (width === 1440 && direction === 'ltr')
        ) {
          await heroSurface.screenshot({
            path: `.cache/page-presentation-${profile}-${width}-${direction}.png`,
          });
        }
        await region.getByRole('switch', { name: 'Reverse hero regions' }).check();
        await region
          .getByRole('switch', { name: 'Horizontal hero preference' })
          .uncheck();
        await expect(card).toHaveValue('Retained card');
        await expect(hero).toHaveValue('Retained hero');
        const reversedCopy = await copy.boundingBox();
        const reversedContent = await content.boundingBox();
        if (!reversedCopy || !reversedContent)
          throw new Error('Expected retained native hero regions.');
        expect(reversedContent.y + reversedContent.height).toBeLessThanOrEqual(
          reversedCopy.y + TOLERANCE,
        );
        const title = region.getByRole('button', { name: 'Inspect feature details' });
        await title.focus();
        await page.keyboard.press('Tab');
        await expect(
          region.getByRole('button', { name: 'Toggle feature explanation' }),
        ).toBeFocused();
        await appearance.click();
        await page
          .getByRole('option', {
            name: profile === 'Compact' ? 'Spacious' : 'Compact',
            exact: true,
          })
          .click();
        await expect(card).toHaveValue('Retained card');
        await expect(hero).toHaveValue('Retained hero');
        const escaped = await region.evaluate(hasInlineOverflow, {
          selectors: 'input,button,p,a,h1,h2,h3,h4,h5,h6',
          tolerance: TOLERANCE,
        });
        expect(escaped).toBe(false);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(width + TOLERANCE);
      });
    }
  }
}
