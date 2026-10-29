import { expect, test } from '@playwright/test';

const WIDTHS = [240, 320, 768, 1440];
const PROFILES = ['Spacious', 'Compact'];
const DIRECTIONS = ['ltr', 'rtl'];
const HEIGHT = 1000;
const TOLERANCE = 1;
const LONG_TITLE = 'unbroken_document_reference_'.repeat(24);

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    for (const direction of DIRECTIONS) {
      test(`${profile} adjacent links ${width}px ${direction}`, async ({ page }) => {
        await page.setViewportSize({ width, height: HEIGHT });
        await page.goto('/');
        await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
        await page.getByRole('option', { name: profile, exact: true }).click();
        await page.getByRole('button', { name: 'Navigation', exact: true }).click();
        if (direction === 'rtl')
          await page.getByRole('switch', { name: 'Right to left navigation' }).check();
        await page.evaluate(() => {
          document.documentElement.style.fontSize = '200%';
        });
        const region = page.getByRole('navigation', { name: 'Adjacent reference' });
        await expect(region).toHaveCSS('direction', direction);
        const input = page.getByLabel('Previous reference title');
        await input.fill(LONG_TITLE);
        const previous = region.getByRole('link', { name: `Previous ${LONG_TITLE}` });
        const next = region.getByRole('link', { name: 'Next Next reference' });
        await expect(previous).toBeVisible();
        await previous.focus();
        await page.keyboard.press('Tab');
        await expect(next).toBeFocused();
        await page.getByRole('switch', { name: 'No adjacent documents' }).check();
        await expect(region.getByRole('link')).toHaveCount(0);
        await expect(region).toHaveText('No adjacent pages.');
        await page.getByRole('switch', { name: 'No adjacent documents' }).uncheck();
        await expect(input).toHaveValue(LONG_TITLE);
        const escaped = await region.evaluate((element, tolerance) => {
          const box = element.getBoundingClientRect();
          return Array.from(element.querySelectorAll('a')).some((link) => {
            const bounds = link.getBoundingClientRect();
            return bounds.left < box.left - tolerance ||
              bounds.right > box.right + tolerance;
          });
        }, TOLERANCE);
        expect(escaped).toBe(false);
        expect(await page.evaluate(() => document.documentElement.scrollWidth))
          .toBeLessThanOrEqual(width + TOLERANCE);
        const [popup] = await Promise.all([
          page.waitForEvent('popup'), next.click(),
        ]);
        await popup.waitForLoadState();
        expect(await popup.evaluate(() => window.opener === null)).toBe(true);
        await popup.close();
        await previous.focus();
        await Promise.all([
          page.waitForEvent('framenavigated', {
            predicate: (frame) => frame === page.mainFrame(),
          }),
          page.keyboard.press('Enter'),
        ]);
        await expect(page.getByRole('heading', { name: 'reacd', exact: true }))
          .toBeVisible();
      });
    }
  }
}
