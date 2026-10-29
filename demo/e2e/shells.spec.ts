import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const WIDTHS = [240, 320, 768, 1440];
const PROFILES = ['Spacious', 'Compact'];
const DIRECTIONS = ['ltr', 'rtl'];
const HEIGHT = 1000;
const TOLERANCE = 1;
const LONG_TITLE = 'Long_unbroken_header_title_'.repeat(12);

async function select(page: Page, name: string, option: string) {
  await page.getByRole('combobox', { name, exact: true }).click();
  await page.getByRole('option', { name: option, exact: true }).click();
}

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    for (const direction of DIRECTIONS) {
      test(`${profile} shells ${width}px ${direction} at 200%`, async ({ page }) => {
        await page.setViewportSize({ width, height: HEIGHT });
        await page.goto('/');
        await select(page, 'Appearance', profile);
        await expect(
          page.getByRole('heading', { name: 'Application shells' }),
        ).toBeVisible();
        await expect(page.getByRole('main')).toHaveCount(1);
        await page.getByLabel('Header title', { exact: true }).fill(LONG_TITLE);
        await page.evaluate((dir) => {
          document.documentElement.dir = dir;
          document.documentElement.style.fontSize = '200%';
        }, direction);
        for (const mode of ['Modal', 'Slideover', 'Drawer']) {
          await select(page, 'Header menu mode', mode);
          const toggle = page
            .getByRole('region', { name: 'Application shells', exact: true })
            .getByRole('button', { name: 'Open navigation', exact: true });
          await toggle.click();
          const dialog = page.getByRole('dialog', { name: LONG_TITLE });
          await expect(dialog).toBeVisible();
          await expect(dialog).toHaveAttribute('data-mode', mode.toLowerCase());
          const box = await dialog.boundingBox();
          if (box === null) throw new Error('Menu geometry is unavailable.');
          if (mode === 'Slideover') {
            const edge = direction === 'rtl' ? box.x : width - box.x - box.width;
            expect(Math.abs(edge)).toBeLessThanOrEqual(TOLERANCE);
            expect(Math.abs(box.y)).toBeLessThanOrEqual(TOLERANCE);
          } else if (mode === 'Drawer') {
            expect(Math.abs(box.x)).toBeLessThanOrEqual(TOLERANCE);
            expect(Math.abs(box.width - width)).toBeLessThanOrEqual(TOLERANCE);
            expect(Math.abs(box.y + box.height - HEIGHT)).toBeLessThanOrEqual(
              TOLERANCE,
            );
          } else {
            expect(Math.abs(box.x - (width - box.x - box.width))).toBeLessThanOrEqual(
              TOLERANCE,
            );
            expect(box.y).toBeGreaterThan(0);
          }
          const destination = dialog.getByRole('link', {
            name: 'Component documentation',
          });
          await expect(destination).toBeFocused();
          await page.keyboard.press('Shift+Tab');
          await expect(
            dialog.getByRole('button', { name: 'Close navigation' }),
          ).toBeFocused();
          await page.keyboard.press('Tab');
          await expect(destination).toBeFocused();
          const escaped = await dialog.evaluate((element, tolerance) => {
            const outer = element.getBoundingClientRect();
            return Array.from(element.querySelectorAll('a,button,h2,p')).some(
              (child) => {
                const box = child.getBoundingClientRect();
                return (
                  box.width > 0 &&
                  (box.left < outer.left - tolerance ||
                    box.right > outer.right + tolerance)
                );
              },
            );
          }, TOLERANCE);
          expect(escaped).toBe(false);
          await page.keyboard.press('Escape');
          await expect(page.getByRole('dialog')).toHaveCount(0);
          await expect(toggle).toBeFocused();
        }
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(width + TOLERANCE);
      });
    }
  }
}
