import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../src/core/policy.js';

const WIDTHS = [240, 360, 768, 1440];
const HEIGHT = 1000;
const TOLERANCE = 1;
const LONG_TEXT = 'Unbroken_example_composer_'.repeat(30);

async function content(page: Page, profile: string) {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Content and data', exact: true }).click();
}

async function contained(page: Page) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual((await page.evaluate(() => innerWidth)) + TOLERANCE);
  expect(
    await page
      .locator('.reacd-chat-prompt:visible, .reacd-chat-palette:visible')
      .evaluateAll(
        (nodes, tolerance) =>
          nodes.every((node) => node.scrollWidth <= node.clientWidth + tolerance),
        TOLERANCE,
      ),
  ).toBe(true);
  expect(
    await page.locator('.reacd-chat-prompt-submit:visible').evaluateAll(
      (nodes, minimum) =>
        nodes.every((node) => {
          const bounds = node.getBoundingClientRect();
          return bounds.width >= minimum && bounds.height >= minimum;
        }),
      LAYOUT_POLICY.controlTargetPx,
    ),
  ).toBe(true);
  expect(await page.locator('.reacd-chat-palette:visible').evaluateAll((nodes) =>
    nodes.every((node) => {
      const content = node.querySelector('.reacd-chat-palette-content');
      const prompt = node.querySelector('.reacd-chat-palette-prompt');
      return content === null || prompt === null ||
        content.getBoundingClientRect().bottom <= prompt.getBoundingClientRect().top;
    }))).toBe(true);
}

for (const profile of ['Spacious', 'Compact']) {
  for (const width of WIDTHS) {
    test(`${profile} composer at ${width}px, RTL and 200%`, async ({ page }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await content(page, profile);
      const draft = page.getByRole('textbox', { name: 'Example message', exact: true });
      await draft.fill(LONG_TEXT);
      await contained(page);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await page.getByRole('switch', { name: 'Right to left chat composer' }).check();
      await expect(draft).toHaveCSS('direction', 'rtl');
      await contained(page);
      await page.getByRole('button', { name: 'Open example conversation' }).click();
      const dialog = page.getByRole('dialog', { name: 'Example conversation' });
      const modalDraft = dialog.getByRole('textbox', { name: 'Palette message' });
      await modalDraft.fill(LONG_TEXT);
      await modalDraft.press('Enter');
      await expect(dialog.getByRole('log', { name: 'Palette transcript' })
        .locator('.reacd-chat-message-text')).toHaveText(LONG_TEXT);
      await expect(modalDraft).toBeInViewport();
      await contained(page);
      await modalDraft.press('Escape');
      await expect(dialog).not.toBeVisible();
      await expect(
        page.getByRole('button', { name: 'Open example conversation' }),
      ).toBeFocused();
    });
  }

  test(`${profile} composer Enter, newline, status and file controls`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await content(page, profile);
    const preview = page.getByRole('region', { name: 'Chat prompt preview' });
    const draft = preview.getByRole('textbox', { name: 'Example message' });
    await draft.fill('First line');
    await draft.press('Shift+Enter');
    await draft.press('A');
    await expect(draft).toHaveValue('First line\nA');
    await draft.press('Enter');
    await expect(preview.getByRole('button', { name: 'Stop response' })).toBeVisible();
    await expect(draft).toHaveValue('First line\nA');
    await preview.getByRole('button', { name: 'Stop response' }).click();
    await preview.getByRole('button', { name: 'Simulate response failure' }).click();
    await expect(preview.getByRole('alert')).toHaveText('Example connection failed.');
    await preview.getByRole('button', { name: 'Retry response' }).click();
    await preview.getByRole('button', { name: 'Remove Example report' }).click();
    await draft.fill('   ');
    await expect(preview.getByRole('button', { name: 'Send message' })).toBeDisabled();
    expect(errors).toEqual([]);
  });

  test(`${profile} composition completion never submits`, async ({ page }) => {
    await content(page, profile);
    const preview = page.getByRole('region', { name: 'Chat prompt preview' });
    const draft = preview.getByRole('textbox', { name: 'Example message' });
    await draft.fill('Composition draft');
    await draft.dispatchEvent('compositionstart');
    await draft.press('Enter');
    await expect(preview.getByRole('button', { name: 'Send message' })).toBeVisible();
    await draft.dispatchEvent('compositionend');
    await draft.dispatchEvent('keydown', { key: 'Enter', keyCode: 229 });
    await expect(preview.getByRole('button', { name: 'Send message' })).toBeVisible();
    await draft.press('Enter');
    await expect(preview.getByRole('button', { name: 'Stop response' })).toBeVisible();
  });
}
