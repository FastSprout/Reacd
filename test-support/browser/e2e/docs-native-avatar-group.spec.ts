import { expect, test } from '@playwright/test';
import { expectContained, loadedPreview, watchPageErrors } from '../docs-site.js';

test('avatar overflow exposes hidden identities and restores keyboard focus',
  async ({ page }) => {
    const errors = watchPageErrors(page);
    await page.setViewportSize({ width: 375, height: 1000 });
    await page.goto('/components/avatar-group/');
    const preview = await loadedPreview(page);
    const opener = preview.getByRole('button', { name: 'Show 2 more people' });
    await opener.focus();
    await opener.press('Enter');
    const details = page.getByRole('dialog', { name: 'Additional people' });
    await expect(details.getByRole('listitem')).toHaveCount(2);
    await expect(details.getByText('Example reviewer Alexandra Montgomery', {
      exact: true,
    })).toBeVisible();
    await expect(details.getByText('👩‍💻 Example Observer', { exact: true }))
      .toBeVisible();
    await page.keyboard.press('Escape');
    await expect(details).toBeHidden();
    await expect(opener).toBeFocused();
    await expectContained(page);
    expect(errors).toEqual([]);
  });
