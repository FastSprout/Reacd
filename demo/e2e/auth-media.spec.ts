import { expect, test } from '@playwright/test';
import { measureAuthMediaEscapes } from '../../test-support/auth-media-containment.js';

const WIDTHS = [240, 320, 768, 1440];
const PROFILES = ['Spacious', 'Compact'];
const DIRECTIONS = ['ltr', 'rtl'];
const HEIGHT = 1000;
const TOLERANCE = 1;

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    for (const direction of DIRECTIONS) {
      test(`${profile} auth/media ${width}px ${direction} 200%`, async ({ page }) => {
        await page.setViewportSize({ width, height: HEIGHT });
        await page.goto('/');
        const appearance = page.getByRole('combobox', {
          name: 'Appearance',
          exact: true,
        });
        await appearance.click();
        await page.getByRole('option', { name: profile, exact: true }).click();
        const region = page.getByRole('region', {
          name: 'Auth and media components',
          exact: true,
        });
        if (direction === 'rtl')
          await region.getByRole('switch', { name: 'Auth media RTL' }).check();
        await page.evaluate(() => {
          document.documentElement.style.fontSize = '200%';
        });
        const form = region.getByRole('form', { name: 'Local credential example' });
        const email = form.getByRole('textbox', { name: 'Example email' });
        const submit = form.getByRole('button', { name: 'Submit local example' });
        await submit.click();
        await expect(email).toBeFocused();
        expect(
          await email.evaluate(
            (element) =>
              element instanceof HTMLInputElement && element.validity.valueMissing,
          ),
        ).toBe(true);
        await email.fill('invalid-email');
        await submit.click();
        expect(
          await email.evaluate(
            (element) =>
              element instanceof HTMLInputElement && element.validity.typeMismatch,
          ),
        ).toBe(true);
        await email.fill('retained@example.com');
        await region
          .getByRole('button', { name: 'Run local provider example' })
          .click();
        await expect(region.getByText('Local provider example selected')).toBeVisible();
        await email.focus();
        await page.keyboard.press('Tab');
        await expect(submit).toBeFocused();
        await page.keyboard.press('Enter');
        await expect(
          region.getByText('Local example submitted: retained@example.com'),
        ).toBeVisible();
        const loading = region.getByRole('switch', { name: 'Auth example loading' });
        await loading.check();
        const status = form.getByRole('status');
        await expect(status).toHaveText('Submitting');
        expect(
          await status.evaluate(
            (element) => element.closest('[aria-busy="true"]') === null,
          ),
        ).toBe(true);
        await expect(email).toBeDisabled();
        await expect(submit).toBeDisabled();
        await loading.uncheck();
        const disabled = region.getByRole('switch', { name: 'Auth example disabled' });
        await disabled.check();
        await expect(email).toBeDisabled();
        await disabled.uncheck();
        await expect(email).toHaveValue('retained@example.com');
        const logos = region.getByRole('region', { name: 'Example placeholder marks' });
        await expect(
          logos.getByRole('img', { name: 'First image placeholder' }),
        ).toContainText('Image unavailable:');
        await region.getByRole('button', { name: 'Reverse example marks' }).click();
        await expect(logos.getByRole('img').first()).toHaveAccessibleName(
          'Second image placeholder',
        );
        await appearance.click();
        await page
          .getByRole('option', {
            name: profile === 'Compact' ? 'Spacious' : 'Compact',
            exact: true,
          })
          .click();
        await expect(email).toHaveValue('retained@example.com');
        const escaped = await measureAuthMediaEscapes(region, TOLERANCE);
        expect(escaped).toEqual([]);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(width + TOLERANCE);
        if (profile === 'Compact' && width === 320 && direction === 'rtl')
          await region.screenshot({ path: '.cache/auth-media-Compact-320-rtl.png' });
      });
    }
  }
}

test('auth containment detects unclipped hidden and visible escaped controls', async ({
  page,
}) => {
  const width = WIDTHS[0];
  if (width === undefined) throw new Error('Missing narrow auth viewport policy.');
  await page.setViewportSize({ width, height: HEIGHT });
  await page.goto('/');
  const region = page.getByRole('region', {
    name: 'Auth and media components',
    exact: true,
  });
  expect(await measureAuthMediaEscapes(region, TOLERANCE)).toEqual([]);
  await region.evaluate((element) => {
    const PROBE_POSITION = {
      position: 'fixed',
      left: '0px',
      top: '0px',
      width: '1px',
      height: '1px',
      minBlockSize: '0px',
      clipPath: 'none',
    };
    const hidden = document.createElement('input');
    hidden.setAttribute('aria-hidden', 'true');
    hidden.setAttribute('aria-label', 'Unclipped hidden input');
    hidden.tabIndex = -1;
    Object.assign(hidden.style, PROBE_POSITION);
    const visible = document.createElement('button');
    visible.type = 'button';
    visible.setAttribute('aria-label', 'Visible escaped control');
    Object.assign(visible.style, PROBE_POSITION);
    element.append(hidden, visible);
  });
  expect(
    (await measureAuthMediaEscapes(region, TOLERANCE)).map((escape) => escape.label),
  ).toEqual(['Unclipped hidden input', 'Visible escaped control']);
});
