import { expect, test } from '@playwright/test';

for (const profile of ['Spacious', 'Compact']) {
  test(`${profile} editor headings retain a visible typographic hierarchy`, async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
    await page.getByRole('option', { name: profile, exact: true }).click();
    await page.getByRole('button', { name: 'Content and data', exact: true }).click();
    const notes = page.getByRole('textbox', { name: 'Project notes', exact: true });
    const body = await notes.locator('p').evaluate((element) => ({
      size: parseFloat(getComputedStyle(element).fontSize),
      weight: parseFloat(getComputedStyle(element).fontWeight),
    }));
    await notes.focus();
    await page.keyboard.press('ControlOrMeta+a');
    const sizes: number[] = [];
    for (const level of [1, 2, 3]) {
      await page.keyboard.press(`ControlOrMeta+Alt+${level}`);
      const heading = notes.locator(`h${level}`);
      await expect(heading).toBeVisible();
      const style = await heading.evaluate((element) => ({
        size: parseFloat(getComputedStyle(element).fontSize),
        weight: parseFloat(getComputedStyle(element).fontWeight),
      }));
      expect(style.size).toBeGreaterThan(body.size);
      expect(style.weight).toBeGreaterThan(body.weight);
      sizes.push(style.size);
    }
    const [first, second, third] = sizes;
    expect(first).toBeGreaterThan(second ?? 0);
    expect(second).toBeGreaterThan(third ?? 0);
  });
}
