import { expect, test } from '@playwright/test';
import { measureControlEscapes } from '../../control-containment.js';

const WIDTHS = [240, 320, 768, 1440];
const PROFILES = ['Spacious', 'Compact'];
const HEIGHT = 1000;
const TOLERANCE = 1;

for (const profile of PROFILES) {
  test(`${profile} viewport transitions retain focus and release modal state`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: HEIGHT });
    await page.goto('/');
    await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
    await page.getByRole('option', { name: profile, exact: true }).click();
    const region = page.getByRole('region', {
      name: 'Sidebar and Splitter',
      exact: true,
    });
    const outside = region.getByRole('switch', { name: 'Vertical splitter' });
    await outside.focus();
    await page.setViewportSize({ width: 320, height: HEIGHT });
    await expect(outside).toBeFocused();
    await expect(
      page.getByRole('dialog', { name: 'Workspace navigation' }),
    ).toHaveCount(0);
    const toggle = region.getByRole('button', { name: 'Toggle navigation' });
    await toggle.click();
    const query = page.getByRole('textbox', { name: 'Sidebar workspace query' });
    await query.focus();
    await page.setViewportSize({ width: 1440, height: HEIGHT });
    await expect(
      page.getByRole('dialog', { name: 'Workspace navigation' }),
    ).toHaveCount(0);
    await expect(query).toBeVisible();
    await expect(query).toBeFocused();
    await outside.focus();
    await expect(outside).toBeFocused();
    await page.setViewportSize({ width: 768, height: HEIGHT });
    const dialog = page.getByRole('dialog', { name: 'Workspace navigation' });
    await expect(dialog).toBeVisible();
    await page.mouse.click(760, HEIGHT / 2);
    await expect(dialog).toBeHidden();
    await expect(toggle).toBeFocused();
    await page.setViewportSize({ width: 1440, height: HEIGHT });
    await outside.focus();
    await page.setViewportSize({ width: 320, height: HEIGHT });
    await expect(outside).toBeFocused();
    await expect(
      page.getByRole('dialog', { name: 'Workspace navigation' }),
    ).toHaveCount(0);
  });
  for (const width of WIDTHS) {
    for (const rtl of [false, true]) {
      test(`${profile} sidebar/splitter ${width}px ${rtl ? 'rtl' : 'ltr'}`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: HEIGHT });
        await page.goto('/');
        await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
        await page.getByRole('option', { name: profile, exact: true }).click();
        const region = page.getByRole('region', {
          name: 'Sidebar and Splitter',
          exact: true,
        });
        await expect(region).toBeVisible();
        if (rtl) {
          await region
            .getByRole('switch', { name: 'Sidebar RTL', exact: true })
            .check();
          await region
            .getByRole('switch', { name: 'Splitter RTL', exact: true })
            .check();
        }
        await page.evaluate(() => {
          document.documentElement.style.fontSize = '200%';
        });
        const shell = region.locator('.reacd-sidebar-shell');
        const narrow = await shell.evaluate((element) => element.clientWidth < 768);
        const toggle = region.getByRole('button', { name: 'Toggle navigation' });
        if (narrow) {
          await expect(
            page.getByRole('dialog', { name: 'Workspace navigation' }),
          ).toHaveCount(0);
          await toggle.click();
        }
        const sidebar = page.getByRole(narrow ? 'dialog' : 'complementary', {
          name: 'Workspace navigation',
          exact: true,
        });
        await expect(sidebar).toBeVisible();
        await expect(sidebar).toHaveAttribute('data-direction', rtl ? 'rtl' : 'ltr');
        const query = sidebar.getByRole('textbox', { name: 'Sidebar workspace query' });
        await query.fill('Preserved sidebar input');
        if (narrow) {
          const close = sidebar.getByRole('button', { name: 'Close navigation' });
          await close.focus();
          await page.keyboard.press('Tab');
          await expect(
            sidebar.getByRole('button', { name: 'Inspect workspace' }),
          ).toBeFocused();
          await query.focus();
          await page.keyboard.press('Tab');
          await expect(close).toBeFocused();
          await page.keyboard.press('Escape');
          await expect(sidebar).toBeHidden();
          await expect(toggle).toBeFocused();
          await toggle.click();
          await expect(query).toHaveValue('Preserved sidebar input');
          await close.click();
          await expect(toggle).toBeFocused();
        } else {
          await toggle.click();
          await expect(sidebar).toBeHidden();
          await toggle.click();
          await expect(query).toHaveValue('Preserved sidebar input');
        }
        const group = region.getByRole('group', { name: 'Document workspace' });
        const reflow = await group.evaluate((element) => element.clientWidth < 768);
        await expect(group).toHaveAttribute('data-reflow', String(reflow));
        if (reflow) {
          await expect(group.getByRole('separator')).toHaveCount(0);
          await region.getByRole('switch', { name: 'Vertical splitter' }).check();
        }
        const handle = group.getByRole('separator', { name: 'Document outline' });
        await expect(handle).toBeVisible();
        await handle.focus();
        await page.keyboard.press(reflow ? 'ArrowDown' : 'ArrowRight');
        await expect(handle).toHaveAttribute(
          'aria-valuenow',
          rtl && !reflow ? '49' : '51',
        );
        await page.keyboard.press('Enter');
        await expect(handle).toHaveAttribute('aria-valuenow', '0');
        await page.keyboard.press('Enter');
        await expect(handle).toHaveAttribute(
          'aria-valuenow',
          rtl && !reflow ? '49' : '51',
        );
        await region.getByRole('button', { name: 'Reset panel shares' }).click();
        await handle.scrollIntoViewIfNeeded();
        const box = await handle.boundingBox();
        if (!box) throw new Error('Missing splitter handle geometry.');
        const x = box.x + box.width / 2;
        const y = box.y + box.height / 2;
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x + (reflow ? 0 : 30), y + (reflow ? 30 : 0));
        await page.mouse.up();
        expect(Number(await handle.getAttribute('aria-valuenow'))).not.toBe(50);
        await region.getByRole('switch', { name: 'Disable resizing' }).check();
        await expect(handle).toHaveAttribute('aria-disabled', 'true');
        expect(
          await measureControlEscapes(region, TOLERANCE, 'input,button,p,a'),
        ).toEqual([]);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(width + TOLERANCE);
      });
    }
  }
}

