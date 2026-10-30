import { expect, test } from '@playwright/test';
import { LAYOUT_POLICY } from '../../../src/core/policy.js';

for (const profile of ['Spacious', 'Compact']) {
  test(`${profile} AuthForm blocks portalled Select at 240px RTL 200%`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 240, height: 1000 });
    await page.goto('/');
    await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
    await page.getByRole('option', { name: profile, exact: true }).click();
    const region = page.getByRole('region', {
      name: 'Auth and media components',
      exact: true,
    });
    await region.getByRole('switch', { name: 'Auth media RTL' }).check();
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });
    const role = region.getByRole('combobox', { name: 'Example role' });
    const current = region.getByText('Example role: reader', { exact: true });
    const triggerBox = await role.boundingBox();
    if (triggerBox === null) throw new Error('Missing visible role trigger.');
    expect(triggerBox.height).toBeGreaterThanOrEqual(LAYOUT_POLICY.controlTargetPx);
    const mirror = region.locator(
      '.reacd-select-entry > input[aria-hidden="true"][tabindex="-1"]',
    );
    await expect(mirror).toHaveCount(1);
    expect(
      await mirror.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          width: style.width,
          height: style.height,
          position: style.position,
          clipPath: style.clipPath,
        };
      }),
    ).toEqual({
      width: '1px',
      height: '1px',
      position: 'fixed',
      clipPath: 'inset(50%)',
    });
    for (const flag of ['loading', 'disabled']) {
      await role.click();
      const option = page.getByRole('option', { name: 'Administrator', exact: true });
      await expect(option).toBeVisible();
      const hostFlag = region.getByRole('switch', { name: `Auth example ${flag}` });
      await hostFlag.evaluate((element) => {
        if (!(element instanceof HTMLElement)) throw new Error('Missing host switch.');
        element.click();
      });
      await expect(role).toBeDisabled();
      if (await option.isVisible()) {
        if ((await option.getAttribute('aria-disabled')) === 'true') {
          await page.keyboard.press('Enter');
        } else {
          await option.click();
        }
      }
      await expect(current).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(option).toBeHidden();
      await hostFlag.evaluate((element) => {
        if (!(element instanceof HTMLElement)) throw new Error('Missing host switch.');
        element.click();
      });
      await expect(role).toBeEnabled();
      await role.click();
      await page.getByRole('option', { name: 'Administrator', exact: true }).click();
      await expect(
        region.getByText('Example role: administrator', { exact: true }),
      ).toBeVisible();
      await role.click();
      await page.getByRole('option', { name: 'Reader', exact: true }).click();
      await expect(current).toBeVisible();
    }
  });
}
