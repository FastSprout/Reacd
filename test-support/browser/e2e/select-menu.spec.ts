import { expect, test } from '@playwright/test';
import { openUnsupportedExample } from '../native-capabilities.js';
import type { Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../../src/core/policy.js';

const WIDTHS = [240, 360, 1440];
const HEIGHT = 1000;
const TOLERANCE = 1;

async function fields(page: Page, profile: string) {
  if (test.info().project.name === 'mui') {
    await openUnsupportedExample(page, profile, 'Fields', 'SelectMenu');
    await expect(
      page.getByRole('combobox', { name: 'Primary record', exact: true }),
    ).toHaveCount(0);
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });
    return true;
  }
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Fields', exact: true }).click();
  return false;
}

async function contained(page: Page) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual((await page.evaluate(() => innerWidth)) + TOLERANCE);
}

for (const profile of ['Spacious', 'Compact']) {
  for (const width of WIDTHS) {
    test(`${profile} searchable choice ${width}px, RTL and 200% text`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      if (await fields(page, profile)) return;
      await page.getByRole('switch', { name: 'Right to left selection' }).check();
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      const trigger = page.getByRole('combobox', {
        name: 'Primary record',
        exact: true,
      });
      await trigger.click();
      const list = page.getByRole('listbox');
      await expect(list).toHaveCSS('direction', 'rtl');
      const option = list.getByRole('option', { name: /An option with a long label/ });
      await expect(option).toBeVisible();
      const box = await list.boundingBox();
      if (box === null) throw new Error('Missing choice geometry.');
      expect(box.x).toBeGreaterThanOrEqual(-TOLERANCE);
      expect(box.x + box.width).toBeLessThanOrEqual(width + TOLERANCE);
      const target = await option.boundingBox();
      if (target === null) throw new Error('Missing option geometry.');
      expect(target.height).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
      await option.click();
      await expect(trigger).toContainText('An option with a long label');
      await contained(page);
      await trigger.click();
      const query = page.getByRole('combobox', { name: 'Search Primary record' });
      await query.fill('beta');
      await list.getByRole('option', { name: 'Beta', exact: true }).click();
      await trigger.click();
      await expect(query).toBeFocused();
      await expect(query).toHaveValue('beta');
      await page.keyboard.press('Escape');
      await expect(trigger).toBeFocused();
      await contained(page);
    });
  }

  test(`${profile} native forms, readonly required and disabled history clear`, async ({
    page,
  }) => {
    if (await fields(page, profile)) return;
    const primary = page.getByRole('combobox', { name: 'Primary record', exact: true });
    await page.getByRole('switch', { name: 'Read-only selection' }).check();
    await page.getByRole('button', { name: 'Save primary record' }).click();
    await expect(primary).toBeFocused();
    await expect(
      page.getByText('Choose an option before submitting.', { exact: true }),
    ).toBeVisible();
    await page.getByRole('switch', { name: 'Read-only selection' }).uncheck();
    await primary.click();
    await page.getByRole('option', { name: /Answer/ }).click();
    await page.getByRole('button', { name: 'Save primary record' }).click();
    const single = page.getByRole('form', { name: 'Single record form' });
    expect(
      await single.evaluate((form: HTMLFormElement) => Array.from(new FormData(form))),
    ).toEqual([['primary', '42']]);
    const multiple = page.getByRole('combobox', {
      name: 'Related records',
      exact: true,
    });
    await multiple.click();
    await page.getByRole('option', { name: /Answer/ }).click();
    await page.getByRole('option', { name: 'Beta', exact: true }).click();
    await page.getByRole('button', { name: 'Save related records' }).click();
    const form = page.getByRole('form', { name: 'Multiple records form' });
    expect(
      await form.evaluate((element: HTMLFormElement) =>
        Array.from(new FormData(element)),
      ),
    ).toEqual([
      ['related', '42'],
      ['related', 'beta'],
    ]);
    await page.getByRole('button', { name: 'Restore unavailable selection' }).click();
    await primary.focus();
    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('button', { name: 'Clear selection Primary record' }),
    ).toBeFocused();
    await page.keyboard.press('Space');
    await expect(primary).toHaveText('Choose an option.');
    await expect(primary).toBeFocused();
    await page.getByRole('switch', { name: 'Disable selection' }).check();
    expect(
      await form.evaluate((element: HTMLFormElement) =>
        Array.from(new FormData(element)),
      ),
    ).toEqual([]);
  });

  test(`${profile} veto and nested popup Escape remain scoped`, async ({ page }) => {
    if (await fields(page, profile)) return;
    await page.getByRole('switch', { name: 'Decline selection' }).check();
    const trigger = page.getByRole('combobox', { name: 'Primary record', exact: true });
    await trigger.click();
    await page.getByRole('option', { name: /Answer/ }).click();
    await expect(trigger).toHaveText('Choose an option.');
    await expect(page.getByRole('listbox')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    await expect(page.getByRole('listbox')).toBeHidden();
    await page.getByRole('button', { name: 'Open nested selection' }).click();
    const dialog = page.getByRole('dialog', { name: 'Nested selection', exact: true });
    const nestedTrigger = dialog.getByRole('combobox', {
      name: 'Dialog records',
      exact: true,
    });
    await nestedTrigger.click();
    await expect(
      dialog.getByRole('combobox', {
        name: 'Search Dialog records',
        exact: true,
      }),
    ).toBeFocused();
    await expect(dialog.getByRole('listbox')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog.getByRole('listbox')).toBeHidden();
    await expect(dialog).toHaveAttribute('data-state', 'open');
    await expect(dialog).toBeVisible();
    await expect(nestedTrigger).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });
}

