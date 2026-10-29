import { expect, test } from '@playwright/test';

const WIDTHS = [240, 320, 768, 1440];
const PROFILES = ['Spacious', 'Compact'];
const HEIGHT = 1000;
const TOLERANCE = 1;
const WIDE_WIDTH = 1440;
const SIDEBAR_NARROW_LIMIT = 768;

for (const profile of PROFILES) {
  test(`${profile} dashboard icon collapse and declined search`, async ({ page }) => {
    await page.setViewportSize({ width: WIDE_WIDTH, height: HEIGHT });
    await page.goto('/');
    await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
    await page.getByRole('option', { name: profile, exact: true }).click();
    const section = page.getByRole('region', {
      name: 'Dashboard components',
      exact: true,
    });
    const group = section.getByRole('group', { name: 'Dashboard workspace' });
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });
    await section.getByRole('switch', { name: 'Dashboard icon collapse' }).check();
    await group.getByRole('button', { name: 'Collapse navigation' }).click();
    await expect(group.getByRole('button', { name: 'Expand workspace' })).toBeVisible();
    await expect(group.getByRole('separator')).toHaveCount(0);
    await expect(section.getByText('navigation expanded share: 25')).toBeVisible();
    await group.getByRole('button', { name: 'Expand workspace' }).click();
    await expect(group.getByRole('separator')).toHaveCount(2);
    await section.getByRole('switch', { name: 'Reject dashboard selection' }).check();
    const trigger = group.getByRole('button', { name: 'Find workspace command' });
    await trigger.click();
    const search = page.getByRole('dialog', { name: 'Workspace commands' });
    const query = search.getByRole('combobox', { name: 'Find dashboard commands' });
    await query.fill('review');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(search).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    await expect(section.getByText('No workspace action yet.')).toBeVisible();
    await section.getByRole('switch', { name: 'Reject dashboard selection' }).uncheck();
    const status = section.getByRole('combobox', {
      name: 'Dashboard command status',
    });
    for (const value of ['loading', 'error', 'ready']) {
      await status.click();
      await page.getByRole('option', { name: value, exact: true }).click();
      await trigger.click();
      if (value === 'loading') {
        await expect(search.getByRole('status')).toBeVisible();
      } else if (value === 'error') {
        await expect(search.getByText('Dashboard commands unavailable.')).toBeVisible();
      } else {
        await query.fill('review');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
        await expect(search).toBeHidden();
        await expect(
          section.getByText('Inbox inspected.', { exact: true }),
        ).toBeVisible();
      }
      if (value !== 'ready') await page.keyboard.press('Escape');
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(WIDE_WIDTH + TOLERANCE);
  });
}

for (const profile of PROFILES)
  for (const width of WIDTHS) {
    for (const rtl of [false, true]) {
      test(`${profile} dashboard ${width}px ${rtl ? 'rtl' : 'ltr'}`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: HEIGHT });
        await page.goto('/');
        await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
        await page.getByRole('option', { name: profile, exact: true }).click();
        const section = page.getByRole('region', {
          name: 'Dashboard components',
          exact: true,
        });
        const group = section.getByRole('group', { name: 'Dashboard workspace' });
        await expect(group).toBeVisible();
        if (rtl) await section.getByRole('switch', { name: 'Dashboard RTL' }).check();
        await page.evaluate(() => {
          document.documentElement.style.fontSize = '200%';
        });
        const narrow = (await group.getAttribute('data-narrow')) === 'true';
        if (width === WIDE_WIDTH) {
          expect(narrow).toBe(false);
          const aside = page.getByRole('complementary', {
            name: 'Dashboard navigation',
          });
          await expect(aside).toBeVisible();
          const asideBox = await aside.boundingBox();
          const panelBox = await group
            .locator('.reacd-dashboard-region')
            .last()
            .boundingBox();
          if (!asideBox || !panelBox) throw new Error('Missing dashboard geometry.');
          expect(asideBox.width).toBeLessThan(SIDEBAR_NARROW_LIMIT);
          expect(Math.abs(asideBox.x - panelBox.x)).toBeGreaterThan(TOLERANCE);
          expect(rtl ? asideBox.x > panelBox.x : asideBox.x < panelBox.x).toBe(true);
        }
        if (narrow)
          await group
            .getByRole('button', { name: 'Open navigation', exact: true })
            .click();
        const navigation = page.getByRole(narrow ? 'dialog' : 'complementary', {
          name: 'Dashboard navigation',
          exact: true,
        });
        await expect(navigation).toBeVisible();
        const draft = navigation.getByRole('textbox', {
          name: 'Dashboard navigation draft',
        });
        await draft.fill('Retained dashboard input');
        if (narrow) {
          await page.keyboard.press('Escape');
          await expect(navigation).toBeHidden();
          await expect(
            group.getByRole('button', { name: 'Open navigation', exact: true }),
          ).toBeFocused();
        } else {
          await group.getByRole('button', { name: 'Collapse navigation' }).click();
          await expect(navigation).toBeHidden();
          await group.getByRole('button', { name: 'Expand navigation' }).click();
          await expect(draft).toHaveValue('Retained dashboard input');
          const handle = group.getByRole('separator', { name: 'Dashboard navigation' });
          await handle.focus();
          await page.keyboard.press('ArrowRight');
          await expect(handle).toHaveAttribute('aria-valuenow', rtl ? '24' : '26');
          await handle.scrollIntoViewIfNeeded();
          const box = await handle.boundingBox();
          if (!box) throw new Error('Missing resize handle geometry.');
          const start = Number(await handle.getAttribute('aria-valuenow'));
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await page.mouse.down();
          await page.mouse.move(box.x + box.width / 2 + 30, box.y + box.height / 2);
          expect(Number(await handle.getAttribute('aria-valuenow'))).not.toBe(start);
          await handle.dispatchEvent('pointercancel', { pointerId: 1 });
          await page.mouse.up();
          await expect(handle).toHaveAttribute('aria-valuenow', String(start));
        }
        await group.getByRole('button', { name: 'Find workspace command' }).click();
        const search = page.getByRole('dialog', { name: 'Workspace commands' });
        await expect(search).toBeVisible();
        await search
          .getByRole('combobox', { name: 'Find dashboard commands' })
          .fill('review');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
        await expect(search).toBeHidden();
        await expect(
          section.getByText('Inbox inspected.', { exact: true }),
        ).toBeVisible();
        await expect(section.getByText('inspect-inbox', { exact: true })).toBeVisible();
        await section
          .getByRole('switch', { name: 'Additional dashboard panel' })
          .check();
        await expect(group.locator('.reacd-dashboard-region')).toHaveCount(3);
        await expect(
          group.getByRole('heading', { name: 'Workspace notes' }),
        ).toBeVisible();
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(width + TOLERANCE);
        const escaped = await group.evaluate((element, tolerance) => {
          const outer = element.getBoundingClientRect();
          return Array.from(element.querySelectorAll('input,button,p,h1,h2')).some(
            (child) => {
              const box = child.getBoundingClientRect();
              return (
                box.width > 0 &&
                (box.left < outer.left - tolerance ||
                  box.right > outer.right + tolerance)
              );
            },
          );
        }, TOLERANCE);
        expect(escaped).toBe(false);
      });
    }
  }
