import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const VIEWPORT = { width: 320, height: 1000 };
const NARROW_WIDTH = 240;
const TOLERANCE = 1;

async function openExample(page: Page, port: number, title: string) {
  const failures: string[] = [];
  page.on('pageerror', (error) => failures.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400)
      failures.push(`${response.status()}: ${response.url()}`);
  });
  await page.setViewportSize(VIEWPORT);
  await page.goto(`http://127.0.0.1:${port}/`);
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  return failures;
}

async function enlargedTextFits(page: Page) {
  await page.setViewportSize({ width: NARROW_WIDTH, height: VIEWPORT.height });
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%';
  });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(NARROW_WIDTH + TOLERANCE);
}

test('standalone counter updates, resets and starts a fresh store on reload', async ({
  page,
}) => {
  const failures = await openExample(page, 4176, 'Counter');
  const increment = page.getByRole('button', { name: 'Increment', exact: true });
  await increment.click();
  await increment.click();
  await expect(page.getByText('Count: 2', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(page.getByText('Count: 0', { exact: true })).toBeVisible();
  await increment.click();
  await enlargedTextFits(page);
  await expect(page.getByText('Count: 1', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('Count: 0', { exact: true })).toBeVisible();
  expect(failures).toEqual([]);
});

test('standalone form validates, saves and clears local contact state', async ({
  page,
}) => {
  const failures = await openExample(page, 4177, 'Contact form');
  const name = page.getByRole('textbox', { name: 'Contact name', exact: true });
  await page.getByRole('button', { name: 'Save contact', exact: true }).click();
  await expect(page.getByText('No contact saved.', { exact: true })).toBeVisible();
  await expect(name).toBeFocused();
  await name.fill('Ada');
  await page.getByRole('button', { name: 'Save contact', exact: true }).click();
  await expect(page.getByText('Saved contact for Ada.', { exact: true })).toBeVisible();
  await enlargedTextFits(page);
  await expect(name).toHaveValue('Ada');
  await page.getByRole('button', { name: 'Clear contact', exact: true }).click();
  await expect(name).toHaveValue('');
  await expect(page.getByText('No contact saved.', { exact: true })).toBeVisible();
  expect(failures).toEqual([]);
});

test('standalone dashboard filters and restores its sample orders', async ({
  page,
}) => {
  const failures = await openExample(page, 4178, 'Orders dashboard');
  const query = page.getByRole('textbox', { name: 'Filter orders', exact: true });
  const openOnly = page.getByRole('switch', { name: 'Open orders only', exact: true });
  await query.fill('ada');
  await expect(page.getByText('Visible orders: 1', { exact: true })).toBeVisible();
  await openOnly.check();
  await expect(page.getByText('Visible orders: 1', { exact: true })).toBeVisible();
  await query.fill('Mina');
  await expect(page.getByText('No matching orders.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
  await expect(query).toHaveValue('');
  await expect(openOnly).not.toBeChecked();
  await expect(page.getByText('Visible orders: 3', { exact: true })).toBeVisible();
  await openOnly.check();
  await enlargedTextFits(page);
  await expect(page.getByText('Visible orders: 2', { exact: true })).toBeVisible();
  expect(failures).toEqual([]);
});
