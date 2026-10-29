import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../src/core/policy.js';
const WIDTHS = [240, 360, 768, 1440];
const HEIGHT = 1000;
const TOLERANCE = 1;
const LONG_LABEL = 'Overflow_safe_content_'.repeat(16);

async function elements(page: Page, profile: string) {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Actions and feedback', exact: true }).click();
  return page.getByRole('region', { name: 'Element foundations', exact: true });
}
async function contained(page: Page, content: Locator) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual((await page.evaluate(() => innerWidth)) + TOLERANCE);
  const escaped = await content.evaluate((element, tolerance) => {
    const box = element.getBoundingClientRect();
    return Array.from(
      element.querySelectorAll('.reacd-button,.reacd-badge,.reacd-alert'),
    ).some((child) => {
      const rect = child.getBoundingClientRect();
      return rect.left < box.left - tolerance || rect.right > box.right + tolerance;
    });
  }, TOLERANCE);
  expect(escaped).toBe(false);
}

for (const profile of ['Spacious', 'Compact']) {
  for (const width of WIDTHS) {
    test(`${profile} elements ${width}px, long labels, 200% and RTL`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      const section = await elements(page, profile);
      await section
        .getByRole('textbox', { name: 'Element stress text' })
        .fill(LONG_LABEL);
      const card = section.getByRole('region', { name: 'Resilient element content' });
      await contained(page, card);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await section.getByRole('switch', { name: 'Right to left elements' }).check();
      await expect(card).toHaveCSS('direction', 'rtl');
      await contained(page, card);
      const button = section.getByRole('button', {
        name: 'Request export',
        exact: true,
      });
      const box = await button.boundingBox();
      if (box === null) throw new Error('Missing export button geometry.');
      expect(box.width).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
      expect(box.height).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
      const progress = section.getByRole('progressbar', { name: 'Uploaded items' });
      const track = await progress.boundingBox();
      const fill = await progress.locator('.reacd-progress-fill').boundingBox();
      if (track === null || fill === null)
        throw new Error('Missing progress geometry.');
      expect(Math.abs(fill.x + fill.width - track.x - track.width)).toBeLessThanOrEqual(
        TOLERANCE,
      );
      expect(fill.width).toBeCloseTo(track.width / 4, 0);
    });
  }
  test(`${profile} element keyboard, loading, slots and controlled actions`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const section = await elements(page, profile);
    const button = section.getByRole('button', { name: 'Request export', exact: true });
    await button.focus();
    await page.keyboard.press('Space');
    await expect(
      section.getByText('Export requests: 1', { exact: true }),
    ).toBeVisible();
    await section.getByRole('switch', { name: 'Busy export button' }).check();
    await expect(
      section.getByRole('button', { name: 'Requesting export' }),
    ).toBeDisabled();
    await section.getByRole('switch', { name: 'Busy export button' }).uncheck();
    await section.getByRole('switch', { name: 'Disable export button' }).check();
    await expect(button).toBeDisabled();
    await section.getByRole('switch', { name: 'Badge warning state' }).check();
    await expect(section.getByText('Review required', { exact: true })).toBeVisible();
    await section.getByRole('switch', { name: 'Decorative icon' }).check();
    await expect(section.getByRole('img', { name: 'Search workspace' })).toHaveCount(0);
    await section.getByRole('button', { name: 'Review card details' }).click();
    await expect(
      section.getByText('Review requests: 1', { exact: true }),
    ).toBeVisible();
    await section.getByRole('button', { name: 'Review delivery', exact: true }).click();
    await expect(
      section.getByText('Delivery review requests: 1', { exact: true }),
    ).toBeVisible();
    await section
      .getByRole('button', { name: 'Dismiss Review delivery details' })
      .click();
    await section.getByRole('button', { name: 'Show delivery alert' }).click();
    await section.getByRole('switch', { name: 'Readonly alert visibility' }).check();
    await expect(
      section.getByRole('button', { name: 'Dismiss Review delivery details' }),
    ).toHaveCount(0);
    await section.getByRole('switch', { name: 'Indeterminate upload' }).check();
    await expect(
      section.getByRole('progressbar', { name: 'Uploaded items' }),
    ).not.toHaveAttribute('aria-valuenow');
    expect(errors).toEqual([]);
  });
}
