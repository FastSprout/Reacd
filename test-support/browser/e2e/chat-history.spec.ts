import { expect, test } from '@playwright/test';
import { readChatHistory } from '../chat-history.js';
import { openUnsupportedExample } from '../native-capabilities.js';

const MESSAGE_COUNT = 4;
const LONG_TEXT = 'Wheel_reading_message_'.repeat(80);
const TOLERANCE = 1;

test('chat reading rejects a genuinely prevented native wheel', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  if (test.info().project.name === 'mui') {
    await openUnsupportedExample(
      page, 'Spacious', 'Content and data', 'Chat', 'ChatAttachment',
    );
    return;
  }
  await page.goto('/');
  await page.getByRole('button', { name: 'Content and data', exact: true }).click();
  await page.getByRole('textbox', { name: 'Transcript message text' }).fill(LONG_TEXT);
  const add = page.getByRole('button', { name: 'Add example message' });
  for (let index = 0; index < MESSAGE_COUNT; index += 1) await add.click();
  const viewport = page.locator(
    '[data-slot="message-scroller-viewport"][aria-label="Example conversation"]',
  );
  await viewport.hover();
  await expect(viewport).not.toHaveAttribute('data-pending-scroll');
  const height = await viewport.evaluate((element) => element.clientHeight);
  expect(height).toBeGreaterThan(0);
  await page.mouse.wheel(0, -height);
  await expect(viewport).not.toHaveAttribute('data-autoscrolling');
  await expect.poll(() => viewport.evaluate((element) =>
    element.scrollHeight - element.scrollTop - element.clientHeight,
  )).toBeGreaterThan(TOLERANCE);
  const before = await viewport.evaluate((element) => element.scrollTop);
  expect(before).toBeGreaterThan(TOLERANCE);
  await viewport.evaluate((element) => {
    element.addEventListener('wheel', (event) => event.preventDefault(), {
      passive: false,
    });
  });
  await expect(readChatHistory(page, viewport)).rejects.toThrow('toBeLessThan');
  expect(await viewport.evaluate((element) => element.scrollTop))
    .toBeCloseTo(before, 0);
});
