import { expect, test } from '@playwright/test';
import { expectContained, loadedPreview, watchPageErrors } from '../docs-site.js';

for (const width of [375, 1440]) {
  test(`native stepper navigation and retained state at ${width}px`, async ({
    page,
  }) => {
    const errors = watchPageErrors(page);
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/components/stepper/');
    const preview = await loadedPreview(page);
    const steps = preview.getByRole('toolbar', { name: 'Sample checkout' });
    const address = steps.getByRole('button', { name: 'Sample address', exact: true });
    const payment = steps.getByRole('button', { name: 'Sample payment', exact: true });
    const confirm = steps.getByRole('button', {
      name: 'Sample confirmation',
      exact: true,
    });
    await expect(confirm).toBeDisabled();
    await preview
      .getByRole('textbox', { name: 'Sample shipping address' })
      .fill('Retained native address');
    await address.focus();
    await page.keyboard.press('ArrowRight');
    await expect(payment).toBeFocused();
    await expect(address).toHaveAttribute('aria-current', 'step');
    await page.keyboard.press('Enter');
    await expect(payment).toHaveAttribute('aria-current', 'step');
    await confirm.click();
    await expect(
      preview.getByRole('region', { name: 'Sample confirmation' }),
    ).toHaveText('Sample checkout reached confirmation.');
    await address.click();
    await expect(
      preview.getByRole('textbox', { name: 'Sample shipping address' }),
    ).toHaveValue('Retained native address');
    await preview.getByRole('switch', { name: 'Linear sample steps' }).uncheck();
    await preview.getByRole('switch', { name: 'Vertical sample steps' }).check();
    await address.focus();
    await page.keyboard.press('ArrowDown');
    await expect(payment).toBeFocused();
    await page.keyboard.press('End');
    await expect(confirm).toBeFocused();
    await expect(address).toHaveAttribute('aria-current', 'step');
    await page.keyboard.press('Home');
    await expect(address).toBeFocused();
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });
    await expectContained(page);
    await preview.getByRole('switch', { name: 'Disable sample steps' }).check();
    for (const button of [address, payment, confirm])
      await expect(button).toBeDisabled();
    expect(errors).toEqual([]);
  });
}
