import { expect, test } from '@playwright/test';
import { expectContained, loadedPreview, watchPageErrors } from '../docs-site.js';

for (const width of [375, 1440]) {
  test(`native contact email editing and validation at ${width}px`, async ({
    page,
  }) => {
    const errors = watchPageErrors(page);
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/components/input/');
    const preview = await loadedPreview(page);
    const form = preview.getByRole('form', { name: 'Contact form' });
    const email = form.getByRole('textbox', { name: 'Contact email' });
    const save = form.getByRole('button', { name: 'Save contact' });
    await expect(email).toHaveAttribute('autocomplete', 'email');
    await email.fill('');
    await save.click();
    await expect(form.getByRole('alert')).toHaveText('Enter a value.');
    await expect(email).toBeFocused();
    await email.fill('invalid');
    await save.click();
    await expect(form.getByRole('alert')).toHaveText('Enter a valid email address.');
    await email.fill('reader@example.com');
    await expect(form.getByRole('alert')).toBeHidden();
    await save.click();
    await expect(preview.getByText('Contact saved.', { exact: true })).toBeVisible();
    expect(
      await form.evaluate((element) => {
        if (!(element instanceof HTMLFormElement)) throw new Error('Missing form.');
        return Array.from(new FormData(element));
      }),
    ).toEqual([['contact', 'reader@example.com']]);
    await expect(preview.getByRole('switch')).toHaveCount(0);
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });
    await expectContained(page);
    expect(errors).toEqual([]);
  });
}
