import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../../src/core/policy.js';

const PROFILES = ['Spacious', 'Compact'];
const WIDTHS = [240, 360, 768, 1440];
const HEIGHT = 1000;
const TOLERANCE = 1;

async function fields(page: Page, profile: string) {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Fields', exact: true }).click();
}
async function contained(page: Page) {
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
    .toBeLessThanOrEqual((page.viewportSize()?.width ?? 0) + TOLERANCE);
  const quantity = page.getByRole('textbox', { name: 'Quantity', exact: true });
  const code = page.getByRole('textbox', { name: 'Verification code', exact: true });
  await expect(quantity).toBeVisible();
  await expect(code).toBeVisible();
  for (const input of [quantity, code]) {
    expect(
      await input.evaluate((element, tolerance) => {
        const parent = element.closest('[data-slot="field"]') ?? element.parentElement;
        if (!parent) throw new Error('Missing native field');
        const bounds = parent.getBoundingClientRect();
        const box = element.getBoundingClientRect();
        return (
          box.left >= bounds.left - tolerance && box.right <= bounds.right + tolerance
        );
      }, TOLERANCE),
    ).toBe(true);
  }
  const targets = page
    .getByRole('button', { name: /^(Increase|Decrease) Quantity$/ })
    .or(code);
  const geometry = await targets.evaluateAll((elements) =>
    elements.map((element) => {
      const target = element.closest('.MuiInputBase-root') ?? element;
      const box = target.getBoundingClientRect();
      return {
        label: element.getAttribute('aria-label') ?? element.id,
        width: box.width,
        height: box.height,
      };
    }),
  );
  for (const target of geometry) {
    const evidence = JSON.stringify(target);
    expect(target.width, evidence).toBeGreaterThanOrEqual(
      LAYOUT_POLICY.controlTargetPx,
    );
    expect(target.height, evidence).toBeGreaterThanOrEqual(
      LAYOUT_POLICY.controlTargetPx,
    );
  }
}
for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    test(`${profile} numeric/PIN containment at ${width}px and 200%`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await fields(page, profile);
      await contained(page);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await contained(page);
      await page
        .getByRole('textbox', { name: 'Verification code', exact: true })
        .scrollIntoViewIfNeeded();
      await expect(
        page.getByRole('textbox', { name: 'Verification code', exact: true }),
      ).toBeInViewport();
      await page.getByRole('switch', { name: 'Right to left numeric field' }).check();
      await page.getByRole('switch', { name: 'Right to left PIN field' }).check();
      await expect(
        page.getByRole('textbox', { name: 'Quantity', exact: true }),
      ).toHaveCSS('direction', 'rtl');
      await expect(
        page.getByRole('textbox', { name: 'Verification code', exact: true }),
      ).toHaveCSS('direction', 'rtl');
      await contained(page);
    });
  }
  test(`${profile} numeric/PIN keyboard, native validity, paste and masking`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await fields(page, profile);
    const amount = page.getByRole('textbox', { name: 'Quantity', exact: true });
    await amount.focus();
    await page.keyboard.press('ArrowUp');
    await expect(page.getByText('Quantity: 0.2', { exact: true })).toBeVisible();
    await page.keyboard.press('End');
    await expect(amount).toHaveValue('10');
    await expect(
      page.getByRole('button', { name: 'Increase Quantity' }),
    ).toBeDisabled();
    await page.keyboard.press('Home');
    await expect(amount).toHaveValue('0');
    await page.keyboard.press('Alt+ArrowUp');
    await expect(amount).toHaveValue('0.1');
    await page.getByRole('button', { name: 'Clear quantity' }).click();
    await expect(amount).toHaveValue('');
    await page.getByRole('switch', { name: 'Read-only quantity' }).check();
    await expect(amount).toHaveAttribute('readonly');
    await expect(page.getByRole('button', { name: 'Clear quantity' })).toBeDisabled();
    await page.getByRole('button', { name: 'Submit code' }).click();
    await expect(
      page.getByText('Enter a six-digit code.', { exact: true }),
    ).toBeVisible();
    const code = page.getByRole('textbox', { name: 'Verification code' });
    await code.fill('123');
    await page.getByRole('button', { name: 'Submit code' }).click();
    await expect(page.getByText('Code submitted.', { exact: true })).toHaveCount(0);
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.evaluate(
      async (code) => {
        await navigator.clipboard.writeText(code);
      },
      test.info().project.name === 'mui' ? '001234' : '00 1-234',
    );
    await code.focus();
    await page.keyboard.press('ControlOrMeta+A');
    await page.keyboard.press('ControlOrMeta+V');
    await expect(code).toHaveValue('001234');
    await expect(page.getByText('Code is complete.', { exact: true })).toBeVisible();
    await page.getByRole('switch', { name: 'Mask code' }).check();
    await expect(code).toHaveAttribute('type', 'password');
    await page.getByRole('button', { name: 'Submit code' }).click();
    await expect(page.getByText('Code submitted.', { exact: true })).toBeVisible();
    expect(
      await page
        .getByRole('form', { name: 'Code verification' })
        .evaluate((element) => {
          if (!(element instanceof HTMLFormElement)) throw new Error('Native form');
          return [...new FormData(element)];
        }),
    ).toEqual([['code', '001234']]);
    await page.getByRole('button', { name: 'Clear code' }).click();
    await expect(code).toHaveValue('');
    expect(errors).toEqual([]);
  });
}
