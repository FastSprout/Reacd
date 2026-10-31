import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../../src/core/policy.js';
import { contrastRatio } from '../../../src/schema/design/templates.schema.js';

const PROFILES = ['Spacious', 'Compact'];
const WIDTHS = [240, 360, 768, 1440];
const VIEWPORT_HEIGHT = 1000;
const TOLERANCE = 1;

function hexColor(value: string) {
  const channels = value.match(/^rgb\((\d+), (\d+), (\d+)\)$/);
  if (channels === null) throw new Error(`Unsupported measured color: ${value}`);
  return (
    '#' +
    channels
      .slice(1)
      .map((channel) => Number(channel).toString(16).padStart(2, '0'))
      .join('')
  );
}

async function appearance(page: Page, profile: string) {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Actions and feedback' }).click();
  await expect(page.getByRole('textbox', { name: 'Palette draft' })).toBeVisible();
}

async function contained(page: Page) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual((page.viewportSize()?.width ?? 0) + TOLERANCE);
  const button = page.getByRole('button', { name: 'Dark appearance button' });
  const box = await button.boundingBox();
  if (box === null) throw new Error('Visible appearance control needs geometry.');
  expect(box.height).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
  const image = page.getByRole('img', { name: 'Illustrated workspace preview' });
  const geometry = await image.boundingBox();
  if (geometry === null) throw new Error('Mode image needs reserved geometry.');
  expect(geometry.width).toBeGreaterThan(0);
  expect(geometry.height).toBeGreaterThan(0);
  expect(geometry.x + geometry.width).toBeLessThanOrEqual(
    (page.viewportSize()?.width ?? 0) + TOLERANCE,
  );
}

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    test(`${profile} palettes at ${width}px, 200% and RTL`, async ({ page }) => {
      await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
      await appearance(page, profile);
      await contained(page);
      await page.getByRole('button', { name: 'Dark appearance button' }).click();
      await expect(
        page.getByText('Color preference: dark; resolved: dark'),
      ).toBeVisible();
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await page.getByRole('switch', { name: 'Right to left appearance' }).check();
      await expect(page.getByRole('textbox', { name: 'Palette draft' })).toHaveCSS(
        'direction',
        'rtl',
      );
      await contained(page);
      const select = page.getByRole('combobox', { name: 'Color preference' });
      await select.click();
      await expect(
        page.getByRole('option', { name: 'Dark', exact: true }),
      ).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(select).toBeFocused();
    });
  }

  test(`${profile} palette changes preserve drafts and protect controls`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await appearance(page, profile);
    const draft = page.getByRole('textbox', { name: 'Palette draft' });
    await draft.fill('Retained through palette changes');
    const button = page.getByRole('button', { name: 'Dark appearance button' });
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await page.mouse.move(1, 1);
    const expectedColor = await button.evaluate((element) => {
      const theme = element.closest('.reacd-theme');
      if (theme === null) throw new Error('Missing palette scope.');
      return getComputedStyle(theme).color;
    });
    await expect(button).toHaveCSS('color', expectedColor);
    const measured = await button.evaluate((element) => {
      const foreground = getComputedStyle(element).color;
      for (
        let surface: Element | null = element;
        surface !== null;
        surface = surface.parentElement
      ) {
        const background = getComputedStyle(surface).backgroundColor;
        if (background !== 'rgba(0, 0, 0, 0)') {
          return { foreground, background };
        }
      }
      throw new Error('A visible control needs an opaque background surface.');
    });
    expect(
      contrastRatio(hexColor(measured.foreground), hexColor(measured.background)),
    ).toBeGreaterThanOrEqual(4.5);
    await expect(draft).toHaveValue('Retained through palette changes');
    const image = page.getByRole('img', { name: 'Illustrated workspace preview' });
    await expect(image.locator('img')).toHaveAttribute('src', '/color-mode-dark.svg');
    await expect(image).not.toHaveAttribute('aria-busy');
    const colors = await draft.evaluate((field) => {
      const scope = field.closest('.reacd-theme');
      if (scope === null) throw new Error('Missing palette scope.');
      const style = getComputedStyle(scope);
      return {
        text: style.getPropertyValue('--reacd-text').trim(),
        surface: style.getPropertyValue('--reacd-surface').trim(),
      };
    });
    expect(contrastRatio(colors.text, colors.surface)).toBeGreaterThanOrEqual(4.5);
    await page.getByRole('switch', { name: 'Read-only appearance' }).check();
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('switch', { name: 'Read-only appearance' }).uncheck();
    await page.getByRole('switch', { name: 'Dark appearance switch' }).uncheck();
    await expect(image.locator('img')).toHaveAttribute('src', '/color-mode-light.svg');
    expect(errors).toEqual([]);
  });

  test(`${profile} system preference follows live device changes`, async ({ page }) => {
    await appearance(page, profile);
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect(
      page.getByText('Color preference: system; resolved: dark'),
    ).toBeVisible();
    const select = page.getByRole('combobox', { name: 'Color preference' });
    await select.click();
    await page.getByRole('option', { name: 'Light', exact: true }).click();
    await expect(
      page.getByText('Color preference: light; resolved: light'),
    ).toBeVisible();
    await page.emulateMedia({ colorScheme: 'light' });
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect(
      page.getByText('Color preference: light; resolved: light'),
    ).toBeVisible();
    await select.click();
    await page.getByRole('option', { name: 'System', exact: true }).click();
    await expect(
      page.getByText('Color preference: system; resolved: dark'),
    ).toBeVisible();
  });
}
