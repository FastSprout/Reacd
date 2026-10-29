import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const PROFILES = ['Spacious', 'Compact'];
const WIDTHS = [240, 360, 768, 1440];
const HEIGHT = 1000;
const TOLERANCE = 1;
const LONG_TEXT = 'Unbroken_editor_content_'.repeat(40);

async function editors(page: Page, profile: string) {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Content and data', exact: true }).click();
  await expect(
    page.getByRole('textbox', { name: 'Project notes', exact: true }),
  ).toBeVisible();
}
async function contained(page: Page) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual((page.viewportSize()?.width ?? 0) + TOLERANCE);
  expect(
    await page
      .locator('.reacd-editor .ProseMirror:visible')
      .evaluateAll(
        (elements, tolerance) =>
          elements.every(
            (element) => element.scrollWidth <= element.clientWidth + tolerance,
          ),
        TOLERANCE,
      ),
  ).toBe(true);
  expect(
    await page
      .locator('.reacd-editor-menu:visible')
      .evaluateAll(
        (elements, tolerance) =>
          elements.every(
            (element) => element.scrollWidth <= element.clientWidth + tolerance,
          ),
        TOLERANCE,
      ),
  ).toBe(true);
}

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    test(`${profile} editors at ${width}px, RTL and 200%`, async ({ page }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await editors(page, profile);
      const notes = page.getByRole('textbox', { name: 'Project notes', exact: true });
      await notes.fill(LONG_TEXT);
      await expect(
        page.getByRole('textbox', { name: 'Notes reader', exact: true }),
      ).toHaveText(LONG_TEXT);
      await contained(page);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await page.getByRole('switch', { name: 'Right to left notes' }).check();
      await expect(notes).toHaveCSS('direction', 'rtl');
      await page
        .getByRole('switch', {
          name: 'Right to left editor-suggestion-menu',
        })
        .check();
      const suggestion = page.getByRole('textbox', {
        name: 'Block suggestion document',
        exact: true,
      });
      await suggestion.fill('/he');
      const option = page.getByRole('option', { name: 'Heading', exact: true });
      await expect(option).toBeVisible();
      await expect(suggestion).toHaveCSS('direction', 'rtl');
      await contained(page);
      await page.keyboard.press('Enter');
      await expect(suggestion.locator('h1')).toHaveCount(1);
      await expect(suggestion).toBeFocused();
      await contained(page);
    });
  }

  test(`${profile} native edits, safe paste, history and atomic rejection`, async ({
    page,
    context,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await editors(page, profile);
    const notes = page.getByRole('textbox', { name: 'Project notes', exact: true });
    await notes.fill('Edited note');
    const reader = page.getByRole('textbox', { name: 'Notes reader', exact: true });
    await expect(reader).toHaveText('Edited note');
    await page.getByRole('switch', { name: 'Reject note changes' }).check();
    await notes.press('End');
    await notes.pressSequentially('!');
    await expect(notes).toHaveText('Edited note');
    await expect(reader).toHaveText('Edited note');
    await page.getByRole('switch', { name: 'Reject note changes' }).uncheck();
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.evaluate(async () => {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': new Blob(['<script>Literal</script>\nNext'], {
            type: 'text/plain',
          }),
          'text/html': new Blob(['<img src=x onerror=alert(1)>'], {
            type: 'text/html',
          }),
        }),
      ]);
    });
    await notes.focus();
    await page.keyboard.press('ControlOrMeta+a');
    await page.keyboard.press('ControlOrMeta+v');
    await expect(notes).toContainText('<script>Literal</script>');
    await expect(notes.locator('script,img')).toHaveCount(0);
    await expect(reader).toHaveText((await notes.textContent()) ?? '');
    await page.getByRole('button', { name: 'Replace notes from host' }).click();
    await expect(notes).toHaveText('Replaced by the host.');
    await page.getByRole('switch', { name: 'Read-only notes' }).check();
    await expect(notes).toHaveAttribute('contenteditable', 'false');
    await page.getByRole('switch', { name: 'Read-only notes' }).uncheck();
    await page.getByRole('switch', { name: 'Disable notes' }).check();
    await expect(notes).toHaveAttribute('aria-disabled', 'true');
    await page.getByRole('switch', { name: 'Disable notes' }).uncheck();

    const draft = page.getByRole('textbox', { name: 'Review draft', exact: true });
    await draft.focus();
    await page.keyboard.press('ControlOrMeta+a');
    const toolbar = page.getByRole('toolbar', { name: 'Review formatting' });
    await toolbar.getByRole('button', { name: 'Bold', exact: true }).click();
    await expect(draft.locator('strong')).toHaveText('Toolbar draft.');
    await toolbar.getByRole('button', { name: 'Undo', exact: true }).click();
    await expect(draft.locator('strong')).toHaveCount(0);
    await toolbar.getByRole('button', { name: 'Redo', exact: true }).click();
    await expect(draft.locator('strong')).toHaveText('Toolbar draft.');

    const atomic = page.getByRole('textbox', { name: 'Controlled notes', exact: true });
    await page.getByRole('switch', { name: 'Reject atomic edits' }).check();
    await atomic.focus();
    await page.keyboard.press('End');
    await page.keyboard.press('Enter');
    await expect(page.getByText('Accepted blocks: 1', { exact: true })).toBeVisible();
    await expect(atomic).toHaveText('Controlled draft.');
    await page.getByRole('switch', { name: 'Reject atomic edits' }).uncheck();
    await atomic.focus();
    await page.keyboard.press('End');
    await page.keyboard.press('Enter');
    await expect(page.getByText('Accepted blocks: 2', { exact: true })).toBeVisible();
    await page.keyboard.press('Backspace');
    await expect(page.getByText('Accepted blocks: 1', { exact: true })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test(`${profile} trigger menus, keyboard and composition`, async ({ page }) => {
    await editors(page, profile);
    const mention = page.getByRole('textbox', { name: 'Mention document' });
    await mention.fill('@ex');
    await expect(
      page.getByRole('option', { name: 'Example person', exact: true }),
    ).toHaveAttribute('aria-selected', 'true');
    await expect(mention).toHaveAttribute('aria-activedescendant', /.+/);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(mention).toHaveText('@Example person ');
    await expect(mention).toBeFocused();
    const emoji = page.getByRole('textbox', { name: 'Emoji document' });
    await emoji.fill(':missing');
    await expect(page.getByText('No matching results.', { exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('listbox', { name: 'Wave options' })).toHaveCount(0);
    await emoji.fill('');
    await emoji.pressSequentially(':wa');
    await page.getByRole('option', { name: 'Wave', exact: true }).click();
    await expect(emoji.getByRole('img', { name: 'wave' })).toBeVisible();
    await expect(emoji).toBeFocused();
    await emoji.fill('');
    await emoji.dispatchEvent('compositionstart');
    await page.keyboard.insertText('composed');
    await emoji.dispatchEvent('compositionend', { data: 'composed' });
    await expect(emoji).toHaveText('composed');
    await page.getByRole('switch', { name: 'Read-only editor-emoji-menu' }).check();
    await expect(emoji).toHaveAttribute('contenteditable', 'false');
    await contained(page);
  });
}
