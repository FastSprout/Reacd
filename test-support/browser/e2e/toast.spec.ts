import { expect, test } from '@playwright/test';
import { TOAST_DURATIONS } from '../../../src/core/toast-policy.js';
const WIDTHS = [240, 375, 1440];
const PROFILES = ['Spacious', 'Compact'];
const DIRECTIONS = ['ltr', 'rtl'];
const HEIGHT = 1000;
const TOLERANCE = 1;
const LONG_TITLE = 'Record_without_word_breaks_'.repeat(20);
for (const profile of PROFILES)
  for (const width of WIDTHS) {
    for (const direction of DIRECTIONS) {
      test(`${profile} notifications ${width}px ${direction} at 200%`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: HEIGHT });
        await page.emulateMedia({ reducedMotion: 'reduce' });
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
        await page
          .getByRole('textbox', { name: 'Notification title' })
          .fill(LONG_TITLE);
        const trigger = page.getByRole('button', { name: 'Show two notifications' });
        await trigger.click();
        const notice = page.getByRole('dialog', { name: LONG_TITLE, exact: true });
        const background = page.getByRole('dialog', {
          name: 'Background export ready',
        });
        await expect(notice).toBeVisible();
        await expect(background).toBeVisible();
        await expect(notice).toHaveCSS('direction', direction);
        const viewport = page.getByRole('region', { name: 'Notifications' });
        const bounds = await viewport.boundingBox();
        if (bounds === null) throw new Error('Missing notification viewport bounds.');
        expect(bounds.x).toBeGreaterThanOrEqual(-TOLERANCE);
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(width + TOLERANCE);
        expect(bounds.y).toBeGreaterThanOrEqual(-TOLERANCE);
        expect(bounds.y + bounds.height).toBeLessThanOrEqual(HEIGHT + TOLERANCE);
        const first = await background.boundingBox();
        const second = await notice.boundingBox();
        if (first === null || second === null)
          throw new Error('Missing toast geometry.');
        expect(first.y + first.height).toBeLessThanOrEqual(second.y + TOLERANCE);
        expect(
          await notice.evaluate(
            (element) => element.scrollWidth <= element.clientWidth,
          ),
        ).toBe(true);
        await page.keyboard.press('F6');
        await expect(viewport).toBeFocused();
        await page.keyboard.press('Tab');
        await expect(background).toBeFocused();
        await page.keyboard.press('Escape');
        await expect(background).toBeHidden();
        await expect(notice).toBeFocused();
        await page.keyboard.press('Escape');
        await expect(notice).toBeHidden();
        await expect(trigger).toBeFocused();
        await page
          .getByRole('textbox', { name: 'Notification title' })
          .fill('Saved notification');
        await page
          .getByRole('button', { name: 'Show notification', exact: true })
          .click();
        await page.getByRole('button', { name: 'Undo sample update' }).click();
        await expect(
          page.getByRole('dialog', { name: 'Saved notification' }),
        ).toBeHidden();
        await expect(
          page.getByText('Sample update undone.', { exact: true }),
        ).toBeVisible();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth + 1,
          ),
        ).toBe(false);
      });
    }
  }
test('pauses auto dismissal on hover and resumes after leaving', async ({ page }) => {
  const GRACE_MS = 500;
  await page.goto('/');
  await page.getByRole('button', { name: 'Navigation', exact: true }).click();
  await page.getByRole('combobox', { name: 'Notification duration' }).click();
  await page.getByRole('option', { name: 'Normal', exact: true }).click();
  await page.getByRole('button', { name: 'Show notification', exact: true }).click();
  const notice = page.getByRole('dialog', { name: 'Sample record saved' });
  await notice.hover();
  await page.waitForTimeout(TOAST_DURATIONS.normal + GRACE_MS);
  await expect(notice).toBeVisible();
  await page.mouse.move(0, 0);
  await expect(notice).toBeHidden({ timeout: TOAST_DURATIONS.normal + GRACE_MS });
});
test('honors urgent notification vetoes', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Navigation', exact: true }).click();
  await page.getByRole('switch', { name: 'Keep notification open' }).check();
  await page.getByRole('switch', { name: 'Urgent notification' }).check();
  await page.getByRole('button', { name: 'Show notification', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Sample record saved');
  await page.keyboard.press('F6');
  await page.keyboard.press('Tab');
  const notice = page.getByRole('alertdialog', { name: 'Sample record saved' });
  await expect(notice).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(notice).toBeVisible();
  await expect(notice).toBeFocused();
  await expect(notice.getByRole('status')).toContainText('change was rejected');
  await notice.getByRole('button', { name: 'Dismiss notification' }).click();
  await expect(notice).toBeVisible();
  await page.getByRole('switch', { name: 'Keep notification open' }).uncheck();
  await page.keyboard.press('F6');
  await page.keyboard.press('Tab');
  await expect(notice).toBeFocused();
  await notice.getByRole('button', { name: 'Dismiss notification' }).click();
  await expect(notice).toBeHidden();
});
test('dismisses from the grip with native touch input', async ({
  browser,
  baseURL,
  storageState,
}, info) => {
  const context = await browser.newContext({
    ...(storageState === undefined ? {} : { storageState }),
    hasTouch: true,
    viewport: { width: 375, height: HEIGHT },
  });
  const page = await context.newPage();
  if (baseURL === undefined) throw new Error('Missing browser test base URL.');
  await page.goto(baseURL);
  const adapter = info.project.name === 'mui' ? 'material-ui' : 'shadcn-ui';
  await expect(page.locator('[data-adapter]').first()).toHaveAttribute(
    'data-adapter', adapter,
  );
  await page.getByRole('button', { name: 'Navigation', exact: true }).click();
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%';
  });
  await page.getByRole('textbox', { name: 'Notification title' }).fill(LONG_TITLE);
  await page.getByRole('button', { name: 'Show notification', exact: true }).click();
  const notice = page.getByRole('dialog', { name: LONG_TITLE });
  const client = await context.newCDPSession(page);
  const content = notice.locator('.reacd-toast-content');
  const textBounds = await content.boundingBox();
  if (textBounds === null) throw new Error('Missing notification text bounds.');
  const textPoint = {
    x: textBounds.x + textBounds.width / 2,
    y: textBounds.y + (textBounds.height * 3) / 4,
  };
  await client.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [textPoint],
  });
  const SCROLL_STEPS = 6;
  const SCROLL_DISTANCE = 160;
  for (let index = 1; index <= SCROLL_STEPS; index++) {
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [
        { x: textPoint.x, y: textPoint.y - (SCROLL_DISTANCE * index) / SCROLL_STEPS },
      ],
    });
  }
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect
    .poll(() => content.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);
  await expect(notice).toBeVisible();
  const grip = notice.locator('.reacd-toast-grip');
  const bounds = await grip.boundingBox();
  if (bounds === null) throw new Error('Missing toast grip geometry.');
  const point = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
  await client.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [point],
  });
  const STEPS = 6;
  for (let index = 1; index <= STEPS; index++) {
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: point.x + (bounds.width * index) / (3 * STEPS), y: point.y }],
    });
  }
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(notice).toBeHidden();
  await context.close();
});
