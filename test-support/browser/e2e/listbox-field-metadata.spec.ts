import { expect, test } from '@playwright/test';
import { expectUnsupportedDiagnostic } from '../native-capabilities.js';
import { watchPreviewFailures } from '../preview-failures.js';

test('reports the exact selected SDK Listbox metadata capability gap', async ({
  page,
}) => {
  const failures = watchPreviewFailures(page);
  await page.goto('/listbox-field-metadata.html');
  await expectUnsupportedDiagnostic(page, failures, 'Listbox metadata', 'Listbox');
  await expect(page.getByRole('listbox', { name: 'Control' })).toHaveCount(0);
  await expect(page.getByRole('option', { name: 'Beta' })).toHaveCount(0);
  await expect(page.locator('.reacd-listbox')).toHaveCount(0);
});

test('does not invent named inputs or required-selection fallbacks', async ({
  page,
}) => {
  const failures = watchPreviewFailures(page);
  await page.goto('/listbox-field-metadata.html');
  await expectUnsupportedDiagnostic(page, failures, 'Listbox metadata', 'Listbox');
  await expect(page.locator('input[name=inherited]')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Clear selection' })).toHaveCount(0);
  await expect(page.getByRole('option', { name: 'Answer' })).toHaveCount(0);
});
