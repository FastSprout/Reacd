import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

export async function expandNativeDisclosure(page: Page, name: string) {
  const trigger = page.getByRole('button', { name, exact: true });
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  const id = await trigger.getAttribute('aria-controls');
  if (!id) throw new Error(`Native disclosure has no content target: ${name}`);
  const content = page.locator(`id=${id}`);
  await expect(content).toBeVisible();
  await expect.poll(() => content.evaluate((element) => {
    const animations = new Set(element.getAnimations({ subtree: true }));
    for (let parent = element.parentElement; parent; parent = parent.parentElement) {
      for (const animation of parent.getAnimations()) animations.add(animation);
    }
    return [...animations].filter((animation) =>
      animation.effect?.getComputedTiming().iterations !== Infinity &&
      (animation.pending || animation.playState === 'running'),
    ).length;
  })).toBe(0);
}
