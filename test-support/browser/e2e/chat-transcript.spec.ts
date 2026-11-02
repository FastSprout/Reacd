import { readChatHistory } from '../chat-history.js';
import { openUnsupportedExample } from '../native-capabilities.js';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../../src/core/policy.js';

const WIDTHS = [240, 360, 768, 1440];
const HEIGHT = 1000;
const TOLERANCE = 1;
const LONG_TEXT = 'Unbroken_example_response_'.repeat(40);
const MESSAGE_COUNT = 4;

async function content(page: Page, profile: string) {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Content and data', exact: true }).click();
}

async function contained(page: Page) {
  const messages = page.locator('[data-slot="message"], [data-slot="attachment"]');
  expect(await messages.count()).toBeGreaterThan(0);
  const escaped = await page
    .locator('[data-slot="message"], [data-slot="attachment"]')
    .evaluateAll(
      (elements, tolerance) =>
        elements.some((element) => {
          const bounds = element.getBoundingClientRect();
          return Array.from(element.querySelectorAll('p, span, button, img')).some(
            (child) => {
              const box = child.getBoundingClientRect();
              return (
                box.width > 0 &&
                (box.left < bounds.left - tolerance ||
                  box.right > bounds.right + tolerance)
              );
            },
          );
        }),
      TOLERANCE,
    );
  expect(escaped).toBe(false);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual((await page.evaluate(() => innerWidth)) + TOLERANCE);
  expect(
    await page
      .locator('[data-slot="message"] button, [data-slot="attachment"] button')
      .count(),
  ).toBeGreaterThan(0);
  const targets = await page
    .locator('[data-slot="message"] button, [data-slot="attachment"] button')
    .evaluateAll(
      (elements, minimum) =>
        elements.every((element) => {
          const box = element.getBoundingClientRect();
          return box.width >= minimum && box.height >= minimum;
        }),
      LAYOUT_POLICY.controlTargetPx,
    );
  expect(targets).toBe(true);
  const descriptions = page.locator('[data-slot="attachment-description"]');
  expect(await descriptions.count()).toBeGreaterThan(0);
  expect(
    await descriptions.evaluateAll(
      (elements, tolerance) =>
        elements.every(
          (element) => element.scrollWidth <= element.clientWidth + tolerance,
        ),
      TOLERANCE,
    ),
  ).toBe(true);
}

