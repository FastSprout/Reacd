import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { expectUnsupportedDiagnostic } from '../native-capabilities.js';
import { watchPreviewFailures } from '../preview-failures.js';
import { scrollOverflowDiagnostic } from '../scroll-overflow.js';
import { LAYOUT_POLICY } from '../../../src/core/policy.js';

const WIDTHS = [240, 320, 375, 600, 768, 1024, 1440, 1920];
const TEMPLATES = ['Spacious', 'Compact'];
const VIEWPORT_HEIGHT = 1000;
const PIXEL_TOLERANCE = 1;
const OVERFLOW_PROBE_WIDTH = 320;

async function select(page: Page, name: string, option: string) {
  await page.getByRole('combobox', { name, exact: true }).click();
  await page.getByRole('option', { name: option, exact: true }).click();
}

async function contained(page: Page) {
  const widths = await page.evaluate(() => ({
    page: document.documentElement.scrollWidth,
    viewport: innerWidth,
  }));
  const diagnostics = widths.page > widths.viewport + PIXEL_TOLERANCE
    ? await page.evaluate(scrollOverflowDiagnostic, PIXEL_TOLERANCE)
    : undefined;
  if (diagnostics) {
    await test.info().attach('document-scroll-overflow', {
      body: JSON.stringify(diagnostics, null, 2),
      contentType: 'application/json',
    });
  }
  expect(widths.page, JSON.stringify(diagnostics))
    .toBeLessThanOrEqual(widths.viewport + PIXEL_TOLERANCE);
  const surface = page.locator('[data-adapter]').first();
  await expect(surface).toBeVisible();
  const surfaceBox = await surface.boundingBox();
  if (!surfaceBox) throw new Error('Expected native application surface bounds.');
  expect(surfaceBox.width).toBeGreaterThan(0);
  expect(surfaceBox.x).toBeGreaterThanOrEqual(-PIXEL_TOLERANCE);
  expect(surfaceBox.x + surfaceBox.width).toBeLessThanOrEqual(
    widths.viewport + PIXEL_TOLERANCE,
  );
  const forms = page.getByRole('form');
  const escaped = await forms.evaluateAll(
    (elements, tolerance) =>
      elements.flatMap((element) => {
        const box = element.getBoundingClientRect();
        let parent = element.parentElement;
        while (parent && getComputedStyle(parent).display === 'contents')
          parent = parent.parentElement;
        if (!parent || box.width === 0) return [];
        const outer = parent.getBoundingClientRect();
        return box.left < outer.left - tolerance || box.right > outer.right + tolerance
          ? [`Native form escaped: ${element.getAttribute('aria-label')}`]
          : [];
      }),
    PIXEL_TOLERANCE,
  );
  expect(escaped).toEqual([]);
}

test('detects real overflow through the selected SDK native form boundary', async ({
  page,
}) => {
  await page.setViewportSize({ width: OVERFLOW_PROBE_WIDTH, height: VIEWPORT_HEIGHT });
  await page.goto('/');
  const form = page.getByRole('form', { name: 'Local credential example' });
  await expect(form).toBeVisible();
  await expect(form.locator('..')).not.toHaveCSS('display', 'contents');
  await contained(page);
  await form.evaluate((element, offset) => {
    if (!(element instanceof HTMLElement)) throw new Error('Missing native form.');
    element.style.position = 'relative';
    element.style.left = `-${offset}px`;
  }, LAYOUT_POLICY.controlTargetPx);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(OVERFLOW_PROBE_WIDTH + PIXEL_TOLERANCE);
  await expect(contained(page)).rejects.toThrow(
    'Native form escaped: Local credential example',
  );
});

