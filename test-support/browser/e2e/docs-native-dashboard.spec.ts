import { expect, test } from '@playwright/test';
import { expectContained, loadedPreview, watchPageErrors } from '../docs-site.js';

test('native dashboard keeps controlled notes, scoped navigation and search', async ({
  page,
}) => {
  const errors = watchPageErrors(page);
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/components/dashboard-group/');
  const preview = await loadedPreview(page);
  const workspace = preview.getByRole('group', { name: 'Orders workspace' });
  const note = workspace.getByRole('textbox', { name: 'Workspace note' });
  await note.fill('Review the accepted order.');
  await workspace.getByRole('button', { name: 'Collapse navigation' }).click();
  await workspace.getByRole('button', { name: 'Expand workspace' }).click();
  await expect(note).toHaveValue('Review the accepted order.');
  await workspace.getByRole('button', { name: 'Search dashboard' }).click();
  const search = page.getByRole('dialog', { name: 'Workspace search' });
  await search.getByRole('combobox', { name: 'Search workspace' }).fill('orders');
  await search.getByRole('option', { name: 'View orders' }).click();
  await expect(search).toBeHidden();
  await expect(
    workspace.getByRole('heading', { name: 'Orders', exact: true }),
  ).toBeVisible();
  await page.setViewportSize({ width: 375, height: 812 });
  const opener = workspace.getByRole('button', {
    name: 'Open navigation',
    exact: true,
  });
  await expect(opener).toBeVisible();
  const source = page.getByRole('region', { name: 'tsx', exact: true }).first();
  await expect
    .poll(
      async () => {
        const workspaceBox = await workspace.boundingBox();
        const codeBox = await source.boundingBox();
        return (
          workspaceBox !== null &&
          codeBox !== null &&
          workspaceBox.height > 0 &&
          workspaceBox.y + workspaceBox.height <= codeBox.y
        );
      },
      { message: 'The visible dashboard must occupy space before its source.' },
    )
    .toBe(true);
  await opener.click();
  const navigation = page.getByRole('dialog', { name: 'Workspace navigation' });
  await expect(navigation.getByRole('textbox', { name: 'Workspace note' })).toHaveValue(
    'Review the accepted order.',
  );
  await page.keyboard.press('Escape');
  await expect(navigation).toBeHidden();
  await expect(opener).toBeFocused();
  await expectContained(page);
  expect(errors).toEqual([]);
});

test('native splitter applies SDK steps and preserves fields', async ({ page }) => {
  const errors = watchPageErrors(page);
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/components/splitter/');
  const preview = await loadedPreview(page);
  const query = preview.getByRole('textbox', { name: 'Splitter outline query' });
  await query.fill('Reviewed outline');
  const handle = preview.getByRole('separator');
  await handle.focus();
  await page.keyboard.press('ArrowRight');
  await expect(preview.getByText('outline share: 55', { exact: true })).toBeVisible();
  await page.keyboard.press('Shift+ArrowRight');
  await expect(preview.getByText('outline share: 60', { exact: true })).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(handle).toHaveAttribute('aria-valuenow', '0');
  await expect(query.locator('xpath=ancestor::*[@data-panel]')).toHaveAttribute(
    'inert',
  );
  await page.keyboard.press('Enter');
  await expect(handle).toHaveAttribute('aria-valuenow', '60');
  await expect(query.locator('xpath=ancestor::*[@data-panel]')).not.toHaveAttribute(
    'inert',
  );
  await expect(query).toBeVisible();
  await preview.getByRole('switch', { name: 'Vertical splitter' }).check();
  await expect(query).toHaveValue('Reviewed outline');
  await preview.getByRole('switch', { name: 'Disable resizing' }).check();
  await expect(handle).toHaveAttribute('aria-disabled', 'true');
  await expectContained(page);
  expect(errors).toEqual([]);
});
