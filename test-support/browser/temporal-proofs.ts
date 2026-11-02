import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { watchPreviewFailures } from './preview-failures.js';

export async function openTemporalProof(page: Page, template?: string) {
  const failures = watchPreviewFailures(page);
  await page.goto('/temporal-recovery.html');
  if (template === 'erp-compact')
    await page.getByRole('button', { name: 'Switch template' }).click();
  const material = await page.locator('[data-adapter]').first()
    .getAttribute('data-adapter') === 'material-ui';
  return { material, failures };
}

export async function unsupportedTemporalProof(
  page: Page,
  failures: ReturnType<typeof watchPreviewFailures>,
  label: string,
  component: 'InputDate' | 'InputTime',
) {
  const message = `Adapter "material-ui" does not support component "${component}".`;
  await expect.poll(failures).toContainEqual({
    name: 'UnsupportedAdapterComponentError', adapterId: 'material-ui',
    componentName: component, message,
  });
  const alert = page.getByRole('alert').filter({
    has: page.getByText(`Cannot load ${label}`, { exact: true }),
  });
  await expect(alert).toBeVisible();
  await expect(alert).toContainText(message);
  await expect(alert.getByRole('spinbutton')).toHaveCount(0);
  await expect(alert.locator('input[name]')).toHaveCount(0);
}
