import { openUnsupportedExample } from '../native-capabilities.js';
import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import { expectContained, watchPageErrors } from '../docs-site.js';

async function startSwipe(page: Page, grip: Locator) {
  await grip.hover();
  const bounds = await grip.boundingBox();
  if (!bounds) throw new Error('Missing native notification grip.');
  const x = bounds.x + bounds.width / 2;
  const y = bounds.y + bounds.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 20, y);
  await page.mouse.move(x + 80, y);
}

for (const width of [375, 1920]) {
  test(
    'native SDK contract: ' +
      `native Toast keeps SDK motion after rejected swipe at ${width}px`,
    async ({ page }) => {
      const errors = watchPageErrors(page);
      await page.setViewportSize({ width, height: 1000 });
      if (test.info().project.name === 'mui') {
        await openUnsupportedExample(page, 'Spacious', 'Navigation', 'Toast', 'Toast');
        return;
      }

      await page.goto('/');
    await page.getByRole('navigation', {
      name: 'Component families', exact: true,
    }).getByRole('button', { name: 'Navigation', exact: true }).click();
      await page.getByRole('switch', { name: 'Keep notification open' }).check();
      await page
        .getByRole('button', { name: 'Show notification', exact: true })
        .click();
      const card = page.getByRole('dialog', { name: 'Sample record saved' });
      await expect(card).toHaveAttribute('data-radix-collection-item', '');
      const grip = card.locator('[data-toast-grip]');
      await startSwipe(page, grip);
      await page.mouse.up();
      await expect(card).toBeVisible();
      await expect(card.getByRole('status')).toContainText('change was rejected');
      await expect(card).toHaveCSS('animation-name', 'none');
      await grip.hover();
      const resting = await card.boundingBox();
      if (!resting) throw new Error('Missing retained native notification bounds.');
      await startSwipe(page, grip);
      await expect(card).toHaveAttribute('data-swipe', 'move');
      await expect
        .poll(async () => (await card.boundingBox())?.x ?? resting.x)
        .toBeGreaterThan(resting.x + 20);
      await page.mouse.up();
      await expect(card).toHaveAttribute('data-swipe', 'end');
      await expect
        .poll(async () => (await card.boundingBox())?.x ?? Infinity)
        .toBeCloseTo(resting.x, 0);
      await page.getByRole('switch', { name: 'Keep notification open' }).uncheck();
      await startSwipe(page, grip);
      await page.mouse.up();
      await expect(card).toBeHidden();
      await expectContained(page);
      expect(errors).toEqual([]);
    },
  );
}
