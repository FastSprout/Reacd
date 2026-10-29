import { expect, test } from '@playwright/test';

const PROFILES = ['Spacious', 'Compact'];
const FAILURE = 'Injected native editor observer startup failure.';

for (const profile of PROFILES) {
  test(`${profile} native startup recovery preserves host data and neighbors`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.addInitScript((message: string) => {
      const NativeObserver = window.MutationObserver;
      let pending = true;
      window.MutationObserver = class extends NativeObserver {
        override observe(target: Node, options?: MutationObserverInit): void {
          if (
            pending &&
            target instanceof Element &&
            target.classList.contains('ProseMirror')
          ) {
            pending = false;
            throw new Error(message);
          }
          super.observe(target, options);
        }
      };
    }, FAILURE);
    await page.goto('/');
    await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
    await page.getByRole('option', { name: profile, exact: true }).click();
    await page.getByRole('button', { name: 'Content and data', exact: true }).click();

    const diagnostic = page.getByRole('alert').filter({
      hasText: 'Editor could not start.',
    });
    await expect(diagnostic).toBeVisible();
    const retry = page.getByRole('button', { name: 'Retry editor', exact: true });
    await expect(retry).toBeVisible();
    const notes = page.getByRole('textbox', { name: 'Project notes', exact: true });
    await expect(notes).toHaveCount(0);
    const reader = page.getByRole('textbox', { name: 'Notes reader', exact: true });
    await expect(reader).toHaveText('Start a project note.');
    await expect(reader).toHaveAttribute('aria-readonly', 'true');
    await expect(
      page.getByText('Document edit requests: 0', {
        exact: true,
      }),
    ).toBeVisible();
    const actions = page.getByRole('button', {
      name: 'Actions and feedback',
      exact: true,
    });
    await expect(actions).toBeEnabled();

    await page.getByRole('button', { name: 'Replace notes from host' }).click();
    await expect(reader).toHaveText('Replaced by the host.');
    await expect(diagnostic).toBeVisible();
    await retry.click();
    await expect(notes).toHaveText('Replaced by the host.');
    await expect(diagnostic).toHaveCount(0);
    await expect(
      page.getByRole('button', {
        name: 'Retry editor',
        exact: true,
      }),
    ).toHaveCount(0);
    await expect(
      page.getByText('Document edit requests: 0', {
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      page
        .getByRole('toolbar', {
          name: 'Document formatting',
        })
        .getByRole('button', { name: 'Bold', exact: true }),
    ).toBeEnabled();
    await notes.focus();
    await page.keyboard.press('ControlOrMeta+a');
    await page.keyboard.press('ArrowRight');
    await expect
      .poll(() =>
        notes.evaluate((node) => {
          const selection = window.getSelection();
          if (
            selection === null ||
            !selection.isCollapsed ||
            selection.anchorNode === null ||
            !node.contains(selection.anchorNode)
          )
            return false;
          const beforeCaret = document.createRange();
          beforeCaret.selectNodeContents(node);
          beforeCaret.setEnd(selection.anchorNode, selection.anchorOffset);
          return beforeCaret.toString().length === node.textContent?.length;
        }),
      )
      .toBe(true);
    await page.keyboard.type('!');
    await expect(reader).toHaveText('Replaced by the host.!');
    await expect(
      page.getByText('Document edit requests: 1', {
        exact: true,
      }),
    ).toBeVisible();
    await actions.click();
    await expect(notes).toHaveCount(0);
    await page.getByRole('button', { name: 'Content and data', exact: true }).click();
    await expect(notes).toHaveText('Replaced by the host.!');
    await expect(reader).toHaveText('Replaced by the host.!');
    await expect(
      page.getByText('Document edit requests: 1', {
        exact: true,
      }),
    ).toBeVisible();
    expect(errors).toEqual([]);
  });
}
