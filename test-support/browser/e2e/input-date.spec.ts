import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { watchPreviewFailures } from '../preview-failures.js';

const PROFILES = ['Spacious', 'Compact'];
const WIDTHS = [240, 360, 768, 1440];
const HEIGHT = 1000;
const TOLERANCE = 1;

async function fields(page: Page, profile: string) {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Fields', exact: true }).click();
  return (
    (await page.locator('[data-adapter]').first().getAttribute('data-adapter')) ===
    'material-ui'
  );
}
async function rangeDiagnostic(
  page: Page,
  failures: ReturnType<typeof watchPreviewFailures>,
) {
  const message = 'Adapter "material-ui" does not support component "InputDate".';
  await expect.poll(failures).toContainEqual({
    name: 'UnsupportedAdapterComponentError',
    adapterId: 'material-ui',
    componentName: 'InputDate',
    message,
  });
  await expect(
    page.getByRole('form', { name: 'Dates form' }).getByRole('alert'),
  ).toHaveText(`Cannot load InputDate range${message}`);
  await expect(
    page.locator('input[name="booking.start"],input[name="booking.end"]'),
  ).toHaveCount(0);
}
async function contained(page: Page, material: boolean) {
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth))
    .toBeLessThanOrEqual(TOLERANCE);
  const labels = material
    ? ['Event date']
    : ['Event date', 'Booking dates Start', 'Booking dates End'];
  for (const label of labels) {
    const group = page.getByRole('group', { name: label, exact: true });
    await expect(group).toHaveCount(1);
    await expect(group.getByRole('spinbutton')).toHaveCount(3);
    expect(
      await group.evaluate((element, tolerance) => {
        const outer = element.getBoundingClientRect();
        return [...element.querySelectorAll('[role=spinbutton]')].every((child) => {
          const box = child.getBoundingClientRect();
          const range = document.createRange();
          range.selectNodeContents(child);
          const text = range.getBoundingClientRect();
          return (
            box.width > 0 &&
            box.height > 0 &&
            box.left >= outer.left - tolerance &&
            box.right <= outer.right + tolerance &&
            text.left >= outer.left - tolerance &&
            text.right <= outer.right + tolerance
          );
        });
      }, TOLERANCE),
    ).toBe(true);
  }
}
async function canonical(page: Page) {
  return page.getByRole('form', { name: 'Dates form' }).evaluate((element) => {
    if (!(element instanceof HTMLFormElement)) throw new Error('Expected form');
    return Object.fromEntries(new FormData(element));
  });
}

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    test(`${profile} dates at ${width}px, 200%, RTL and Arabic`, async ({ page }) => {
      const failures = watchPreviewFailures(page);
      await page.setViewportSize({ width, height: HEIGHT });
      const material = await fields(page, profile);
      if (material) await rangeDiagnostic(page, failures);
      await contained(page, material);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await contained(page, material);
      await page.getByRole('switch', { name: 'Right to left dates' }).check();
      const form = page.getByRole('form', { name: 'Dates form' });
      await expect
        .poll(() =>
          form.evaluate((element) => {
            for (let node: Element | null = element; node; node = node.parentElement)
              if (node.getAttribute('dir') === 'rtl') return true;
            return false;
          }),
        )
        .toBe(true);
      const event = page.getByRole('group', { name: 'Event date', exact: true });
      if (!material) await expect(event).toHaveCSS('direction', 'ltr');
      await contained(page, material);
      await page.getByRole('switch', { name: 'Arabic date locale' }).check();
      if (!material) await expect(event).toHaveCSS('direction', 'rtl');
      await contained(page, material);
      expect((await canonical(page))['event']).toBe('2024-02-28');
    });
  }

  test(`${profile} date keyboard, forms and protection`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const failures = watchPreviewFailures(page);
    const material = await fields(page, profile);
    if (material) await rangeDiagnostic(page, failures);
    const event = page.getByRole('group', { name: 'Event date', exact: true });
    const day = event.getByRole('spinbutton', { name: /^day(?:,|$)/i });
    const month = event.getByRole('spinbutton', { name: /^month(?:,|$)/i });
    await day.focus();
    await page.keyboard.press('ArrowUp');
    await expect(
      page.getByText('Event date: 2024-02-29', { exact: true }),
    ).toBeVisible();
    const save = page.getByRole('button', { name: 'Save dates' });
    await save.click();
    await expect(page.getByText('Dates saved.', { exact: true })).toBeVisible();
    const data = { event: '2024-02-29' };
    expect(await canonical(page)).toEqual(
      material
        ? data
        : { ...data, 'booking.start': '2024-02-28', 'booking.end': '2024-03-01' },
    );
    if (!material) {
      await page.getByRole('button', { name: 'Clear Booking dates End' }).click();
      await save.click();
      await expect(
        page
          .getByRole('group', { name: 'Booking dates End', exact: true })
          .getByRole('spinbutton', { name: /^month/i }),
      ).toBeFocused();
      expect((await canonical(page))['booking.end']).toBe('');
    }
    await page.getByRole('button', { name: 'Restore sample dates' }).click();
    await month.focus();
    await page.keyboard.press('Backspace');
    await expect(month).not.toHaveAttribute('aria-valuenow');
    await save.click();
    await expect(month).toBeFocused();
    await expect(
      page
        .getByText(
          material
            ? 'Date must be within its allowed limits.'
            : 'Complete all date segments or clear the field.',
          { exact: true },
        )
        .first(),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Restore sample dates' }).click();
    await expect(month).toHaveAttribute('aria-valuenow', '2');
    await page.getByRole('switch', { name: 'Right to left dates' }).check();
    await month.focus();
    await page.keyboard.press('ArrowRight');
    if (!material) await expect(day).toBeFocused();
    else
      await expect
        .poll(() =>
          event.evaluate((element) => element.contains(document.activeElement)),
        )
        .toBe(true);
    await day.focus();
    await page.keyboard.press('ArrowUp');
    await expect(
      page.getByText('Event date: 2024-02-29', { exact: true }),
    ).toBeVisible();
    await page.getByRole('switch', { name: 'Arabic date locale' }).check();
    const arabicDay = material ? day : event.locator('[data-type=day]');
    await arabicDay.focus();
    await page.keyboard.press('ArrowDown');
    await expect(
      page.getByText('Event date: 2024-02-28', { exact: true }),
    ).toBeVisible();
    await page.getByRole('switch', { name: 'Read-only dates' }).check();
    await arabicDay.focus();
    await page.keyboard.press('ArrowUp');
    await expect(
      page.getByText('Event date: 2024-02-28', { exact: true }),
    ).toBeVisible();
    const clear = page.getByRole('button', { name: 'Clear Event date' });
    if (material) await expect(clear).toHaveCount(0);
    else await expect(clear).toBeDisabled();
    await page.getByRole('switch', { name: 'Read-only dates' }).uncheck();
    await page.getByRole('switch', { name: 'Disable dates' }).check();
    if (material) await expect(clear).toHaveCount(0);
    else await expect(clear).toBeDisabled();
    expect(await canonical(page)).toEqual({});
    expect(errors).toEqual([]);
  });
}
