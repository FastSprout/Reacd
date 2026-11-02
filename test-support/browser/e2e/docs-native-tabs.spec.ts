import { expect, test } from '@playwright/test';
import { expectContained, loadedPreview, watchPageErrors } from '../docs-site.js';

for (const width of [375, 1920]) {
  test(`native tabs wrap labels and retain keyboard behavior at ${width}px`,
    async ({ page }) => {
      const errors = watchPageErrors(page);
      await page.setViewportSize({ width, height: 1000 });
      await page.goto('/components/tabs/');
      const preview = await loadedPreview(page);
      const account = preview.getByRole('tab', { name: 'Account preferences' });
      const billing = preview.getByRole('tab', { name: 'Billing preferences' });
      await expectContained(page);
      for (const tab of await preview.getByRole('tab').all()) {
        await expect.poll(() => tab.evaluate((element) =>
          element.scrollWidth - element.clientWidth,
        )).toBeLessThanOrEqual(2);
      }
      await account.focus();
      await page.keyboard.press('ArrowRight');
      await expect(billing).toBeFocused();
      await expect(billing).toHaveAttribute('aria-selected', 'true');
      await preview.getByRole('switch', { name: 'Vertical tabs' }).click();
      await preview.getByRole('switch', { name: 'Manual tab activation' }).click();
      await billing.focus();
      await page.keyboard.press('ArrowUp');
      await expect(account).toBeFocused();
      await expect(account).toHaveAttribute('aria-selected', 'false');
      await page.keyboard.press('Enter');
      await expect(account).toHaveAttribute('aria-selected', 'true');
      await expectContained(page);
      expect(errors).toEqual([]);
    });
}
