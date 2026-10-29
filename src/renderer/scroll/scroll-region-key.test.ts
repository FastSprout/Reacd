import { expect, it, vi } from 'vitest';
import { FOCUS_REVEAL_POLICY } from '../../core/focus-policy.js';
import { scrollRegionByKey } from './scroll-region-key.js';

it('scrolls region arrows instantly without capturing child controls', () => {
  const region = document.createElement('div');
  const child = document.createElement('input');
  const preventDefault = vi.fn();
  const scrollBy = vi.fn();
  const event = {
    target: region,
    currentTarget: region,
    defaultPrevented: false,
    preventDefault,
    key: 'ArrowLeft',
  };
  scrollRegionByKey(event);
  Object.defineProperty(region, 'scrollBy', { value: scrollBy });
  scrollRegionByKey({ ...event, defaultPrevented: true });
  scrollRegionByKey({ ...event, target: child });
  scrollRegionByKey({ ...event, key: 'ArrowDown' });
  expect(preventDefault).not.toHaveBeenCalled();
  scrollRegionByKey(event);
  expect(scrollBy).toHaveBeenLastCalledWith({
    left: -FOCUS_REVEAL_POLICY.keyStep,
    behavior: FOCUS_REVEAL_POLICY.behavior,
  });
  scrollRegionByKey({ ...event, key: 'ArrowRight' });
  expect(scrollBy).toHaveBeenLastCalledWith({
    left: FOCUS_REVEAL_POLICY.keyStep,
    behavior: FOCUS_REVEAL_POLICY.behavior,
  });
  expect(preventDefault).toHaveBeenCalledTimes(2);
});
