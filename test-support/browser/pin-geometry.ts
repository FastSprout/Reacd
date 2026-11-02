import { expect, type Locator, type Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../src/core/policy.js';

const NATIVE_SLOT = { minimumWidthPx: 36, fontPx: 14 } as const;

export async function expectPinReadable(
  page: Page,
  input: Locator,
  length: number,
  textScale: number,
) {
  const control = input.locator('xpath=ancestor::*[@data-input-otp-container][1]');
  const slots = control.locator('[data-slot="input-otp-slot"]');
  await expect(slots).toHaveCount(length);
  await expect
    .poll(() =>
      slots.evaluateAll(
        (elements, expected) =>
          elements.every((element) => {
            const box = element.getBoundingClientRect();
            return (
              box.width >= expected.width &&
              Number.parseFloat(getComputedStyle(element).fontSize) === expected.font
            );
          }),
        {
          width: NATIVE_SLOT.minimumWidthPx * textScale,
          font: NATIVE_SLOT.fontPx * textScale,
        },
      ),
    )
    .toBe(true);
  const bounds = await input.boundingBox();
  if (!bounds) throw new Error('Expected visible native PIN input');
  expect(bounds.height).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
  expect(bounds.width).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
  const geometry = await slots.evaluateAll((elements) =>
    elements.map((element) => {
      const box = element.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(element);
      const glyph = range.getBoundingClientRect();
      return {
        width: box.width,
        fontPx: Number.parseFloat(getComputedStyle(element).fontSize),
        left: box.left,
        right: box.right,
        top: box.top,
        bottom: box.bottom,
        glyph: {
          left: glyph.left,
          right: glyph.right,
          top: glyph.top,
          bottom: glyph.bottom,
        },
      };
    }),
  );
  const tolerance = 1;
  for (const slot of geometry) {
    expect(slot.width).toBeGreaterThanOrEqual(NATIVE_SLOT.minimumWidthPx * textScale);
    expect(slot.fontPx).toBe(NATIVE_SLOT.fontPx * textScale);
    expect(slot.left).toBeGreaterThanOrEqual(bounds.x - tolerance);
    expect(slot.right).toBeLessThanOrEqual(bounds.x + bounds.width + tolerance);
    expect(slot.glyph.left).toBeGreaterThanOrEqual(slot.left - tolerance);
    expect(slot.glyph.right).toBeLessThanOrEqual(slot.right + tolerance);
    expect(slot.glyph.top).toBeGreaterThanOrEqual(slot.top - tolerance);
    expect(slot.glyph.bottom).toBeLessThanOrEqual(slot.bottom + tolerance);
  }
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual((page.viewportSize()?.width ?? 0) + tolerance);
  return bounds.height;
}

export async function openPinFields(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Fields', exact: true }).click();
  return page.getByLabel('Verification code', { exact: true });
}
