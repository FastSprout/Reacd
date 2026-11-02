import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

export const DOCS_BROWSER_POLICY = {
  origin: 'http://127.0.0.1:4175',
  canonicalOrigin: 'https://reacd.dev',
  viewportHeight: 1000,
  overflowTolerance: 2,
  phone: { width: 375, height: 900 },
  desktop: { width: 1440, height: 1000 },
  widths: [320, 375, 768, 1024, 1440, 1920, 2560],
} as const;

export function watchPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (
      message.type() === 'error' &&
      /hydration|hydrating|did not match/i.test(message.text())
    )
      errors.push(message.text());
  });
  return errors;
}

export async function loadedPreview(page: Page) {
  const selector = page.getByRole('combobox', { name: 'Example adapter', exact: true });
  await expect(selector).toBeVisible();
  const preview = page
    .locator('[data-adapter="shadcn-ui"]')
    .filter({ has: selector })
    .last();
  await expect(
    preview.getByRole('status', { name: 'Loading example', exact: true }),
  ).toHaveCount(0);
  const diagnostics = preview.getByRole('alert').filter({
    hasText: /Cannot render|Unable to render this interface|UnsupportedAdapter/,
  });
  expect(
    await diagnostics.allTextContents(),
    'Every preview must render its SDK',
  ).toEqual([]);
  const content = preview.locator('[data-adapter]').first();
  await expect(content).toBeVisible();
  expect(
    await content.evaluate((element) => element.childElementCount),
  ).toBeGreaterThan(0);
  return preview;
}

export async function expectContained(page: Page): Promise<void> {
  await expect
    .poll(() =>
      page
        .locator('html')
        .evaluate((element) => element.scrollWidth - element.clientWidth),
    )
    .toBeLessThanOrEqual(DOCS_BROWSER_POLICY.overflowTolerance);
  await expect(page.locator('iframe')).toHaveCount(0);
}

export async function chooseAdapter(page: Page, label: 'Material UI' | 'shadcn/ui') {
  await page.getByRole('combobox', { name: 'Example adapter', exact: true }).click();
  await page.getByRole('option', { name: label, exact: true }).click();
}
