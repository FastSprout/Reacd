import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { COMPONENT_NAMES } from '../../src/components/component-names.js';
import type { ComponentCatalog } from '../../src/components/catalog.js';
import { EXPECTED_UNSUPPORTED } from '../adapter-examples/native-capabilities.js';
import { watchPreviewFailures } from './preview-failures.js';

type Name = keyof ComponentCatalog;
type Failures = ReturnType<typeof watchPreviewFailures>;

export async function expectUnsupportedDiagnostic(
  page: Page,
  failures: Failures,
  previewLabel: string,
  component: Name,
): Promise<void> {
  const surface = page.locator('[data-adapter]').first();
  await expect(surface).toBeAttached();
  const adapter = await surface.getAttribute('data-adapter');
  if (adapter !== 'material-ui' && adapter !== 'shadcn-ui')
    throw new Error(`Unexpected native adapter: ${adapter}.`);
  expect(EXPECTED_UNSUPPORTED[adapter]).toContain(component);
  const expected = {
    name: 'UnsupportedAdapterComponentError',
    adapterId: adapter,
    componentName: component,
    message: `Adapter "${adapter}" does not support component "${component}".`,
  };
  await expect.poll(failures).toContainEqual(expected);
  const alert = page
    .getByRole('alert')
    .filter({ has: page.getByText(`Cannot load ${previewLabel}`, { exact: true }) });
  await expect(alert).toHaveCount(1);
  await expect(alert).toContainText(expected.message);
  await expect(alert.getByRole('button')).toHaveCount(0);
  await expect(alert.getByRole('textbox')).toHaveCount(0);
  await expect(alert.getByRole('slider')).toHaveCount(0);
  await expect(alert.getByRole('option')).toHaveCount(0);
}

export async function openUnsupportedExample(
  page: Page,
  profile: string,
  section: 'Fields' | 'Content and data' | 'Navigation' | 'Layout',
  previewLabel: string,
  component?: Name,
): Promise<void> {
  const expected = component ?? COMPONENT_NAMES.find((name) => name === previewLabel);
  if (expected === undefined) throw new Error(`Unknown component: ${previewLabel}.`);
  const failures = watchPreviewFailures(page);
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('navigation', { name: 'Component families', exact: true })
    .getByRole('button', { name: section, exact: true }).click();
  await expectUnsupportedDiagnostic(page, failures, previewLabel, expected);
}
