import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

async function fields(page: Page, profile: string) {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Fields', exact: true }).click();
}

for (const profile of ['Spacious', 'Compact']) {
  test(`${profile} required read-only empty calendar blocks native submit`, async ({
    page,
  }) => {
    await fields(page, profile);
    const calendar = page.getByRole('group', { name: 'Delivery calendar' });
    const form = page.getByRole('form', { name: 'Calendar form' });
    const save = page.getByRole('button', { name: 'Save calendar selection' });
    await page.getByRole('button', { name: 'Clear calendar selection' }).click();
    await page.getByRole('switch', { name: 'Read-only calendar' }).check();
    await save.click();
    await expect(calendar).toBeFocused();
    await expect(
      page.getByText('Calendar selection is not saved.', { exact: true }),
    ).toBeVisible();
    expect(
      await form.evaluate((element: HTMLFormElement) => element.checkValidity()),
    ).toBe(false);
    expect(
      await form.evaluate((element: HTMLFormElement) =>
        Object.fromEntries(new FormData(element)),
      ),
    ).toEqual({ delivery: '' });
    await page.getByRole('switch', { name: 'Disable calendar' }).check();
    await save.click();
    await expect(
      page.getByText('Calendar selection saved.', { exact: true }),
    ).toBeVisible();
    expect(
      await form.evaluate((element: HTMLFormElement) =>
        Array.from(new FormData(element)),
      ),
    ).toEqual([]);
  });

  test(`${profile} read-only range requires both canonical endpoints`, async ({
    page,
  }) => {
    await fields(page, profile);
    const calendar = page.getByRole('group', { name: 'Delivery calendar' });
    const form = page.getByRole('form', { name: 'Calendar form' });
    const save = page.getByRole('button', { name: 'Save calendar selection' });
    const readOnly = page.getByRole('switch', { name: 'Read-only calendar' });
    await page.getByRole('switch', { name: 'Calendar range selection' }).check();
    await readOnly.check();
    await save.click();
    await expect(calendar).toBeFocused();
    await expect(
      page.getByText('Calendar selection is not saved.', { exact: true }),
    ).toBeVisible();
    expect(
      await form.evaluate((element: HTMLFormElement) => element.checkValidity()),
    ).toBe(false);
    await readOnly.uncheck();
    await calendar.getByRole('button', { name: /October 30, 2026$/ }).click();
    await readOnly.check();
    await save.click();
    await expect(
      page.getByText('Calendar selection saved.', { exact: true }),
    ).toBeVisible();
    expect(
      await form.evaluate((element: HTMLFormElement) => element.checkValidity()),
    ).toBe(true);
    expect(
      await form.evaluate((element: HTMLFormElement) =>
        Object.fromEntries(new FormData(element)),
      ),
    ).toEqual({
      'delivery.start': '2026-10-29',
      'delivery.end': '2026-10-30',
    });
  });
}
