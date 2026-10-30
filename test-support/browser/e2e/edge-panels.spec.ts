import { expect, test } from '@playwright/test';

const WIDTHS = [240, 375, 1440];
const PROFILES = ['Spacious', 'Compact'];
const DIRECTIONS = ['ltr', 'rtl'];
const EDGES = ['Top', 'Bottom', 'Start', 'End'];
const HEIGHT = 1000;
const TOLERANCE = 1;
const LONG_NOTE = 'Note_without_word_breaks_'.repeat(20);

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    for (const direction of DIRECTIONS) {
      test(`${profile} edge panels ${width}px ${direction} at 200%`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: HEIGHT });
        await page.goto('/');
        await page.getByRole('button', { name: 'Navigation', exact: true }).click();
        await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
        await page.getByRole('option', { name: profile, exact: true }).click();
        if (direction === 'rtl') {
          await page.getByRole('switch', { name: 'Right to left navigation' }).check();
        }
        await page.evaluate(() => {
          document.documentElement.style.fontSize = '200%';
        });
        for (const kind of ['Drawer', 'Slideover']) {
          const lower = kind.toLowerCase();
          const trigger = page.getByRole('button', { name: `Open sample ${lower}` });
          for (const edge of EDGES) {
            const placement = page.getByRole('combobox', { name: `${kind} placement` });
            await placement.click();
            const option = page.getByRole('option', { name: edge, exact: true });
            await option.click();
            await expect(option).toBeHidden();
            await expect(placement).toBeFocused();
            await trigger.focus();
            await expect(trigger).toBeFocused();
            await page.keyboard.press('Enter');
            const dialog = page.getByRole('dialog', { name: `Sample ${lower}` });
            await expect(dialog).toBeVisible();
            await expect(dialog).toHaveCSS('direction', direction);
            const physical =
              edge === 'Start'
                ? direction === 'rtl'
                  ? 'right'
                  : 'left'
                : edge === 'End'
                  ? direction === 'rtl'
                    ? 'left'
                    : 'right'
                  : edge.toLowerCase();
            await expect(dialog).toHaveAttribute('data-edge', physical);
            const note = dialog.getByLabel(`${kind} note`, { exact: true });
            await note.fill(LONG_NOTE);
            const box = await dialog.boundingBox();
            if (box === null) throw new Error('Missing panel geometry.');
            expect(box.x).toBeGreaterThanOrEqual(-TOLERANCE);
            expect(box.y).toBeGreaterThanOrEqual(-TOLERANCE);
            expect(box.x + box.width).toBeLessThanOrEqual(width + TOLERANCE);
            expect(box.y + box.height).toBeLessThanOrEqual(HEIGHT + TOLERANCE);
            if (physical === 'left')
              expect(Math.abs(box.x)).toBeLessThanOrEqual(TOLERANCE);
            if (physical === 'right')
              expect(Math.abs(box.x + box.width - width)).toBeLessThanOrEqual(
                TOLERANCE,
              );
            await dialog.getByRole('button', { name: `Save ${lower} note` }).click();
            await expect(dialog.getByText('Sample note saved locally.')).toBeVisible();
            await page.keyboard.press('Escape');
            await expect(dialog).toBeHidden();
            await expect(trigger).toBeFocused();
          }
          await page.getByRole('switch', { name: `Lock ${lower} dismissal` }).check();
          await trigger.click();
          await page.keyboard.press('Escape');
          const dialog = page.getByRole('dialog', { name: `Sample ${lower}` });
          await expect(dialog).toBeVisible();
          await dialog.getByRole('button', { name: 'Close', exact: true }).click();
          await expect(dialog).toBeHidden();
          await page.getByRole('switch', { name: `Lock ${lower} dismissal` }).uncheck();
        }
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(width + TOLERANCE);
      });
    }
  }
}

test('drawer swipe dismissal retains a keyboard close alternative', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: HEIGHT });
  await page.goto('/');
  await page.getByRole('button', { name: 'Navigation', exact: true }).click();
  const trigger = page.getByRole('button', { name: 'Open sample drawer' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Sample drawer' });
  const handle = dialog.locator('.reacd-drawer-grip');
  const box = await handle.boundingBox();
  if (box === null) throw new Error('Missing drawer swipe affordance.');
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x, HEIGHT, { steps: 10 });
  await page.mouse.up();
  await expect(dialog).toBeHidden();
  await trigger.click();
  await dialog.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(dialog).toBeHidden();
});

test('drawer accepts a native touch swipe from its grip', async ({
  browser,
  baseURL,
}) => {
  if (baseURL === undefined) throw new Error('Missing browser base URL.');
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 375, height: HEIGHT },
    hasTouch: true,
  });
  const page = await context.newPage();
  try {
    await page.goto('/');
    await page.getByRole('button', { name: 'Navigation', exact: true }).click();
    await page.getByRole('button', { name: 'Open sample drawer' }).click();
    const dialog = page.getByRole('dialog', { name: 'Sample drawer' });
    const box = await dialog.locator('.reacd-drawer-grip').boundingBox();
    if (box === null) throw new Error('Missing drawer touch grip.');
    const client = await context.newCDPSession(page);
    const x = box.x + box.width / 2;
    const start = box.y + box.height / 2;
    const steps = 10;
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x, y: start }],
    });
    for (let step = 1; step <= steps; step++) {
      await client.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [
          {
            x,
            y: start + ((HEIGHT - start) * step) / steps,
          },
        ],
      });
    }
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [],
    });
    await expect(dialog).toBeHidden();
  } finally {
    await context.close();
  }
});
