import { expect, test } from '@playwright/test';
import {
  DOCS_BROWSER_POLICY, expectContained, loadedPreview, watchPageErrors,
} from '../docs-site.js';

const FEATURE_REGIONS = [
  'People', 'Quick actions', 'Dates and calendar', 'Recent transactions',
  'Visitors', 'Verify your account', 'Revenue', 'Savings targets', 'Shortcuts',
  'Workspace navigation', 'Product update', 'Contributors', 'Login', 'Chat',
];

for (const width of [375, 1920]) {
  for (const textScale of [100, 200]) {
    test(`complete home gallery works at ${width}px and ${textScale}% text`,
      async ({ page }) => {
        const errors = watchPageErrors(page);
        await page.setViewportSize({ width, height: 1000 });
        await page.goto('/');
        await loadedPreview(page);
        await page.locator('html').evaluate((element, scale) => {
          element.style.fontSize = `${scale}%`;
        }, textScale);
        await expect(page.getByText('All examples use local sample data.',
          { exact: true })).toBeVisible();
        for (const name of FEATURE_REGIONS) {
          await expect(page.getByRole('region', { name, exact: true })).toBeVisible();
        }
        const dismiss = page.getByRole('button', { name: 'Dismiss update' });
        const notice = page.getByRole('status', { name: 'Workspace update' });
        const controlBox = await dismiss.boundingBox();
        const noticeBox = await notice.boundingBox();
        if (!controlBox || !noticeBox) throw new Error('Missing banner bounds.');
        const tolerance = DOCS_BROWSER_POLICY.overflowTolerance;
        expect(controlBox.x).toBeGreaterThanOrEqual(noticeBox.x - tolerance);
        expect(controlBox.x + controlBox.width)
          .toBeLessThanOrEqual(noticeBox.x + noticeBox.width + tolerance);
        const textBoxes = await dismiss.evaluate((element) => {
          const range = document.createRange();
          range.selectNodeContents(element);
          return [...range.getClientRects()].map((box) => ({
            left: box.left, right: box.right,
          }));
        });
        expect(textBoxes.length).toBeGreaterThan(0);
        for (const box of textBoxes) {
          expect(box.left).toBeGreaterThanOrEqual(controlBox.x - tolerance);
          expect(box.right).toBeLessThanOrEqual(
            controlBox.x + controlBox.width + tolerance,
          );
        }
        await expectContained(page);
        await page.getByRole('button', { name: 'Avery Morgan', exact: true }).click();
        await expect(page.getByText('Selected profile: Avery Morgan.',
          { exact: true })).toBeVisible();
        await page.getByRole('combobox', { name: 'Find a workspace action' })
          .fill('folder');
        await page.getByRole('option', { name: 'Add new folder', exact: true }).click();
        await expect(page.getByText('Selected action: add-folder.',
          { exact: true })).toBeVisible();
        await page.getByRole('button', { name: 'Advance monthly goal' }).click();
        await expect(page.getByText('Monthly goal: 80%', { exact: true }))
          .toBeVisible();
        await page.getByRole('button', { name: 'Contribute to savings' }).click();
        await expect(page.getByRole('progressbar', { name: 'Savings allocation' }))
          .toHaveAttribute('aria-valuenow', '9800');
        await page.getByRole('textbox', { name: 'Verification code' }).fill('001234');
        await page.getByRole('button', { name: 'Submit code' }).click();
        await expect(page.getByText('Code submitted.', { exact: true })).toBeVisible();
        await page.getByRole('textbox', { name: 'Account email' })
          .fill('avery@example.com');
        await page.getByLabel('Account password', { exact: true })
          .fill('example-password');
        await page.getByRole('button', { name: 'Continue locally' }).click();
        await expect(page.getByText('Local sign-in form completed.',
          { exact: true })).toBeVisible();
        const prompt = page.getByRole('textbox', { name: 'Message', exact: true });
        await prompt.fill('Meet tomorrow');
        await prompt.press('Enter');
        await expect(page.getByText('Last sent: Meet tomorrow', { exact: true }))
          .toBeVisible();
        await page.getByRole('button', { name: 'Dismiss update' }).click();
        await page.getByRole('button', { name: 'Restore update' }).click();
        await page.getByRole('button', { name: 'Toggle dark appearance' }).click();
        await expect(page.getByText('Selected profile: Avery Morgan.',
          { exact: true })).toBeVisible();
        await expectContained(page);
        await page.getByRole('tab', { name: 'Templates', exact: true }).click();
        await page.getByRole('button', { name: 'Increment', exact: true }).click();
        await expect(page.getByText('Count: 1', { exact: true })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Orders dashboard source' }))
          .toHaveAttribute('href', '/examples/orders-dashboard/');
        await expectContained(page);
        await page.getByRole('tab', { name: 'Components', exact: true }).click();
        await expect(page.getByRole('region', { name: 'Chat', exact: true }))
          .toBeVisible();
        await expectContained(page);
        expect(errors).toEqual([]);
      },
    );
  }
}
