import { expect, it, vi } from 'vitest';
import { FOCUS_REVEAL_POLICY } from '../../core/focus-policy.js';
import { revealFocusedControl } from './reveal-focused-control.js';

it('reveals contained controls while preserving portal or changed focus', async () => {
  const region = document.createElement('div');
  const control = document.createElement('button');
  const outside = document.createElement('input');
  region.append(control);
  document.body.append(region, outside);
  revealFocusedControl(new EventTarget(), region);
  revealFocusedControl(region, region);
  revealFocusedControl(outside, region);
  revealFocusedControl(control, region);
  const scroll = vi.fn();
  Object.defineProperty(region, 'scrollBy', { value: scroll });
  vi.spyOn(region, 'getBoundingClientRect').mockReturnValue(
    new DOMRect(10, 0, 100, 100),
  );
  const bounds = vi.spyOn(control, 'getBoundingClientRect');
  bounds.mockReturnValue(new DOMRect(5, 0, 20, 20));
  control.focus();
  revealFocusedControl(control, region);
  await Promise.resolve();
  expect(scroll).toHaveBeenLastCalledWith({
    left: -8,
    behavior: FOCUS_REVEAL_POLICY.behavior,
  });
  bounds.mockReturnValue(new DOMRect(90, 0, 30, 20));
  revealFocusedControl(control, region);
  await Promise.resolve();
  expect(scroll).toHaveBeenLastCalledWith({
    left: 13,
    behavior: FOCUS_REVEAL_POLICY.behavior,
  });
  bounds.mockReturnValue(new DOMRect(20, 0, 20, 20));
  revealFocusedControl(control, region);
  await Promise.resolve();
  revealFocusedControl(control, region);
  outside.focus();
  await Promise.resolve();
  expect(scroll).toHaveBeenCalledTimes(2);
  region.remove();
  outside.remove();
});
