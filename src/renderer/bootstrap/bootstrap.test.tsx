import { act, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NATIVE_MODULE_IMPORT_TIMEOUT_MS } from
  '../../../test-support/native-module-policy.js';

describe('browser entry point', () => {
  beforeEach(async () => {
    vi.resetModules();
    await import('../../../tooling/conformance/app.js');
    await import('../../../src/bootstrap.js');
  }, NATIVE_MODULE_IMPORT_TIMEOUT_MS);
  it('reports a missing mount point', async () => {
    await expect(import('../../../tooling/conformance/main.js')).rejects.toThrow(
      'Mount container #root',
    );
  });

  it('mounts the complete application with the real React root', async () => {
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
