import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const WIDTHS = [240, 360, 768, 1440];
const HEIGHT = 1000;
const TOLERANCE = 1;
const DESCRIPTION = 'Counts and signed changes by workflow category.';
const MARKS = {
  Line: { mui: '.MuiLineChart-line', shadcn: '.recharts-line-curve' },
  Area: { mui: '.MuiLineChart-area', shadcn: '.recharts-area-area' },
  Bar: { mui: '.MuiBarChart-element', shadcn: '.recharts-rectangle' },
  Donut: { mui: '.MuiPieChart-arc', shadcn: '.recharts-sector' },
};

async function content(page: Page, profile: string) {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Content and data', exact: true }).click();
}

function graph(page: Page, label = 'Reference activity') {
  const role = test.info().project.name === 'mui' ? 'group' : 'img';
  return page.getByRole(role, { name: label, exact: true });
}

function mark(kind: keyof typeof MARKS) {
  return MARKS[kind][test.info().project.name === 'mui' ? 'mui' : 'shadcn'];
}

async function chooseKind(page: Page, kind: keyof typeof MARKS) {
  await page.getByRole('combobox', { name: 'Chart kind', exact: true }).click();
  await page.getByRole('option', { name: kind, exact: true }).click();
  const chart = graph(page);
  await expect(chart).toBeVisible();
  await expect(chart.locator(mark(kind)).first()).toBeVisible();
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
      const chart = graph(page, label);
      await expect(chart).toBeVisible();
      await expect(chart).toHaveAccessibleDescription(DESCRIPTION);
      const traces = chart.locator(mark('Line'));
      await expect(traces).toHaveCount(2);
      await expect(traces.first()).toHaveCSS('stroke', 'rgb(255, 255, 255)');
      const bounds = await chart.boundingBox();
      if (!bounds) throw new Error('Native Chart must have visible bounds.');
      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.x).toBeGreaterThanOrEqual(-TOLERANCE);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width + TOLERANCE);
      const data = page.getByRole('region', { name: `${label} data`, exact: true });
      await data.focus();
      await expect(data).toBeFocused();
      const review = data.getByRole('rowheader', { name: 'Review', exact: true });
      await expect(review).toBeVisible();
      await expect(review).toHaveCSS('color', 'rgb(255, 255, 255)');
      await expect(
        data.getByRole('columnheader', { name: 'Count', exact: true }),
      ).toBeVisible();
      await expect(
        data.getByRole('columnheader', { name: 'Change', exact: true }),
      ).toBeVisible();
      if (test.info().project.name === 'mui') {
        const legend = chart.locator('.MuiChartsLegend-root');
        await expect(legend.getByText('Count', { exact: true })).toBeVisible();
        await expect(legend.getByText('Change', { exact: true })).toBeVisible();
      }
      await contained(page);
    });
  }

  test(`${profile} chart kinds, dataset refresh, zero totals and retry`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await content(page, profile);
    const table = page.getByRole('table', { name: 'Reference activity data' });
    await expect(
      table.getByRole('row', { name: 'Draft 2 -2', exact: true }),
    ).toBeVisible();
    await expect(
      table.getByRole('row', { name: 'Review No value 3', exact: true }),
    ).toBeVisible();
    await expect(
      table.getByRole('row', { name: 'Ready 8 -1', exact: true }),
    ).toBeVisible();
    const initialPath = await graph(page)
      .locator(mark('Line'))
      .first()
      .getAttribute('d');
    if (!initialPath) throw new Error('Expected an actual native line path.');
    await page.getByRole('switch', { name: 'Missing chart values' }).uncheck();
    await expect(
      table.getByRole('row', { name: 'Review 4 3', exact: true }),
    ).toBeVisible();
    await expect(table.getByText('No value', { exact: true })).toHaveCount(0);
    await expect(graph(page).locator(mark('Line')).first()).not.toHaveAttribute(
      'd',
      initialPath,
    );
    for (const kind of ['Area', 'Bar', 'Donut'] as const) await chooseKind(page, kind);
    await page.getByRole('switch', { name: 'Zero chart values' }).check();
    await expect(
      page.getByRole('img', { name: 'Reference activity', exact: true }),
    ).toHaveText('No chart data available.');
    await expect(
      table.getByRole('row', { name: 'Review 0', exact: true }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Preview loading chart' }).click();
    await expect(
      page.getByRole('status').filter({ hasText: 'Loading chart data…' }),
    ).toBeVisible();
    await expect(table).toHaveCount(0);
    await page.getByRole('button', { name: 'Preview failed chart' }).click();
    const failure = page.getByRole('alert').filter({
      hasText: 'Unable to load chart data.',
    });
    const retry = failure.getByRole('button', { name: 'Retry chart' });
    await retry.focus();
    await page.keyboard.press('Enter');
    await expect(failure).toHaveCount(0);
    await expect(table).toBeVisible();
    await page.getByRole('switch', { name: 'Empty chart data' }).check();
    await expect(table).toBeVisible();
    await expect(table.getByRole('rowheader')).toHaveCount(0);
    await expect(
      page.getByRole('status').filter({
        hasText: 'No chart data available.',
      }),
    ).toBeVisible();
    await page.getByRole('switch', { name: 'Empty chart data' }).uncheck();
    await page.getByRole('switch', { name: 'Zero chart values' }).uncheck();
    await chooseKind(page, 'Line');
    await expect(
      table.getByRole('row', { name: 'Review 4 3', exact: true }),
    ).toBeVisible();
    await contained(page);
    expect(errors).toEqual([]);
  });
}