for (const template of TEMPLATES) {
  for (const width of WIDTHS) {
    test(`${template} contains long text at ${width}px and 200% text`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
      const failures = watchPreviewFailures(page);
      await page.goto('/');
      await select(page, 'Appearance', template);
      await contained(page);
      await page.getByRole('button', { name: 'Example overview' }).click();
      await page.getByRole('button', { name: 'Advanced settings' }).click();
      await page.getByRole('button', { name: 'Nested settings' }).click();
      await contained(page);
      const disclosures = page.getByText('Full text', { exact: true });
      expect(await disclosures.count()).toBeGreaterThan(0);
      for (const disclosure of await disclosures.all()) {
        await expect(disclosure).toBeVisible();
        await disclosure.click();
        await contained(page);
      }
      await page.getByRole('switch', { name: 'Compact container' }).click();
      await contained(page);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await contained(page);
      await page.getByRole('switch', { name: 'Compact container' }).click();
      await page.evaluate(() => {
        document.documentElement.dir = 'rtl';
      });
      await contained(page);
      await page.evaluate(() => {
        document.documentElement.dir = 'ltr';
      });
      await page.getByRole('button', { name: 'Content and data' }).click();
      await expect(
        page.getByRole('region', { name: 'Example inventory' }),
      ).toHaveAttribute('tabindex', '0');
      await contained(page);
      await page.getByRole('tab', { name: 'Generative UI' }).click();
      if (test.info().project.name === 'mui') {
        await expectUnsupportedDiagnostic(page, failures, 'Generative UI', 'SplitView');
        return;
      }
      await expect(page.getByRole('region', { name: 'Sample orders' })).toHaveAttribute(
        'tabindex',
        '0',
      );
      const choice = page.getByRole('combobox', { name: 'Filter Active' });
      const bounds = await choice.evaluate((element) => {
        const box = element.getBoundingClientRect();
        const parent = element.parentElement?.getBoundingClientRect();
        if (!parent) throw new Error('Missing native filter track.');
        const label = element.querySelector('span');
        if (!label) throw new Error('Missing native filter label.');
        const labelBox = label.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(label);
        return { left: box.left, right: box.right,
          parentLeft: parent.left, parentRight: parent.right,
          label: { top: labelBox.top, bottom: labelBox.bottom,
            left: labelBox.left, right: labelBox.right },
          glyphs: [...range.getClientRects()].map((rect) => ({
            top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right,
          })) };
      });
      expect(bounds.left).toBeGreaterThanOrEqual(bounds.parentLeft - PIXEL_TOLERANCE);
      expect(bounds.right).toBeLessThanOrEqual(bounds.parentRight + PIXEL_TOLERANCE);
      expect(bounds.glyphs.length).toBeGreaterThan(0);
      for (const glyph of bounds.glyphs) {
        expect(glyph.top).toBeGreaterThanOrEqual(bounds.label.top - PIXEL_TOLERANCE);
        expect(glyph.bottom).toBeLessThanOrEqual(bounds.label.bottom + PIXEL_TOLERANCE);
        expect(glyph.left).toBeGreaterThanOrEqual(bounds.label.left - PIXEL_TOLERANCE);
        expect(glyph.right).toBeLessThanOrEqual(bounds.label.right + PIXEL_TOLERANCE);
      }
      await contained(page);
    });
  }

  test(`${template} supports fields, actions, data, and JSON interactions`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const failures = watchPreviewFailures(page);
    await page.goto('/');
    await select(page, 'Appearance', template);
    await page.getByRole('button', { name: 'Example notes' }).click();
    await page.getByLabel('Panel note').fill('Retained panel value');
    await page.getByRole('button', { name: 'Example notes' }).click();
    await expect(page.getByLabel('Panel note')).toBeHidden();
    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('switch', { name: 'Show advanced settings' }),
    ).toBeFocused();
    await page.getByRole('button', { name: 'Example overview' }).focus();
    await page.keyboard.press(test.info().project.name === 'mui' ? 'Tab' : 'End');
    await expect(page.getByRole('button', { name: 'Example notes' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByLabel('Panel note')).toHaveValue('Retained panel value');
    await expect(page.getByRole('button', { name: 'Disabled section' })).toBeDisabled();
    await page.getByRole('button', { name: 'Fields', exact: true }).click();
    await page.getByRole('button', { name: 'Save example' }).click();
    await expect(page.getByRole('textbox', { name: /^Name(?: \*)?$/ }))
      .toHaveValue('');
    await page.getByRole('textbox', { name: /^Name(?: \*)?$/ }).fill('Example');
    await page.getByRole('textbox', { name: /^Email(?: \*)?$/ })
      .fill('example@example.com');
    await page.getByRole('textbox', { name: /^Notes(?: \*)?$/ }).fill('Example notes');
    await select(page, 'Role', 'Editor');
    await page.getByRole('checkbox', { name: 'Receive updates' }).check();
    await page.getByRole('slider', { name: 'Volume', exact: true }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(
      page.getByRole('slider', { name: 'Volume', exact: true }),
    ).toHaveAttribute('aria-valuenow', '60');
    await page.getByRole('button', { name: 'Save example' }).click();
    await expect(
      page.getByText('Saved locally: Example, example@example.com,' + ' editor.'),
    ).toBeVisible();
    await select(page, 'Appearance', template === 'Spacious' ? 'Compact' : 'Spacious');
    await expect(page.getByRole('textbox', { name: /^Name(?: \*)?$/ }))
      .toHaveValue('Example');
    await page.getByRole('button', { name: 'Actions and feedback' }).click();
    await page.getByRole('button', { name: 'Activate example' }).click();
    await expect(page.getByText('1 activations', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Disabled action' })).toBeDisabled();
    await page.getByRole('button', { name: 'Reset activations' }).click();
    await expect(page.getByText('0 activations')).toBeVisible();
    await page.getByRole('button', { name: 'Content and data' }).click();
    await select(page, 'Data state', 'Empty');
    const inventory = page.getByRole('table', {
      name: 'Example inventory',
      exact: true,
    });
    await expect(
      test.info().project.name === 'mui'
        ? inventory.getByRole('cell', { name: 'No data available.', exact: true })
        : inventory.getByRole('status'),
    ).toHaveText('No data available.');
    await select(page, 'Data state', 'Loading');
    if (test.info().project.name === 'mui')
      await expect(page.getByRole('progressbar', { name: 'Loading data…' }))
        .toBeVisible();
    else await expect(page.getByRole('status').filter({ hasText: 'Loading data' }))
      .toHaveText('Loading data…');
    await select(page, 'Data state', 'Error');
    await expect(
      page.getByRole('alert').filter({ hasText: 'Example failure.' }),
    ).toBeVisible();
    await select(page, 'Data state', 'Ready');
    await expect(
      page.getByRole('table', { name: 'Example inventory', exact: true }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Documentation' })).toHaveAttribute(
      'href',
      'http://127.0.0.1:8000/',
    );
    await page.getByRole('tab', { name: 'Generative UI' }).click();
    if (test.info().project.name === 'mui') {
      await expectUnsupportedDiagnostic(page, failures, 'Generative UI', 'SplitView');
      expect(errors).toEqual([]);
      return;
    }
    await contained(page);
    await page.getByRole('slider').focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '30');
    await page.getByRole('checkbox', { name: 'Select row A' }).check();
    await page.getByRole('button', { name: 'Next page' }).click();
    await expect(page.getByRole('checkbox', { name: 'Select row B' })).toBeVisible();
    await page.getByRole('button', { name: 'Sort Amount' }).click();
    await expect(
      page.getByRole('columnheader', { name: /Sort Amount/ }),
    ).toHaveAttribute('aria-sort', 'descending');
    await page.getByLabel('Filter Name').fill('gamma');
    await expect(page.getByRole('checkbox', { name: 'Select row C' })).toBeVisible();
    await contained(page);
    await page.getByLabel('Example note').fill('A note');
    await page.getByRole('button', { name: 'Save note' }).click();
    await expect(page.getByText('Saved locally: A note')).toBeVisible();
    await page.getByLabel('JSON declaration').fill('invalid');
    await page.getByRole('button', { name: 'Render declaration' }).click();
    await expect(page.getByRole('alert')).toContainText('Invalid declaration');
    await page.getByRole('button', { name: 'Reset declaration' }).click();
    await expect(page.getByRole('alert')).toHaveCount(0);
    await page.getByRole('button', { name: 'Render declaration' }).click();
    await expect(
      page.getByRole('heading', { name: 'Generated example' }),
    ).toBeVisible();
    await page.getByRole('tab', { name: 'Components', exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(
      page.getByRole('heading', { name: 'Component catalog' }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Documentation' })).toHaveAttribute(
      'href',
      'http://127.0.0.1:8000/',
    );
    await contained(page);
    expect(errors).toEqual([]);
  });
}
