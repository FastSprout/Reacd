import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../src/core/policy.js';
import { CHAT_POLICY } from '../../src/core/chat-policy.js';

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
  const escaped = await page
    .locator('.reacd-chat-message, .reacd-chat-attachment')
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
  const targets = await page
    .locator('.reacd-chat-message button, .reacd-chat-attachment button')
    .evaluateAll(
      (elements, minimum) =>
        elements.every((element) => {
          const box = element.getBoundingClientRect();
          return box.width >= minimum && box.height >= minimum;
        }),
      LAYOUT_POLICY.controlTargetPx,
    );
  expect(targets).toBe(true);
  const readable = await page.locator('.reacd-chat-file-description').evaluateAll(
    (elements, { trackRem, tolerance }) =>
      elements.every((element) => {
        const parent = element.parentElement;
        if (parent === null) return false;
        const style = getComputedStyle(parent);
        const available =
          parent.clientWidth -
          parseFloat(style.paddingInlineStart) -
          parseFloat(style.paddingInlineEnd);
        const track =
          parseFloat(getComputedStyle(document.documentElement).fontSize) * trackRem;
        return (
          element.getBoundingClientRect().width + tolerance >=
          Math.min(available, track)
        );
      }),
    { trackRem: CHAT_POLICY.metadataTrackRem, tolerance: TOLERANCE },
  );
  expect(readable).toBe(true);
}

for (const profile of ['Spacious', 'Compact']) {
  for (const width of WIDTHS) {
    test(`${profile} chat at ${width}px, 200% text and scoped RTL`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: HEIGHT });
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
      await expect(page.getByRole('alert')).toContainText(
        'Simulated connection failure.',
      );
      await page.getByRole('button', { name: 'Retry response', exact: true }).click();
      await expect(page.getByRole('alert')).toHaveCount(0);
    });
  }

  test(`${profile} attachment status, preview failure and keyboard removal`, async ({
    page,
  }) => {
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
      page.locator('.reacd-chat-attachment').getByRole('status'),
    ).toContainText('Uploading');
    await page.getByRole('switch', { name: 'Failed attachment' }).check();
    await expect(page.getByRole('alert')).toContainText('Upload failed');
    await page.getByRole('switch', { name: 'Preview image attachment' }).check();
    await page
      .getByRole('textbox', { name: 'Attachment image URL' })
      .fill('/example-chat-image.png');
    const image = page.getByRole('img', { name: 'example-reference.png' });
    await expect(image).toBeVisible();
    await expect
      .poll(() =>
        image.evaluate(
          (element) => element instanceof HTMLImageElement && element.naturalWidth > 0,
        ),
      )
      .toBe(true);
    await page
      .getByRole('textbox', { name: 'Attachment image URL' })
      .fill('/missing-chat-image.png');
    await expect(image).toHaveCount(0);
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
  });

  test(`${profile} transcript follow, history, recovery and actions`, async ({
    page,
  }) => {
    await content(page, profile);
    await page
      .getByRole('textbox', { name: 'Transcript message text' })
      .fill(LONG_TEXT);
    const add = page.getByRole('button', { name: 'Add example message' });
    for (let index = 0; index < MESSAGE_COUNT; index += 1) await add.click();
    const log = page.getByRole('log', { name: 'Example conversation' });
    await expect
      .poll(() =>
        log.evaluate(
          (element) => element.scrollHeight - element.scrollTop - element.clientHeight,
        ),
      )
      .toBeLessThanOrEqual(TOLERANCE);
    await log.evaluate((element) => {
      element.scrollTop = 0;
    });
    const latest = page.getByRole('button', { name: 'Jump to latest message' });
    await expect(latest).toBeVisible();
    await add.click();
    await expect.poll(() => log.evaluate((element) => element.scrollTop)).toBe(0);
    await latest.focus();
    await page.keyboard.press('Enter');
    await expect(latest).toHaveCount(0);
    await expect
      .poll(() =>
        log.evaluate(
          (element) => element.scrollHeight - element.scrollTop - element.clientHeight,
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
  });
}