test('sidebar containment detects unclipped hidden and visible escapes', async ({
  page,
}) => {
  await page.setViewportSize({ width: 240, height: HEIGHT });
  await page.goto('/');
  const region = page.getByRole('region', {
    name: 'Sidebar and Splitter',
    exact: true,
  });
  expect(await measureControlEscapes(region, TOLERANCE, 'input,button,p,a')).toEqual(
    [],
  );
  await region.evaluate((element) => {
    const PROBE_POSITION = {
      position: 'fixed',
      left: '0px',
      top: '0px',
      width: '1px',
      height: '1px',
      minBlockSize: '0px',
      clipPath: 'none',
    };
    const hidden = document.createElement('input');
    hidden.setAttribute('aria-hidden', 'true');
    hidden.setAttribute('aria-label', 'Unclipped sidebar input');
    hidden.tabIndex = -1;
    Object.assign(hidden.style, PROBE_POSITION);
    const visible = document.createElement('button');
    visible.type = 'button';
    visible.setAttribute('aria-label', 'Visible sidebar escape');
    Object.assign(visible.style, PROBE_POSITION);
    element.append(hidden, visible);
  });
  expect(
    (await measureControlEscapes(region, TOLERANCE, 'input,button,p,a')).map(
      (escape) => escape.label,
    ),
  ).toEqual(['Unclipped sidebar input', 'Visible sidebar escape']);
});
