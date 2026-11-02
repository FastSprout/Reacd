import { expect, test } from '@playwright/test';
import { expectUnsupportedDiagnostic } from '../native-capabilities.js';
import { watchPreviewFailures } from '../preview-failures.js';

test('reports the actual SDK gap instead of fabricating metadata-aware editors',
  async ({ page }) => {
    const failures = watchPreviewFailures(page);
    await page.goto('/editor-field-metadata.html');
    await expectUnsupportedDiagnostic(page, failures, 'Editor metadata', 'Editor');
    for (const label of ['Field note', 'Auth note', 'Independent note']) {
      await expect(page.getByRole('textbox', { name: label, exact: true }))
        .toHaveCount(0);
    }
    await expect(page.locator('[contenteditable="true"]')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Retry editor', exact: true }))
      .toHaveCount(0);
  },
);
