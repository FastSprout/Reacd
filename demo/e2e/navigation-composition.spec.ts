import { expect, test } from '@playwright/test';

const WIDTHS = [240, 375, 1440];
const PROFILES = ['Spacious', 'Compact'];
const DIRECTIONS = ['ltr', 'rtl'];
const HEIGHT = 1000;
const TOLERANCE = 1;
const LONG_LABEL = 'Resource_without_word_breaks_'.repeat(20);

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    for (const direction of DIRECTIONS) {
      test(`${profile} navigation composition ${width}px ${direction} at 200%`, async ({
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
        const note = page.getByLabel('Footer note', { exact: true });
        await note.fill('A retained footer note');
        await page.getByRole('button', { name: 'Select resource locally' }).click();
        await expect(page.getByText('Resource selected locally.')).toBeVisible();
        await page.getByRole('switch', { name: 'Disable footer action' }).check();
        await expect(
          page.getByRole('button', { name: 'Select resource locally' }),
        ).toBeDisabled();
        await expect(note).toHaveValue('A retained footer note');
        const trigger = page.getByRole('button', {
          name: 'Sample resources',
          exact: true,
        });
        await trigger.click();
        const child = page.getByRole('button', {
          name: 'Open sample locally',
          exact: true,
        });
        await expect(child).toBeVisible();
        const popup = page.locator('.reacd-menu-popup');
        await expect(popup).toBeVisible();
        const box = await popup.boundingBox();
        if (box === null) throw new Error('Missing navigation popup geometry.');
        expect(box.x).toBeGreaterThanOrEqual(-TOLERANCE);
        expect(box.x + box.width).toBeLessThanOrEqual(width + TOLERANCE);
        await child.click();
        await expect(page.getByText('Sample opened locally.')).toBeVisible();
        await page.getByRole('switch', { name: 'Vertical navigation menu' }).check();
        await trigger.click();
        await expect(child).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(trigger).toBeFocused();
        const address = page.getByLabel('Sample shipping address', { exact: true });
        await address.fill('A retained shipping address');
        const current = page.getByRole('button', { name: /Sample address/ });
        await current.focus();
        await page.keyboard.press(direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight');
        const next = page.getByRole('button', { name: /Sample payment/ });
        await expect(next).toBeFocused();
        await expect(current).toHaveAttribute('aria-current', 'step');
        await page.keyboard.press('Enter');
        await expect(next).toHaveAttribute('aria-current', 'step');
        await current.click();
        await expect(address).toHaveValue('A retained shipping address');
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(width + TOLERANCE);
      });
    }
  }
}

for (const profile of PROFILES) {
  for (const direction of DIRECTIONS) {
    test(`${profile} long menu labels ${direction}`, async ({ page }) => {
      const width = WIDTHS[0];
      if (width === undefined) throw new Error('Missing narrow viewport policy.');
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
      await page.getByLabel('Menu group label', { exact: true }).fill(LONG_LABEL);
      const trigger = page.getByRole('button', { name: LONG_LABEL, exact: true });
      await trigger.click();
      await expect(
        page.getByRole('button', { name: 'Open sample locally' }),
      ).toBeVisible();
      const escapedText = await trigger.evaluate((element, tolerance) => {
        const box = element.getBoundingClientRect();
        const text = document.createRange();
        text.selectNodeContents(element);
        return [...text.getClientRects()].some(
          (rect) =>
            rect.left < box.left - tolerance || rect.right > box.right + tolerance,
        );
      }, TOLERANCE);
      expect(escapedText).toBe(false);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width + TOLERANCE);
      await page.screenshot({
        path: `.cache/navigation-${profile}-${direction}.png`,
        fullPage: true,
      });
    });
  }
}
