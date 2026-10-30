import { act, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('browser entry point', () => {
  it('reports a missing mount point', async () => {
    vi.resetModules();
    await expect(import('../../../tooling/conformance/main.js')).rejects.toThrow(
      'Mount container #root',
    );
  });

  it('mounts the complete application with the real React root', async () => {
    vi.resetModules();
    const element = document.createElement('div');
    element.id = 'root';
    document.body.append(element);
    const module = await import('../../../tooling/conformance/main.js');
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.getByRole('heading', { name: 'reacd' })).toBeInTheDocument();
    expect(module.root).not.toHaveProperty('render');
    expect(Object.isFrozen(module.root)).toBe(true);
    act(() => module.root.unmount());
    expect(element.childNodes).toHaveLength(0);
    element.remove();
  });
});
