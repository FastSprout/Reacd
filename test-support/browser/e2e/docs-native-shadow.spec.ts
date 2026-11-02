import { expect, test } from '@playwright/test';
import { loadedPreview, watchPageErrors } from '../docs-site.js';

test('compact theme removes SDK elevation without removing keyboard focus', async ({
  page,
}) => {
  const errors = watchPageErrors(page);
  await page.goto('/components/theme/');
  const preview = await loadedPreview(page);
  const action = preview.getByRole('button', { name: 'Run scoped action' });
  const shadow = await action.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      elevation: style.getPropertyValue('--tw-shadow').trim(),
      composed: style.boxShadow,
    };
  });
  expect(shadow.elevation).toBe('0 0 #0000');
  await action.focus();
  await page.keyboard.press('ArrowRight');
  await expect(action).toBeFocused();
  await expect.poll(() => action.evaluate((element) =>
    element.matches(':focus-visible'),
  )).toBe(true);
  await expect.poll(() => action.evaluate((element) =>
    getComputedStyle(element).boxShadow,
  )).not.toBe(shadow.composed);
  await action.press('Enter');
  await expect(preview.getByText('Scoped actions: 1', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});
