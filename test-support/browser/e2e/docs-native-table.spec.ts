import { expect, test } from '@playwright/test';
import { expectContained, loadedPreview, watchPageErrors } from '../docs-site.js';

for (const width of [375, 1920]) {
  test(`native table announces paging and request states at ${width}px`, async ({
    page,
  }) => {
    const errors = watchPageErrors(page);
    await page.setViewportSize({ width, height: 1080 });
    await page.goto('/components/table/');
    const preview = await loadedPreview(page);
    await preview.getByRole('button', { name: 'Next page' }).click();
    await expect(preview.getByRole('status')).toHaveText('Page 2 of 3');
    await preview.getByRole('button', { name: 'Sort Amount' }).click();
    await expect(preview.getByRole('status')).toHaveText('Page 1 of 3');
    await expect(preview.getByRole('columnheader', { name: 'Amount' }))
      .toHaveAttribute('aria-sort', 'descending');
    await preview.getByRole('button', { name: 'Preview loading table' }).click();
    await expect(preview.getByRole('status')).toHaveText('Loading data…');
    await expect(preview.getByRole('button', { name: 'Next page' })).toBeDisabled();
    await preview.getByRole('button', { name: 'Preview failed table' }).click();
    await expect(preview.getByRole('alert')).toHaveText('Unable to load data.');
    await preview.getByRole('button', { name: 'Retry table' }).click();
    await expect(preview.getByRole('table', { name: 'Reference orders' }))
      .toBeVisible();
    await expectContained(page);
    expect(errors).toEqual([]);
  });
}
