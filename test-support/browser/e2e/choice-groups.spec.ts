import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../../src/core/policy.js';
import { watchPageErrors } from '../docs-site.js';

const WIDTHS = [240, 320, 375, 600, 768, 1024, 1440, 1920];
const PROFILES = ['Spacious', 'Compact'];
const HEIGHT = 1000;
const TOLERANCE = 1;
async function appearance(page: Page, profile: string) {
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
}
async function fields(page: Page, profile: string) {
  await page.goto('/');
  await appearance(page, profile);
  await page.getByRole('button', { name: 'Fields', exact: true }).click();
}
async function contained(page: Page) {
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
    .toBeLessThanOrEqual((page.viewportSize()?.width ?? 0) + TOLERANCE);
  const choices = [
    { form: 'Delivery example', role: 'radio', count: 3 },
    { form: 'Channels example', role: 'checkbox', count: 4 },
  ] as const;
  for (const choice of choices) {
    const controls = page
      .getByRole('form', { name: choice.form, exact: true })
      .getByRole(choice.role);
    await expect(controls).toHaveCount(choice.count);
    for (const control of await controls.all()) {
      const geometry = await control.evaluate((element, minimum) => {
        if (!(
          element instanceof HTMLInputElement || element instanceof HTMLButtonElement
        )) {
          throw new Error('Expected a native SDK labelable choice control.');
        }
        const label = [...(element.labels ?? [])].find(
          (candidate) => candidate.control === element,
        );
        if (!label) throw new Error('Expected an associated native choice label.');
        const scope = element.closest('fieldset, [role=group], [role=radiogroup]');
        if (!scope) throw new Error('Expected the actual native choice group.');
        const native = element.getBoundingClientRect();
        const target =
          native.width >= minimum && native.height >= minimum
            ? native
            : label.getBoundingClientRect();
        const outer = scope.getBoundingClientRect();
        const labelBox = label.getBoundingClientRect();
        const range = document.createRange();
        const walker = document.createTreeWalker(label, NodeFilter.SHOW_TEXT);
        const text = [];
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
          if (!node.textContent?.trim()) continue;
          range.selectNodeContents(node);
          text.push(
            ...[...range.getClientRects()].map((rect) => ({
              left: rect.left,
              right: rect.right,
              top: rect.top,
              bottom: rect.bottom,
            })),
          );
        }
        const visual = element.closest('.MuiRadio-root, .MuiCheckbox-root') ?? element;
        const visualBox = visual.getBoundingClientRect();
        const glyphs = [...visual.querySelectorAll('svg')].map((glyph) => {
          const box = glyph.getBoundingClientRect();
          return { left: box.left, right: box.right, top: box.top, bottom: box.bottom };
        });
        return {
          target: {
            left: target.left,
            right: target.right,
            width: target.width,
            height: target.height,
          },
          outer: { left: outer.left, right: outer.right },
          label: {
            left: labelBox.left,
            right: labelBox.right,
            top: labelBox.top,
            bottom: labelBox.bottom,
          },
          visual: {
            left: visualBox.left,
            right: visualBox.right,
            top: visualBox.top,
            bottom: visualBox.bottom,
          },
          text,
          glyphs,
        };
      }, LAYOUT_POLICY.controlTargetPx);
      expect(geometry.target.width).toBeGreaterThanOrEqual(
        LAYOUT_POLICY.controlTargetPx,
      );
      expect(geometry.target.height).toBeGreaterThanOrEqual(
        LAYOUT_POLICY.controlTargetPx,
      );
      expect(geometry.target.left).toBeGreaterThanOrEqual(
        geometry.outer.left - TOLERANCE,
      );
      expect(geometry.target.right).toBeLessThanOrEqual(
        geometry.outer.right + TOLERANCE,
      );
      expect(geometry.text.length).toBeGreaterThan(0);
      for (const fragment of geometry.text) {
        expect(fragment.left).toBeGreaterThanOrEqual(geometry.outer.left - TOLERANCE);
        expect(fragment.right).toBeLessThanOrEqual(geometry.outer.right + TOLERANCE);
        expect(fragment.left).toBeGreaterThanOrEqual(geometry.label.left - TOLERANCE);
        expect(fragment.right).toBeLessThanOrEqual(geometry.label.right + TOLERANCE);
        expect(fragment.top).toBeGreaterThanOrEqual(geometry.label.top - TOLERANCE);
        expect(fragment.bottom).toBeLessThanOrEqual(geometry.label.bottom + TOLERANCE);
      }
      for (const glyph of geometry.glyphs) {
        expect(glyph.left).toBeGreaterThanOrEqual(geometry.visual.left - TOLERANCE);
        expect(glyph.right).toBeLessThanOrEqual(geometry.visual.right + TOLERANCE);
        expect(glyph.top).toBeGreaterThanOrEqual(geometry.visual.top - TOLERANCE);
        expect(glyph.bottom).toBeLessThanOrEqual(geometry.visual.bottom + TOLERANCE);
      }
    }
  }
}

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    test(`${profile} choice groups wrap at ${width}px and 200%`, async ({ page }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await fields(page, profile);
      await page.getByText('Standard delivery', { exact: true }).click();
      await expect(
        page.getByRole('radio', { name: 'Standard delivery' }),
      ).toBeChecked();
      for (const label of ['Email notifications', 'SMS notifications']) {
        await page.getByText(label, { exact: true }).click();
        await expect(page.getByRole('checkbox', { name: label })).toBeChecked();
      }
      await contained(page);
      await page.getByRole('switch', { name: 'Arrange delivery horizontally' }).click();
      await page.getByRole('switch', { name: 'Arrange channels horizontally' }).click();
      await contained(page);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await contained(page);
      await page
        .getByRole('radio', { name: 'Express delivery' })
        .scrollIntoViewIfNeeded();
      await expect(
        page.getByRole('radio', { name: 'Express delivery' }),
      ).toBeInViewport();
      await page
        .getByRole('checkbox', { name: 'SMS notifications' })
        .scrollIntoViewIfNeeded();
      await expect(
        page.getByRole('checkbox', { name: 'SMS notifications' }),
      ).toBeInViewport();
    });
  }
  test(`${profile} choice groups validate forms, keyboard, limits, and themes`, async ({
    page,
  }) => {
    const errors = watchPageErrors(page);
    await fields(page, profile);
    await page.getByRole('button', { name: 'Save delivery' }).click();
    await expect(page.getByText('No delivery saved.')).toBeVisible();
    const standard = page.getByRole('radio', { name: 'Standard delivery' });
    await standard.focus();
    await page.keyboard.press('Space');
    await expect(standard).toBeChecked();
    await page.keyboard.down('ArrowDown');
    const express = page.getByRole('radio', { name: 'Express delivery' });
    await expect(express).toBeFocused();
    await expect(express).toBeChecked();
    await page.keyboard.up('ArrowDown');
    await page.getByRole('button', { name: 'Save delivery' }).click();
    await expect(page.getByText('Saved delivery: express')).toBeVisible();
    await page.getByRole('button', { name: 'Save channels' }).click();
    await expect(page.getByText('No channels saved.')).toBeVisible();
    const email = page.getByRole('checkbox', { name: 'Email notifications' });
    const sms = page.getByRole('checkbox', { name: 'SMS notifications' });
    const inApp = page.getByRole('checkbox', { name: 'In-app notifications' });
    await email.check();
    await sms.check();
    await expect(inApp).toBeDisabled();
    await sms.focus();
    await page.keyboard.press('Tab');
    await expect(inApp).not.toBeFocused();
    await page.keyboard.press('Space');
    await expect(inApp).not.toBeChecked();
    await email.uncheck();
    await inApp.check();
    await page.getByRole('button', { name: 'Save channels' }).click();
    await expect(page.getByText('Saved channels: sms, inApp')).toBeVisible();
    await expect(
      page.getByRole('checkbox', { name: 'Unavailable channel' }),
    ).toBeDisabled();
    await appearance(page, profile === 'Spacious' ? 'Compact' : 'Spacious');
    await expect(inApp).toBeChecked();
    await expect(page.getByRole('radio', { name: 'Express delivery' })).toBeChecked();
    await page.getByRole('button', { name: 'Clear channels' }).click();
    await page.getByRole('switch', { name: 'Disable channel choices' }).click();
    await page.getByRole('button', { name: 'Save channels' }).click();
    await expect(page.getByText('Saved channels:', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Clear delivery' }).click();
    await page.getByRole('switch', { name: 'Disable delivery choices' }).click();
    await page.getByRole('button', { name: 'Save delivery' }).click();
    await expect(page.getByText('Saved delivery:', { exact: true })).toBeVisible();
    expect(errors).toEqual([]);
  });
}
