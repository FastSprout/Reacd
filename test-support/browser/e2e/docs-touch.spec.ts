import { expect, test } from '@playwright/test';
import { expectContained, loadedPreview, watchPageErrors } from '../docs-site.js';

test('emulated phone navigation filters links and restores focus', async ({
  page,
  isMobile,
}) => {
  expect(isMobile).toBe(true);
  const errors = watchPageErrors(page);
  await page.goto('/components/button/');
  await loadedPreview(page);
  const trigger = page.getByRole('button', { name: 'Open navigation', exact: true });
  await trigger.tap();
  const menu = page.getByRole('dialog', { name: 'reacd', exact: true });
  await expect(menu).toBeVisible();
  await menu
    .getByRole('textbox', { name: 'Filter navigation', exact: true })
    .fill('Grid');
  await expect(menu.getByRole('link', { name: 'Grid', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.tap();
  await menu.getByRole('button', { name: 'Close navigation', exact: true }).tap();
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
  await page.getByRole('button', { name: 'Request export', exact: true }).tap();
  await expect(page.getByText('Export requests: 1', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Toggle dark appearance' }).tap();
  await expect(page.getByText('Export requests: 1', { exact: true })).toBeVisible();
  await expectContained(page);
  await trigger.tap();
  await menu.getByRole('link', { name: 'Grid', exact: true }).tap();
  await expect(page).toHaveURL(/\/components\/grid\/$/);
  await expect(
    page.getByRole('heading', { name: 'Grid', level: 1, exact: true }),
  ).toBeVisible();
  await expect(menu).toBeHidden();
  expect(errors).toEqual([]);
});

test('emulated phone theme choices persist without resetting the example', async ({
  page,
  isMobile,
}) => {
  expect(isMobile).toBe(true);
  const errors = watchPageErrors(page);
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/examples/counter/');
  await loadedPreview(page);
  const increment = page.getByRole('button', { name: 'Increment', exact: true });
  await increment.tap();
  const opener = page.getByRole('button', { name: 'Customize theme' });
  await opener.tap();
  const dialog = page.getByRole('dialog', { name: 'Customize theme' });
  await dialog.getByRole('combobox', { name: 'Primary color' }).tap();
  await page.getByRole('option', { name: 'Blue', exact: true }).tap();
  await expect(dialog.getByRole('combobox', { name: 'Primary color' }))
    .toHaveText('Blue');
  await dialog.getByRole('button', { name: 'Close', exact: true }).tap();
  await expect(page.getByText('Count: 1', { exact: true })).toBeVisible();
  await expect(increment).toHaveCSS('background-color', 'rgb(96, 165, 250)');
  await expectContained(page);
  await page.reload();
  await loadedPreview(page);
  await expect(increment).toHaveCSS('background-color', 'rgb(96, 165, 250)');
  await opener.tap();
  await expect(dialog.getByRole('combobox', { name: 'Primary color' }))
    .toHaveText('Blue');
  await dialog.getByRole('button', { name: 'Close', exact: true }).tap();
  await expectContained(page);
  expect(errors).toEqual([]);
});
