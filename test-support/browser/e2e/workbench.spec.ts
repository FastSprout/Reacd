import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
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
    viewport: window.innerWidth,
  }));
  expect(widths.page).toBeLessThanOrEqual(widths.viewport + PIXEL_TOLERANCE);
  const escaped = await page.locator('.reacd-node').evaluateAll(
    (elements, tolerance): string[] =>
      elements.flatMap<string>((element) => {
        const box = element.getBoundingClientRect();
        let ancestor = element.parentElement;
        while (ancestor !== null && getComputedStyle(ancestor).display === 'contents')
          ancestor = ancestor.parentElement;
        const parent = ancestor?.getBoundingClientRect();
        if (!parent || box.width === 0) return [];
        return box.right > parent.right + tolerance ||
          box.left < parent.left - tolerance
          ? [element.getAttribute('class') ?? element.tagName]
          : [];
      }),
    PIXEL_TOLERANCE,
  );
  expect(escaped).toEqual([]);
  const controls = await page
    .locator('[role="slider"], .reacd-range-root input[type="range"]')
    .evaluateAll(
      (elements, tolerance): string[] =>
        elements.flatMap<string>((element) => {
          const root =
            element.closest('.reacd-range-control') ?? element.closest('.reacd-slider');
          if (root === null) return ['Missing slider track.'];
          const visibleThumb = element.closest('.reacd-range-thumb') ?? element;
          const thumb = visibleThumb.getBoundingClientRect();
          const track = root.getBoundingClientRect();
          const minimum = Number(
            element.getAttribute('aria-valuemin') ?? element.getAttribute('min'),
          );
          const maximum = Number(
            element.getAttribute('aria-valuemax') ?? element.getAttribute('max'),
          );
          const value = Number(element.getAttribute('aria-valuenow'));
          if (
            !Number.isFinite(minimum) ||
            !Number.isFinite(maximum) ||
            maximum <= minimum ||
            !Number.isFinite(value)
          )
            return ['Invalid slider bounds or value.'];
          const fraction = (value - minimum) / (maximum - minimum);
          const vertical = element.getAttribute('aria-orientation') === 'vertical';
          const reverse = vertical || getComputedStyle(root).direction === 'rtl';
          const start = vertical ? track.top : track.left;
          const extent = vertical ? track.height : track.width;
          const thumbExtent = vertical ? thumb.height : thumb.width;
          const distance = thumbExtent / 2 + (extent - thumbExtent) * fraction;
          const expected = reverse ? start + extent - distance : start + distance;
          const center = vertical
            ? thumb.top + thumb.height / 2
            : thumb.left + thumb.width / 2;
          return thumb.left < track.left - tolerance ||
            thumb.right > track.right + tolerance ||
            thumb.top < track.top - tolerance ||
            thumb.bottom > track.bottom + tolerance ||
            Math.abs(center - expected) > tolerance
            ? ['Slider thumb does not match its track and value.']
            : [];
        }),
      PIXEL_TOLERANCE,
    );
  expect(controls).toEqual([]);
  const targets = await page.getByRole('checkbox').evaluateAll(
    (elements, minimum) =>
      elements.map((element) => {
        const box = element.getBoundingClientRect();
        return box.width >= minimum && box.height >= minimum;
      }),
    LAYOUT_POLICY.controlTargetPx,
  );
  expect(targets.every(Boolean)).toBe(true);
  const switches = await page.getByRole('switch').evaluateAll(
    (elements, tolerance): string[] =>
      elements.flatMap<string>((element) => {
        const thumb = element.querySelector('span');
        if (thumb === null) return ['Missing toggle thumb.'];
        const track = element.getBoundingClientRect();
        const marker = thumb.getBoundingClientRect();
        const inset = Number.parseFloat(
          getComputedStyle(element).getPropertyValue('--reacd-toggle-inset'),
        );
        const rtl = getComputedStyle(element).direction === 'rtl';
        const checked = element.getAttribute('aria-checked') === 'true';
        const edge =
          checked !== rtl ? track.right - marker.right : marker.left - track.left;
        return !Number.isFinite(inset) ||
          marker.left < track.left - tolerance ||
          marker.right > track.right + tolerance ||
          marker.top < track.top - tolerance ||
          marker.bottom > track.bottom + tolerance ||
          Math.abs(edge - inset) > tolerance
          ? ['Toggle thumb does not match its track and state.']
          : [];
      }),
    PIXEL_TOLERANCE,
  );
  expect(switches).toEqual([]);
}

test('detects real overflow through a display-contents form boundary', async ({
  page,
}) => {
  await page.setViewportSize({ width: OVERFLOW_PROBE_WIDTH, height: VIEWPORT_HEIGHT });
  await page.goto('/');
  const form = page.getByRole('form', { name: 'Local credential example' });
  await expect(form).toBeVisible();
  await expect(form.locator('..')).toHaveCSS('display', 'contents');
  await contained(page);
  await form.evaluate((element, offset) => {
    if (!(element instanceof HTMLElement)) throw new Error('Missing native form.');
    element.style.position = 'relative';
    element.style.left = `-${offset}px`;
  }, LAYOUT_POLICY.controlTargetPx);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(OVERFLOW_PROBE_WIDTH + PIXEL_TOLERANCE);
  await expect(contained(page)).rejects.toThrow('reacd-node reacd-vstack');
});

for (const template of TEMPLATES) {
  for (const width of WIDTHS) {
    test(`${template} contains long text at ${width}px and 200% text`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
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
      await expect(page.getByRole('region', { name: 'Sample orders' })).toHaveAttribute(
        'tabindex',
        '0',
      );
      await contained(page);
    });
  }

  test(`${template} supports fields, actions, data, and JSON interactions`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
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
    await page.keyboard.press('End');
    await expect(page.getByRole('button', { name: 'Example notes' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByLabel('Panel note')).toHaveValue('Retained panel value');
    await expect(page.getByRole('button', { name: 'Disabled section' })).toBeDisabled();
    await page.getByRole('button', { name: 'Fields', exact: true }).click();
    await page.getByRole('button', { name: 'Save example' }).click();
    await expect(page.getByLabel('Name', { exact: true })).toHaveValue('');
    await page.getByLabel('Name', { exact: true }).fill('Example');
    await page.getByLabel('Email', { exact: true }).fill('example@example.com');
    await page.getByLabel('Notes', { exact: true }).fill('Example notes');
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
    await expect(page.getByLabel('Name', { exact: true })).toHaveValue('Example');
    await page.getByRole('button', { name: 'Actions and feedback' }).click();
    await page.getByRole('button', { name: 'Activate example' }).click();
    await expect(page.getByText('1 activations', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Disabled action' })).toBeDisabled();
    await page.getByRole('button', { name: 'Reset activations' }).click();
    await expect(page.getByText('0 activations')).toBeVisible();
    await page.getByRole('button', { name: 'Content and data' }).click();
    await select(page, 'Data state', 'Empty');
    await expect(
      page.getByRole('status').filter({ hasText: 'No data available.' }),
    ).toHaveText('No data available.');
    await select(page, 'Data state', 'Loading');
    await expect(
      page.getByRole('status').filter({ hasText: 'Loading data' }),
    ).toHaveText('Loading data…');
    await select(page, 'Data state', 'Error');
    await expect(page.getByRole('alert')).toContainText('Example failure.');
    await select(page, 'Data state', 'Ready');
    await expect(
      page.getByRole('table', { name: 'Example inventory', exact: true }),
    ).toBeVisible();
    await page.getByRole('tab', { name: 'Generative UI' }).click();
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
    ).toHaveAttribute('aria-sort', 'ascending');
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
