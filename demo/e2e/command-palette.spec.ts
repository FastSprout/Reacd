import { expect, test } from '@playwright/test';

const WIDTHS = [240, 375, 1440];
const PROFILES = ['Spacious', 'Compact'];
const DIRECTIONS = ['ltr', 'rtl'];
const HEIGHT = 1000;
const TOLERANCE = 1;
const LONG_QUERY = 'Query_without_word_breaks_'.repeat(20);

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    for (const direction of DIRECTIONS) {
      test(`${profile} command palette ${width}px ${direction} at 200%`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: HEIGHT });
        await page.goto('/');
        await page.getByRole('button', { name: 'Navigation', exact: true }).click();
        await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
        await page.getByRole('option', { name: profile, exact: true }).click();
        if (direction === 'rtl') {
          await page.getByRole('switch', { name: 'Right to left navigation' }).check();
        }
        await page.evaluate(() => {
          document.documentElement.style.fontSize = '200%';
        });
        const input = page.getByRole('combobox', { name: 'Sample command search' });
        await input.fill('account');
        await expect(
          page.getByRole('option', { name: /Open profile locally/ }),
        ).toBeVisible();
        await input.press('ArrowDown');
        await input.press('Enter');
        await expect(page.getByText('Profile opened locally.')).toBeVisible();
        await expect(input).toHaveValue('account');
        await input.fill('documentation');
        await page.getByRole('switch', { name: 'Veto command activation' }).check();
        const docs = page.getByRole('option', {
          name: 'Inspect documentation locally',
        });
        await docs.click();
        await expect(page.getByText('Selected command: profile')).toBeVisible();
        await page.getByRole('switch', { name: 'Veto command activation' }).uncheck();
        await docs.click();
        await expect(page.getByText('Documentation inspected locally.')).toBeVisible();
        await input.fill(LONG_QUERY);
        const section = page.getByRole('region', { name: 'Command palette preview' });
        await expect(section.getByRole('status')).toHaveText('No matching commands.');
        for (const status of ['Loading', 'Error', 'Ready']) {
          await page.getByRole('combobox', { name: 'Command result status' }).click();
          await page.getByRole('option', { name: status, exact: true }).click();
          if (status === 'Error') {
            await expect(section.getByRole('alert')).toHaveText(
              'Commands could not be loaded.',
            );
          }
        }
        await page
          .getByRole('switch', { name: 'Host-filtered command results' })
          .check();
        await expect(section.getByRole('option')).toHaveCount(3);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(width + TOLERANCE);
      });
    }
  }
}
