import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { watchPreviewFailures } from '../preview-failures.js';

async function fields(page: Page, profile: string) {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Fields', exact: true }).click();
  return await page.locator('[data-adapter]').first()
    .getAttribute('data-adapter') === 'material-ui';
}
async function formData(page: Page) {
  return page.getByRole('form', { name: 'Calendar form' }).evaluate(element => {
    if (!(element instanceof HTMLFormElement)) throw new Error('Expected form');
    return Object.fromEntries(new FormData(element));
  });
}
for (const profile of ['Spacious', 'Compact']) {
  test(`${profile} required read-only empty calendar blocks native submit`, async ({
    page,
  }) => {
    await fields(page, profile);
    const calendar = page.getByRole('group', {
      name: 'Delivery calendar', exact: true,
    });
    const form = page.getByRole('form', { name: 'Calendar form' });
    const save = page.getByRole('button', { name: 'Save calendar selection' });
    await page.getByRole('button', { name: 'Clear calendar selection' }).click();
    await page.getByRole('switch', { name: 'Read-only calendar' }).check();
    await save.click();
    await expect.poll(() => calendar.evaluate(element =>
      element.contains(document.activeElement))).toBe(true);
    await expect(page.getByText('Calendar selection is not saved.', { exact: true }))
      .toBeVisible();
    await expect(form.getByRole('alert')).toBeVisible();
    expect(await formData(page)).toEqual({ delivery: '' });
    await page.getByRole('switch', { name: 'Disable calendar' }).check();
    await save.click();
    await expect(page.getByText('Calendar selection saved.', { exact: true }))
      .toBeVisible();
    expect(await formData(page)).toEqual({});
  });

  test(`${profile} read-only range requires both canonical endpoints`, async ({
    page,
  }) => {
    const failures = watchPreviewFailures(page);
    const material = await fields(page, profile);
    const calendar = page.getByRole('group', {
      name: 'Delivery calendar', exact: true,
    });
    const form = page.getByRole('form', { name: 'Calendar form' });
    const save = page.getByRole('button', { name: 'Save calendar selection' });
    const readOnly = page.getByRole('switch', { name: 'Read-only calendar' });
    await page.getByRole('switch', { name: 'Calendar range selection' }).check();
    if (material) {
      const message = 'Adapter "material-ui" does not support component "Calendar".';
      await expect.poll(failures).toContainEqual({
        name: 'UnsupportedAdapterComponentError', adapterId: 'material-ui',
        componentName: 'Calendar', message,
      });
      await expect(form.getByRole('alert')).toHaveText(
        `Cannot load Calendar variant${message}`,
      );
      expect(await formData(page)).toEqual({});
    } else {
      await readOnly.check();
      await save.click();
      await expect.poll(() => calendar.evaluate(element =>
        element.contains(document.activeElement))).toBe(true);
      await expect(page.getByText('Calendar selection is not saved.', { exact: true }))
        .toBeVisible();
      await expect(form.getByRole('alert')).toBeVisible();
      expect(await formData(page)).toEqual({
        'delivery.start': '2026-10-29', 'delivery.end': '',
      });
      await readOnly.uncheck();
      await calendar.getByRole('button', { name: /October 30, 2026/ }).first().click();
      await readOnly.check();
      await save.click();
      await expect(page.getByText('Calendar selection saved.', { exact: true }))
        .toBeVisible();
      expect(await formData(page)).toEqual({
        'delivery.start': '2026-10-29', 'delivery.end': '2026-10-30',
      });
    }
  });
}
