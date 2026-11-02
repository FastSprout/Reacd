import { expect, test } from '@playwright/test';
import { expectPinReadable, openPinFields } from '../pin-geometry.js';

for (const width of [240, 360]) {
  for (const length of [6, 12]) {
    for (const alphabet of ['numeric', 'alphanumeric']) {
      for (const grouped of [false, true]) {
        for (const rtl of [false, true]) {
          const lineKeys =
            process.platform === 'darwin'
              ? {
                  start: rtl ? 'Meta+ArrowRight' : 'Meta+ArrowLeft',
                  end: rtl ? 'Meta+ArrowLeft' : 'Meta+ArrowRight',
                }
              : { start: 'Home', end: 'End' };
          const name = `${width}px ${length} ${alphabet} grouped=${grouped} rtl=${rtl}`;
          test(`native PIN remains readable at ${name}`, async ({ page }, info) => {
            await page.setViewportSize({ width, height: 1000 });
            const code = await openPinFields(page);
            await page
              .getByRole('switch', { name: 'Twelve-character code' })
              .setChecked(length === 12);
            await page
              .getByRole('switch', { name: 'Alphanumeric code' })
              .setChecked(alphabet === 'alphanumeric');
            await page
              .getByRole('switch', { name: 'Group code slots' })
              .setChecked(grouped);
            await page
              .getByRole('switch', { name: 'Right to left PIN field' })
              .setChecked(rtl);
            await expect(code).toHaveCSS('direction', rtl ? 'rtl' : 'ltr');
            const value =
              alphabet === 'numeric'
                ? '001234567890'.slice(0, length)
                : 'W'.repeat(length);
            const heights = [];
            for (const scale of ['100%', '200%']) {
              const textScale = scale === '200%' ? 2 : 1;
              await page.evaluate((fontSize) => {
                document.documentElement.style.fontSize = fontSize;
              }, scale);
              await page
                .getByRole('button', { name: 'Clear code', exact: true })
                .click();
              await code.focus();
              await code.pressSequentially(value);
              await expect(code).toHaveValue(value);
              await expect(
                page.getByText('Code is complete.', { exact: true }),
              ).toBeVisible();
              heights.push({
                scale,
                height: await expectPinReadable(page, code, length, textScale),
              });
              await expect(code).toBeFocused();
              await code.press(lineKeys.start);
              await expect
                .poll(() =>
                  code.evaluate((element) => {
                    if (!(element instanceof HTMLInputElement))
                      throw new Error('Input');
                    return [element.selectionStart, element.selectionEnd];
                  }),
                )
                .toEqual([0, 1]);
              await code.pressSequentially('9');
              await expect(code).toHaveValue(`9${value.slice(1)}`);
              await code.press(lineKeys.end);
              await code.press('Backspace');
              await expect(code).toHaveValue(`9${value.slice(1, -1)}`);
              await code.press('ControlOrMeta+A');
              await page.evaluate(async (value) => {
                await navigator.clipboard.writeText(value.split('').join(' - '));
              }, value);
              await code.press('ControlOrMeta+V');
              await expect(code).toHaveValue(value);
              await page
                .getByRole('switch', { name: 'Mask code', exact: true })
                .check();
              await expect(code).toHaveAttribute('type', 'password');
              await expectPinReadable(page, code, length, textScale);
              await page
                .getByRole('switch', { name: 'Mask code', exact: true })
                .uncheck();
              await page
                .getByRole('button', { name: 'Submit code', exact: true })
                .click();
              await expect(
                page.getByText('Code submitted.', { exact: true }),
              ).toBeVisible();
              const values = await page
                .getByRole('form', { name: 'Code verification' })
                .evaluate((element) => {
                  if (!(element instanceof HTMLFormElement)) throw new Error('Form');
                  return [...new FormData(element)];
                });
              expect(values).toEqual([['code', value]]);
            }
            await info.attach('native-pin-heights', {
              body: JSON.stringify(heights),
              contentType: 'application/json',
            });
          });
        }
      }
    }
  }
}

for (const profile of ['Spacious', 'Compact']) {
  test(`pending named fields preserve native participation in ${profile}`, async ({
    page,
    browserName,
  }) => {
    // macOS WebKit uses Option+Tab to include buttons in native tab traversal.
    const nextControlKey =
      process.platform === 'darwin' && browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
    await page.setViewportSize({ width: 360, height: 1000 });
    const code = await openPinFields(page);
    const appearance = page.getByRole('combobox', { name: 'Appearance', exact: true });
    await appearance.click();
    const option = page.getByRole('option', { name: profile, exact: true });
    await option.click();
    await expect(option).toBeHidden();
    await expect(appearance).toBeFocused();
    await code.focus();
    await expect(code).toBeFocused();
    await code.pressSequentially('001234');
    await expect(code).toHaveValue('001234');
    await expect(page.getByText('Code is complete.', { exact: true })).toBeVisible();
    const codeForm = page.getByRole('form', { name: 'Code verification' });
    await expect.poll(() => codeForm.evaluate((element) => {
      if (!(element instanceof HTMLFormElement)) throw new Error('Expected form.');
      return new FormData(element).get('code');
    })).toBe('001234');
    const codePending = page.getByRole('switch', { name: 'Submitting code' });
    await codePending.check();
    await expect(codeForm.locator('fieldset')).toHaveAttribute('inert', '');
    await expect(code).toHaveJSProperty('disabled', false);
    expect(
      await codeForm.evaluate((element) => {
        if (!(element instanceof HTMLFormElement))
          throw new Error('Expected native form');
        return [...new FormData(element)];
      }),
    ).toEqual([['code', '001234']]);
    await codePending.focus();
    await page.keyboard.press(nextControlKey);
    await expect(
      page.getByRole('switch', { name: 'Mask code', exact: true }),
    ).toBeFocused();
    await expect(
      page.getByRole('button', { name: 'Submit code', exact: true }),
    ).toBeDisabled();
    const quantityPending = page.getByRole('switch', { name: 'Submitting quantity' });
    await quantityPending.check();
    const quantityForm = page.getByRole('form', { name: 'Quantity form' });
    await expect(quantityForm.locator('fieldset')).toHaveAttribute('inert', '');
    await expect(
      page.getByRole('textbox', { name: 'Quantity', exact: true }),
    ).toHaveJSProperty('disabled', false);
    expect(
      await quantityForm.evaluate((element) => {
        if (!(element instanceof HTMLFormElement))
          throw new Error('Expected native form');
        return [...new FormData(element)];
      }),
    ).toEqual([['quantity', '0.1']]);
    await quantityPending.focus();
    await page.keyboard.press(nextControlKey);
    await expect(
      page.getByRole('switch', { name: 'Read-only quantity' }),
    ).toBeFocused();
    await expect(page.getByRole('button', { name: 'Save quantity' })).toBeDisabled();
    await expect(page.getByText('Code submitted.', { exact: true })).toHaveCount(0);
    await expect(page.getByText('Quantity saved.', { exact: true })).toHaveCount(0);
    await codePending.uncheck();
    await quantityPending.uncheck();
    await page.getByRole('button', { name: 'Submit code', exact: true }).click();
    await expect(page.getByText('Code submitted.', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Save quantity' }).click();
    await expect(page.getByText('Quantity saved.', { exact: true })).toBeVisible();
  });
}
