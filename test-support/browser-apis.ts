import { vi } from 'vitest';

// JSDOM has no layout. Browser conformance uses the real ResizeObserver.
class TestResizeObserver implements ResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

vi.stubGlobal('ResizeObserver', TestResizeObserver);

// JSDOM cannot hit-test password-manager overlays. Browser tests use native APIs.
Object.defineProperty(document, 'elementFromPoint', {
  configurable: true,
  value: () => null,
});

Object.defineProperties(HTMLElement.prototype, {
  hasPointerCapture: { configurable: true, value: () => false },
  setPointerCapture: { configurable: true, value: () => undefined },
  releasePointerCapture: { configurable: true, value: () => undefined },
  scrollIntoView: { configurable: true, value: () => undefined },
  getAnimations: { configurable: true, value: () => [] },
});

class TestMediaQueryList extends EventTarget implements MediaQueryList {
  readonly matches = false;
  onchange: MediaQueryList['onchange'] = null;
  constructor(readonly media: string) {
    super();
  }
  addListener(..._args: Parameters<MediaQueryList['addListener']>): void {}
  removeListener(..._args: Parameters<MediaQueryList['removeListener']>): void {}
}

vi.stubGlobal('matchMedia', (query: string) => new TestMediaQueryList(query));
