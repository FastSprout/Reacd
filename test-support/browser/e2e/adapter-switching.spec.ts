import { expect, test } from '@playwright/test';

test('changes the complete preview adapter without losing Jotai state', async ({
  page,
}) => {
  await page.goto(
    'http://127.0.0.1:4175/assets/previews/docs-preview.html?component=Button',
  );
  const adapter = page.getByRole('switch', { name: 'Material UI preview' });
  await adapter.uncheck();
  await page.getByRole('button', { name: 'Request export' }).click();
  await expect(page.getByText('Export requests: 1')).toBeVisible();
  await adapter.check();
  const button = page.getByRole('button', { name: 'Request export' });
  await expect(button).toHaveClass(/MuiButton-root/);
  await expect(page.getByText('Export requests: 1')).toBeVisible();
  await page.getByRole('switch', { name: 'Compact preview' }).check();
  await expect(button).toHaveClass(/MuiButton-sizeSmall/);
  await page.getByRole('switch', { name: 'Right to left preview' }).check();
  await expect(page.locator('.reacd-app')).toHaveAttribute('dir', 'rtl');
  await button.click();
  await expect(page.getByText('Export requests: 2')).toBeVisible();
  await adapter.uncheck();
  await expect(page.getByText('Export requests: 2')).toBeVisible();
});

test('uses a nested Material theme independently of its outer template', async ({
  page,
}) => {
  await page.goto(
    'http://127.0.0.1:4175/assets/previews/docs-preview.html?' +
      'component=Theme&adapter=mui',
  );
  const button = page.getByRole('button', { name: 'Run scoped action' });
  await expect(button).toHaveClass(/MuiButton-sizeSmall/);
  await page.getByRole('switch', { name: 'Compact preview' }).check();
  await expect(button).toHaveClass(/MuiButton-sizeSmall/);
  await button.click();
  await expect(page.getByText('Scoped actions: 1')).toBeVisible();
});