for (const profile of ['Spacious', 'Compact']) {
  for (const width of WIDTHS) {
    test(
      'native SDK contract: ' +
        `${profile} chat at ${width}px, 200% text and scoped RTL`,
      async ({ page }) => {
        await page.setViewportSize({ width, height: HEIGHT });
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
          await expect(
            page.getByText('Cannot load Chat', { exact: true }),
          ).toBeVisible();
          return;
        }

        await content(page, profile);
        await page
          .getByRole('textbox', { name: 'Example response', exact: true })
          .fill(LONG_TEXT);
        await page
          .getByRole('textbox', { name: 'Transcript message text' })
          .fill(LONG_TEXT);
        await page.getByRole('button', { name: 'Add example message' }).click();
        await contained(page);
        await page.evaluate(() => {
          document.documentElement.style.fontSize = '200%';
        });
        await page.getByRole('switch', { name: 'Right to left conversation' }).check();
        await expect(page.getByRole('log', { name: 'Example conversation' })).toHaveCSS(
          'direction',
          'rtl',
        );
        await contained(page);
        await page.getByRole('button', { name: 'Fail example conversation' }).click();
        const error = page
          .getByRole('region', { name: 'Chat transcript preview' })
          .getByRole('alert');
        await expect(error).toHaveText('Simulated connection failure.');
        await page.getByRole('button', { name: 'Retry response', exact: true }).click();
        await expect(error).toHaveCount(0);
      },
    );
  }

  test(
    'native SDK contract: ' +
      `${profile} attachment status, preview failure and keyboard removal`,
    async ({ page }) => {
      if (test.info().project.name === 'mui') {
        await openUnsupportedExample(
          page,
          profile,
          'Content and data',
          'Chat',
          'ChatAttachment',
        );
        return;
      }

      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.route('**/example-chat-image.png', (route) =>
        route.fulfill({
          contentType: 'image/svg+xml',
          body: [
            '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">',
            '<rect width="64" height="64" fill="#245b44"/>',
            '</svg>',
          ].join(''),
        }),
      );
      await page.route('**/missing-chat-image.png', (route) =>
        route.fulfill({ status: 404 }),
      );
      await content(page, profile);
      await page.getByRole('switch', { name: 'Uploading attachment' }).check();
      await expect(
        page
          .getByRole('region', { name: 'Chat attachment preview' })
          .getByRole('status'),
      ).toContainText('Uploading');
      await page.getByRole('switch', { name: 'Failed attachment' }).check();
      await expect(
        page
          .getByRole('region', { name: 'Chat attachment preview' })
          .getByRole('alert'),
      ).toHaveText('Upload failed');
      await page.getByRole('switch', { name: 'Preview image attachment' }).check();
      await page
        .getByRole('textbox', { name: 'Attachment image URL' })
        .fill('/example-chat-image.png');
      const image = page.getByRole('img', { name: 'example-reference.png' });
      await expect(image).toBeVisible();
      await expect
        .poll(() =>
          image
            .locator('img')
            .evaluate(
              (element) =>
                element instanceof HTMLImageElement && element.naturalWidth > 0,
            ),
        )
        .toBe(true);
      await page
        .getByRole('textbox', { name: 'Attachment image URL' })
        .fill('/missing-chat-image.png');
      await expect(image.locator('img')).toHaveCount(0);
      await expect(image.locator('[data-slot="avatar-fallback"]')).toBeVisible();
      await expect(image).toBeVisible();
      await expect(
        page.getByText('example-reference.png', { exact: true }),
      ).toBeVisible();
      await page.getByRole('switch', { name: 'Protect attachment' }).check();
      const remove = page.getByRole('button', { name: 'Remove example-reference.png' });
      await expect(remove).toBeDisabled();
      await page.getByRole('switch', { name: 'Protect attachment' }).uncheck();
      await remove.focus();
      await page.keyboard.press('Enter');
      await expect(
        page.getByText('Example attachment removed.', { exact: true }),
      ).toBeVisible();
      await page.getByRole('button', { name: 'Restore attachment' }).click();
      await expect(remove).toBeVisible();
      expect(errors).toEqual([]);
    },
  );

  test(
    'native SDK contract: ' +
      `${profile} transcript follow, history, recovery and actions`,
    async ({ page }) => {
      if (test.info().project.name === 'mui') {
        await openUnsupportedExample(
          page,
          profile,
          'Content and data',
          'Chat',
          'ChatAttachment',
        );
        return;
      }

      await content(page, profile);
      await page
        .getByRole('textbox', { name: 'Transcript message text' })
        .fill(LONG_TEXT);
      const add = page.getByRole('button', { name: 'Add example message' });
      for (let index = 0; index < MESSAGE_COUNT; index += 1) await add.click();
      const log = page.getByRole('log', { name: 'Example conversation' });
      const viewport = page.locator(
        '[data-slot="message-scroller-viewport"][aria-label="Example conversation"]',
      );
      await expect
        .poll(() =>
          viewport.evaluate(
            (element) =>
              element.scrollHeight - element.scrollTop - element.clientHeight,
          ),
        )
        .toBeLessThanOrEqual(TOLERANCE);
      await readChatHistory(page, viewport);
      const latest = page.getByRole('button', { name: 'Jump to latest message' });
      await expect(latest).toBeVisible();
      await add.click();
      await expect
        .poll(() => viewport.evaluate((element) => element.scrollTop))
        .toBe(0);
      await latest.focus();
      await page.keyboard.press('Enter');
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
      await page.getByRole('button', { name: 'Stream example conversation' }).click();
      await expect(log).toHaveAttribute('aria-busy', 'true');
      await page.getByRole('button', { name: 'Fail example conversation' }).click();
      await page.getByRole('button', { name: 'Retry response', exact: true }).click();
      await expect(log).toHaveAttribute('aria-busy', 'false');
      await expect(log.getByRole('article')).toHaveCount(MESSAGE_COUNT + 1);
      await page
        .getByRole('button', { name: 'Save example response', exact: true })
        .click();
      await expect(
        page.getByText('Example response saved.', { exact: true }),
      ).toBeVisible();
    },
  );
}
