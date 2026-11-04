import { expect, test } from '@playwright/test';
import { COLOR_MODE_POLICY } from '../../../src/core/color-mode-policy.js';
import {
  chooseAdapter,
  DOCS_BROWSER_POLICY,
  expectContained,
  loadedPreview,
  watchPageErrors,
} from '../docs-site.js';

const ALTERNATIVE = 'Illustrated workspace';
const SOURCE = '/color-mode-light.svg';
const ADAPTERS = [
  { label: 'shadcn/ui', id: 'shadcn-ui' },
  { label: 'Material UI', id: 'material-ui' },
] as const;
const DIMENSIONS = COLOR_MODE_POLICY.imageAspects[COLOR_MODE_POLICY.defaultAspect];

for (const width of [375, 1920]) {
  for (const adapter of ADAPTERS) {
    test(`${adapter.label} Image loads and stays contained at ${width}px`, async ({
      page,
    }) => {
      const errors = watchPageErrors(page);
      await page.setViewportSize({ width, height: 1000 });
      await page.goto('/components/image/');
      const preview = await loadedPreview(page);
      await chooseAdapter(page, adapter.label);
      await expect(preview.locator('[data-adapter]').first())
        .toHaveAttribute('data-adapter', adapter.id);
      const image = preview.getByRole('img', { name: ALTERNATIVE, exact: true });
      await expect(image).toBeVisible();
      await expect(image).toHaveAttribute('src', SOURCE);
      await expect(image).toHaveAttribute('width', String(DIMENSIONS.width));
      await expect(image).toHaveAttribute('height', String(DIMENSIONS.height));
      await expect(image).toHaveCSS('object-fit', 'contain');
      await expect.poll(() => image.evaluate((element) =>
        element instanceof HTMLImageElement &&
        element.complete && element.naturalWidth > 0,
      )).toBe(true);
      await expect(image.locator('..')).toHaveAttribute('aria-busy', 'false');
      const bounds = await image.boundingBox();
      const outer = await preview.boundingBox();
      if (!bounds || !outer) throw new Error('Missing native Image preview bounds.');
      const tolerance = DOCS_BROWSER_POLICY.overflowTolerance;
      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
      expect(bounds.x).toBeGreaterThanOrEqual(outer.x - tolerance);
      expect(bounds.y).toBeGreaterThanOrEqual(outer.y - tolerance);
      expect(bounds.x + bounds.width)
        .toBeLessThanOrEqual(outer.x + outer.width + tolerance);
      expect(bounds.y + bounds.height)
        .toBeLessThanOrEqual(outer.y + outer.height + tolerance);
      expect(Math.abs(bounds.height -
        bounds.width * DIMENSIONS.height / DIMENSIONS.width))
        .toBeLessThanOrEqual(tolerance);
      await expectContained(page);
      expect(errors).toEqual([]);
    });

    test(`${adapter.label} Image exposes its 404 state at ${width}px`, async ({
      page,
    }) => {
      const errors = watchPageErrors(page);
      await page.setViewportSize({ width, height: 1000 });
      await page.route(`**${SOURCE}`, (route) => route.fulfill({
        status: 404,
        contentType: 'image/svg+xml',
        body: '',
      }));
      await page.goto('/components/image/');
      const preview = await loadedPreview(page);
      await chooseAdapter(page, adapter.label);
      await expect(preview.locator('[data-adapter]').first())
        .toHaveAttribute('data-adapter', adapter.id);
      const feedback = preview.getByRole('img', { name: ALTERNATIVE, exact: true });
      await expect(feedback).toBeVisible();
      await expect(feedback)
        .toHaveAccessibleDescription(COLOR_MODE_POLICY.imageFallback);
      await expect(feedback).toHaveText(COLOR_MODE_POLICY.imageFallback);
      await expect(feedback.locator('..')).toHaveAttribute('aria-busy', 'false');
      await expect(preview.locator('img[alt="Illustrated workspace"]')).toHaveCount(0);
      await expectContained(page);
      expect(errors).toEqual([]);
    });
  }
}
