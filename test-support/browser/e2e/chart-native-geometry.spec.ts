import { expect, test } from '@playwright/test';

const nativeMarks = {
  Line: { mui: '.MuiLineChart-line', shadcn: '.recharts-line-curve' },
  Area: { mui: '.MuiLineChart-area', shadcn: '.recharts-area-area' },
  Bar: { mui: '.MuiBarChart-element', shadcn: '.recharts-rectangle' },
  Donut: { mui: '.MuiPieChart-arc', shadcn: '.recharts-sector' },
};

for (const [kind, marks] of Object.entries(nativeMarks)) {
  test(`native ${kind} retains drawable area at 240px and 200%`, async ({ page }) => {
    await page.setViewportSize({ width: 240, height: 1000 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Content and data', exact: true }).click();
    await page.getByRole('combobox', { name: 'Chart kind', exact: true }).click();
    await page.getByRole('option', { name: kind, exact: true }).click();
    await page.getByRole('switch', { name: 'Right to left chart' }).check();
    await page.getByRole('switch', { name: 'Inverted chart template' }).check();
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });
    const material = test.info().project.name === 'mui';
    const mark = material ? marks.mui : marks.shadcn;
    const image = page.getByRole(material ? 'group' : 'img', {
      name: 'Reference activity',
      exact: true,
    });
    await expect(image.locator(mark).first()).toBeVisible();
    const geometry = await image.boundingBox();
    expect(geometry).not.toBeNull();
    if (!geometry) throw new Error('Expected native Chart bounds.');
    expect(geometry.x).toBeGreaterThanOrEqual(0);
    expect(geometry.x + geometry.width).toBeLessThanOrEqual(241);
    if (kind !== 'Donut') {
      const clip = image.locator('clipPath rect').first();
      expect(Number(await clip.getAttribute('width'))).toBeGreaterThan(0);
      expect(Number(await clip.getAttribute('height'))).toBeGreaterThan(0);
    }
    await expect(
      page.getByRole('table', { name: 'Reference activity data' }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(241);
  });
}
