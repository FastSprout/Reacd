import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

const READING_TOLERANCE = 1;

export async function readChatHistory(page: Page, viewport: Locator) {
  await viewport.hover();
  const geometry = await viewport.evaluate((element) => ({
    content: element.scrollHeight,
    viewport: element.clientHeight,
  }));
  expect(geometry.viewport).toBeGreaterThan(0);
  const gestures = Math.ceil(geometry.content / geometry.viewport) + 1;
  for (let index = 0; index < gestures; index += 1) {
    const before = await viewport.evaluate((element) => element.scrollTop);
    if (before <= READING_TOLERANCE) break;
    await page.mouse.wheel(0, -geometry.content);
    await expect
      .poll(() => viewport.evaluate((element) => element.scrollTop))
      .toBeLessThan(before);
  }
  await expect
    .poll(() => viewport.evaluate((element) => element.scrollTop))
    .toBeLessThanOrEqual(READING_TOLERANCE);
}
