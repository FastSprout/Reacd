import { expect, test } from '@playwright/test';
import { chooseAdapter, expectContained, loadedPreview, watchPageErrors } from
  '../docs-site.js';

const GALLERY_INTERACTION_TIMEOUT = 60_000;
test.setTimeout(GALLERY_INTERACTION_TIMEOUT);

const REGIONS = [
  'People', 'Quick actions', 'Dates and calendar', 'Recent transactions',
  'Visitors', 'Verify your account', 'Revenue', 'Savings targets', 'Shortcuts',
  'Workspace navigation', 'Product update', 'Contributors', 'Login', 'Chat',
];

for (const width of [375, 1920]) {
  for (const route of ['/', '/examples/showcase/']) {
    test(`complete Material gallery works at ${width}px on ${route}`,
      async ({ page }) => {
        const errors = watchPageErrors(page);
        await page.setViewportSize({ width, height: 1000 });
        await page.goto(route);
        await loadedPreview(page);
        await page.getByRole('textbox', { name: 'Account email' })
          .fill('avery@example.com');
        await chooseAdapter(page, 'Material UI');
        const material = page.locator('[data-adapter="material-ui"]').first();
        await expect(material).toBeVisible();
        await expect(material.getByText('Cannot render Showcase')).toHaveCount(0);
        for (const name of REGIONS) {
          await expect(material.getByRole('region', { name, exact: true }))
            .toBeVisible();
        }
        await expect(material.locator('[data-adapter="shadcn-ui"]')).toHaveCount(0);
        await expect(material.locator('.MuiDateCalendar-root')).toBeVisible();
        await expect(material.locator('.MuiChartsSurface-root').first()).toBeVisible();
        await expect(material.getByRole('textbox', { name: 'Account email' }))
          .toHaveValue('avery@example.com');
        const command = material.getByRole('combobox', {
          name: 'Find a workspace action',
        });
        await command.fill('folder');
        await material.getByRole('option', { name: 'Add new folder' }).click();
        await expect(material.getByText('Selected action: add-folder.'))
          .toBeVisible();
        await material.getByRole('navigation', { name: 'Workspace sections' })
          .getByText('Projects', { exact: true }).click();
        await expect(material.getByText('Workspace view: Projects.')).toBeVisible();
        await material.getByRole('textbox', { name: 'Verification code' })
          .fill('001234');
        await material.getByRole('button', { name: 'Submit code' }).click();
        await expect(material.getByText('Code submitted.', { exact: true }))
          .toBeVisible();
        await material.getByLabel(/^Account password/)
          .fill('example-password');
        await material.getByRole('button', { name: 'Continue locally' }).click();
        await expect(material.getByText('Local sign-in form completed.'))
          .toBeVisible();
        const message = material.getByRole('textbox', { name: 'Message', exact: true });
        await message.fill('Meet tomorrow');
        await message.press('Enter');
        await expect(material.getByText('Last sent: Meet tomorrow')).toBeVisible();
        await material.locator('.MuiDateCalendar-root')
          .getByText('18', { exact: true }).click();
        await expect(material.getByText('Delivery day: 2026-11-18')).toBeVisible();
        await material.getByRole('button', { name: /Choose date/ }).click();
        const dateCell = page.getByRole('dialog').getByRole('gridcell', {
          name: '20', exact: true,
        });
        await dateCell.click({ trial: true });
        await expect(dateCell).toBeInViewport({ ratio: 1 });
        await dateCell.click();
        await expect(material.getByText('Delivery date: 2026-11-20')).toBeVisible();
        await material.getByRole('button', { name: 'Dismiss update' }).click();
        await material.getByRole('button', { name: 'Restore update' }).click();
        await page.locator('html').evaluate(element => {
          element.style.fontSize = '200%';
        });
        await expectContained(page);
        await chooseAdapter(page, 'shadcn/ui');
        await expect(page.getByText('Workspace view: Projects.')).toBeVisible();
        await expect(page.getByText('Delivery day: 2026-11-18')).toBeVisible();
        await expect(page.getByText('Delivery date: 2026-11-20')).toBeVisible();
        expect(errors).toEqual([]);
      });
  }
}
