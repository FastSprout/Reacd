import { expect, test } from '@playwright/test';

const DOCS_ORIGIN = 'http://127.0.0.1:4175';
const NARROW_WIDTH = 320;
const OVERFLOW_TOLERANCE = 1;

test('MkDocs embeds the interactive TSX example with isolated state', async ({
  page,
  context,
}) => {
  const failures: string[] = [];
  page.on('pageerror', (error) => failures.push(error.message));
  await page.goto(`${DOCS_ORIGIN}/components/button/`);
  const host = page.getByTitle('Live Button example', { exact: true });
  await expect(host).toBeVisible();
  await expect(host).toHaveAttribute('sandbox', /allow-forms/);
  const preview = host.contentFrame();
  await preview.getByRole('button', { name: 'Request export', exact: true }).click();
  await expect(preview.getByText('Export requests: 1', { exact: true })).toBeVisible();
  await preview.getByRole('switch', { name: 'Compact preview', exact: true }).click();
  await preview
    .getByRole('switch', {
      name: 'Right to left preview',
      exact: true,
    })
    .click();
  await expect(preview.getByText('Export requests: 1', { exact: true })).toBeVisible();
  await expect(page.locator('code.language-tsx').first()).toContainText(
    'export function ButtonExample()',
  );
  await expect(page.locator('code.language-tsx').first()).toContainText(
    'Export requests: ${count}',
  );
  const direct = page.getByRole('link', { name: 'Open Button example', exact: true });
  const target = await direct.getAttribute('href');
  if (target === null) throw new Error('The live example link is missing.');
  const separate = await context.newPage();
  await separate.goto(new URL(target, page.url()).href);
  await expect(separate.getByText('Export requests: 0', { exact: true })).toBeVisible();
  await expect(preview.getByText('Export requests: 1', { exact: true })).toBeVisible();
  await separate.close();
  expect(failures).toEqual([]);
});

for (const template of ['saas-modern-light', 'erp-compact']) {
  test(`${template} preview reflows at narrow RTL and handles unknown URLs`, async ({
    page,
  }) => {
    const failures: string[] = [];
    page.on('pageerror', (error) => failures.push(error.message));
    await page.setViewportSize({ width: NARROW_WIDTH, height: 800 });
    await page.goto(`${DOCS_ORIGIN}/components/grid/`);
    const host = page.getByTitle('Live Grid example', { exact: true });
    await expect(host).toBeVisible();
    const query = `?component=Grid&template=${template}&direction=rtl`;
    await host.evaluate((element, search) => {
      if (!(element instanceof HTMLIFrameElement)) throw new Error('Missing frame.');
      element.src = new URL(
        `../../assets/previews/docs-preview.html${search}`,
        window.location.href,
      ).href;
    }, query);
    const preview = host.contentFrame();
    await expect(preview.getByRole('region', { name: 'Grid live example' })).toHaveCSS(
      'direction',
      'rtl',
    );
    await expect(preview.getByText('Orders overview', { exact: true })).toBeVisible();
    expect(
      await host.evaluate((element) => element.getBoundingClientRect().width),
    ).toBeLessThanOrEqual(NARROW_WIDTH + OVERFLOW_TOLERANCE);
    const documentWidth = await preview.locator('html').evaluate((element) => ({
      scroll: element.scrollWidth,
      client: element.clientWidth,
    }));
    expect(documentWidth.scroll).toBeLessThanOrEqual(
      documentWidth.client + OVERFLOW_TOLERANCE,
    );
    await page.goto(`${DOCS_ORIGIN}/assets/previews/docs-preview.html?component=html`);
    await expect(page.getByRole('alert')).toContainText('Unknown documentation');
    expect(failures).toEqual([]);
  });
}

test('iframe typing and root-relative images remain runnable', async ({ page }) => {
  await page.goto(`${DOCS_ORIGIN}/components/color-mode-image/`);
  const preview = page.getByTitle('Live ColorModeImage example').contentFrame();
  const draft = preview.getByRole('textbox', { name: 'Palette draft', exact: true });
  await draft.fill('');
  await draft.pressSequentially('Retained iframe draft');
  const image = preview.getByRole('img', { name: 'Illustrated workspace preview' });
  await expect(image).toBeVisible();
  const nativeImage = image.locator('img');
  await expect
    .poll(() =>
      nativeImage.evaluate(
        (element) =>
          element instanceof HTMLImageElement &&
          element.complete &&
          element.naturalWidth > 0,
      ),
    )
    .toBe(true);
  for (const file of [
    'color-mode-light.svg',
    'color-mode-dark.svg',
    'avatar-placeholder.svg',
  ]) {
    expect((await page.request.get(`${DOCS_ORIGIN}/${file}`)).status()).toBe(200);
  }
  await preview.getByRole('button', { name: 'Dark appearance button' }).click();
  await expect(draft).toHaveValue('Retained iframe draft');
  await expect(nativeImage).toHaveAttribute('src', '/color-mode-dark.svg');
  await expect
    .poll(() =>
      nativeImage.evaluate(
        (element) =>
          element instanceof HTMLImageElement &&
          element.complete &&
          element.naturalWidth > 0,
      ),
    )
    .toBe(true);
});
