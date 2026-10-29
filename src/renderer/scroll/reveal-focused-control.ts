import { FOCUS_REVEAL_POLICY } from '../../core/focus-policy.js';

export function revealFocusedControl(target: EventTarget, region: HTMLElement): void {
  if (!(target instanceof HTMLElement) || target === region || !region.contains(target))
    return;
  if (typeof region.scrollBy !== 'function') return;
  // Correct the physical bounds after the browser finishes native focus scrolling.
  queueMicrotask(() => {
    if (target.ownerDocument.activeElement !== target) return;
    const outer = region.getBoundingClientRect();
    const inner = target.getBoundingClientRect();
    const start = outer.left + FOCUS_REVEAL_POLICY.clearance;
    const end = outer.right - FOCUS_REVEAL_POLICY.clearance;
    const left =
      inner.left < start
        ? inner.left - start
        : inner.right > end
          ? inner.right - end
          : 0;
    if (left !== 0) region.scrollBy({ left, behavior: FOCUS_REVEAL_POLICY.behavior });
  });
}
