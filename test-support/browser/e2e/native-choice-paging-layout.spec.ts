import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { LAYOUT_POLICY } from '../../../src/core/policy.js';

const WIDTHS = [240, 360];
const PROFILES = ['Spacious', 'Compact'];
const VIEWPORT_HEIGHT = 1000;
const TEXT_ZOOM_PERCENT = 200;
const GEOMETRY_TOLERANCE = 1;

async function expectContainedControl(control: Locator, viewportWidth: number) {
  await control.scrollIntoViewIfNeeded();
  const geometry = await control.evaluate((element) => {
    const box = element.getBoundingClientRect();
    const range = document.createRange();
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const textBoxes = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      range.selectNodeContents(node);
      textBoxes.push(
        ...Array.from(range.getClientRects(), (rect) => ({
          left: rect.left,
          right: rect.right,
          top: rect.top,
          bottom: rect.bottom,
        })),
      );
    }
    return {
      left: box.left,
      right: box.right,
      top: box.top,
      bottom: box.bottom,
      height: box.height,
      textBoxes,
    };
  });
  expect(geometry.left).toBeGreaterThanOrEqual(-GEOMETRY_TOLERANCE);
  expect(geometry.right).toBeLessThanOrEqual(viewportWidth + GEOMETRY_TOLERANCE);
  expect(geometry.height).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
  for (const text of geometry.textBoxes) {
    expect(text.left).toBeGreaterThanOrEqual(geometry.left - GEOMETRY_TOLERANCE);
    expect(text.right).toBeLessThanOrEqual(geometry.right + GEOMETRY_TOLERANCE);
    expect(text.top).toBeGreaterThanOrEqual(geometry.top - GEOMETRY_TOLERANCE);
    expect(text.bottom).toBeLessThanOrEqual(geometry.bottom + GEOMETRY_TOLERANCE);
  }
}

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    test(`${profile} choice and paging controls fit ${width}px at 200%`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
      await page.goto('/');
      await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
      await page.getByRole('option', { name: profile, exact: true }).click();
      await page.getByRole('button', { name: 'Content and data', exact: true }).click();
      await page.evaluate((zoom) => {
        document.documentElement.style.fontSize = `${zoom}%`;
      }, TEXT_ZOOM_PERCENT);
      const source = page.getByRole('combobox', { name: 'Avatar source' });
      await source.click();
      await page.getByRole('option', { name: 'Local placeholder image' }).click();
      await expect(page.getByRole('listbox')).toHaveCount(0);
      await expect(source).toBeFocused();
      await expect(source).toHaveText('Local placeholder image');
      await expectContainedControl(source, width);
      const labels =
        test.info().project.name === 'mui'
          ? ['Go to previous page', 'Go to next page']
          : ['Previous page', 'Next page'];
      for (const label of labels) {
        const buttons = page.getByRole('button', { name: label, exact: true });
        await expect(buttons.first()).toBeVisible();
        expect(await buttons.count()).toBeGreaterThan(0);
        for (const button of await buttons.all()) {
          await expectContainedControl(button, width);
        }
      }
    });
  }
}
