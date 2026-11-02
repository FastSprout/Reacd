import { expect, test } from '@playwright/test';
import { expectUnsupportedDiagnostic } from '../native-capabilities.js';
import { watchPreviewFailures } from '../preview-failures.js';

for (const profile of ['Spacious', 'Compact']) {
  test(`${profile} runs the public core TSX examples`, async ({ page }) => {
    const failures = watchPreviewFailures(page);
    await page.setViewportSize({ width: 360, height: 1000 });
    await page.goto('/');
    await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
    await page.getByRole('option', { name: profile, exact: true }).click();
    await expect(page.getByText('const ready = true;', { exact: true })).toBeVisible();
    for (const name of ['Orders overview', 'Customer overview', 'Delivery overview'])
      await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Release summary' })).toBeVisible();
    const adapter = await page
      .locator('[data-adapter]')
      .first()
      .getAttribute('data-adapter');
    expect(['material-ui', 'shadcn-ui']).toContain(adapter);
    const material = adapter === 'material-ui';
    if (material) {
      await expectUnsupportedDiagnostic(page, failures, 'Spacer', 'Spacer');
      await expectUnsupportedDiagnostic(page, failures, 'Spacer example', 'Spacer');
      await expectUnsupportedDiagnostic(
        page,
        failures,
        'Split view preview',
        'SplitView',
      );
      await expectUnsupportedDiagnostic(
        page,
        failures,
        'SplitView example',
        'SplitView',
      );
      await expectUnsupportedDiagnostic(page, failures, 'Viewport example', 'Viewport');
      await expect(page.getByText('End of row', { exact: true })).toHaveCount(0);
      await expect(
        page.getByRole('switch', { name: 'Constrain sample viewport' }),
      ).toHaveCount(0);
    } else {
      await expect(page.getByText('End of row', { exact: true })).toBeVisible();
      await page.getByRole('switch', { name: 'Constrain sample viewport' }).check();
      await expect(page.getByText('Viewport mode: compact')).toBeVisible();
    }
    await page.getByRole('button', { name: 'Save toolbar draft' }).click();
    await expect(page.getByText('Toolbar saves: 1')).toBeVisible();
    await page.getByRole('button', { name: 'Fields', exact: true }).click();
    await expectUnsupportedDiagnostic(page, failures, 'CodeEditor', 'CodeEditor');
    await expect(page.getByRole('textbox', { name: 'Editable source' })).toHaveCount(0);
    await page.getByRole('textbox', { name: 'Additional notes' }).fill('Ready');
    await expect(page.getByText('Current notes: Ready')).toBeVisible();
    await page.getByRole('switch', { name: 'Email summaries', exact: true }).check();
    await expect(page.getByText('Email summaries are enabled.')).toBeVisible();
    await page.getByRole('button', { name: 'Approve sample' }).click();
    await expect(page.getByText('Approved samples: 1')).toBeVisible();
    await page.getByRole('navigation', {
      name: 'Component families', exact: true,
    }).getByRole('button', { name: 'Navigation', exact: true }).click();
    await page.getByRole('button', { name: 'Reports view' }).click();
    await expect(page.getByText('Selected view: reports')).toBeVisible();
    await page.getByRole('button', { name: 'Content and data', exact: true }).click();
    const table = page.getByRole('table', { name: 'Selectable sample records' });
    await table.getByRole('checkbox', { name: 'Select row sample-a' }).check();
    await expect(page.getByText('Selected sample rows: sample-a')).toBeVisible();
    await page
      .getByRole('button', {
        name: 'Actions and feedback',
        exact: true,
      })
      .click();
    await expect(
      page.getByRole(material ? 'progressbar' : 'status', {
        name: 'Loading the sample',
        exact: true,
      }),
    ).toBeVisible();
    await page.getByRole('tab', { name: 'Generative UI', exact: true }).click();
    if (material) {
      await expectUnsupportedDiagnostic(page, failures, 'Generative UI', 'SplitView');
      await expect(page.getByRole('textbox', { name: 'JSON declaration' })).toHaveCount(
        0,
      );
    } else {
      const document = {
        schemaVersion: '0.2',
        state: [],
        root: { type: 'Badge', label: 'Literal transport badge', leadingIcon: 'info' },
      };
      await page
        .getByRole('textbox', { name: 'JSON declaration' })
        .fill(JSON.stringify(document));
      await page.getByRole('button', { name: 'Render declaration' }).click();
      await expect(
        page.getByText('Literal transport badge', { exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: 'Literal transport badge' }),
      ).toHaveCount(0);
    }
  });
}
