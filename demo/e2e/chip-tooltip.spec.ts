import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const WIDTHS = [240, 320, 375, 600, 768, 1024, 1440, 1920];
const PROFILES = ['Spacious', 'Compact'];
const TOLERANCE = 1;
const LONG_TEXT = 'Long_sample_indicator_'.repeat(20);
async function select(page: Page, name: string, option: string) {
  const trigger = page.getByRole('combobox', { name, exact: true });
  await trigger.click();
  await page.getByRole('option', { name: option, exact: true }).click();
  await expect(trigger).toBeFocused();
}
async function data(page: Page, profile: string) {
  await page.goto('/');
  await select(page, 'Appearance', profile);
  await page.getByRole('button', { name: 'Content and data', exact: true }).click();
}
async function contained(page: Page) {
  const failures = await page.locator('.reacd-chip').evaluateAll(
    (elements, tolerance) =>
      elements.flatMap((element) => {
        const root = element.getBoundingClientRect();
        const body = element.querySelector('.reacd-chip-body')?.getBoundingClientRect();
        const marker = element
          .querySelector('.reacd-chip-indicator')
          ?.getBoundingClientRect();
        if (marker === undefined || marker.width === 0) return [];
        const outside =
          marker.left < root.left - tolerance || marker.right > root.right + tolerance;
        const overlap =
          body !== undefined &&
          body.height > 0 &&
          body.top < marker.bottom - tolerance &&
          body.bottom > marker.top + tolerance;
        return outside || overlap ? ['Chip content overlaps or escapes.'] : [];
      }),
    TOLERANCE,
  );
  expect(failures).toEqual([]);
  const viewport = await page.evaluate(() => ({
    width: innerWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(viewport.scroll).toBeLessThanOrEqual(viewport.width + TOLERANCE);
}
async function openHint(page: Page) {
  const action = page.getByRole('button', { name: 'Run annotated action' });
  await action.scrollIntoViewIfNeeded();
  await page.keyboard.press('Tab');
  await action.focus();
  await expect(page.getByRole('tooltip')).toBeVisible();
  await expect(page.locator('.reacd-tooltip-positioner')).toHaveCSS('opacity', '1');
}

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    test(`${profile} chip and hint geometry at ${width}px and 200%`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await data(page, profile);
      await page.getByLabel('Chip text', { exact: true }).fill(LONG_TEXT);
      for (const corner of ['Top start', 'Top end', 'Bottom start', 'Bottom end']) {
        await select(page, 'Chip corner', corner);
        await contained(page);
      }
      await page.getByRole('switch', { name: 'Long tooltip text' }).check();
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await contained(page);
      await openHint(page);
      await expect
        .poll(async () => {
          const popup = await page.getByRole('tooltip').boundingBox();
          return (
            popup !== null &&
            popup.x >= -TOLERANCE &&
            popup.x + popup.width <= width + TOLERANCE &&
            popup.y >= -TOLERANCE &&
            popup.y + popup.height <= 1000 + TOLERANCE
          );
        })
        .toBe(true);
      await page.keyboard.press('Escape');
      await expect(page.getByRole('tooltip')).toHaveCount(0);
      await page.evaluate(() => {
        document.documentElement.dir = 'rtl';
      });
      await contained(page);
    });
  }
  test(`${profile} hint focus, hover, actions, and dialog lifecycle`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await data(page, profile);
    await page.getByRole('button', { name: 'Run annotated action' }).hover();
    await expect(page.getByRole('tooltip')).toBeVisible();
    await page.getByRole('tooltip').hover();
    await expect(page.getByRole('tooltip')).toBeVisible();
    await page.getByRole('heading', { name: 'Tooltip preview', exact: true }).hover();
    await expect(page.getByRole('tooltip')).toHaveCount(0);
    await openHint(page);
    await page.getByRole('tooltip').hover();
    await expect(page.getByRole('tooltip')).toBeVisible();
    const group = page.locator('.reacd-tooltip-anchor').filter({
      has: page.getByRole('button', { name: 'Run annotated action' }),
    });
    await expect(group).toHaveAttribute('tabindex', '-1');
    await page.getByRole('button', { name: 'Run annotated action' }).click();
    await expect(page.getByText('Annotated action count: 1')).toBeVisible();
    const staticAnchor = page.getByRole('group', {
      name: 'Example placeholder identity',
    });
    await staticAnchor.focus();
    await expect(page.getByRole('tooltip')).toContainText(
      'Example placeholder identity',
    );
    await page.keyboard.press('Escape');
    await page.getByRole('switch', { name: 'Disable tooltip child' }).check();
    await expect(group).toHaveAttribute('tabindex', '0');
    await page.keyboard.press('Tab');
    await group.focus();
    await expect(page.getByRole('tooltip')).toBeVisible();
    await page.keyboard.press('Escape');
    const disable = page.getByRole('switch', { name: 'Disable tooltip', exact: true });
    await disable.check();
    await expect(group).toHaveAttribute('tabindex', '-1');
    await page.getByRole('button', { name: 'Open sample messages' }).click();
    await expect(page.getByText('Sample action count: 1')).toBeVisible();
    await select(page, 'Appearance', profile === 'Spacious' ? 'Compact' : 'Spacious');
    await expect(page.getByText('Sample action count: 1')).toBeVisible();
    await page.getByRole('button', { name: 'Open tooltip dialog' }).click();
    const dialog = page.getByRole('dialog', { name: 'Tooltip dialog' });
    const dialogAction = dialog.getByRole('button', { name: 'Dialog sample action' });
    await expect(dialogAction).toBeFocused();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    await expect(dialog.getByRole('tooltip')).toContainText('Hint inside the dialog');
    await page.keyboard.press('Escape');
    await expect(dialog).toBeVisible();
    await expect(page.getByRole('tooltip')).toHaveCount(0);
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await page.getByRole('button', { name: 'Open tooltip dialog' }).click();
    await expect(
      dialog.getByRole('group', { name: 'Hint inside the dialog' }),
    ).toHaveAttribute('tabindex', '-1');
    await page.getByRole('button', { name: 'Close tooltip dialog' }).click();
    await expect(page.getByRole('tooltip')).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}
test.describe('touch hints', () => {
  test.use({ hasTouch: true, viewport: { width: 375, height: 900 } });
  test('tapping the child action works without relying on a tooltip', async ({
    page,
  }) => {
    await data(page, 'Spacious');
    await page.getByRole('button', { name: 'Run annotated action' }).tap();
    await expect(page.getByText('Annotated action count: 1')).toBeVisible();
    await expect(page.getByRole('tooltip')).toHaveCount(0);
  });
});
