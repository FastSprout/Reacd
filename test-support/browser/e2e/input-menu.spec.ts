import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const WIDTHS = [240, 360, 1440];
const HEIGHT = 1000;
const TOLERANCE = 1;

async function fields(page: Page, profile: string) {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Fields', exact: true }).click();
}

async function contained(page: Page) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual((await page.evaluate(() => innerWidth)) + TOLERANCE);
}

for (const profile of ['Spacious', 'Compact']) {
  for (const width of WIDTHS) {
    test(`${profile} suggestions ${width}px, long labels, RTL and 200%`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await fields(page, profile);
      await page.getByRole('switch', { name: 'Right to left suggestions' }).check();
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      const input = page.getByRole('combobox', { name: 'Destination', exact: true });
      await input.click();
      const list = page.getByRole('listbox', { name: 'Destination suggestions' });
      await expect(list).toHaveCSS('direction', 'rtl');
      await expect(
        list.getByRole('option', { name: /A destination with/ }),
      ).toBeVisible();
      const box = await list.boundingBox();
      expect(box).not.toBeNull();
      if (box === null) throw new Error('Missing popup geometry.');
      expect(box.x).toBeGreaterThanOrEqual(-TOLERANCE);
      expect(box.x + box.width).toBeLessThanOrEqual(width + TOLERANCE);
      await contained(page);
      await list.getByRole('option', { name: /Kraków/ }).click();
      await expect(input).toHaveValue('Kraków');
      await page.getByRole('button', { name: 'Save destination', exact: true }).click();
      const form = page.getByRole('form', { name: 'Destination form' });
      expect(
        await form.evaluate((element: HTMLFormElement) =>
          Array.from(new FormData(element)),
        ),
      ).toEqual([['destination', 'Kraków']]);
      await contained(page);
    });
  }

  test(`${profile} accepted clear restores the text editing focus`, async ({
    page,
  }) => {
    await fields(page, profile);
    const input = page.getByRole('combobox', { name: 'Destination', exact: true });
    await input.fill('Custom place');
    await input.press('Escape');
    await input.press('Tab');
    const clear = page.getByRole('button', { name: 'Clear text: Destination' });
    await expect(clear).toBeFocused();
    await page.keyboard.press('Space');
    await expect(input).toHaveValue('');
    await expect(input).toBeFocused();
    await page.keyboard.type('Next place');
    await expect(input).toHaveValue('Next place');
  });

  test(`${profile} required readonly, disabled, veto and nested scope`, async ({
    page,
  }) => {
    await fields(page, profile);
    const input = page.getByRole('combobox', { name: 'Destination', exact: true });
    await page.getByRole('switch', { name: 'Read-only suggestions' }).check();
    await page.getByRole('button', { name: 'Save destination', exact: true }).click();
    await expect(input).toBeFocused();
    await expect(
      page.getByText('Destination is not saved.', { exact: true }),
    ).toBeVisible();
    await page.getByRole('switch', { name: 'Disable suggestions' }).check();
    await page.getByRole('button', { name: 'Save destination', exact: true }).click();
    await expect(page.getByText('Destination saved.', { exact: true })).toBeVisible();
    await page.getByRole('switch', { name: 'Disable suggestions' }).uncheck();
    await page.getByRole('switch', { name: 'Read-only suggestions' }).uncheck();
    await page.getByRole('switch', { name: 'Decline suggested text' }).check();
    await input.click();
    await page.getByRole('option', { name: /Paris/ }).click();
    await expect(input).toHaveValue('');
    await expect(page.getByRole('listbox')).toBeVisible();
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Open nested suggestions' }).click();
    const dialog = page.getByRole('dialog', {
      name: 'Nested suggestions',
      exact: true,
    });
    await dialog.getByRole('combobox', { name: 'Dialog destination' }).click();
    await expect(dialog.getByRole('listbox')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('listbox')).toBeHidden();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });
}

test('composition commits final text once and never selects or submits early', async ({
  page,
}) => {
  await fields(page, 'Spacious');
  const input = page.getByRole('combobox', { name: 'Destination', exact: true });
  await input.click();
  await page.keyboard.press('ArrowDown');
  await input.dispatchEvent('compositionstart');
  await input.fill('東京');
  await input.dispatchEvent('keydown', {
    key: 'Enter',
    keyCode: 13,
    isComposing: true,
  });
  await input.dispatchEvent('keydown', { key: 'Enter', keyCode: 229 });
  await expect(page.getByText('Accepted text:', { exact: true })).toBeVisible();
  await expect(
    page.getByText('Destination is not saved.', { exact: true }),
  ).toBeVisible();
  await input.dispatchEvent('compositionend', { data: '東京' });
  await expect(page.getByText('Accepted text: 東京', { exact: true })).toBeVisible();
});

for (const profile of ['Spacious', 'Compact']) {
  test(`${profile} required feedback recovers after a readonly host write`, async ({
    page,
  }) => {
    await fields(page, profile);
    await page.getByRole('switch', { name: 'Read-only suggestions' }).check();
    await page.getByRole('button', { name: 'Save destination', exact: true }).click();
    const input = page.getByRole('combobox', { name: 'Destination', exact: true });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await page.getByRole('button', { name: 'Use Paris from host' }).click();
    await expect(input).toHaveValue('Paris');
    await expect(input).toHaveAttribute('aria-invalid', 'false');
    const form = page.getByRole('form', { name: 'Destination form' });
    await expect(form.getByRole('alert')).toHaveCount(0);
    expect(
      await form.evaluate((element: HTMLFormElement) =>
        Array.from(new FormData(element)),
      ),
    ).toEqual([['destination', 'Paris']]);
  });

  test(`${profile} disabled field protects its open portal`, async ({ page }) => {
    await fields(page, profile);
    const input = page.getByRole('combobox', { name: 'Destination', exact: true });
    const disable = await page
      .getByRole('switch', {
        name: 'Disable suggestions',
      })
      .elementHandle();
    if (disable === null) throw new Error('Missing host control.');
    await input.click();
    const option = page.getByRole('option', { name: /Paris/ });
    await expect(option).toBeVisible();
    await disable.evaluate((element: HTMLElement) => element.click());
    await expect(input).toBeDisabled();
    await expect(option).toBeHidden();
    await expect(input).toHaveValue('');
    const form = page.getByRole('form', { name: 'Destination form' });
    expect(
      await form.evaluate((element: HTMLFormElement) =>
        Array.from(new FormData(element)),
      ),
    ).toEqual([]);
    await expect(page.getByText('Accepted text:', { exact: true })).toBeVisible();
  });
}
