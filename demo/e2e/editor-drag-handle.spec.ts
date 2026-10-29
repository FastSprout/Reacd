import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../src/core/policy.js';
const WIDTHS = [240, 360, 768, 1440];
const HEIGHT = 1000;
const TOLERANCE = 1;
const DROP_AFTER_FRACTION = 0.75;
async function content(page: Page, profile: string) {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Content and data', exact: true }).click();
}
for (const profile of ['Spacious', 'Compact']) {
  for (const width of WIDTHS)
    test(`${profile} block controls ${width}px, RTL and 200%`, async ({ page }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await content(page, profile);
      await page.getByRole('switch', { name: 'Right to left block controls' }).check();
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      const group = page.getByRole('group', { name: 'Review block', exact: true });
      const up = group.getByRole('button', { name: 'Review block: Move up' });
      await expect(up).toBeEnabled();
      await up.focus();
      await page.keyboard.press('Enter');
      await expect(
        page.getByText('Block order: review, prepare, publish', {
          exact: true,
        }),
      ).toBeVisible();
      await expect(group).toHaveCSS('direction', 'rtl');
      const outer = await group.boundingBox();
      if (!outer) throw new Error('Missing block control geometry');
      for (const button of await group.getByRole('button').all()) {
        const box = await button.boundingBox();
        if (!box) throw new Error('Missing action geometry');
        expect(box.width).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
        expect(box.height).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
        expect(box.x).toBeGreaterThanOrEqual(outer.x - TOLERANCE);
        expect(box.x + box.width).toBeLessThanOrEqual(
          outer.x + outer.width + TOLERANCE,
        );
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width + TOLERANCE);
      if (profile === 'Spacious' && (width === 360 || width === 1440))
        await group.screenshot({ path: `.cache/editor-drag-${width}.png` });
    });
  test(`${profile} native block drop, host rejection and protection`, async ({
    page,
  }) => {
    await content(page, profile);
    const box = page.getByRole('textbox', {
      name: 'Block reorder document',
      exact: true,
    });
    const group = page.getByRole('group', { name: 'Review block', exact: true });
    const handle = group.getByRole('button', {
      name: 'Review block: Select and drag block',
    });
    await expect(handle).toBeEnabled();
    const target = box.locator('[data-reacd-block="publish"]');
    const bounds = await target.boundingBox();
    if (!bounds) throw new Error('Missing live drop target');
    await handle.dragTo(target, {
      targetPosition: {
        x: bounds.width / 2,
        y: bounds.height * DROP_AFTER_FRACTION,
      },
    });
    await expect(
      page.getByText('Block order: prepare, publish, review', {
        exact: true,
      }),
    ).toBeVisible();
    await page.getByRole('switch', { name: 'Reject block moves' }).check();
    await group.getByRole('button', { name: 'Review block: Move up' }).click();
    await expect(
      page.getByText('Block order: prepare, publish, review', {
        exact: true,
      }),
    ).toBeVisible();
    await page.getByRole('switch', { name: 'Read-only block document' }).check();
    for (const button of await group.getByRole('button').all())
      await expect(button).toBeDisabled();
    await expect(box).toHaveAttribute('aria-readonly', 'true');
    await page.getByRole('switch', { name: 'Disable block document' }).check();
    await expect(box).toHaveAttribute('aria-disabled', 'true');
  });
}
