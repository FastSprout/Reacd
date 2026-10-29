import { expect, test } from '@playwright/test';

const PROFILES = ['Spacious', 'Compact'];
const TARGET = 44;
for (const profile of PROFILES) {
  test(`${profile} Collapsible keyboard, retention, nesting, and state`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.goto('/');
    await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
    await page.getByRole('option', { name: profile, exact: true }).click();
    const trigger = page.getByRole('button', { name: 'Advanced settings' });
    const external = page.getByRole('switch', { name: 'Show advanced settings' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    const target = await trigger.boundingBox();
    if (target === null) throw new Error('Missing disclosure trigger');
    expect(target.height).toBeGreaterThanOrEqual(TARGET);
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(external).toBeChecked();
    await expect(
      page.getByRole('region', { name: 'External disclosure' }),
    ).toBeVisible();
    await page.getByLabel('Disclosure note').fill('Retained browser note');
    await page.getByRole('combobox', { name: 'Disclosure role' }).click();
    await page.getByRole('option', { name: 'Editor', exact: true }).click();
    await expect(page.getByRole('combobox', { name: 'Disclosure role' })).toBeFocused();
    await page.getByRole('button', { name: 'Nested settings' }).click();
    await expect(page.getByText(/Long nested identifier/)).toBeVisible();
    await trigger.focus();
    await page.keyboard.press('Space');
    await expect(external).not.toBeChecked();
    await expect(page.getByLabel('Disclosure note')).toBeHidden();
    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('button', { name: 'Reset disclosure note' }),
    ).toBeFocused();
    await external.check();
    await expect(page.getByLabel('Disclosure note')).toHaveValue(
      'Retained browser note',
    );
    await expect(page.getByText(/Long nested identifier/)).toBeVisible();
    await expect(page.getByRole('combobox', { name: 'Disclosure role' })).toContainText(
      'Editor',
    );
    await expect(
      page.getByRole('button', { name: 'Unavailable settings' }),
    ).toBeDisabled();
    await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
    await page
      .getByRole('option', {
        name: profile === 'Spacious' ? 'Compact' : 'Spacious',
        exact: true,
      })
      .click();
    await expect(page.getByLabel('Disclosure note')).toHaveValue(
      'Retained browser note',
    );
    await page.getByRole('button', { name: 'Reset disclosure note' }).click();
    await expect(page.getByLabel('Disclosure note')).toHaveValue('');
    await trigger.click();
    await expect(page.getByRole('region', { name: 'External disclosure' })).toHaveCount(
      0,
    );
    expect(errors).toEqual([]);
  });
}
