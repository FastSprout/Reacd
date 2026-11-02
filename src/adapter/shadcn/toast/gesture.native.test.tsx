import { fireEvent, render, screen, within } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { NativeToastSurface } from './provider.js';
import { ShadcnToast } from './toast.adapter.js';

function swipe(target: Element) {
  fireEvent.pointerDown(target, { pointerId: 1, pointerType: 'touch',
    clientX: 10, clientY: 10, button: 0 });
  fireEvent.pointerMove(target, { pointerId: 1, pointerType: 'touch',
    clientX: 90, clientY: 10 });
  fireEvent.pointerUp(target, { pointerId: 1, pointerType: 'touch',
    clientX: 90, clientY: 10 });
}

it('excludes native scroll content while the grip keeps actual SDK swipe', () => {
  const request = vi.fn(() => false);
  render(<NativeToastSurface><ShadcnToast title="Gesture notice" open
    onOpenChange={request} duration="persistent" /></NativeToastSurface>);
  const card = screen.getByRole('dialog', { name: 'Gesture notice' });
  const content = within(card).getByRole('region', { name: 'Gesture notice content' });
  expect(card.style.animation).toBe('');
  expect(card.className).toContain('data-[state=open]:animate-in');
  swipe(within(content).getByText('Gesture notice'));
  expect(request).not.toHaveBeenCalled();
  const grip = card.querySelector('[data-toast-grip]');
  if (!grip) throw new Error('Expected native presentation grip.');
  swipe(grip);
  expect(request).toHaveBeenCalledExactlyOnceWith(false);
  expect(screen.getByRole('dialog', { name: 'Gesture notice' })).toBe(card);
  expect(card).toHaveAttribute('data-state', 'open');
  expect(card).toHaveAttribute('data-swipe', 'end');
  expect(card.className).toContain('data-[swipe=end]:translate-x-0');
  expect(card.className).toContain('data-[swipe=end]:animate-none!');
  expect(card.style.transform).toBe('');
  expect(card.style.animation).toBe('');
  fireEvent.pointerDown(grip, { pointerId: 2, pointerType: 'touch',
    clientX: 10, clientY: 10, button: 0 });
  fireEvent.pointerMove(grip, { pointerId: 2, pointerType: 'touch',
    clientX: 50, clientY: 10 });
  fireEvent.pointerMove(grip, { pointerId: 2, pointerType: 'touch',
    clientX: 70, clientY: 10 });
  expect(card).toHaveAttribute('data-swipe', 'move');
  expect(card.style.getPropertyValue('--radix-toast-swipe-move-x')).toBe('60px');
  expect(card.className).toContain(
    'data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]',
  );
  fireEvent.pointerUp(grip, { pointerId: 2, pointerType: 'touch',
    clientX: 90, clientY: 10 });
  expect(request).toHaveBeenCalledTimes(2);
});
