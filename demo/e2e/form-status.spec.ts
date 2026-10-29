import { expect, test } from '@playwright/test';

for (const profile of ['Spacious', 'Compact']) {
  for (const rtl of [false, true]) {
    test(`${profile} form status remains outside busy content, RTL ${rtl}`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.setViewportSize({ width: 360, height: 900 });
      await page.goto('/');
      await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
      await page.getByRole('option', { name: profile, exact: true }).click();
      await page.getByRole('button', { name: 'Fields', exact: true }).click();
      if (rtl) {
        await page.getByRole('switch', { name: 'Right to left project form' }).check();
      }
      const form = page.getByRole('form', { name: 'Project form', exact: true });
      await page.getByRole('switch', { name: 'Form is submitting' }).check();
      await expect(form).toHaveAttribute('aria-busy', 'true');
      const status = page.getByRole('status').filter({
        hasText: 'Submitting Project form',
      });
      await expect(status).toBeVisible();
      expect(
        await status.evaluate((element) => element.closest('[aria-busy="true"]')),
      ).toBeNull();
      expect(await status.evaluate((element) => element.closest('[inert]'))).toBeNull();
      await expect(form).toHaveAccessibleDescription('Form errors');
      await expect(form.getByRole('alert', { name: 'Form errors' })).toContainText(
        'The previous example failed. Retry is available.',
      );
      expect(
        await form.evaluate((element) =>
          element instanceof HTMLFormElement ? [...new FormData(element)] : [],
        ),
      ).toEqual([['project', 'Local project']]);
      await form.evaluate((element) => {
        if (!(element instanceof HTMLFormElement)) throw new Error('Missing form.');
        element.requestSubmit();
      });
      await expect(
        page.getByText('Submission attempts: 0', { exact: true }),
      ).toBeVisible();
      await page.getByRole('switch', { name: 'Form is submitting' }).uncheck();
      await expect(status).toHaveCount(0);
      await expect(form).not.toHaveAttribute('aria-busy');
      await page.getByRole('button', { name: 'Submit project', exact: true }).click();
      await expect(
        page.getByText('Submission attempts: 1', { exact: true }),
      ).toBeVisible();
      await page.getByRole('switch', { name: 'Disable project form' }).check();
      expect(
        await form.evaluate((element) =>
          element instanceof HTMLFormElement ? [...new FormData(element)] : [],
        ),
      ).toEqual([]);
      expect(errors).toEqual([]);
    });
  }
}
