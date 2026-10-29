import type { KeyboardEvent } from 'react';
export function openKeyboardContextMenu(event: KeyboardEvent<HTMLElement>): void {
  if (event.key !== 'ContextMenu' && !(event.shiftKey && event.key === 'F10')) return;
  event.preventDefault();
  const target = event.currentTarget;
  const bounds = target.getBoundingClientRect();
  target.dispatchEvent(
    new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: bounds.left,
      clientY: bounds.bottom,
    }),
  );
}
