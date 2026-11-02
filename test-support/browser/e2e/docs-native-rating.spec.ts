import { expect, test } from '@playwright/test';
import { chooseAdapter, expectContained, loadedPreview, watchPageErrors } from
  '../docs-site.js';

test('native rating retains host state across explicit SDK selection', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  const errors = watchPageErrors(page);
  await page.goto('/components/input-rating/');
  const preview = await loadedPreview(page);
  const slider = preview.getByRole('slider', { name: 'Service rating' });
  await slider.focus();
  await page.keyboard.press('ArrowRight');
  await expect(preview.getByText('Selected rating: 3', { exact: true })).toBeVisible();
  await chooseAdapter(page, 'Material UI');
  const group = preview.getByRole('group', { name: 'Service rating' });
  await expect(group.getByRole('radio', { name: '3 Stars', exact: true }))
    .toBeChecked();
  const next = group.getByRole('radio', { name: '4 Stars', exact: true });
  await next.focus();
  await page.keyboard.press('Space');
  await expect(preview.getByText('Selected rating: 4', { exact: true })).toBeVisible();
  await preview.getByRole('button', { name: 'Clear Service rating' }).click();
  await expect(preview.getByText('Selected rating: 0', { exact: true })).toBeVisible();
  await chooseAdapter(page, 'shadcn/ui');
  await expect(slider).toHaveAttribute('aria-valuenow', '0');
  await expectContained(page);
  expect(errors).toEqual([]);
});
