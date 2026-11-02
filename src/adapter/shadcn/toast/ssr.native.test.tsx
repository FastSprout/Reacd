import { act, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { expect, it, vi } from 'vitest';
import { NativeToastSurface } from './provider.js';
import { ShadcnToast } from './toast.adapter.js';

it('keeps notifications out of SSR and hydrates native owners without mismatch',
  async () => {
    const recover = vi.fn();
    const content = <NativeToastSurface><ShadcnToast title="Hydrated" open
      onOpenChange={() => undefined} duration="persistent" />
    </NativeToastSurface>;
    const server = renderToString(content);
    expect(server).not.toContain('role="dialog"');
    const container = document.createElement('div');
    container.innerHTML = server;
    document.body.append(container);
    const root = hydrateRoot(container, content, { onRecoverableError: recover });
    try {
      await act(async () => { await Promise.resolve(); });
      expect(await screen.findByRole('dialog', { name: 'Hydrated' })).toBeVisible();
      expect(recover).not.toHaveBeenCalled();
    } finally {
      act(() => root.unmount());
      container.remove();
    }
  },
);
