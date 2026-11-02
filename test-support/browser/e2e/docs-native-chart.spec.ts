import { expect, test } from '@playwright/test';
import { expectContained, loadedPreview, watchPageErrors } from '../docs-site.js';

for (const width of [375, 1920]) {
  test(`native chart preview at ${width}px`, async ({ page }) => {
    const errors = watchPageErrors(page);
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/components/chart/');
    const preview = await loadedPreview(page);
    const plot = preview.getByRole('img', { name: 'Monthly sales', exact: true });
    await expect(plot).toBeVisible();
    await expect(plot).toHaveAccessibleDescription(
      'Completed orders during the first quarter.',
    );
    const bars = plot.locator('.recharts-bar-rectangle path');
    await expect(bars).toHaveCount(3);
    for (const bar of await bars.all()) {
      await expect(bar).toBeVisible();
      const box = await bar.boundingBox();
      if (box === null) throw new Error('A chart bar has no rendered geometry.');
      expect(box.width).toBeGreaterThan(0);
      expect(box.height).toBeGreaterThan(0);
    }
    const table = preview.getByRole('table', { name: 'Monthly sales data' });
    await expect(table.getByRole('row', { name: 'January 24' })).toBeVisible();
    await expect(table.getByRole('row', { name: 'February 31' })).toBeVisible();
    await expect(table.getByRole('row', { name: 'March 28' })).toBeVisible();
    const scroll = preview.getByRole('region', { name: 'Monthly sales data' });
    await scroll.focus();
    await expect(scroll).toBeFocused();
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });
    await expectContained(page);
    expect(errors).toEqual([]);
  });
}
