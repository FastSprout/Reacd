import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../src/core/policy.js';

const PROFILES = ['Spacious', 'Compact'];
const WIDTHS = [240, 360, 768, 1440];
const VIEWPORT_HEIGHT = 1000;
const ROUNDING_TOLERANCE = 1;

async function fields(page: Page, profile: string) {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Fields', exact: true }).click();
}

async function contained(page: Page) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual((page.viewportSize()?.width ?? 0) + ROUNDING_TOLERANCE);
  for (const input of await page.locator('.reacd-input > input:not([hidden])').all()) {
    const box = await input.boundingBox();
    if (box === null) throw new Error('Visible input must have geometry.');
    expect(box.height).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
    expect(
      await input.evaluate((element, tolerance) => {
        const style = getComputedStyle(element);
        return element.clientHeight + tolerance >= Number.parseFloat(style.lineHeight);
      }, ROUNDING_TOLERANCE),
    ).toBe(true);
  }
}

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    test(`${profile} Input/Form at ${width}px, 200% and RTL`, async ({ page }) => {
      await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
      await fields(page, profile);
      await contained(page);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await contained(page);
      await page.getByRole('switch', { name: 'Right to left email' }).check();
      await page.getByRole('switch', { name: 'Right to left project form' }).check();
      await expect(page.getByRole('form', { name: 'Project form' })).toHaveCSS(
        'direction',
        'rtl',
      );
      await contained(page);
    });
  }

  test(`${profile} Input email, readonly, loading and canonical FormData`, async ({
    page,
  }) => {
    await fields(page, profile);
    const input = page.getByRole('textbox', { name: 'Contact email' });
    const form = page.getByRole('form', { name: 'Contact form' });
    await page.getByRole('button', { name: 'Clear contact email' }).click();
    await page.getByRole('switch', { name: 'Read-only email' }).check();
    await page.getByRole('button', { name: 'Save contact' }).click();
    await expect(input).toBeFocused();
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await page.getByRole('switch', { name: 'Read-only email' }).uncheck();
    await input.fill('invalid');
    await page.getByRole('button', { name: 'Save contact' }).click();
    await expect(input).toBeFocused();
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await input.fill('owner@example.com');
    await page.getByRole('button', { name: 'Save contact' }).click();
    await expect(page.getByText('Contact saved.', { exact: true })).toBeVisible();
    await page.getByRole('switch', { name: 'Updating email' }).check();
    await expect(input).toHaveAttribute('readonly');
    expect(
      await form.evaluate((element) => {
        if (!(element instanceof HTMLFormElement)) throw new Error('Expected form.');
        return Object.fromEntries(new FormData(element));
      }),
    ).toEqual({ contact: 'owner@example.com' });
    await page.getByRole('switch', { name: 'Updating email' }).uncheck();
    await page.getByRole('switch', { name: 'Disable email' }).check();
    expect(
      await form.evaluate((element) => {
        if (!(element instanceof HTMLFormElement)) throw new Error('Expected form.');
        return [...new FormData(element)];
      }),
    ).toEqual([]);
  });

  test(`${profile} Form summary retries, inert state and validation`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await fields(page, profile);
    const form = page.getByRole('form', { name: 'Project form' });
    const input = page.getByRole('textbox', { name: 'Project name' });
    const submit = page.getByRole('button', { name: 'Submit project' });
    await submit.click();
    await submit.click();
    await expect(
      page.getByText('Submission attempts: 2', { exact: true }),
    ).toBeVisible();
    await expect(form.getByRole('alert')).toContainText('Retry is available.');
    await page.getByRole('switch', { name: 'Form is submitting' }).check();
    await expect(form).toHaveAttribute('aria-busy', 'true');
    await input.focus();
    await expect(input).not.toBeFocused();
    expect(
      await form.evaluate((element) => {
        if (!(element instanceof HTMLFormElement)) throw new Error('Expected form.');
        element.requestSubmit();
        return Object.fromEntries(new FormData(element));
      }),
    ).toEqual({ project: 'Local project' });
    await expect(
      page.getByText('Submission attempts: 2', { exact: true }),
    ).toBeVisible();
    await page.getByRole('switch', { name: 'Form is submitting' }).uncheck();
    await page.getByRole('switch', { name: 'Disable project form' }).check();
    await expect(input).toBeDisabled();
    expect(
      await form.evaluate((element) => {
        if (!(element instanceof HTMLFormElement)) throw new Error('Expected form.');
        return [...new FormData(element)];
      }),
    ).toEqual([]);
    await page.getByRole('switch', { name: 'Disable project form' }).uncheck();
    await page.getByRole('button', { name: 'Clear project name' }).click();
    await submit.click();
    await expect(input).toBeFocused();
    await expect(
      page.getByText('Submission attempts: 2', { exact: true }),
    ).toBeVisible();
    expect(errors).toEqual([]);
  });
}
