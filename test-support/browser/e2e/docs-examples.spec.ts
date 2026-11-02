import { expect, test } from '@playwright/test';
import { chooseAdapter, loadedPreview, watchPageErrors } from '../docs-site.js';

test('the counter state survives explicit native SDK changes', async ({ page }) => {
  const errors = watchPageErrors(page);
  await page.goto('/examples/counter/');
  const preview = await loadedPreview(page);
  await preview.getByRole('button', { name: 'Increment', exact: true }).click();
  await expect(preview.getByText('Count: 1', { exact: true })).toBeVisible();
  await chooseAdapter(page, 'Material UI');
  await expect(
    preview.getByRole('button', { name: 'Increment', exact: true }),
  ).toHaveClass(/MuiButton-root/);
  await expect(preview.getByText('Count: 1', { exact: true })).toBeVisible();
  await chooseAdapter(page, 'shadcn/ui');
  await expect(preview.getByText('Count: 1', { exact: true })).toBeVisible();
  await preview.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(preview.getByText('Count: 0', { exact: true })).toBeVisible();
  await expect(page.getByRole('region', { name: 'tsx', exact: true })).toContainText(
    'export function CounterExample()',
  );
  expect(errors).toEqual([]);
});

test('native form validation and values survive explicit adapter changes', async ({
  page,
}) => {
  const errors = watchPageErrors(page);
  await page.goto('/examples/contact-form/');
  const preview = await loadedPreview(page);
  const name = preview.getByRole('textbox', { name: 'Contact name', exact: true });
  await preview.getByRole('button', { name: 'Save contact', exact: true }).click();
  await expect(name).toBeFocused();
  await expect(preview.getByText('No contact saved.', { exact: true })).toBeVisible();
  await name.fill('Ada');
  await chooseAdapter(page, 'Material UI');
  await expect(name).toHaveValue('Ada');
  await preview.getByRole('button', { name: 'Save contact', exact: true }).click();
  await expect(
    preview.getByText('Saved contact for Ada.', { exact: true }),
  ).toBeVisible();
  await preview.getByRole('button', { name: 'Clear contact', exact: true }).click();
  await expect(name).toHaveValue('');
  expect(errors).toEqual([]);
});

test('the orders dashboard combines filters without losing declared data', async ({
  page,
}) => {
  await page.goto('/examples/orders-dashboard/');
  const preview = await loadedPreview(page);
  await preview.getByRole('switch', { name: 'Open orders only', exact: true }).click();
  await expect(preview.getByText('Visible orders: 2', { exact: true })).toBeVisible();
  await preview
    .getByRole('textbox', { name: 'Filter orders', exact: true })
    .fill('Mina');
  await expect(preview.getByText('No matching orders.', { exact: true })).toBeVisible();
  await chooseAdapter(page, 'Material UI');
  await expect(
    preview.getByRole('textbox', { name: 'Filter orders', exact: true }),
  ).toHaveValue('Mina');
  await preview.getByRole('button', { name: 'Clear filters', exact: true }).click();
  await expect(preview.getByText('Visible orders: 3', { exact: true })).toBeVisible();
});

test('nested Material themes stay compact across appearance', async ({ page }) => {
  const errors = watchPageErrors(page);
  await page.goto('/components/theme/');
  await loadedPreview(page);
  await chooseAdapter(page, 'Material UI');
  const action = page.getByRole('button', { name: 'Run scoped action', exact: true });
  await expect(action).toHaveClass(/MuiButton-sizeSmall/);
  await action.click();
  await expect(page.getByText('Scoped actions: 1', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Toggle dark appearance' }).click();
  await expect(action).toHaveClass(/MuiButton-sizeSmall/);
  await expect(page.getByText('Scoped actions: 1', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});
