import { openUnsupportedExample } from '../native-capabilities.js';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../../src/core/policy.js';

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
  const prompts = page.getByRole('form').filter({
    has: page.getByRole('textbox', { name: /Example message|Palette message/ }),
  });
  expect(await prompts.count()).toBeGreaterThan(0);
  expect(
    await prompts.evaluateAll(
      (nodes, tolerance) =>
        nodes.every((node) => node.scrollWidth <= node.clientWidth + tolerance),
      TOLERANCE,
    ),
  ).toBe(true);
  const submit = prompts.getByRole('button', { name: 'Send message', exact: true });
  expect(await submit.count()).toBeGreaterThan(0);
  expect(
    await submit.evaluateAll(
      (nodes, minimum) =>
        nodes.every((node) => {
          const bounds = node.getBoundingClientRect();
          return bounds.width >= minimum && bounds.height >= minimum;
        }),
      LAYOUT_POLICY.controlTargetPx,
    ),
  ).toBe(true);
  const palette = page.getByRole('region', { name: 'Palette conversation' });
  if (await palette.isVisible()) {
    const transcript = palette.locator('[data-radix-scroll-area-viewport]');
    const composer = palette.getByRole('form', { name: 'Palette message' });
    const historyBox = await transcript.boundingBox();
    const composerBox = await composer.boundingBox();
    expect(historyBox).not.toBeNull();
    expect(composerBox).not.toBeNull();
    if (historyBox === null || composerBox === null) {
      throw new Error('Missing native palette geometry.');
    }
    expect(historyBox.y + historyBox.height).toBeLessThanOrEqual(
      composerBox.y + TOLERANCE,
    );
  }
}

for (const profile of ['Spacious', 'Compact']) {
  for (const width of WIDTHS) {
    test(
      'native SDK contract: ' + `${profile} composer at ${width}px, RTL and 200%`,
      async ({ page }) => {
        await page.setViewportSize({ width, height: HEIGHT });
        if (test.info().project.name === 'mui') {
          await openUnsupportedExample(
            page,
            profile,
            'Content and data',
            'ChatComposer',
            'ChatPromptSubmit',
          );

          await page.locator('html').evaluate((element) => {
            element.style.fontSize = '200%';
          });
          await expect(
            page.getByText('Cannot load ChatComposer', { exact: true }),
          ).toBeVisible();
          return;
        }

        await content(page, profile);
        const draft = page.getByRole('textbox', {
          name: 'Example message',
          exact: true,
        });
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
        await expect(
          dialog
            .getByRole('log', { name: 'Palette transcript' })
            .getByText(LONG_TEXT, { exact: true }),
        ).toHaveText(LONG_TEXT);
        await expect(modalDraft).toBeInViewport();
        await contained(page);
        await modalDraft.press('Escape');
        await expect(dialog).not.toBeVisible();
        await expect(
          page.getByRole('button', { name: 'Open example conversation' }),
        ).toBeFocused();
      },
    );
  }

  test(
    'native SDK contract: ' +
      `${profile} composer Enter, newline, status and file controls`,
    async ({ page }) => {
      if (test.info().project.name === 'mui') {
        await openUnsupportedExample(
          page,
          profile,
          'Content and data',
          'ChatComposer',
          'ChatPromptSubmit',
        );
        return;
      }

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
      await expect(
        preview.getByRole('button', { name: 'Stop response' }),
      ).toBeVisible();
      await expect(draft).toHaveValue('First line\nA');
      await preview.getByRole('button', { name: 'Stop response' }).click();
      await preview.getByRole('button', { name: 'Simulate response failure' }).click();
      await expect(preview.getByRole('alert')).toHaveText('Example connection failed.');
      await preview.getByRole('button', { name: 'Retry response' }).click();
      await preview.getByRole('button', { name: 'Remove Example report' }).click();
      await draft.fill('   ');
      await expect(
        preview.getByRole('button', { name: 'Send message' }),
      ).toBeDisabled();
      expect(errors).toEqual([]);
    },
  );

  test(
    'native SDK contract: ' + `${profile} composition completion never submits`,
    async ({ page }) => {
      if (test.info().project.name === 'mui') {
        await openUnsupportedExample(
          page,
          profile,
          'Content and data',
          'ChatComposer',
          'ChatPromptSubmit',
        );
        return;
      }

      await content(page, profile);
      const preview = page.getByRole('region', { name: 'Chat prompt preview' });
      const draft = preview.getByRole('textbox', { name: 'Example message' });
      await draft.fill('Composition draft');
      await draft.dispatchEvent('compositionstart');
      await draft.dispatchEvent('keydown', { key: 'Enter', isComposing: true });
      await expect(preview.getByRole('button', { name: 'Send message' })).toBeVisible();
      await expect(preview.getByText('No request yet.', { exact: true })).toBeVisible();
      await draft.dispatchEvent('compositionend');
      await draft.dispatchEvent('keydown', { key: 'Enter', keyCode: 229 });
      await expect(preview.getByRole('button', { name: 'Send message' })).toBeVisible();
      await expect(preview.getByText('No request yet.', { exact: true })).toBeVisible();
      await draft.press('Enter');
      await expect(
        preview.getByRole('button', { name: 'Stop response' }),
      ).toBeVisible();
    },
  );
}
