import { act, within } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { COLOR_MODE_POLICY } from '../../../core/color-mode-policy.js';
import { ShadcnImage } from './image.adapter.js';

it.each([640, 0])(
  'reconciles a native image completed before hydration with width %s',
  async (naturalWidth) => {
    const report = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const view = <ShadcnImage src="/cached.svg" alt="Cached workspace" />;
    const container = document.createElement('div');
    container.innerHTML = renderToString(view);
    document.body.append(container);
    const image = container.querySelector('img');
    if (!(image instanceof HTMLImageElement)) throw new Error('Expected image.');
    Object.defineProperty(image, 'complete', { configurable: true, value: true });
    Object.defineProperty(image, 'naturalWidth', {
      configurable: true, value: naturalWidth,
    });
    expect(image.closest('[aria-busy]')).toHaveAttribute('aria-busy', 'true');
    let root: Root | undefined;
    try {
      await act(async () => { root = hydrateRoot(container, view); });
      const actual = within(container).getByRole('img', { name: 'Cached workspace' });
      expect(actual.closest('[aria-busy]')).toHaveAttribute('aria-busy', 'false');
      if (naturalWidth) {
        expect(actual).toBe(image);
        expect(actual).toHaveAttribute('src', '/cached.svg');
      } else {
        expect(actual).toHaveTextContent(COLOR_MODE_POLICY.imageFallback);
        expect(actual).toHaveAccessibleDescription(COLOR_MODE_POLICY.imageFallback);
        expect(actual).not.toHaveAttribute('src');
      }
      expect(report).not.toHaveBeenCalled();
    } finally {
      await act(async () => { root?.unmount(); });
      container.remove();
      report.mockRestore();
    }
  },
);
