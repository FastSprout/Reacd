import { openUnsupportedExample } from '../native-capabilities.js';
import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';
const WIDTHS = [240, 375, 1440];
const PROFILES = ['Spacious', 'Compact'];
const DIRECTIONS = ['ltr', 'rtl'];
const HEIGHT = 1000;
const TOLERANCE = 1;

async function settledMenuBox(menu: Locator, width: number) {
  await expect(menu).toHaveCSS('opacity', '1');
  await expect.poll(() => menu.evaluate((element) =>
    element.getAnimations().every((animation) =>
      !animation.pending && animation.playState !== 'running',
    ),
  )).toBe(true);
  await expect
    .poll(async () => {
      const box = await menu.boundingBox();
      return (
        box !== null &&
        box.x >= -TOLERANCE &&
        box.y >= -TOLERANCE &&
        box.x + box.width <= width + TOLERANCE &&
        box.y + box.height <= HEIGHT + TOLERANCE
      );
    })
    .toBe(true);
  const box = await menu.boundingBox();
  if (box === null) throw new Error('Missing settled native menu geometry.');
  return box;
}
for (const profile of PROFILES)
  for (const width of WIDTHS) {
    for (const direction of DIRECTIONS) {
      test(
        'native SDK contract: ' +
          `${profile} action menus ${width}px ${direction} at 200%`,
        async ({ page }) => {
          await page.setViewportSize({ width, height: HEIGHT });
          if (test.info().project.name === 'mui') {
            await openUnsupportedExample(
              page,
              profile,
              'Navigation',
              'DropdownMenu',
              'DropdownMenu',
            );

            await page.locator('html').evaluate((element) => {
              element.style.fontSize = '200%';
            });
            if (direction === 'rtl') {
              await page
                .getByRole('switch', { name: 'Right to left navigation' })
                .check();
            }
            await expect(
              page.getByText('Cannot load DropdownMenu', { exact: true }),
            ).toBeVisible();
            return;
          }

          await page.goto('/');
          await page
            .getByRole('navigation', {
              name: 'Component families',
              exact: true,
            })
            .getByRole('button', { name: 'Navigation', exact: true })
            .click();
          await expect(
            page.getByRole('button', {
              name: 'Record actions',
              exact: true,
            }),
          ).toBeVisible();
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
          const box = await settledMenuBox(menu, width);
          expect(box.x).toBeGreaterThanOrEqual(-TOLERANCE);
          expect(box.x + box.width).toBeLessThanOrEqual(width + TOLERANCE);
          expect(box.y).toBeGreaterThanOrEqual(-TOLERANCE);
          expect(box.y + box.height).toBeLessThanOrEqual(HEIGHT + TOLERANCE);
          await page.getByRole('menuitemcheckbox', { name: 'Pin record' }).click();
          await expect(
            page.getByText('Record is pinned.', { exact: true }),
          ).toBeVisible();
          await page
            .getByRole('menuitemradio', { name: 'Compact', exact: true })
            .click();
          await page.getByRole('menuitem', { name: 'Share', exact: true }).click();
          const copy = page.getByRole('menuitem', { name: 'Copy record identifier' });
          await expect(copy).toBeVisible();
          const sub = page.getByRole('menu', { name: 'Share', exact: true });
          const subBox = await settledMenuBox(sub, width);
          expect(subBox.x).toBeGreaterThanOrEqual(-TOLERANCE);
          expect(subBox.x + subBox.width).toBeLessThanOrEqual(width + TOLERANCE);
          await copy.click();
          await expect(menu).toBeHidden();
          await expect(
            page.getByText('Record identifier copied locally.'),
          ).toBeVisible();
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
        },
      );
    }
  }
const TOUCH_HOLD_DURATIONS_MS = [700, 2000];

test.describe('native touch context menus', () => {
  test.use({ hasTouch: true, viewport: { width: 375, height: HEIGHT } });
  for (const hold of TOUCH_HOLD_DURATIONS_MS) {
    test(
      'native SDK contract: ' + `keeps the menu open after a ${hold}ms native hold`,
      async ({ page, context }, info) => {
        if (test.info().project.name === 'mui') {
          await openUnsupportedExample(
            page,
            'Spacious',
            'Navigation',
            'ContextMenu',
            'ContextMenu',
          );
          return;
        }

        await page.clock.install();
        await page.goto('/');
        const adapter = info.project.name === 'mui' ? 'material-ui' : 'shadcn-ui';
        await expect(page.locator('[data-adapter]').first()).toHaveAttribute(
          'data-adapter',
          adapter,
        );
        await page
          .getByRole('navigation', {
            name: 'Component families',
            exact: true,
          })
          .getByRole('button', { name: 'Navigation', exact: true })
          .click();
        const trigger = page.getByRole('group', { name: 'Sample record context' });
        await trigger.scrollIntoViewIfNeeded();
        const bounds = await trigger.boundingBox();
        if (bounds === null) throw new Error('Missing context trigger geometry.');
        const client = await context.newCDPSession(page);
        await client.send('Input.dispatchTouchEvent', {
          type: 'touchStart',
          touchPoints: [
            {
              x: bounds.x + bounds.width / 2,
              y: bounds.y + bounds.height / 2,
            },
          ],
        });
        await page.clock.runFor(hold);
        const menu = page.getByRole('menu', { name: 'Sample record context' });
        await expect(menu).toBeVisible();
        await client.send('Input.dispatchTouchEvent', {
          type: 'touchEnd',
          touchPoints: [],
        });
        await expect(menu).toBeVisible();
        await expect(page.getByText('Sample record is active.')).toBeVisible();
        await page.getByRole('menuitem', { name: 'Archive sample record' }).tap();
        await expect(page.getByText('Sample record archived locally.')).toBeVisible();
      },
    );
  }
});
