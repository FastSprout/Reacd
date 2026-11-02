import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { installLayout, resizeContainers } from
  '../../../../test-support/layout-observer.js';
import { ShadcnPage } from './page.adapter.js';

let restore: (() => void) | undefined;
afterEach(() => {
  vi.restoreAllMocks();
  restore?.();
  restore = undefined;
});

it('observes an independent SDK width/font box instead of article height', () => {
  restore = installLayout(1440);
  const observe = vi.spyOn(ResizeObserver.prototype, 'observe');
  render(<ShadcnPage title="Orders">Article content</ShadcnPage>);
  const page = screen.getByRole('main', { name: 'Orders' });
  const measurement = page.querySelector(':scope > [aria-hidden="true"]');
  if (!(measurement instanceof HTMLElement)) throw new Error('Missing measurement');
  expect(page).toHaveStyle({ position: 'relative' });
  expect(measurement).toHaveStyle('position: absolute; pointer-events: none;');
  expect(measurement.style.blockSize).toBe('1em');
  expect(getComputedStyle(measurement).blockSize)
    .toBe(getComputedStyle(measurement).fontSize);
  expect(observe).toHaveBeenCalledWith(measurement);
  expect(observe).not.toHaveBeenCalledWith(page);
  expect(screen.getByText('Article content')).toBeVisible();
});

it('updates both rails for doubled font metrics at unchanged pixel width', () => {
  restore = installLayout(1440);
  render(<ShadcnPage title="Orders" left="Documents" right="Headings">
    Article content
  </ShadcnPage>);
  expect(screen.getByText('Documents')).toBeVisible();
  expect(screen.getByText('Headings')).toBeVisible();
  const measurement = screen.getByRole('main', { name: 'Orders' })
    .querySelector(':scope > [aria-hidden="true"]');
  if (!(measurement instanceof HTMLElement)) throw new Error('Missing measurement');
  measurement.style.fontSize = '32px';
  expect(getComputedStyle(measurement).blockSize).toBe('32px');
  resizeContainers(1440);
  expect(screen.getByText('Documents')).not.toBeVisible();
  expect(screen.getByText('Headings')).not.toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Navigation' }));
  fireEvent.click(screen.getByRole('button', { name: 'On this page' }));
  expect(screen.getByText('Documents')).toBeVisible();
  expect(screen.getByText('Headings')).toBeVisible();
});
