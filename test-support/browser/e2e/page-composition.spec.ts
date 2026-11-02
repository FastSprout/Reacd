import { expect, test } from '@playwright/test';
import { hasInlineOverflow } from '../inline-overflow.js';
import type { Locator, Page } from '@playwright/test';

const WIDTHS = [240, 320, 768, 1440];
const PROFILES = ['Spacious', 'Compact'];
const DIRECTIONS = ['ltr', 'rtl'];
const HEIGHT = 1000;
const TOLERANCE = 1;
const WIDE_ASIDE_WIDTH = { mui: 900, shadcn: 768 };
const WIDE_GEOMETRY_WIDTH = 1440;

async function appearance(page: Page, profile: string) {
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
}

async function geometry(items: Locator) {
  return items.evaluateAll((elements) =>
    elements.map((element) => {
      const card = element.closest('.MuiCard-root, .bg-card');
      if (!card) throw new Error('Expected the selected SDK Card for this action.');
      const box = card.getBoundingClientRect();
      return { x: box.x, y: box.y, width: box.width, height: box.height };
    }),
  );
}

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    for (const direction of DIRECTIONS) {
      test(`${profile} page flow ${width}px ${direction} at 200%`, async ({ page }) => {
        await page.setViewportSize({ width, height: HEIGHT });
        await page.goto('/');
        await appearance(page, profile);
        const region = page.getByRole('region', {
          name: 'Page composition',
          exact: true,
        });
        await expect(region).toBeVisible();
        if (direction === 'rtl')
          await page.getByRole('switch', { name: 'Page composition RTL' }).check();
        await expect(region).toHaveCSS('direction', direction);
        const bodyQuery = page.getByLabel('Page body query', { exact: true });
        const listQuery = page.getByLabel('Page list query', { exact: true });
        await bodyQuery.fill('Retained body state');
        await listQuery.fill('Retained list state');
        await page.getByRole('switch', { name: 'Divide page list' }).check();
        await expect(region.getByRole('list').getByRole('separator')).toHaveCount(2);
        await expect(region.getByRole('listitem')).toHaveCount(3);
        await appearance(page, profile === 'Compact' ? 'Spacious' : 'Compact');
        await appearance(page, profile);
        await expect(bodyQuery).toHaveValue('Retained body state');
        await expect(listQuery).toHaveValue('Retained list state');
        await page.evaluate((dir) => {
          document.documentElement.dir = dir;
          document.documentElement.style.fontSize = '200%';
        }, direction);
        const aside = page.getByRole('complementary', {
          name: 'Page composition navigation',
        });
        await expect(aside).toBeVisible();
        await expect(aside).toHaveCSS(
          'position',
          width >=
            WIDE_ASIDE_WIDTH[test.info().project.name === 'mui' ? 'mui' : 'shadcn']
            ? 'sticky'
            : 'static',
        );
        const flow = await geometry(
          region.getByRole('button', { name: /^Inspect flow / }),
        );
        const grid = await geometry(
          region.getByRole('button', { name: /^Inspect grid / }),
        );
        expect(flow).toHaveLength(6);
        expect(grid).toHaveLength(6);
        const flowColumns = new Set(flow.map((item) => Math.round(item.x))).size;
        const gridColumns = new Set(grid.map((item) => Math.round(item.x))).size;
        for (const count of [flowColumns, gridColumns]) {
          expect(count).toBeGreaterThanOrEqual(1);
          expect(count).toBeLessThanOrEqual(3);
        }
        if (width === WIDE_GEOMETRY_WIDTH) {
          expect(flowColumns).toBeGreaterThan(1);
          expect(gridColumns).toBeGreaterThan(1);
          const [firstFlow, secondFlow] = flow;
          const [firstGrid, secondGrid] = grid;
          if (!firstFlow || !secondFlow || !firstGrid || !secondGrid)
            throw new Error('Missing page layout geometry.');
          expect(Math.abs(firstFlow.x - secondFlow.x)).toBeLessThanOrEqual(TOLERANCE);
          expect(secondFlow.y).toBeGreaterThan(firstFlow.y);
          expect(Math.abs(firstGrid.y - secondGrid.y)).toBeLessThanOrEqual(TOLERANCE);
          expect(Math.abs(firstGrid.x - secondGrid.x)).toBeGreaterThan(TOLERANCE);
        }
        for (const kind of ['flow', 'grid']) {
          const first = page.getByRole('button', { name: `Inspect ${kind} first` });
          await first.focus();
          await page.keyboard.press('Tab');
          await expect(
            page.getByRole('button', {
              name: `Inspect ${kind} second`,
            }),
          ).toBeFocused();
          await first.click();
          await expect(page.getByText(`Selected ${kind}: First`)).toBeVisible();
        }
        const escaped = await region.evaluate(hasInlineOverflow, {
          selectors: 'input,button,p,a,li',
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
