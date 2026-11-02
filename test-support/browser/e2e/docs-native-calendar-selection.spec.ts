import { expect, test } from '@playwright/test';
import { expectContained, loadedPreview, watchPageErrors } from '../docs-site.js';

const MINIMUM_CALENDAR_DAY_PX = 44;

for (const width of [375, 1920]) {
  test(`native calendar days and focus at ${width}px`, async ({ page }) => {
    const errors = watchPageErrors(page);
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/components/calendar/');
    const preview = await loadedPreview(page);
    const grid = preview.getByRole('region', { name: 'Delivery calendar grid' });
    const sunday = preview.getByRole('button', { name: /November 8, 2026/ });
    const bounds = await grid.boundingBox();
    const dayBounds = await sunday.boundingBox();
    if (!bounds || !dayBounds) throw new Error('Expected visible native calendar.');
    expect(dayBounds.width).toBeGreaterThanOrEqual(MINIMUM_CALENDAR_DAY_PX);
    expect(dayBounds.height).toBeGreaterThanOrEqual(MINIMUM_CALENDAR_DAY_PX);
    expect(dayBounds.x + dayBounds.width).toBeLessThanOrEqual(bounds.x + bounds.width);
    const day = preview.getByRole('button', { name: /November 16, 2026/ });
    await day.click();
    await expect(preview.getByText('Delivery day: 2026-11-16', { exact: true }))
      .toBeVisible();
    await day.focus();
    await page.keyboard.press('ArrowRight');
    const next = preview.getByRole('button', { name: /November 17, 2026/ });
    await expect(next).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(preview.getByText('Delivery day: 2026-11-17', { exact: true }))
      .toBeVisible();
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    await expectContained(page);
    expect(errors).toEqual([]);
  });

  test(`native searchable selection at ${width}px`, async ({ page }) => {
    const errors = watchPageErrors(page);
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/components/select-menu/');
    const preview = await loadedPreview(page);
    const trigger = preview.getByRole('combobox', { name: 'Assignee', exact: true });
    await trigger.click();
    const query = page.getByRole('combobox', { name: 'Search Assignee' });
    await expect(query).toBeFocused();
    await query.fill('Leo');
    const option = page.getByRole('option', { name: 'Leo Martin' });
    await expect(option).toBeVisible();
    await expect(page.getByRole('option', { name: 'Maya Patel' })).toHaveCount(0);
    await query.press('ArrowDown');
    await query.press('Enter');
    await expect(trigger).toHaveText('Leo Martin');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await trigger.click();
    await expect(query).toHaveValue('Leo');
    await expect(option).toHaveAttribute('aria-selected', 'true');
    await expect(query).toBeFocused();
    await query.press('Escape');
    await expect(trigger).toBeFocused();
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    await expectContained(page);
    expect(errors).toEqual([]);
  });
}
