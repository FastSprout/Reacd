import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { LAYOUT_POLICY } from '../../../src/core/policy.js';
import { expectUnsupportedDiagnostic } from '../native-capabilities.js';
import { watchPreviewFailures } from '../preview-failures.js';

async function contained(control: Locator, width: number) {
  await control.scrollIntoViewIfNeeded();
  const geometry = await control.boundingBox();
  if (!geometry) throw new Error('Expected visible SDK control.');
  expect(geometry.x).toBeGreaterThanOrEqual(-1);
  expect(geometry.x + geometry.width).toBeLessThanOrEqual(width + 1);
  expect(geometry.height).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
  const text = await control.evaluate(node => ({
    width: node.scrollWidth, client: node.clientWidth,
    height: node.scrollHeight, block: node.clientHeight,
  }));
  expect(text.width).toBeLessThanOrEqual(text.client + 1);
  expect(text.height).toBeLessThanOrEqual(text.block + 1);
}

for (const width of [240, 360]) {
  test(`native triggers and people remain usable at ${width}px and 200%`, async ({
    page,
  }) => {
    const failures = watchPreviewFailures(page);
    const material = test.info().project.name === 'mui';
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Content and data', exact: true }).click();
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });
    if (material) {
      await expectUnsupportedDiagnostic(page, failures, 'Chat', 'ChatAttachment');
      await expectUnsupportedDiagnostic(page, failures, 'Popover', 'Popover');
    }
    const names = material ? ['Open tooltip dialog'] : [
      'Open example conversation', 'Open tooltip dialog', 'Add delivery note',
    ];
    for (const name of names) {
      await contained(page.getByRole('button', { name, exact: true }), width);
    }
    const trigger = page.getByRole('button', {
      name: material ? 'Open tooltip dialog' : 'Open example conversation',
      exact: true,
    });
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog', {
      name: material ? 'Tooltip dialog' : 'Example conversation',
    })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    const people = page.getByRole('group', { name: 'Reviewer placeholders' });
    await expect(people.getByRole('img')).toHaveCount(2);
    for (const identity of await people.getByRole('img').all()) {
      const box = await identity.boundingBox();
      if (!box) throw new Error('Expected visible SDK identity.');
      expect(box.x).toBeGreaterThanOrEqual(-1);
      expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
    }
    const overflow = people.getByRole('button', { name: 'Show 2 more people' });
    await contained(overflow, width);
    await overflow.focus();
    await page.keyboard.press('Enter');
    const list = material
      ? page.getByRole('dialog', { name: 'Reviewer placeholders overflow' })
        .getByRole('list')
      : page.getByRole('list', { name: 'Additional people' });
    await expect(list.getByRole('listitem')).toHaveCount(2);
    await expect(material ? list.locator('.MuiAvatar-root') :
      list.getByRole('img')).toHaveCount(2);
    await page.keyboard.press('Escape');
    await expect(overflow).toBeFocused();
  });
}
