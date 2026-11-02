import { expect, test } from '@playwright/test';
import { expectContained, loadedPreview, watchPageErrors } from '../docs-site.js';

for (const width of [375, 1920]) {
  test(`required switch focuses its native control at ${width}px`, async ({ page }) => {
    const errors = watchPageErrors(page);
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/components/switch/');
    const preview = await loadedPreview(page);
    const control = preview.getByRole('switch', { name: 'Publish updates' });
    await preview.getByRole('button', { name: 'Save publishing' }).click();
    await expect(control).toBeFocused();
    await expect(preview.getByText('Publishing is not saved.', { exact: true }))
      .toBeVisible();
    await control.check();
    await preview.getByRole('button', { name: 'Save publishing' }).click();
    await expect(preview.getByText('Publishing saved.', { exact: true })).toBeVisible();
    const form = preview.getByRole('form', { name: 'Publishing form' });
    expect(await form.evaluate((element) => {
      if (!(element instanceof HTMLFormElement)) throw new Error('Missing form');
      return new FormData(element).getAll('publish');
    })).toEqual(['on']);
    await expectContained(page);
    expect(errors).toEqual([]);
  });

  test(`host field errors block submission and focus the control at ${width}px`,
    async ({ page }) => {
      const errors = watchPageErrors(page);
      await page.setViewportSize({ width, height: 1000 });
      await page.goto('/components/form-field/');
      const preview = await loadedPreview(page);
      await preview.getByRole('switch', { name: 'Approve account' }).check();
      const notes = preview.getByRole('textbox', { name: 'Account notes' });
      await notes.fill('Reviewed by the account owner.');
      await preview.getByRole('button', { name: 'Reject account notes' }).click();
      await preview.getByRole('button', { name: 'Save account fields' }).click();
      await expect(notes).toBeFocused();
      await expect(notes).toHaveAttribute('aria-invalid', 'true');
      await expect(preview.getByText('Account is not saved.', { exact: true }))
        .toBeVisible();
      await preview.getByRole('button', { name: 'Clear account error' }).click();
      await preview.getByRole('button', { name: 'Save account fields' }).click();
      await expect(preview.getByText('Account saved.', { exact: true })).toBeVisible();
      await expectContained(page);
      expect(errors).toEqual([]);
    });

  test(`required mixed checkbox focuses its SDK control at ${width}px`, async ({
    page,
  }) => {
    const errors = watchPageErrors(page);
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/components/checkbox/');
    const preview = await loadedPreview(page);
    const writer = preview.getByRole('checkbox', { name: 'Approve selected accounts' });
    const save = preview.getByRole('button', { name: 'Save approval' });
    await save.click();
    await expect(writer).toBeFocused();
    await expect(writer).toHaveAccessibleDescription(
      /Select this option to continue\./,
    );
    await expect(preview.getByText('Approval is not saved.')).toBeVisible();
    await writer.click();
    await save.click();
    await expect(preview.getByText('Approval saved.', { exact: true })).toBeVisible();
    const form = preview.getByRole('form', { name: 'Approval form' });
    expect(await form.evaluate((element) => {
      if (!(element instanceof HTMLFormElement)) throw new Error('Missing form');
      return new FormData(element).getAll('approval');
    })).toEqual(['approved']);
    await expectContained(page);
    expect(errors).toEqual([]);
  });

  test(`PIN completion and validation at ${width}px`, async ({ page }) => {
    const errors = watchPageErrors(page);
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/components/pin-input/');
    const preview = await loadedPreview(page);
    const code = preview.getByLabel('Verification code', { exact: true });
    await preview.getByRole('button', { name: 'Submit code', exact: true }).click();
    await expect(code).toBeFocused();
    await expect(preview.getByText('Code submitted.', { exact: true })).toHaveCount(0);
    await code.pressSequentially('001234');
    await expect(code).toHaveValue('001234');
    await expect(preview.getByText('Code is complete.', { exact: true })).toBeVisible();
    await preview.getByRole('button', { name: 'Submit code', exact: true }).click();
    await expect(preview.getByText('Code submitted.', { exact: true })).toBeVisible();
    await preview.getByRole('button', { name: 'Clear code', exact: true }).click();
    await expect(code).toHaveValue('');
    await expectContained(page);
    expect(errors).toEqual([]);
  });

  test(`authentication SDK form stays usable at ${width}px`, async ({ page }) => {
    const errors = watchPageErrors(page);
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/components/auth-form/');
    const preview = await loadedPreview(page);
    const submit = preview.getByRole('button', { name: 'Submit local example' });
    const email = preview.getByRole('textbox', { name: 'Example email' });
    await submit.click();
    await expect(email).toBeFocused();
    await preview.getByRole('button', { name: 'Run local provider example' }).click();
    await expect(preview.getByText('Local provider example selected')).toBeVisible();
    await email.fill('reader@example.com');
    await submit.click();
    await expect(preview.getByText(
      'Local example submitted: reader@example.com', { exact: true },
    )).toBeVisible();
    await preview.getByRole('switch', { name: 'Auth example loading' }).click();
    await expect(preview.getByRole('status')).toHaveText('Submitting');
    await expect(email).toBeDisabled();
    await expect(submit).toBeDisabled();
    await expectContained(page);
    expect(errors).toEqual([]);
  });

  test(`field groups wrap action labels at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/components/field-group/');
    const preview = await loadedPreview(page);
    const label = 'SearchRegionalDocumentation'.repeat(20);
    await preview.getByRole('textbox', { name: 'Group action label' }).fill(label);
    const action = preview.getByRole('button', { name: label, exact: true });
    await expect(action).toBeVisible();
    await expect.poll(() => action.evaluate((element) =>
      element.scrollWidth - element.clientWidth,
    )).toBeLessThanOrEqual(2);
    await expectContained(page);
    await action.click();
    await expect(preview.getByRole('textbox', { name: 'Reference query' }))
      .toHaveValue('Component reference');
    await preview.getByRole('switch', { name: 'Vertical field group' }).click();
    await preview.getByRole('switch', { name: 'Right to left group' }).click();
    await expectContained(page);
  });
}
