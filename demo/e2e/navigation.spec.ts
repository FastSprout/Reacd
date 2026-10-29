import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const WIDTHS = [240, 320, 375, 600, 768, 1024, 1440, 1920];
const HEIGHT = 1000;
const TOLERANCE = 1;
const LONG_LABEL = 'Current_record_without_breaks_'.repeat(30);

async function select(page: Page, name: string, option: string) {
  const trigger = page.getByRole('combobox', { name, exact: true });
  await trigger.click();
  await page.getByRole('option', { name: option, exact: true }).click();
  await expect(trigger).toBeFocused();
}
async function navigation(page: Page, profile: string) {
  await page.goto('/');
  await select(page, 'Appearance', profile);
  await page.getByRole('button', { name: 'Navigation', exact: true }).click();
}
async function bounds(page: Page) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual((await page.evaluate(() => innerWidth)) + TOLERANCE);
  const escaped = await page.locator('.reacd-breadcrumb-label').evaluateAll(
    (labels, tolerance) =>
      labels.some((label) => {
        const box = label.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(label);
        return [...range.getClientRects()].some(
          (text) =>
            text.left < box.left - tolerance || text.right > box.right + tolerance,
        );
      }),
    TOLERANCE,
  );
  expect(escaped).toBe(false);
}
for (const profile of ['Spacious', 'Compact']) {
  for (const width of WIDTHS) {
    test(`${profile} page and path reflow at ${width}px, RTL and 200%`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await navigation(page, profile);
      await select(page, 'Pagination dataset', 'Billion-item count');
      const pager = page.getByRole('navigation', { name: 'Sample result pages' });
      await pager.getByRole('button', { name: 'Last page' }).click();
      await expect(pager.getByRole('status')).toContainText('Page 100000000 of');
      await expect(pager.locator('[aria-current="page"]')).toHaveCount(1);
      await expect(pager.getByRole('button', { name: 'Next page' })).toBeDisabled();
      await page.getByLabel('Breadcrumb final label').fill(LONG_LABEL);
      await page.getByRole('switch', { name: 'Deep breadcrumb path' }).check();
      await bounds(page);
      await page.getByRole('switch', { name: 'Right to left navigation' }).check();
      await expect(pager).toHaveCSS('direction', 'rtl');
      await expect(page.locator('.reacd-breadcrumb-separator').first()).toHaveCSS(
        'transform',
        'matrix(-1, 0, 0, -1, 0, 0)',
      );
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await bounds(page);
      await select(page, 'Breadcrumb separator', 'Slash');
      await bounds(page);
      if (width === 375)
        await page.screenshot({
          path: `.cache/navigation-${profile}-375.png`,
          fullPage: true,
        });
    });
  }
  test(`${profile} navigation controls preserve state and native links`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await navigation(page, profile);
    const pager = page.getByRole('navigation', { name: 'Sample result pages' });
    const next = pager.getByRole('button', { name: 'Next page' });
    await next.focus();
    await page.keyboard.press('Enter');
    await expect(pager.getByRole('status')).toContainText('Page 2 of 3');
    await page.getByRole('switch', { name: 'Read-only pagination' }).check();
    await expect(next).toBeDisabled();
    await page.getByRole('switch', { name: 'Read-only pagination' }).uncheck();
    await page.getByRole('switch', { name: 'Disable pagination' }).check();
    await expect(next).toBeDisabled();
    await page.getByRole('switch', { name: 'Disable pagination' }).uncheck();
    await select(page, 'Pagination page size', '25 per page');
    await expect(pager.getByRole('status')).toContainText('Page 1 of 1');
    await select(page, 'Pagination dataset', 'Empty dataset');
    await expect(pager.getByRole('status')).toContainText('0 items');
    await expect(next).toBeDisabled();
    const path = page.getByRole('navigation', { name: 'Sample navigation path' });
    const action = path.getByRole('button', { name: 'Sample projects' });
    await action.focus();
    await page.keyboard.press('Space');
    await expect(page.getByText('Selected Sample projects locally.')).toBeVisible();
    await page.getByRole('switch', { name: 'Disable breadcrumb action' }).check();
    await expect(action).toBeDisabled();
    const popupEvent = page.context().waitForEvent('page');
    await path.getByRole('link', { name: 'Workspace' }).click({ button: 'middle' });
    const popup = await popupEvent;
    await popup.waitForLoadState();
    await expect(popup).toHaveURL(/\/$/);
    await popup.close();
    await expect(pager.getByRole('status')).toContainText('0 items');
    expect(errors).toEqual([]);
  });
  test(`${profile} paging URLs use real native navigation`, async ({ page }) => {
    await page.context().route('**/orders?**', (route) =>
      route.fulfill({
        contentType: 'text/html',
        body: '<main>Orders host route</main>',
      }),
    );
    await page.goto('/');
    await select(page, 'Appearance', profile);
    await page.getByRole('tab', { name: 'Generative UI', exact: true }).click();
    await page.getByLabel('JSON declaration').fill(
      JSON.stringify({
        schemaVersion: '0.2',
        state: [
          {
            key: 'page',
            kind: 'pagination',
            access: 'readWrite',
            initial: { pageIndex: 0, pageSize: 10 },
          },
        ],
        root: {
          type: 'VStack',
          children: [
            {
              type: 'Pagination',
              label: 'Linked host pages',
              totalItems: 23,
              value: { state: 'page', mode: 'readWrite' },
              navigation: { href: '/orders?status=open#results' },
            },
            {
              type: 'Pagination',
              label: 'Bounded page display',
              totalItems: 11,
              value: { state: 'page', mode: 'read' },
            },
          ],
        },
      }),
    );
    await page.getByRole('button', { name: 'Render declaration' }).click();
    const pager = page.getByRole('navigation', { name: 'Linked host pages' });
    await pager.getByRole('link', { name: 'Last page' }).click();
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(pager.getByRole('status')).toContainText('Page 1 of 3');
    await expect(page).toHaveURL(/\/$/);
    const next = pager.getByRole('link', { name: 'Next page' });
    const target = '/orders?status=open&page=2&pageSize=10#results';
    await expect(next).toHaveAttribute('href', target);
    const opened = page.context().waitForEvent('page');
    await next.click({ button: 'middle' });
    const popup = await opened;
    await expect(popup).toHaveURL(new RegExp(target.replace('?', '\\?')));
    await expect(pager.getByRole('status')).toContainText('Page 1 of 3');
    await popup.close();
    await next.click();
    await expect(page).toHaveURL(new RegExp(target.replace('?', '\\?')));
    await expect(page.getByRole('main')).toHaveText('Orders host route');
  });
}
