import { expect, test } from '@playwright/test';
import { COMPONENT_NAMES } from '../../src/components/component-names.js';
import { referenceSlug } from '../../tooling/docs-preview/paths.js';

const INTENTIONAL_UNAVAILABLE_IMAGES = new Set([
  '/missing-editorial-example.png',
  '/unavailable-logo-one.png',
  '/unavailable-logo-two.png',
]);

for (const component of COMPONENT_NAMES) {
  test(`MkDocs ${component} embeds its loaded runnable example`, async ({ page }) => {
    const failures: string[] = [];
    page.on('pageerror', (error) => failures.push(error.message));
    page.on('response', (response) => {
      if (
        response.status() >= 400 &&
        !INTENTIONAL_UNAVAILABLE_IMAGES.has(new URL(response.url()).pathname)
      ) {
        failures.push(`${response.status()}: ${response.url()}`);
      }
    });
    await page.goto(`http://127.0.0.1:4175/components/${referenceSlug(component)}/`);
    const host = page.getByTitle(`Live ${component} example`, { exact: true });
    await host.scrollIntoViewIfNeeded();
    await expect(host).toBeVisible();
    const preview = host.contentFrame();
    await expect(
      preview.getByRole('region', {
        name: `${component} live example`,
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      preview.getByRole('status', {
        name: `Loading ${component} example`,
        exact: true,
      }),
    ).toHaveCount(0);
    await expect(
      preview.getByText(`Cannot load ${component} example`, {
        exact: true,
      }),
    ).toHaveCount(0);
    expect(failures).toEqual([]);
  });
}
