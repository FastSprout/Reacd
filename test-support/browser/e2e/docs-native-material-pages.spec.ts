import { expect, test } from '@playwright/test';
import {
  chooseAdapter, expectContained, loadedPreview, watchPageErrors,
} from '../docs-site.js';

const pages = [
  'page-aside', 'page-body', 'page-columns', 'page-grid', 'page-list', 'page-logos',
] as const;

for (const width of [375, 1920]) {
  for (const component of pages) {
    test(`Material ${component} uses its SDK at ${width}px`, async ({ page }) => {
      const errors = watchPageErrors(page);
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`/components/${component}/`);
      await loadedPreview(page);
      await chooseAdapter(page, 'Material UI');
      const surface = page.locator('[data-adapter="material-ui"]').first();
      await expect(surface).toBeVisible();
      await expect(surface.locator('.MuiBox-root, .MuiStack-root, .MuiList-root')
        .first()).toBeVisible();
      await expect(surface.getByRole('alert')).toHaveCount(0);
      if (component === 'page-list') {
        const input = surface.getByRole('textbox', { name: 'Page list query' });
        await input.fill('Preserved between native adapters');
        await chooseAdapter(page, 'shadcn/ui');
        await expect(page.getByRole('textbox', { name: 'Page list query' }))
          .toHaveValue('Preserved between native adapters');
      }
      await expectContained(page);
      expect(errors).toEqual([]);
    });
  }
}
