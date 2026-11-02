import { expect, test } from '@playwright/test';

const ORIGIN = process.env['REACD_SITE_ORIGIN'] ?? 'http://127.0.0.1:4175';
const VIEWPORT = { width: 1440, height: 1000 };

test.beforeEach(async ({ page }) => {
  await page.setViewportSize(VIEWPORT);
  await page.goto(`${ORIGIN}/components/button/`);
  await expect(
    page.getByRole('navigation', {
      name: 'Documentation navigation',
      exact: true,
    }),
  ).toBeVisible();
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
});

test('the article starts near its title independently of navigation length', async ({
  page,
}) => {
  const title = await page
    .getByRole('heading', { name: 'Button', level: 1 })
    .boundingBox();
  const paragraph = await page
    .getByText('Trigger an application action through a typed callback.', {
      exact: true,
    })
    .boundingBox();
  if (!title || !paragraph) throw new Error('Missing article content.');
  expect(paragraph.y - title.y - title.height).toBeLessThan(200);
});

test('the native navigation viewport is bounded and keyboard scrollable', async ({
  page,
}) => {
  const side = await page
    .getByRole('complementary', { name: 'Navigation' })
    .boundingBox();
  if (!side) throw new Error('Missing navigation rail.');
  expect(side.height).toBeLessThanOrEqual(VIEWPORT.height);
  const viewport = page.getByRole('region', { name: 'Navigation', exact: true })
    .and(page.locator('[tabindex="0"]'));
  await expect(viewport).toHaveAttribute('data-radix-scroll-area-viewport', '');
  const start = await viewport.evaluate((element) => ({
    top: element.scrollTop,
    height: element.clientHeight,
    content: element.scrollHeight,
  }));
  expect(start.content).toBeGreaterThan(start.height);
  await viewport.focus();
  await expect(viewport).toBeFocused();
  await page.keyboard.press('End');
  await expect
    .poll(() => viewport.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(start.top);
});
