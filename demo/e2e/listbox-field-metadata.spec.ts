import { expect, test } from '@playwright/test';

test('inherits naming, feedback and dynamic disabled guard', async ({ page }) => {
  await page.goto('/listbox-field-metadata.html');
  const list = page.getByRole('listbox', { name: 'Control' });
  await expect(list).toHaveAccessibleDescription(/Group help.*Local help/);
  await page.getByRole('option', { name: 'Beta' }).click();
  await expect(page.getByTestId('calls')).toHaveText('[["b"]]');
  const form = page.getByRole('form', { name: 'Metadata form' });
  expect(
    await form.evaluate((element) =>
      element instanceof HTMLFormElement ? [...new FormData(element)] : [],
    ),
  ).toEqual([['inherited', 'b']]);
  await page.getByRole('checkbox', { name: 'Group error' }).check();
  await expect(list).toHaveAttribute('aria-invalid', 'true');
  await expect(list).toHaveAccessibleDescription(/Group help.*Server rejected.*Local/);
  await page.getByRole('checkbox', { name: 'Disable group' }).check();
  await expect(list).toHaveAttribute('aria-disabled', 'true');
  await expect(list).toHaveAttribute('tabindex', '-1');
  const answer = page.getByRole('option', { name: 'Answer' });
  const bounds = await answer.boundingBox();
  if (bounds === null) throw new Error('Expected option geometry.');
  await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await list.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('calls')).toHaveText('[["b"]]');
  await expect(page.getByRole('button', { name: 'Clear selection' })).toBeDisabled();
  expect(
    await form.evaluate((element) =>
      element instanceof HTMLFormElement ? [...new FormData(element)] : [],
    ),
  ).toEqual([]);
});

test('native readonly inherited required and explicit override', async ({ page }) => {
  await page.goto('/listbox-field-metadata.html');
  await page.getByRole('checkbox', { name: 'Readonly choice' }).check();
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByTestId('submits')).toHaveText('0');
  await expect(page.getByRole('alert')).toHaveText('Select at least one option.');
  const list = page.getByRole('listbox', { name: 'Control' });
  await expect
    .poll(() => list.evaluate((element) => element.contains(document.activeElement)))
    .toBe(true);
  await expect(list).toHaveAttribute('aria-required', 'true');
  await page.getByRole('checkbox', { name: 'Override required' }).check();
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByTestId('submits')).toHaveText('1');
  await expect(list).toHaveAttribute('aria-required', 'false');
  await expect(page.getByTestId('calls')).toHaveText('[]');
});
