import { createElement } from 'react';
import type { ComponentType } from 'react';
import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
const { mount } = vi.hoisted(() => ({
  mount: vi.fn<(View: ComponentType) => string>(),
}));
vi.mock('../../src/state/bootstrap.js', () => ({ mountApplication: mount }));
vi.mock('./preview-app.js', () => ({
  DocumentationPreview: ({
    search,
    initialAdapter,
  }: {
    search: string;
    initialAdapter: string;
  }) => (initialAdapter === 'mui' ? 'Material request' : search || 'Default request'),
}));
it('mounts through the trusted bootstrap with the current query', async () => {
  mount.mockImplementation((View) => {
    render(createElement(View));
    return 'isolated root';
  });
  const result = await import('./bootstrap.js');
  expect(result.root).toBe('isolated root');
  expect(screen.getByText('Default request')).toBeInTheDocument();
  expect(mount).toHaveBeenCalledOnce();
});

it('mounts the Material preview selected by the trusted browser host', async () => {
  window.localStorage.setItem('reacd-conformance-adapter', 'mui');
  vi.resetModules();
  try {
    await import('./bootstrap.js');
    expect(screen.getByText('Material request')).toBeInTheDocument();
  } finally {
    window.localStorage.removeItem('reacd-conformance-adapter');
  }
});
