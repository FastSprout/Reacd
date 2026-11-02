import { expect, test } from '@playwright/test';

test('rating clear retains its full label at 240px and 200%', async ({ page }) => {
  await page.setViewportSize({ width: 240, height: 1000 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Fields', exact: true }).click();
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%';
  });
  const clear = page.getByRole('button', { name: 'Clear Service rating' });
  const bounds = await clear.evaluate((element) => {
    const box = element.getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(element);
    return {
      left: box.left,
      right: box.right,
      height: box.height,
      text: Array.from(range.getClientRects(), (rect) => ({
        left: rect.left,
        right: rect.right,
      })),
    };
  });
  expect(bounds.left).toBeGreaterThanOrEqual(0);
  expect(bounds.right).toBeLessThanOrEqual(241);
  expect(bounds.height).toBeGreaterThanOrEqual(72);
  for (const text of bounds.text) {
    expect(text.left).toBeGreaterThanOrEqual(bounds.left - 1);
    expect(text.right).toBeLessThanOrEqual(bounds.right + 1);
  }
  await clear.focus();
  await page.keyboard.press('Space');
  await expect(page.getByText('Rating: 0 of 5', { exact: true })).toBeVisible();
  await expect(clear).toBeDisabled();
});
