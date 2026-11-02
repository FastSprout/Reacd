import { expect, test } from '@playwright/test';
import { expectContained, watchPageErrors } from '../docs-site.js';

for (const width of [375, 1440]) {
  test(`native workbench text validation and loading data at ${width}px`, async ({
    page,
  }) => {
    const errors = watchPageErrors(page);
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Fields', exact: true }).click();
    const preview = page.getByRole('region', {
      name: 'Controlled fields',
      exact: true,
    });
    const form = preview.getByRole('form', { name: 'Contact form' });
    const email = form.getByRole('textbox', { name: 'Contact email' });
    const save = form.getByRole('button', { name: 'Save contact' });
    await preview.getByRole('button', { name: 'Clear contact email' }).click();
    await preview.getByRole('switch', { name: 'Read-only email' }).check();
    await save.click();
    await expect(
      form.getByRole('alert').getByText('Enter a value.', {
        exact: true,
      }),
    ).toBeVisible();
    await expect(email).toBeFocused();
    await preview.getByRole('switch', { name: 'Read-only email' }).uncheck();
    await email.fill('invalid');
    await save.click();
    await expect(
      form
        .getByRole('alert')
        .getByText('Enter a valid email address.', { exact: true }),
    ).toBeVisible();
    await preview.getByRole('button', { name: 'Restore contact email' }).click();
    await expect(form.getByRole('alert')).toBeHidden();
    await preview.getByRole('switch', { name: 'Updating email' }).check();
    if (test.info().project.name === 'mui') {
      await expect(
        form.getByRole('progressbar', {
          name: 'Updating Contact email',
          exact: true,
        }),
      ).toBeVisible();
    } else {
      await expect(form.getByRole('status')).toHaveText('Updating Contact email');
    }
    await expect(email).toHaveAttribute('readonly', '');
    await expect(email).toBeEnabled();
    expect(
      await form.evaluate((element) => {
        if (!(element instanceof HTMLFormElement)) throw new Error('Missing form.');
        return new FormData(element).get('contact');
      }),
    ).toBe('owner@example.com');
    await save.click();
    await expect(preview.getByText('Contact saved.', { exact: true })).toBeVisible();
    await preview.getByRole('switch', { name: 'Updating email' }).uncheck();
    await preview.getByRole('switch', { name: 'Disable email' }).check();
    await expect(email).toBeDisabled();
    expect(
      await form.evaluate((element) => {
        if (!(element instanceof HTMLFormElement)) throw new Error('Missing form.');
        return new FormData(element).has('contact');
      }),
    ).toBe(false);
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });
    await expectContained(page);
    expect(errors).toEqual([]);
  });
}
