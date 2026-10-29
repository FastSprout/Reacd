import { expect, test } from '@playwright/test';
const WIDTHS = [240, 375, 1440];
const PROFILES = ['Spacious', 'Compact'];
const DIRECTIONS = ['ltr', 'rtl'];
const HEIGHT = 1000;
const TOLERANCE = 1;
for (const profile of PROFILES)
  for (const width of WIDTHS) {
    for (const direction of DIRECTIONS) {
      test(`${profile} action menus ${width}px ${direction} at 200%`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: HEIGHT });
        await page.goto('/');
        await page.getByRole('button', { name: 'Navigation', exact: true }).click();
        await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
        await page.getByRole('option', { name: profile, exact: true }).click();
        if (direction === 'rtl')
          await page
            .getByRole('switch', {
              name: 'Right to left navigation',
            })
            .check();
        await page.evaluate(() => {
          document.documentElement.style.fontSize = '200%';
        });
        const trigger = page.getByRole('button', {
          name: 'Record actions',
          exact: true,
        });
        await trigger.click();
        const menu = page.getByRole('menu', { name: 'Record actions', exact: true });
        await expect(menu).toBeVisible();
        await expect(menu).toHaveCSS('direction', direction);
        const box = await menu.boundingBox();
        if (box === null) throw new Error('Missing menu geometry.');
        expect(box.x).toBeGreaterThanOrEqual(-TOLERANCE);
        expect(box.x + box.width).toBeLessThanOrEqual(width + TOLERANCE);
        expect(box.y).toBeGreaterThanOrEqual(-TOLERANCE);
        expect(box.y + box.height).toBeLessThanOrEqual(HEIGHT + TOLERANCE);
        await page.getByRole('menuitemcheckbox', { name: 'Pin record' }).click();
        await expect(
          page.getByText('Record is pinned.', { exact: true }),
        ).toBeVisible();
        await page.getByRole('menuitemradio', { name: 'Compact', exact: true }).click();
        await page.getByRole('menuitem', { name: 'Share', exact: true }).click();
        const copy = page.getByRole('menuitem', { name: 'Copy record identifier' });
        await expect(copy).toBeVisible();
        const sub = page.getByRole('menu', { name: 'Share', exact: true });
        const subBox = await sub.boundingBox();
        if (subBox === null) throw new Error('Missing submenu geometry.');
        expect(subBox.x).toBeGreaterThanOrEqual(-TOLERANCE);
        expect(subBox.x + subBox.width).toBeLessThanOrEqual(width + TOLERANCE);
        await copy.click();
        await expect(menu).toBeHidden();
        await expect(page.getByText('Record identifier copied locally.')).toBeVisible();
        const context = page.getByRole('group', { name: 'Sample record context' });
        await context.scrollIntoViewIfNeeded();
        await context.focus();
        await page.keyboard.press('Shift+F10');
        const contextMenu = page.getByRole('menu', { name: 'Sample record context' });
        await expect(contextMenu).toBeVisible();
        await page.getByRole('menuitem', { name: 'Confirm sample record' }).click();
        await expect(contextMenu).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(contextMenu).toBeHidden();
        await expect(context).toBeFocused();
        await context.click({ button: 'right' });
        await page.getByRole('menuitem', { name: 'Archive sample record' }).click();
        await expect(page.getByText('Sample record archived locally.')).toBeVisible();
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        );
        expect(overflow).toBe(false);
      });
    }
  }
test('opens a context menu from a native long press', async ({ browser, baseURL }) => {
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 375, height: HEIGHT },
  });
  const page = await context.newPage();
  if (baseURL === undefined) throw new Error('Missing browser test base URL.');
  await page.goto(baseURL);
  await page.getByRole('button', { name: 'Navigation', exact: true }).click();
  const trigger = page.getByRole('group', { name: 'Sample record context' });
  await trigger.scrollIntoViewIfNeeded();
  const bounds = await trigger.boundingBox();
  if (bounds === null) throw new Error('Missing context trigger geometry.');
  const client = await context.newCDPSession(page);
  await client.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 }],
  });
  await expect(page.getByRole('menu', { name: 'Sample record context' })).toBeVisible();
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await page.getByRole('menuitem', { name: 'Archive sample record' }).tap();
  await expect(page.getByText('Sample record archived locally.')).toBeVisible();
  await context.close();
});