test('host close restores focus without a focus-changing click', async ({ page }) => {
  if (test.info().project.name === 'mui') {
    await openUnsupportedExample(page, 'Spacious', 'Fields', 'SelectMenu');
    await expect(page.getByRole('combobox', { name: 'Focus records' })).toHaveCount(0);
    return;
  }
  await page.goto('/');
  await page.getByRole('tab', { name: 'Generative UI', exact: true }).click();
  const source = page.getByRole('textbox', { name: 'JSON declaration' });
  const declaration = {
    schemaVersion: '0.2',
    state: [
      { key: 'selected', kind: 'text', access: 'readWrite', initial: '42' },
      { key: 'query', kind: 'text', access: 'readWrite', initial: '' },
      { key: 'showA', kind: 'boolean', access: 'readWrite', initial: true },
      { key: 'showB', kind: 'boolean', access: 'readWrite', initial: false },
    ],
    root: {
      type: 'SelectMenu',
      label: 'Focus records',
      items: [{ value: '42', label: 'Answer' }],
      value: { state: 'selected', mode: 'readWrite' },
      query: { state: 'query', mode: 'readWrite' },
      open: { state: 'showA', mode: 'readWrite' },
    },
  };
  await source.fill(JSON.stringify(declaration));
  const apply = page.getByRole('button', { name: 'Render declaration', exact: true });
  await apply.click();
  const trigger = page.getByRole('combobox', { name: 'Focus records', exact: true });
  const query = page.getByRole('combobox', { name: 'Search Focus records' });
  await expect(query).toBeFocused();
  await query.press('Escape');
  await expect(query).toBeHidden();
  await source.fill(
    JSON.stringify({
      ...declaration,
      root: {
        ...declaration.root,
        open: { state: 'showB', mode: 'readWrite' },
      },
    }),
  );
  await trigger.click();
  await expect(query).toBeVisible();
  await query.focus();
  await expect(query).toBeFocused();
  await apply.evaluate((button: HTMLButtonElement) => button.click());
  await expect(query).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('IME Enter and process keys do not commit options', async ({ page }) => {
  if (await fields(page, 'Spacious')) return;
  const trigger = page.getByRole('combobox', {
    name: 'Primary record',
    exact: true,
  });
  await trigger.click();
  const query = page.getByRole('combobox', { name: 'Search Primary record' });
  await expect(query).toBeFocused();
  await query.press('ArrowDown');
  await query.evaluate((input) => {
    input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
    input.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        keyCode: 229,
        isComposing: true,
        bubbles: true,
      }),
    );
    input.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        keyCode: 229,
        bubbles: true,
      }),
    );
    input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }));
  });
  await expect(trigger).toHaveText('Choose an option.');
  await expect(page.getByRole('listbox')).toBeVisible();
  await query.press('Escape');
  await expect(trigger).toBeFocused();
});

test('Space edits query and Tab leaves without selecting or trapping focus', async ({
  page,
}) => {
  if (await fields(page, 'Spacious')) return;
  const trigger = page.getByRole('combobox', { name: 'Primary record', exact: true });
  await trigger.click();
  const query = page.getByRole('combobox', { name: 'Search Primary record' });
  await query.fill('two');
  await query.press('Space');
  await expect(query).toHaveValue('two ');
  await query.press('Tab');
  await expect(query).toBeHidden();
  await expect(
    page.getByRole('button', {
      name: 'Clear selection Primary record',
    }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Save primary record' })).toBeFocused();
  await expect(trigger).toHaveText('Choose an option.');
});
