import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

async function ordinaryProtectedTyping(page: Page, box: Locator) {
  const bounds = await box.boundingBox();
  if (bounds === null) throw new Error('Expected native editor geometry.');
  await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await page.keyboard.type('Unexpected');
}
async function open(page: Page, compact: boolean) {
  await page.goto('/editor-field-metadata.html');
  if (compact) await page.getByRole('button', { name: 'Switch template' }).click();
}

for (const compact of [false, true]) {
  test(`Field guards and retained menu, compact ${compact}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await open(page, compact);
    const box = page.getByRole('textbox', { name: 'Field note', exact: true });
    await expect(box).toBeVisible();
    await ordinaryProtectedTyping(page, box);
    await expect(box).toHaveText('Field note');
    await expect(page.getByText('Field requests: 0', { exact: true })).toBeVisible();
    await expect(box).toHaveAttribute('contenteditable', 'false');
    await expect(box).toHaveAttribute('aria-disabled', 'true');
    await expect(box).toHaveAttribute('tabindex', '-1');
    await expect(box).toHaveAttribute('aria-invalid', 'true');
    await expect(box).toHaveAccessibleDescription(/Group guidance.*Server rejected/);
    await expect(page.getByRole('alert')).toHaveCount(1);
    await expect(page.getByRole('button', { name: 'Field bold' })).toHaveAttribute(
      'disabled',
    );
    await expect(
      page.getByRole('group', { name: 'Field blocks' }).getByRole('button').first(),
    ).toHaveAttribute('disabled');
    await ordinaryProtectedTyping(page, box);
    await expect(box).toHaveText('Field note');
    await expect(page.getByText('Field requests: 0', { exact: true })).toBeVisible();
    await expect(
      page.getByRole('textbox', { name: 'Independent note' }),
    ).toHaveAttribute('contenteditable', 'true');

    await page.getByRole('switch', { name: 'Disable editor field' }).uncheck();
    await expect(box).toHaveAttribute('contenteditable', 'true');
    await expect(page.getByText('Field requests: 0', { exact: true })).toBeVisible();
    await page.getByRole('switch', { name: 'Readonly editor field' }).check();
    await expect(box).toHaveAttribute('contenteditable', 'false');
    await expect(box).toHaveAttribute('aria-readonly', 'true');
    await expect(box).toHaveAttribute('aria-disabled', 'false');
    await page.getByRole('switch', { name: 'Readonly editor field' }).uncheck();
    await page.getByRole('switch', { name: 'Editor field error' }).uncheck();
    await expect(box).toHaveAttribute('aria-invalid', 'false');
    await expect(page.getByRole('alert')).toHaveCount(0);
    await page.getByRole('button', { name: 'Replace field from host' }).click();
    await expect(box).toHaveText('Host note');
    await expect(page.getByText('Field requests: 0', { exact: true })).toBeVisible();

    await box.click();
    await box.press('ControlOrMeta+a');
    await page.keyboard.type('/');
    const menu = page.getByRole('listbox', { name: 'Field commands' });
    await expect(menu).toBeVisible();
    await page.getByRole('switch', { name: 'Disable editor field' }).check();
    await expect(box).toHaveAttribute('contenteditable', 'false');
    await expect(menu).toHaveCount(0);
    const requests = page.getByText(/^Field requests: /);
    const previous = await requests.textContent();
    await ordinaryProtectedTyping(page, box);
    await expect(requests).toHaveText(previous ?? 'Missing request count');
    await expect(box).toHaveText('/');
    expect(errors).toEqual([]);
  });

  test(`AuthForm loading and disabled protect Editor, compact ${compact}`, async ({
    page,
  }) => {
    await open(page, compact);
    const box = page.getByRole('textbox', { name: 'Auth note', exact: true });
    await expect(box).toHaveAttribute('contenteditable', 'true');
    for (const label of ['Auth loading', 'Auth disabled']) {
      await page.getByRole('switch', { name: label, exact: true }).check();
      await expect(box).toHaveAttribute('contenteditable', 'false');
      await expect(box).toHaveAttribute('aria-disabled', 'true');
      await ordinaryProtectedTyping(page, box);
      await expect(box).toHaveText('Field note');
      await expect(page.getByText('Auth requests: 0', { exact: true })).toBeVisible();
      await page.getByRole('switch', { name: label, exact: true }).uncheck();
      await expect(box).toHaveAttribute('contenteditable', 'true');
      await expect(page.getByText('Auth requests: 0', { exact: true })).toBeVisible();
    }
    await box.click();
    await box.press('End');
    await page.keyboard.type('!');
    await expect(box).toContainText('!');
    await expect(page.getByText('Auth requests: 1', { exact: true })).toBeVisible();
    await expect(page.getByText('Field requests: 0', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Submit auth proof' }).click();
    await expect(page.getByText('Auth submissions: 1', { exact: true })).toBeVisible();
  });
}
