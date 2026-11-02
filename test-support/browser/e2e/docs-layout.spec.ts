import { expect, test } from '@playwright/test';
import {
  DOCS_BROWSER_POLICY as POLICY,
  expectContained,
  loadedPreview,
  watchPageErrors,
} from '../docs-site.js';

const reference = {
  homeHeader: 64,
  docsHeader: 112,
  articleLeft: 316,
  articleWidth: 864,
  tolerance: 2,
} as const;
const paths = ['/', '/components/grid/', '/examples/contact-form/'];

test('reference geometry preserves the hero and documentation columns', async ({
  page,
}) => {
  await page.setViewportSize(POLICY.desktop);
  await page.goto('/');
  await loadedPreview(page);
  expect((await page.getByRole('banner').boundingBox())?.height).toBe(
    reference.homeHeader,
  );
  await expect(page.getByRole('heading', { level: 1 })).toContainText('React views.');
  await page.goto('/components/button/');
  await loadedPreview(page);
  expect((await page.getByRole('banner').boundingBox())?.height).toBe(
    reference.docsHeader,
  );
  const heading = await page.getByRole('heading', { level: 1 }).boundingBox();
  if (!heading) throw new Error('Missing page title');
  expect(Math.abs(heading.x - reference.articleLeft)).toBeLessThanOrEqual(
    reference.tolerance,
  );
  expect(Math.abs(heading.width - reference.articleWidth)).toBeLessThanOrEqual(
    reference.tolerance,
  );
  await expect(
    page.getByRole('navigation', { name: 'Documentation navigation', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('navigation', { name: 'On this page', exact: true }),
  ).toBeVisible();
});

for (const width of POLICY.widths) {
  for (const path of paths) {
    test(`${path} reflows at ${width}px in both monochrome appearances`, async ({
      page,
    }) => {
      const errors = watchPageErrors(page);
      await page.emulateMedia({ colorScheme: 'light' });
      await page.setViewportSize({ width, height: POLICY.viewportHeight });
      await page.goto(path);
      await loadedPreview(page);
      await expectContained(page);
      await page.getByRole('button', { name: 'Toggle dark appearance' }).click();
      await expectContained(page);
      expect(errors).toEqual([]);
    });
  }
}

for (const width of [375, 1440]) {
  test(`200% text reflows real heading and controls at ${width}px`, async ({
    page,
  }) => {
    const errors = watchPageErrors(page);
    await page.setViewportSize({ width, height: POLICY.viewportHeight });
    await page.goto('/components/button/');
    await loadedPreview(page);
    const heading = page.getByRole('heading', {
      name: 'Button',
      level: 1,
      exact: true,
    });
    const before = await heading.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).fontSize),
    );
    await page.locator('html').evaluate((element) => {
      element.style.fontSize = '200%';
    });
    const after = await heading.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).fontSize),
    );
    expect(after).toBeGreaterThanOrEqual(before * 2);
    await expectContained(page);
    await page.getByRole('button', { name: 'Request export', exact: true }).click();
    await expect(page.getByText('Export requests: 1', { exact: true })).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('appearance and width preserve the live SDK store', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.setViewportSize({ width: 2560, height: POLICY.viewportHeight });
  await page.goto('/components/button/');
  const preview = await loadedPreview(page);
  const action = page.getByRole('button', { name: 'Request export', exact: true });
  await action.click();
  await page.mouse.move(0, 0);
  const wide = await preview.evaluate(
    (element) => element.getBoundingClientRect().width,
  );
  await expect(action).toHaveCSS('background-color', 'rgb(24, 24, 24)');
  await page.getByRole('button', { name: 'Toggle dark appearance' }).click();
  await page.mouse.move(0, 0);
  await expect(action).toHaveCSS('background-color', 'rgb(250, 250, 250)');
  await expect(page.getByText('Export requests: 1', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Toggle documentation width' }).click();
  await expect
    .poll(() => preview.evaluate((element) => element.getBoundingClientRect().width))
    .toBeLessThan(wide);
  await expect(page.getByText('Export requests: 1', { exact: true })).toBeVisible();
  await expectContained(page);
});

test('blocked storage preserves appearance, width and live state', async ({ page }) => {
  const errors = watchPageErrors(page);
  await page.emulateMedia({ colorScheme: 'light' });
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new DOMException('Blocked');
    };
    Storage.prototype.setItem = () => {
      throw new DOMException('Blocked');
    };
  });
  await page.setViewportSize({ width: 1920, height: POLICY.viewportHeight });
  await page.goto('/components/button/');
  const preview = await loadedPreview(page);
  await page.getByRole('button', { name: 'Request export', exact: true }).click();
  const wide = await preview.evaluate(
    (element) => element.getBoundingClientRect().width,
  );
  await page.getByRole('button', { name: 'Toggle documentation width' }).click();
  await expect
    .poll(() => preview.evaluate((element) => element.getBoundingClientRect().width))
    .toBeLessThan(wide);
  await page.getByRole('button', { name: 'Toggle dark appearance' }).click();
  await expect(page.getByText('Export requests: 1', { exact: true })).toBeVisible();
  await expectContained(page);
  expect(errors).toEqual([]);
});
