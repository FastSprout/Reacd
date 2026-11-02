import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../../src/core/policy.js';

const PROFILES = ['Spacious', 'Compact'];
const WIDTHS = [240, 360, 768, 1440];
const VIEWPORT_HEIGHT = 1000;
const GEOMETRY_TOLERANCE = 1;
const CAPPED_ROWS = 6;
const BASE_ROWS = 2;

async function fields(page: Page, profile: string) {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Fields', exact: true }).click();
}

async function containment(page: Page) {
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
    .toBeLessThanOrEqual((page.viewportSize()?.width ?? 0) + GEOMETRY_TOLERANCE);
  const controls = [
    page.getByRole('switch', { name: 'Publish updates', exact: true }),
    page.getByRole('switch', { name: 'Approve account', exact: true }),
    page.getByRole('textbox', { name: 'Release notes', exact: true }),
    page.getByRole('textbox', { name: 'Account notes', exact: true }),
  ];
  for (const control of controls) {
    await expect(control).toBeVisible();
    const bounds = await control.evaluate((element) => {
      const switchControl = element.getAttribute('role') === 'switch';
      const target = switchControl ? element.closest('label') : element;
      if (!target) throw new Error('Expected the associated SDK switch label.');
      if (
        switchControl &&
        (!(target instanceof HTMLLabelElement) || target.control !== element)
      ) {
        throw new Error('Expected an actual clickable native label.');
      }
      const parent =
        target.closest('[data-slot="field"], .MuiFormControl-root') ??
        target.parentElement;
      if (!parent) throw new Error('Expected a native field container.');
      const inner = target.getBoundingClientRect();
      const outer = parent.getBoundingClientRect();
      return {
        inner: { x: inner.x, width: inner.width, height: inner.height },
        outer: { x: outer.x, width: outer.width },
      };
    });
    expect(bounds.inner.x).toBeGreaterThanOrEqual(bounds.outer.x - GEOMETRY_TOLERANCE);
    expect(bounds.inner.x + bounds.inner.width).toBeLessThanOrEqual(
      bounds.outer.x + bounds.outer.width + GEOMETRY_TOLERANCE,
    );
    expect(bounds.inner.height).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
  }
}

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    test(`${profile} Form controls at ${width}px, 200% and RTL`, async ({ page }) => {
      await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
      await fields(page, profile);
      await containment(page);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await containment(page);
      await page.getByRole('switch', { name: 'Right to left fields' }).check();
      const account = page.getByRole('form', {
        name: 'Account fields form',
        exact: true,
      });
      await expect(
        account.getByRole('group', {
          name: /^Approval(?: \*)?$/,
          exact: true,
        }),
      ).toHaveCSS('direction', 'rtl');
      await containment(page);
    });
  }

  test(`${profile} native form, readonly, scoped errors and automatic rows`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await fields(page, profile);
    const publish = page.getByRole('switch', { name: 'Publish updates' });
    await page.getByRole('switch', { name: 'Read-only publishing' }).check();
    await page.getByRole('button', { name: 'Save publishing' }).click();
    await expect(publish).toBeFocused();
    await expect(publish).not.toBeChecked();
    await page.getByRole('switch', { name: 'Read-only publishing' }).uncheck();
    await publish.focus();
    await page.keyboard.press('Space');
    await expect(publish).toBeChecked();
    await page.getByRole('button', { name: 'Save publishing' }).click();
    await expect(page.getByText('Publishing saved.', { exact: true })).toBeVisible();
    const publishing = page.getByRole('form', { name: 'Publishing form' });
    expect(
      await publishing.evaluate((form) => {
        if (!(form instanceof HTMLFormElement)) throw new Error('Expected form.');
        return Object.fromEntries(new FormData(form));
      }),
    ).toEqual({ publish: 'on' });
    const release = page.getByRole('textbox', { name: 'Release notes' });
    const initialHeight = await release.evaluate((element) => element.clientHeight);
    await page.getByRole('button', { name: 'Fill long release notes' }).click();
    await expect
      .poll(() => release.evaluate((element) => element.clientHeight))
      .toBeGreaterThan(initialHeight);
    const maximum = await release.evaluate((element, rows) => {
      const style = getComputedStyle(element);
      return (
        rows * parseFloat(style.lineHeight) +
        parseFloat(style.paddingTop) +
        parseFloat(style.paddingBottom)
      );
    }, CAPPED_ROWS);
    expect(
      await release.evaluate((element) => element.clientHeight),
    ).toBeLessThanOrEqual(maximum + GEOMETRY_TOLERANCE);
    expect(
      await release.evaluate((field) => field.scrollHeight > field.clientHeight),
    ).toBe(true);
    await page.getByRole('button', { name: 'Clear release notes' }).click();
    await expect(release).toHaveAttribute('rows', String(BASE_ROWS));
    await expect
      .poll(() => release.evaluate((element) => element.clientHeight))
      .toBeLessThanOrEqual(initialHeight + GEOMETRY_TOLERANCE);
    const notes = page.getByRole('textbox', { name: 'Account notes' });
    await page.getByRole('switch', { name: 'Approve account' }).check();
    await notes.fill('Reviewed by owner');
    await page.getByRole('button', { name: 'Reject account notes' }).click();
    await page.getByRole('button', { name: 'Save account fields' }).click();
    await expect(notes).toBeFocused();
    await expect(notes).toHaveAttribute('aria-invalid', 'true');
    await page.getByRole('button', { name: 'Clear account error' }).click();
    await page.getByRole('button', { name: 'Save account fields' }).click();
    await expect(page.getByText('Account saved.', { exact: true })).toBeVisible();
    await page.getByRole('switch', { name: 'Disable account fields' }).check();
    const account = page.getByRole('form', { name: 'Account fields form' });
    expect(
      await account.evaluate((form) => {
        if (!(form instanceof HTMLFormElement)) throw new Error('Expected form.');
        return [...new FormData(form)];
      }),
    ).toEqual([]);
    expect(errors).toEqual([]);
  });
}
