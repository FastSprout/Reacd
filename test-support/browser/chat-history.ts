import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

const READING_TOLERANCE = 1;

export async function readChatHistory(page: Page, viewport: Locator) {
  await viewport.hover();
  await expect(viewport).not.toHaveAttribute('data-pending-scroll');
  const initial = await viewport.evaluate((element) => ({
    content: element.scrollHeight,
    top: element.scrollTop,
    following: element.hasAttribute('data-autoscrolling'),
  }));
  if (initial.following || initial.top > READING_TOLERANCE)
    await page.mouse.wheel(0, -initial.content);
  await nativeReadingReady(viewport);
  const geometry = await viewport.evaluate((element) => ({
    content: element.scrollHeight,
    viewport: element.clientHeight,
  }));
  expect(geometry.viewport).toBeGreaterThan(0);
  const gestures = Math.ceil(geometry.content / geometry.viewport) + 1;
  for (let index = 0; index < gestures; index += 1) {
    await nativeReadingReady(viewport);
    const before = await viewport.evaluate((element) => element.scrollTop);
    if (before <= READING_TOLERANCE) break;
    const content = await viewport.evaluate((element) => element.scrollHeight);
    await page.mouse.wheel(0, -content);
    await expect
      .poll(() => viewport.evaluate((element) => element.scrollTop))
      .toBeLessThan(before);
  }
  await expect
    .poll(() => viewport.evaluate((element) => element.scrollTop))
    .toBeLessThanOrEqual(READING_TOLERANCE);
}

async function nativeReadingReady(viewport: Locator) {
  await expect(viewport).not.toHaveAttribute('data-pending-scroll');
  await expect(viewport).not.toHaveAttribute('data-autoscrolling');
}
