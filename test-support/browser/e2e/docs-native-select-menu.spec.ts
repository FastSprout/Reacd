import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { expectContained, loadedPreview, watchPageErrors } from '../docs-site.js';

const MINIMUM_NATIVE_BUTTON_PX = 32;
const LONG_LABEL = 'Nora Chen — Customer operations and regional support';
const EDGE_TOLERANCE_PX = 1;

async function expectNativeTrigger(trigger: Locator, text: string, wraps = false) {
  const bounds = await trigger.boundingBox();
  if (!bounds) throw new Error('Missing visible native SDK trigger.');
  expect(bounds.height).toBeGreaterThanOrEqual(MINIMUM_NATIVE_BUTTON_PX);
  const value = trigger.getByText(text, { exact: true });
  const geometry = await value.evaluate((element) => {
    const owner = element.closest('button');
    if (!owner) throw new Error('Missing native SDK trigger.');
    const button = owner.getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(element);
    return {
      height: button.height,
      left: button.left,
      right: button.right,
      top: button.top,
      bottom: button.bottom,
      lines: Array.from(range.getClientRects(), (rect) => ({
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
      })),
    };
  });
  expect(geometry.height).toBeGreaterThanOrEqual(MINIMUM_NATIVE_BUTTON_PX);
  expect(geometry.lines.length).toBeGreaterThan(0);
  for (const line of geometry.lines) {
    expect(line.left).toBeGreaterThanOrEqual(geometry.left - EDGE_TOLERANCE_PX);
    expect(line.right).toBeLessThanOrEqual(geometry.right + EDGE_TOLERANCE_PX);
    expect(line.top).toBeGreaterThanOrEqual(geometry.top - EDGE_TOLERANCE_PX);
    expect(line.bottom).toBeLessThanOrEqual(geometry.bottom + EDGE_TOLERANCE_PX);
  }
  if (wraps) {
    expect(new Set(geometry.lines.map((line) => line.top)).size).toBeGreaterThan(1);
  }
}

for (const width of [375, 1920]) {
  test(`native SelectMenu retains control size and wraps text at ${width}px`, async ({
    page,
  }) => {
    const errors = watchPageErrors(page);
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/components/select-menu/');
    const preview = await loadedPreview(page);
    const trigger = preview.getByRole('combobox', { name: 'Assignee', exact: true });
    await expectNativeTrigger(trigger, 'Maya Patel');
    await trigger.click();
    await page.getByRole('option', { name: LONG_LABEL, exact: true }).click();
    await expect(trigger).toHaveText(LONG_LABEL);
    await expectNativeTrigger(trigger, LONG_LABEL, width === 375);
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });
    await expectNativeTrigger(trigger, LONG_LABEL, width === 375);
    await expectContained(page);
    expect(errors).toEqual([]);
  });
}
