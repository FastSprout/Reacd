import { readChatHistory } from '../chat-history.js';
import { openUnsupportedExample } from '../native-capabilities.js';
import { expect, test } from '@playwright/test';

const PROFILES = ['Spacious', 'Compact'];
const WIDTH = 320;
const HEIGHT = 900;
const MESSAGE_COUNT = 4;
const TOLERANCE = 1;
const LONG_TEXT = 'Focus_review_message_'.repeat(80);

for (const profile of PROFILES) {
  test(
    'native SDK contract: ' +
      `${profile} explicit chat jumps retain focus without passive stealing`,
    async ({ page }) => {
      await page.setViewportSize({ width: WIDTH, height: HEIGHT });
      if (test.info().project.name === 'mui') {
        await openUnsupportedExample(
          page,
          profile,
          'Content and data',
          'Chat',
          'ChatAttachment',
        );

        await page.locator('html').evaluate((element) => {
          element.style.fontSize = '200%';
        });
        await expect(page.getByText('Cannot load Chat', { exact: true })).toBeVisible();
        return;
      }

      await page.goto('/');
      await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
      await page.getByRole('option', { name: profile, exact: true }).click();
      await page.getByRole('button', { name: 'Content and data', exact: true }).click();
      const input = page.getByRole('textbox', { name: 'Transcript message text' });
      await input.fill(LONG_TEXT);
      await page.getByRole('switch', { name: 'Right to left conversation' }).check();
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      const add = page.getByRole('button', { name: 'Add example message' });
      for (let index = 0; index < MESSAGE_COUNT; index++) await add.click();
      const log = page.getByRole('log', { name: 'Example conversation' });
      const viewport = page.locator(
        '[data-slot="message-scroller-viewport"][aria-label="Example conversation"]',
      );
      const latest = page.getByRole('button', { name: 'Jump to latest message' });
      for (const activation of ['keyboard', 'pointer']) {
        await readChatHistory(page, viewport);
        await expect(latest).toBeVisible();
        await page.getByRole('button', { name: 'Stream example conversation' }).click();
        await expect(log).toHaveAttribute('aria-busy', 'true');
        await latest.scrollIntoViewIfNeeded();
        await latest.focus();
        const before = await page.evaluate(() => scrollY);
        if (activation === 'keyboard') await page.keyboard.press('Enter');
        else await latest.click();
        await expect(latest).toBeFocused();
        await expect(latest).toBeVisible();
        await expect
          .poll(() =>
            viewport.evaluate(
              (element) =>
                element.scrollHeight - element.scrollTop - element.clientHeight,
            ),
          )
          .toBeLessThanOrEqual(TOLERANCE);
        const after = await page.evaluate(() => ({
          y: scrollY,
          maximum: document.documentElement.scrollHeight - innerHeight,
        }));
        expect(Math.abs(after.y - Math.min(before, after.maximum))).toBeLessThanOrEqual(
          TOLERANCE,
        );
        await add.focus();
        await add.click();
        await expect(add).toBeFocused();
        await expect
          .poll(() =>
            viewport.evaluate(
              (element) =>
                element.scrollHeight - element.scrollTop - element.clientHeight,
            ),
          )
          .toBeLessThanOrEqual(TOLERANCE);
        await expect(add).toBeFocused();
        await readChatHistory(page, viewport);
        await expect(latest).toBeVisible();
        await add.focus();
        await add.click();
        await expect(add).toBeFocused();
        await expect
          .poll(() => viewport.evaluate((element) => element.scrollTop))
          .toBeLessThanOrEqual(TOLERANCE);
      }
      await page
        .getByRole('switch', {
          name: 'Follow latest conversation message',
        })
        .uncheck();
      await expect(latest).toHaveCount(0);
      await expect(log).toHaveCSS('direction', 'rtl');
    },
  );
}
