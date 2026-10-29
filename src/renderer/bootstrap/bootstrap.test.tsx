import { act, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('browser entry point', () => {
  it('reports a missing mount point', async () => {
    vi.resetModules();
    await expect(import('../../../demo/main.js')).rejects.toThrow(
      'Mount container #root',
    );
  });

  it('mounts the complete application with the real React root', async () => {
    vi.resetModules();
    const element = document.createElement('div');
    element.id = 'root';
    document.body.append(element);
    const module = await import('../../../demo/main.js');
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.getByRole('heading', { name: 'reacd' })).toBeInTheDocument();
    act(() => module.root.unmount());
    element.remove();
  });
});
