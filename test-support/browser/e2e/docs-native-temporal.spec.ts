import { expect, test } from '@playwright/test';
import { expectContained, loadedPreview, watchPageErrors } from '../docs-site.js';

const examples = [
  {
    route: 'input-date',
    label: 'Delivery date',
    segment: 'day, Delivery date',
    result: 'Delivery date: 2026-11-17',
    empty: 'Choose a delivery date.',
  },
  {
    route: 'input-time',
    label: 'Meeting time',
    segment: 'hour, Meeting time',
    result: 'Meeting time: 10:00:00',
    empty: 'Choose a meeting time.',
  },
];

for (const width of [375, 1920]) {
  for (const example of examples) {
    test(`native ${example.route} editing at ${width}px`, async ({ page }) => {
      const errors = watchPageErrors(page);
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`/components/${example.route}/`);
      const preview = await loadedPreview(page);
      const segment = preview.getByRole('spinbutton', { name: example.segment });
      await segment.focus();
      await page.keyboard.press('ArrowUp');
      await expect(preview.getByText(example.result, { exact: true })).toBeVisible();
      await preview.getByRole('button', { name: `Clear ${example.label}` }).click();
      await expect(preview.getByText(example.empty, { exact: true })).toBeVisible();
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await expectContained(page);
      expect(errors).toEqual([]);
    });
  }
}
