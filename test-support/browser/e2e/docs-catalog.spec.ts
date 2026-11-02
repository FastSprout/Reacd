import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { COMPONENT_NAMES } from '../../../src/components/component-names.js';
import { EXPECTED_UNSUPPORTED, PREVIEW_UNSUPPORTED_DEPENDENCIES } from
  '../../adapter-examples/native-capabilities.js';
import { referenceSlug } from '../../../tooling/site/previews/paths.js';
import { expectContained, loadedPreview, watchPageErrors } from '../docs-site.js';
import { watchPreviewFailures } from '../preview-failures.js';

for (const width of [375, 1920]) {
  for (const component of COMPONENT_NAMES) {
    test(
      `${component} native preview or exact intentional exception at ${width}px`,
      { tag: '@catalog' },
      async ({ page }) => {
        const errors = watchPageErrors(page);
        const unsupported = EXPECTED_UNSUPPORTED['shadcn-ui'].includes(component);
        const failures = unsupported ? watchPreviewFailures(page) : null;
        await page.setViewportSize({ width, height: 1000 });
        await page.goto(`/components/${referenceSlug(component)}/`);
        let preview: Locator;
        if (failures) {
          const selector = page.getByRole('combobox', { name: 'Example adapter' });
          await expect(selector).toBeVisible();
          preview = page.locator('[data-adapter="shadcn-ui"]')
            .filter({ has: selector }).last();
          await expect(preview.getByRole('status', { name: 'Loading example' }))
            .toHaveCount(0);
          const dependency = PREVIEW_UNSUPPORTED_DEPENDENCIES[component] ?? component;
          const expected = {
            name: 'UnsupportedAdapterComponentError',
            adapterId: 'shadcn-ui',
            componentName: dependency,
            message: `Adapter "shadcn-ui" does not support component "${dependency}".`,
          };
          await expect.poll(failures).toContainEqual(expected);
          for (const failure of await failures()) expect(failure).toEqual(expected);
          const alert = preview.getByRole('alert');
          await expect(alert).toHaveCount(1);
          await expect(alert.getByText(`Cannot render ${component}`, { exact: true }))
            .toBeVisible();
          await expect(alert.getByText(expected.message, { exact: true }))
            .toBeVisible();
          await expect(page.getByRole('heading', {
            name: 'Adapter availability', exact: true,
          })).toBeVisible();
        } else {
          preview = await loadedPreview(page);
        }
        await expect(
          preview.getByRole('combobox', { name: 'Example adapter' }),
        ).toHaveText(/shadcn\/ui/);
        await expect(
          page.getByRole('region', { name: 'tsx', exact: true }).first(),
        ).toBeAttached();
        await expectContained(page);
        expect(errors).toEqual([]);
      },
    );
  }
}
