import { COMPOSITION_HOST_EVENTS } from '../composition-events.js';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

async function open(page: Page, compact: boolean) {
  await page.setViewportSize({ width: 360, height: 960 });
  await page.goto('/composition-safety.html');
  if (compact) await page.getByRole('switch', { name: 'Compact fixture' }).check();
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%';
  });
}

for (const compact of [false, true]) {
  for (const flag of ['Disable', 'Submit']) {
    test(`${compact} ${flag} blocks portal edits and retains form data`, async ({
      page,
    }) => {
      await open(page, compact);
      const toggle = page.getByRole('switch', {
        name: `${flag} settings form`,
      });
      await page.getByRole('combobox', { name: 'Role', exact: true }).click();
      const option = page.getByRole('option', { name: 'Admin', exact: true });
      await expect(option).toBeVisible();
      await page.evaluate(
        (eventName) => {
          window.dispatchEvent(new Event(eventName));
        },
        flag === 'Disable'
          ? COMPOSITION_HOST_EVENTS.disableForm
          : COMPOSITION_HOST_EVENTS.submitForm,
      );
      await expect(option).toBeHidden();
      await page.keyboard.press('Enter');
      await expect(page.getByText('Accepted role edits: 0')).toBeVisible();
      const form = page.getByRole('form', { name: 'Settings', exact: true });
      expect(
        await form.evaluate((node: HTMLFormElement) => Array.from(new FormData(node))),
      ).toEqual(flag === 'Disable' ? [] : [['role', 'reader']]);
      await page.getByRole('button', { name: 'Supply admin from host' }).click();
      expect(
        await form.evaluate((node: HTMLFormElement) => Array.from(new FormData(node))),
      ).toEqual(flag === 'Disable' ? [] : [['role', 'admin']]);
      await expect(page.getByText('Accepted role edits: 0')).toBeVisible();
      await toggle.uncheck();
      await page.getByRole('combobox', { name: 'Role', exact: true }).click();
      await page.getByRole('option', { name: 'Reader', exact: true }).click();
      await expect(page.getByText('Accepted role edits: 1')).toBeVisible();
    });
  }

  test(`${compact} inactive retained tabs hide portals without losing state`, async ({
    page,
  }) => {
    await open(page, compact);
    await page.getByRole('switch', { name: 'Keep dialog open' }).check();
    const dialog = page.getByRole('dialog', { name: 'Retained dialog', exact: true });
    await expect(dialog).toBeHidden();
    await page.getByRole('tab', { name: 'Second', exact: true }).click();
    await expect(dialog).toBeVisible();
    const field = dialog.getByRole('textbox', { name: 'Retained field' });
    await field.fill('Retained note');
    const native = await field.elementHandle();
    if (native === null) throw new Error('Missing retained field.');
    await page.evaluate((eventName) => {
      window.dispatchEvent(new Event(eventName));
    }, COMPOSITION_HOST_EVENTS.firstTab);
    await expect(dialog).toBeHidden();
    await expect(page.getByText('Dialog host intent: true')).toBeVisible();
    await expect(page.getByRole('tab', { name: 'First', exact: true })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(await native.evaluate((element) => element.isConnected)).toBe(true);
    await page.getByRole('tab', { name: 'Second', exact: true }).click();
    await expect(dialog).toBeVisible();
    await expect(field).toHaveValue('Retained note');
    await dialog.getByRole('button', { name: 'Close', exact: true }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByRole('tab', { name: 'Second', exact: true })).toBeFocused();
  });

  test(`${compact} shared tab fallback hides its portal`, async ({ page }) => {
    await open(page, compact);
    await page.getByRole('switch', { name: 'Keep shared popup open' }).check();
    const popup = page.getByRole('dialog', { name: 'Shared popup', exact: true });
    await expect(popup).toBeVisible();
    await page.evaluate((eventName) => {
      window.dispatchEvent(new Event(eventName));
    }, COMPOSITION_HOST_EVENTS.explicitTab);
    await expect(popup).toBeHidden();
    await expect(page.getByText('Shared popup intent: true')).toBeVisible();
    await page.getByRole('tab', { name: 'Shared', exact: true }).click();
    await expect(popup).toBeVisible();
  });

  test(`${compact} actual native ancestry rejects before nested markup`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));
    await open(page, compact);
    const region = page.getByRole('region', { name: 'Native ancestry rejection' });
    await expect(
      region.getByRole('form', { name: 'Rejected nested form' }),
    ).toHaveCount(0);
    await expect(region.getByRole('alert')).toContainText('Forms cannot be nested');
    expect(errors).toEqual([]);
  });
}
