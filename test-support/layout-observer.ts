import { act } from '@testing-library/react';
import { vi } from 'vitest';

const observers = new Set<ControlledResizeObserver>();
const original = globalThis.ResizeObserver;
let currentWidth = 1024;

class ControlledResizeObserver implements ResizeObserver {
  private element: Element | undefined;
  constructor(private readonly callback: ResizeObserverCallback) {
    observers.add(this);
  }
  observe(element: Element): void {
    this.element = element;
  }
  unobserve(): void {
    this.element = undefined;
  }
  disconnect(): void {
    observers.delete(this);
  }
  resize(width: number): void {
    if (!this.element) return;
    this.callback(
      [
        {
          target: this.element,
          contentRect: new DOMRect(0, 0, width, 400),
          borderBoxSize: [],
          contentBoxSize: [],
          devicePixelContentBoxSize: [],
        },
      ],
      this,
    );
  }
}

export function installLayout(width = 1024): () => void {
  currentWidth = width;
  const geometry = vi
    .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
    .mockImplementation(function (this: HTMLElement) {
      return new DOMRect(
        0,
        0,
        this.classList.contains('reacd-splitter-track') ? 192 : currentWidth,
        400,
      );
    });
  vi.stubGlobal('ResizeObserver', ControlledResizeObserver);
  return () => {
    geometry.mockRestore();
    vi.stubGlobal('ResizeObserver', original);
    observers.clear();
  };
}

export function resizeContainers(width: number): void {
  currentWidth = width;
  act(() => {
    for (const observer of observers) observer.resize(width);
  });
}
