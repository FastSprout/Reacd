import { expect, test } from '@playwright/test';
import { expectContained, loadedPreview, watchPageErrors } from '../docs-site.js';

const CHAT_BROWSER_POLICY = {
  messageCount: 16,
  tolerance: 2,
  phone: { width: 375, height: 900 },
  short: { width: 375, height: 500 },
} as const;

test('native chat releases the reader and resumes without stealing focus', async ({
  page,
}) => {
  await page.setViewportSize(CHAT_BROWSER_POLICY.phone);
  const errors = watchPageErrors(page);
  await page.goto('/components/chat-messages/');
  const preview = await loadedPreview(page);
  const viewport = preview.getByRole('region', { name: 'Sample conversation' });
  const log = preview.getByRole('log', { name: 'Sample conversation' });
  const add = preview.getByRole('button', { name: 'Add local reply' });
  await expect(viewport).toHaveAttribute('data-slot', 'message-scroller-viewport');
  for (let index = 0; index < CHAT_BROWSER_POLICY.messageCount; index += 1)
    await add.click();
  await expect(log.getByRole('article')).toHaveCount(CHAT_BROWSER_POLICY.messageCount);
  await expect.poll(() => viewport.evaluate((element) =>
    element.scrollHeight - element.clientHeight - element.scrollTop))
    .toBeLessThanOrEqual(CHAT_BROWSER_POLICY.tolerance);
  await viewport.hover();
  const geometry = await viewport.evaluate((element) => ({
    content: element.scrollHeight, viewport: element.clientHeight,
  }));
  const gestures = Math.ceil(geometry.content / geometry.viewport) + 1;
  for (let index = 0; index < gestures; index += 1) {
    const before = await viewport.evaluate((element) => element.scrollTop);
    if (before <= CHAT_BROWSER_POLICY.tolerance) break;
    await page.mouse.wheel(0, -geometry.content);
    await expect.poll(() => viewport.evaluate((element) => element.scrollTop))
      .toBeLessThan(before);
  }
  await expect.poll(() => viewport.evaluate((element) => element.scrollTop))
    .toBeLessThanOrEqual(CHAT_BROWSER_POLICY.tolerance);
  await add.focus();
  await page.keyboard.press('Enter');
  await expect.poll(() => viewport.evaluate((element) => element.scrollTop))
    .toBeLessThanOrEqual(CHAT_BROWSER_POLICY.tolerance);
  const latest = preview.getByRole('button', { name: 'Jump to latest message' });
  await latest.focus();
  const before = await page.evaluate(() => scrollY);
  await page.keyboard.press('Enter');
  await expect(latest).toBeFocused();
  await expect.poll(() => viewport.evaluate((element) =>
    element.scrollHeight - element.clientHeight - element.scrollTop))
    .toBeLessThanOrEqual(CHAT_BROWSER_POLICY.tolerance);
  expect(Math.abs(await page.evaluate(() => scrollY) - before))
    .toBeLessThanOrEqual(CHAT_BROWSER_POLICY.tolerance);
  await add.focus();
  await page.keyboard.press('Enter');
  await expect(add).toBeFocused();
  await expect.poll(() => viewport.evaluate((element) =>
    element.scrollHeight - element.clientHeight - element.scrollTop))
    .toBeLessThanOrEqual(CHAT_BROWSER_POLICY.tolerance);
  await expectContained(page);
  expect(errors).toEqual([]);
});

test('native chat palette retains a reachable composer in a short viewport', async ({
  page,
}) => {
  await page.setViewportSize(CHAT_BROWSER_POLICY.short);
  const errors = watchPageErrors(page);
  await page.goto('/components/chat-palette/');
  const preview = await loadedPreview(page);
  const draft = preview.getByRole('textbox', { name: 'Message' });
  await draft.fill('A local message in a short viewport.');
  await draft.press('Enter');
  await expect(preview.getByRole('log')).toContainText('A local message');
  await expect(draft).toHaveValue('');
  await draft.focus();
  await expect(draft).toBeFocused();
  await expectContained(page);
  expect(errors).toEqual([]);
});
