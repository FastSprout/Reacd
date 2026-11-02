import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const WIDTHS = [240, 320, 375, 600, 768, 1024, 1440, 1920];
const PROFILES = ['Spacious', 'Compact'];
const TOLERANCE = 1;

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
  const marker = page.getByRole('img', { name: 'Unread messages: 3', exact: true });
  const action = page.getByRole('button', { name: 'Open messages', exact: true });
  await expect(marker).toBeVisible();
  const body = await action.boundingBox();
  const indicator = await marker.boundingBox();
  const parent = await action.locator('..').boundingBox();
  if (!body || !indicator || !parent) throw new Error('Missing native Chip bounds.');
  expect(indicator.width).toBeGreaterThan(0);
  expect(indicator.x).toBeGreaterThanOrEqual(parent.x - TOLERANCE);
  expect(indicator.x + indicator.width).toBeLessThanOrEqual(
    parent.x + parent.width + TOLERANCE,
  );
  expect(indicator.y + indicator.height).toBeLessThanOrEqual(body.y + TOLERANCE);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual((await page.evaluate(() => innerWidth)) + TOLERANCE);
}
function hintBody(page: Page, name: string | RegExp) {
  const tooltip = page.getByRole('tooltip', { name });
  return test.info().project.name === 'mui'
    ? tooltip.locator('.MuiTooltip-tooltip')
    : tooltip.and(page.locator('[data-slot="tooltip-content"]'));
}

async function hintClosed(page: Page) {
  const content =
    test.info().project.name === 'mui'
      ? '.MuiTooltip-tooltip'
      : '[data-slot="tooltip-content"]';
  await expect(page.locator(`${content}:visible`)).toHaveCount(0);
}
async function openHint(page: Page, interaction: 'focus' | 'hover' = 'focus') {
  const action = page.getByRole('button', { name: 'Run annotated action' });
  await action.scrollIntoViewIfNeeded();
  if (interaction === 'hover') await action.hover();
  else await action.focus();
  const visual = hintBody(page, /^Runs a local sample action/);
  await expect(visual).toBeVisible();
  await expect(visual).toHaveCount(1);
  if (test.info().project.name === 'shadcn') {
    await expect(visual).toHaveAttribute('data-state', /^(instant|delayed)-open$/);
  }
  await expect(visual).toHaveCSS('opacity', '1');
  return visual;
}

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    test(`${profile} chip and hint geometry at ${width}px and 200%`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await data(page, profile);
      await contained(page);
      await page.getByRole('switch', { name: 'Long tooltip text' }).check();
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await contained(page);
      const visual = await openHint(page, 'hover');
      const arrow =
        test.info().project.name === 'mui'
          ? page.locator('.MuiTooltip-arrow')
          : visual.locator('svg');
      await expect(arrow).toHaveCount(1);
      await expect(arrow).toBeVisible();
      for (const painted of [visual, arrow]) {
        await expect
          .poll(async () => {
            const popup = await painted.boundingBox();
            return (
              popup !== null &&
              popup.x >= -TOLERANCE &&
              popup.x + popup.width <= width + TOLERANCE &&
              popup.y >= -TOLERANCE &&
              popup.y + popup.height <= 1000 + TOLERANCE
            );
          })
          .toBe(true);
      }
      const contentBox = await visual.boundingBox();
      if (!contentBox) throw new Error('Expected the actual native Tooltip body.');
      await visual.hover({
        position: { x: contentBox.width / 2, y: contentBox.height / 4 },
      });
      await page.keyboard.press('Escape');
      await hintClosed(page);
      await expect(
        page.getByRole('switch', { name: 'Controlled hint open' }),
      ).not.toBeChecked();
      await page.evaluate(() => {
        document.documentElement.dir = 'rtl';
      });
      await contained(page);
      await page.getByRole('button', { name: 'Open messages', exact: true }).click();
      await expect(page.getByRole('img', { name: 'Unread messages: 3' })).toHaveCount(
        0,
      );
      await expect(
        page.getByText('You are all caught up.', { exact: true }),
      ).toBeVisible();
    });
  }
  test(`${profile} hint focus, hover, actions, and dialog lifecycle`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await data(page, profile);
    const action = page.getByRole('button', { name: 'Run annotated action' });
    const wrapper = action.locator('..');
    await action.hover();
    const mainHint = hintBody(page, /^Runs a local sample action/);
    await expect(mainHint).toBeVisible();
    await mainHint.hover();
    await expect(mainHint).toBeVisible();
    await page.getByRole('heading', { name: 'Tooltip preview', exact: true }).hover();
    await hintClosed(page);
    await openHint(page);
    await action.click();
    await expect(page.getByText('Annotated action count: 1')).toBeVisible();
    await page
      .getByRole('region', { name: 'Tooltip preview', exact: true })
      .getByRole('img', { name: 'Example Reader', exact: true })
      .hover();
    const identityHint = hintBody(page, 'Example placeholder identity');
    await expect(identityHint).toHaveText('Example placeholder identity');
    await expect(identityHint).toHaveCSS('opacity', '1');
    await page.keyboard.press('Escape');
    await page.getByRole('switch', { name: 'Disable tooltip child' }).check();
    await expect(action).toBeDisabled();
    if (test.info().project.name === 'shadcn') await wrapper.focus();
    else await wrapper.hover();
    await expect(mainHint).toBeVisible();
    await expect(mainHint).toHaveCSS('opacity', '1');
    await page.keyboard.press('Escape');
    await page.getByRole('switch', { name: 'Disable tooltip', exact: true }).check();
    await wrapper.hover();
    await hintClosed(page);
    await page.getByRole('button', { name: 'Open messages', exact: true }).click();
    await expect(
      page.getByText('You are all caught up.', { exact: true }),
    ).toBeVisible();
    await select(page, 'Appearance', profile === 'Spacious' ? 'Compact' : 'Spacious');
    await expect(
      page.getByText('You are all caught up.', { exact: true }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Open tooltip dialog' }).click();
    const dialog = page.getByRole('dialog', { name: 'Tooltip dialog' });
    const dialogAction = dialog.getByRole('button', { name: 'Dialog sample action' });
    await expect
      .poll(() =>
        dialog.evaluate((element) => element.contains(document.activeElement)),
      )
      .toBe(true);
    await dialogAction.focus();
    await page.keyboard.press('Tab');
    await expect(
      dialog.getByRole('button', { name: 'Close tooltip dialog' }),
    ).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(dialogAction).toBeFocused();
    const dialogHint = hintBody(page, 'Hint inside the dialog');
    await expect(dialogHint).toHaveText('Hint inside the dialog');
    await expect(dialogHint).toHaveCSS('opacity', '1');
    await page.keyboard.press('Escape');
    await expect(dialog).toBeVisible();
    await hintClosed(page);
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await page.getByRole('button', { name: 'Open tooltip dialog' }).click();
    await expect(dialogAction).toBeVisible();
    await dialog.getByRole('button', { name: 'Close tooltip dialog' }).click();
    await hintClosed(page);
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
    await hintClosed(page);
  });
});
