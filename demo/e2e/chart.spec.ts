import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
const WIDTHS = [240, 360, 768, 1440];
const HEIGHT = 1000;
const TOLERANCE = 1;
async function content(page: Page, profile: string) {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Content and data', exact: true }).click();
}
async function contained(page: Page) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual((await page.evaluate(() => innerWidth)) + TOLERANCE);
}
for (const profile of ['Spacious', 'Compact']) {
  for (const width of WIDTHS) {
    test(`${profile} chart ${width}px, 200%, RTL and inverted template`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await content(page, profile);
      const label = 'LongCategory'.repeat(12);
      await page.getByRole('textbox', { name: 'Chart label' }).fill(label);
      await page.getByRole('switch', { name: 'Right to left chart' }).check();
      await page.getByRole('switch', { name: 'Inverted chart template' }).check();
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      const chart = page.getByRole('img', { name: label, exact: true });
      await expect(chart).toBeVisible();
      await expect(chart).toHaveAccessibleDescription(
        'Counts and signed changes by workflow category.',
      );
      await expect(chart).toHaveCSS('color', 'rgb(255, 255, 255)');
      await expect(chart.locator('[data-series] path').first()).toHaveCSS(
        'stroke',
        'rgb(255, 255, 255)',
      );
      const data = page.getByRole('region', { name: `${label} data`, exact: true });
      await data.focus();
      await expect(data).toBeFocused();
      await expect(
        data.getByRole('rowheader', { name: 'Review', exact: true }),
      ).toBeVisible();
      await contained(page);
    });
  }
  test(`${profile} chart kinds, missing data, zero totals and retry`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await content(page, profile);
    const table = page.getByRole('table', { name: 'Reference activity data' });
    await expect(table.getByText('No value', { exact: true })).toBeVisible();
    await expect(table.getByText('-2', { exact: true })).toBeVisible();
    for (const kind of ['Area', 'Bar', 'Donut']) {
      await page.getByRole('combobox', { name: 'Chart kind', exact: true }).click();
      await page.getByRole('option', { name: kind, exact: true }).click();
      await expect(page.getByRole('img', { name: 'Reference activity' })).toBeVisible();
    }
    await page.getByRole('switch', { name: 'Zero chart values' }).check();
    await expect(page.getByRole('img', { name: 'Reference activity' })).toHaveCount(0);
    await expect(table).toBeVisible();
    await page.getByRole('button', { name: 'Preview loading chart' }).click();
    await expect(page.getByText('Loading chart data…', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Preview failed chart' }).click();
    await page.getByRole('button', { name: 'Retry chart' }).click();
    await expect(table).toBeVisible();
    await page.getByRole('switch', { name: 'Empty chart data' }).check();
    await expect(table).toHaveCount(0);
    await contained(page);
    expect(errors).toEqual([]);
  });
}
