import { FOCUS_REVEAL_POLICY } from '../../core/focus-policy.js';

interface ScrollKeyEvent {
  key: string;
  target: EventTarget;
  currentTarget: HTMLElement;
  defaultPrevented: boolean;
  preventDefault: () => void;
}

export function scrollRegionByKey(event: ScrollKeyEvent): void {
  if (event.defaultPrevented || event.target !== event.currentTarget) return;
  const left =
    event.key === 'ArrowLeft'
      ? -FOCUS_REVEAL_POLICY.keyStep
      : event.key === 'ArrowRight'
        ? FOCUS_REVEAL_POLICY.keyStep
        : 0;
  if (left === 0 || typeof event.currentTarget.scrollBy !== 'function') return;
  event.preventDefault();
  event.currentTarget.scrollBy({ left, behavior: FOCUS_REVEAL_POLICY.behavior });
}
